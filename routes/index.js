const Router = require("express").Router();

// server
Router.use("/", require("./server/post_route"));
// dashboard
Router.use("/dashboard", require("./server/dashboard_route"));

module.exports = Router;
