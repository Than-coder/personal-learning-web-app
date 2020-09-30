const Router = require("express").Router();

// controller
const dashboard_controller = require("../../controllers/server/dashboard");
const post_controller = require("../../controllers/server/dashboard/post_controller");
const file_controller = require("../../controllers/server/dashboard/file_controller");
const category_controller = require("../../controllers/server/dashboard/category_controller");

// dashboard page
Router.get("/", dashboard_controller.dashboard_page);
/////////////////////////////
// post
/////////////////////////////
// post table
Router.get("/post-table", post_controller.post_table);
// post edit
Router.get("/post-edit", post_controller.post_edit);
// new post
Router.post("/post-table-new-post", post_controller.new_post);
// update post
Router.put("/post-table-update-post", post_controller.update_post);
// delete psot
Router.delete("/post-table-delete-post", post_controller.delete_post);

/////////////////////////////
// category
/////////////////////////////
Router.get("/category-table", category_controller.category_table);

// api
// new
Router.post("/category-table-new-api", category_controller.new_category);
// delete
Router.delete(
  "/category-table-delete-api",
  category_controller.delete_category
);

/////////////////////////////
// file
/////////////////////////////
Router.get("/file-table", file_controller.file_table);
// api
// mp3 file upload
Router.post("/mp3-file-upload-api", file_controller.mp3_file_upload);
// delete
Router.delete("/mp3-file-delete-api", file_controller.mp3_file_delete);
// update
Router.put("/mp3-file-update-api", file_controller.mp3_file_update);
// find by post_id
Router.get("/mp3-file-find-post_id-api", file_controller.mp3_file_by_postId);

module.exports = Router;
