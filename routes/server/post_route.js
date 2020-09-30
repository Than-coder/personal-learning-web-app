const Router = require("express").Router();

// controller
const post_controller = require("../../controllers/server/post_controller");

// post
Router.get("/", post_controller.index_page);
// detail
Router.get("/post", post_controller.detail_page);

// search category
Router.get("/post/category/", post_controller.search_category);

module.exports = Router;
