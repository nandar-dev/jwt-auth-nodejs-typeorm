import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import * as express from "express";
import { Request, Response } from "express";
import { Database } from "./database";
import { RegisterDTO } from "./dto/request/register.dto";
import { PasswordHash } from "./security/passwordHash";
import { AuthDTO } from "./dto/response/auth.dto";
import { UserDTO } from "./dto/response/user.dto";
import { JWT } from "./security/jwt";
import { LoginDTO } from "./dto/request/login.dto";
import { EntityTODTO } from "./utils/enitityToDTO";

AppDataSource.initialize()
  .then(async () => {
    const app = express();

    app.use(express.json());

    Database.initialize();

    app.listen(4000, () => console.log("Listening on port", 4000));

    app.get("/", (req: Request, res: Response) => {
      res.send("Hello there");
    });

    app.post("/register", async (req: Request, resp: Response) => {
      try {
        const body: RegisterDTO = req.body;

        // validate the body
        if (body.password !== body.repeatPassword)
          throw new Error("Repeat password does not match the password");

        // validate email
        if (
          await Database.userRepository.findOne({
            where: {
              email: body.email,
            },
          })
        )
          throw new Error("Email is already being used");

        // store the user
        const user = new User();
        user.username = body.username;
        user.email = body.email;
        user.password = await PasswordHash.hasPassword(body.password);
        user.age = body.age;

        await Database.userRepository.save(user);

        const authDto: AuthDTO = new AuthDTO();
        const userDto: UserDTO = EntityTODTO.userToDTO(user);

        const tokenAndRefreshToken = await JWT.generateTokenAndRefreshToken(
          user
        );
        authDto.user = userDto;
        authDto.token = tokenAndRefreshToken.token;
        authDto.refreshToken = tokenAndRefreshToken.refreshToken;

        // implement token generation and refresh token

        resp.json(authDto);
      } catch (error) {
        resp.status(500).json({
          message: error.message,
        });
      }
    });

    app.post("/login", async (req: Request, resp: Response) => {
      try {
        const body: LoginDTO = req.body;

        // check if the email/user exists
        const user = await Database.userRepository.findOne({
          where: { email: body.email },
        });
        if (!user) throw new Error("User does not exist");

        // check if the password is valid
        if (!(await PasswordHash.isPasswordValid(body.password, user.password)))
          throw new Error("Password is invalid");

        // retrieve tokens
        const { token, refreshToken } = await JWT.generateTokenAndRefreshToken(
          user
        );

        // generate an authenticationDto/response
        const authDto = new AuthDTO();
        authDto.user = EntityTODTO.userToDTO(user);
        authDto.token = token;
        authDto.refreshToken = refreshToken;

        resp.json(authDto);
      } catch (error) {
        resp.status(500).json({
          message: error.message,
        });
      }
    });
  })
  .catch((error) => console.log(error));
