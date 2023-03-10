import { User } from "./src/entity/User";
import { RefreshToken } from "./src/entity/RefreshToken";
import { ConnectionOptions } from "typeorm";

export default {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "admin",
  database: "jwt_auth",
  synchronize: true,
  logging: false,
  entities: [User, RefreshToken],
  migrations: [],
  //   migrations: ["src/migration/*.{ts, ts}"],
  subscribers: [],
} as ConnectionOptions;
