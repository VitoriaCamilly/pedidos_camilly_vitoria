const express = require("express");
const port = 3000;
const router = require("./routes");

const app = express();
app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
    console.log("Funcionou");
});

app.get("/", (req, res) => {
    res.send("Hello World")
});