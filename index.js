const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const expressLayout = require("express-ejs-layouts");

const port = process.env.PORT || 4444;

const app = express();

app.use(expressLayout);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(bodyParser.json({ limit: "1mb" }));
app.use(
  bodyParser.urlencoded({ limit: "1mb", parameterLimit: 10000, extended: true })
);

// static folder
app.use(express.static(path.join(__dirname, "public")));
// routes
app.use("/", require("./routes"));

// not found
app.get("*", (req, res) => {
  res.send("<h1>Not Found Page!</h1>");
});

// server
app.listen(port, () => console.log(`Server running on port ${port}`));
