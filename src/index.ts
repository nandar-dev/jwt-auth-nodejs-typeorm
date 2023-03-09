import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import * as express from "express";
import { Request, Response } from "express";

const app = express();

app.use(express.json());

app.listen(4000, () => console.log("Listening on port", 4000));

app.get("/", (req: Request, res: Response )=>{
    res.send("Hello there")
})

AppDataSource.initialize()
  .then(async () => {})
  .catch((error) => console.log(error));
