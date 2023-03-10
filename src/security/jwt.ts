import * as jwt from "jsonwebtoken";
import * as moment from "moment";
import { User } from "../entity/User";
import { v4 as uuid4 } from "uuid";
import { RefreshToken } from "../entity/RefreshToken";
import { Database } from "../database";

export class JWT {
  // specify a secret key for jwt generation
  static JWT_SECRET = "123456";

  public static async generateTokenAndRefreshToken(user: User) {
    // specify a payload that's hold the user's id (and) email
    const payload = {
      id: user.id,
      email: user.email,
    };

    const jwtId = uuid4();
    const token = jwt.sign( payload, this.JWT_SECRET,  {
      expiresIn: "1h", // specify when does the toekn expires ** 1 hour **
      jwtid: jwtId, // specify jwid (an id of that token) (needed for the refresh token, as a refresh token only points to one single unique token)
      subject: user.id.toString(), // the subject should be the ursers id (primary key)
    });

    // create a refresh token
    const refreshToken = await this.generateRefreshTokenForUserAndToken(
      user,
      jwtId
    );

    // link that token with the refresh token
    return { token, refreshToken };
  }

  private static async generateRefreshTokenForUserAndToken(
    user: User,
    jwtId: string
  ) {
    // create a new record of refresh token
    const refreshToken = new RefreshToken();
    refreshToken.id = uuid4(); // primary key
    refreshToken.user = user;
    refreshToken.jwtId = jwtId;
    // set the expiry date of the refresh token for example 10 day**
    refreshToken.expiryDate = moment().add(10, "d").toDate();

    // store the refresh token
    await Database.refreshTokenRepository.save(refreshToken);

    return refreshToken.id;
  }
}
