const connectDB = require("./startup/db");
const express = require("express");
const cors = require("cors");
const app = express();
const comment = require('./routes/route-methods')

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/comments", comment);

const port = process.env.PORT || 5000;

app.listen(port, ()=> {
    console.log(`Server started on port: ${port}`);
});