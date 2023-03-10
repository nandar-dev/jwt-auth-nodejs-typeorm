import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import * as express from "express";
import { Request, Response } from "express";
import { Database } from "./database";
import { RegisterDTO } from "./dto/request/register.dto";
import { PasswordHash } from "./security/passwordHash";
import { AuthDTO } from "./dto/response/auth.dto";
import { UserDTO } from "./dto/response/user.dto";

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
        const userDto: UserDTO = new UserDTO();
        userDto.id = user.id;
        userDto.username = user.username;
        userDto.email = user.email;
        userDto.age = user.age;

        authDto.user = userDto;

        // implement token generation and refresh token

        resp.json({
          token: "dummy-token",
          user: {
            id: 1,
            username: "dummy-username",
          },
        });
      } catch (error) {
        resp.status(500).json({
          message: error.message,
        });
      }
    });
  })
  .catch((error) => console.log(error));

// import { AppDataSource } from "./data-source"
// import { User } from "./entity/User"

// AppDataSource.initialize().then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timber"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user)
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     console.log("Loaded users: ", users)

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))
