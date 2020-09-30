// model
const {
  category_model,
  post_model,
  file_model
} = require("../../models/Control_DB");

// common
const common = require("./common");

// home page
async function index_page(req, res) {
  let [page, limit, posts, pages, categories] = [1, undefined, [], [], []];
  let query = req.query;
  if (query.page) {
    page = query.page;
  }
  if (query.limit) {
    limit = query.limit;
  }
  try {
    posts = await post_model.find_by_page({
      limit,
      page,
      fields: ["id", "title", "body", "date"],
      query: ["is_public", 1]
    });
    // pagination
    let page_number = await post_model.find_by_pages_total();
    pages = common.page_to_array(page_number, parseInt(page));
    // categories
    categories = await category_model.find_by_page({ limit: 100 });

    res.render("index", {
      posts,
      categories,
      pages,
      page,
      pagination_name: "home",
      remove_tag: common.remove_tag
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

// detail
async function detail_page(req, res) {
  let [post, post_id] = [null, null];
  let query = req.query;
  if (query.post_id) {
    post_id = query.post_id;
  }
  try {
    if (post_id == null) throw "query post_id is empty";

    post = await post_model.find_one({ query: ["id", post_id] });
    // mp3 files
    files = await file_model.find_all({
      query: ["post_id", post.id],
      sort: true
    });

    res.render("detail", { post, files, title: post.title });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

// search category name
async function search_category(req, res) {
  let [posts, category_name, page, limit, query] = [
    [],
    null,
    1,
    undefined,
    req.query
  ];
  if (query.page) {
    page = parseInt(query.page);
  }
  if (query.name) {
    category_name = query.name;
  }
  if (query.limit) {
    limit = query.limit;
  }
  try {
    if (category_name == null) throw "category name not found!";

    // posts
    posts = await post_model.find_by_page_categoryName({
      page,
      limit,
      category_name,
      query: ["is_public", 1]
    });

    // pagination
    let number = await post_model.find_by_categoryName_pages_total({
      name: category_name
    });
    pages = common.page_to_array(number, page);
    // categories
    categories = await category_model.find_by_page({ limit: 100 });

    res.render("index", {
      posts,
      categories,
      pages,
      page,
      pagination_name: "category",
      category_name,
      remove_tag: common.remove_tag
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

module.exports = {
  index_page,
  detail_page,
  search_category
};
