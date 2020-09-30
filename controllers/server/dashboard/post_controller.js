// model
const {
  post_model,
  category_model,
  file_model
} = require("../../../models/Control_DB");
// common
const common = require("../common");

// post table
async function post_table(req, res) {
  let [posts, page, limit, pages, query] = [[], 1, undefined, [], req.query];

  if (query.page) {
    page = parseInt(query.page);
  }
  if (query.limit) {
    limit = query.limit;
  }

  try {
    posts = await post_model.find_by_page({
      page,
      fields: ["id", "title", "category_name", "is_public", "date"],
      limit
    });
    // pagination
    let page_number = await post_model.find_by_pages_total();
    pages = common.page_to_array(page_number, page);

    res.render("dashboard/post_table", {
      posts,
      pages,
      page,
      page_name: "post"
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// post edit
async function post_edit(req, res) {
  let [post, post_id, query, categories, mp3_files] = [
    null,
    null,
    req.query,
    [],
    []
  ];

  if (query.post_id) {
    post_id = query.post_id;
  }

  try {
    if (post_id == null) throw "'post_id' query not found!";

    post = await post_model.find_one({ query: ["id", post_id] });
    // category
    categories = await category_model.find({ limit: 100 });
    // mp3 files
    mp3_files = await file_model.find_all({ query: ["post_id", post.id] });

    res.render("dashboard/post_edit/post_edit", {
      post,
      title: post.title,
      categories,
      mp3_files
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// new post
async function new_post(req, res) {
  try {
    let post_date = await post_model.add({ title: "untitled" });
    let post = await post_model.find_one({ query: ["date", post_date] });

    res.json({ post_id: post.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

// delete post
async function delete_post(req, res) {
  let [post_id, query] = [null, req.query];
  if (query.post_id) {
    post_id = query.post_id;
  }

  try {
    if (post_id == null) throw "delete post_id not found!";

    await post_model.delete_one({ query: ["id", post_id] });

    res.json({ message: "post deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

// update post
async function update_post(req, res) {
  let [post_id, query] = [null, req.query];
  if (query.post_id) {
    post_id = query.post_id;
  }

  try {
    if (post_id == null) throw "update post_id not found!";
    // update
    await post_model.update_by_id(post_id, req.body);

    res.json({ message: "post updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

module.exports = {
  post_table,
  post_edit,
  new_post,
  delete_post,
  update_post
};
