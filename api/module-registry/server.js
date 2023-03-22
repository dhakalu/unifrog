import express from 'express';
import cors from 'cors';

const app = express();

const api = express.Router();

app.use(cors())
app.use("/static/remotes", express.static("remotes"))

app.listen(5000, () => console.log("Started server at port " + 5000))