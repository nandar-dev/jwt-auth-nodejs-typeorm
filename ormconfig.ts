import { User } from "./src/entity/User";
import { ConnectionOptions } from 'typeorm';

export default {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "admin",
  database: "jwt_auth",
  synchronize: true,
  logging: false,
  entities: [User],
  migrations: [],
  //   migrations: ["src/migration/*.{ts, ts}"],
  subscribers: [],
} as ConnectionOptions;