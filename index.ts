import express, {Express} from "express";
import dotenv from 'dotenv';
import * as database from "./config/database";
import indexRouterV1 from "./api/v1/routes/index.route";
import bodyParser from "body-parser";
import cors from "cors";
const cookieParser = require("cookie-parser");
dotenv.config();
database.connect();



const app: Express = express();
const port:string | number = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
indexRouterV1(app);



app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

