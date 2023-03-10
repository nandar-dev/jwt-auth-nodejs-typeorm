import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { RefreshToken } from "./entity/RefreshToken";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "admin",
  database: "jwt_auth",
  synchronize: true,
  logging: false,
  entities: [User, RefreshToken],
//   entities: ["src/entity/*.{js,ts}"],
  migrations: [],
//   migrations: ["src/migration/*.{ts, ts}"],
  subscribers: [],
});
