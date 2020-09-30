// sqlite model
const category_model = require("./sqlite/Category");
const file_model = require("./sqlite/File");
const post_model = require("./sqlite/Post");

// config
const config = require("../config");
let model = {
  category_model,
  file_model,

  post_model
};

if (config.USED_DB == "sqlite") {
  model = {
    category_model,
    file_model,

    post_model
  };
}

module.exports = model;
