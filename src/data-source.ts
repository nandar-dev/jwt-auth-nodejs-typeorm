import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { RefreshToken } from "./entity/RefreshToken";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "dpg-cgdd8t02qv2aq5ks9ksg-a",
  port: 5432,
  username: "nanda",
  password: "QJLO0LPFuPT9Pjf6wsQ65hTHCtRiKaL9",
  database: "test_bkfk",
  synchronize: true,
  logging: false,
  entities: [User, RefreshToken],
//   entities: ["src/entity/*.{js,ts}"],
  migrations: [],
//   migrations: ["src/migration/*.{ts, ts}"],
  subscribers: [],
});
