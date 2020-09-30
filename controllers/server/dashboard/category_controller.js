// model
const { category_model } = require("../../../models/Control_DB");
// common
const common = require("../common");

// category table
async function category_table(req, res) {
  let [categories, page, limit, pages, query] = [
    [],
    1,
    undefined,
    [],
    req.query
  ];

  if (query.page) {
    page = parseInt(query.page);
  }
  if (query.limit) {
    limit = query.limit;
  }

  try {
    categories = await category_model.find_by_page({ limit, page });

    // pagination
    let page_number = await category_model.find_by_pages_total();
    pages = common.page_to_array(page_number, page);

    res.render("dashboard/category_table", {
      categories,
      pages,
      page,
      page_name: "category"
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// new category
async function new_category(req, res) {
  let [name] = [null];
  if (req.body.name) {
    name = req.body.name;
  }
  try {
    if (name == null) throw "category name is empty";

    // new
    await category_model.add({ name });
    // send client
    res.status(201).json({ message: "category added" });
  } catch (error) {
    res.status(500).json({ error });
  }
}

async function delete_category(req, res) {
  let [category_id, query] = [null, req.query];

  if (query.category_id) {
    category_id = query.category_id;
  }
  try {
    if (category_id == null) throw "category_id query is empty";

    // delete
    await category_model.delete_one({ query: ["id", category_id] });
    // send client
    res.status(200).json({ message: "category deleted" });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = {
  category_table,
  //   api
  new_category,
  delete_category
};
