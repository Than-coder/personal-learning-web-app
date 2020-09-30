const DB = require("./DB");

class Post extends DB {
  create_table() {
    let sql = `CREATE TABLE IF NOT EXISTS ${this.table_name} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      body TEXT,
      category_name TEXT,
      is_public INTEGER DEFAULT 0,
      date DATETIME
      )`;
    return new Promise((resolve, reject) => {
      this.db.run(sql, err => {
        if (err) return reject(err);
        resolve(`${this.table} created`);
      });
    });
  }

  add({
    title = null,
    body = "",
    category_name = "unknown",
    is_public = 0,
    date = new Date()
  } = {}) {
    return new Promise((resolve, reject) => {
      if (title == null) return reject("title is empty!");

      let sql = `INSERT INTO ${this.table_name} 
      (title,body,category_name,is_public,date) VALUES (?,?,?,?,?)`;
      this.db.run(sql, title, body, category_name, is_public, date, err => {
        if (err) return reject(err);
        resolve(date.getTime());
      });
    });
  }

  search_all_by_category_id(id) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM ${this.table_name} WHERE category_id=?`;
      this.db.all(sql, id, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  find_by_page_categoryName({
    category_name = null,
    fields = [],
    sort = false,
    limit = this.limit,
    page = 1,
    query = []
  } = {}) {
    return new Promise((resolve, rejectect) => {
      if (category_name == null) return rejectect("category_name is empty");
      if (typeof query == "string")
        return rejectect("query is array required!");

      let start = page * limit - limit;
      let sql = `SELECT ${fields.length > 0 ? fields.join(",") : "*"} FROM ${
        this.table_name
      } WHERE category_name=? ${
        query.length > 0 ? `AND ${query[0]}='${query[1]}'` : ""
      } ORDER BY date ${sort ? "ASC" : "DESC"} LIMIT ${start},${limit} `;

      this.db.all(sql, category_name, (err, result) => {
        if (err) return rejectect(err);
        resolve(result);
      });
    });
  }

  find_by_categoryName_pages_total({ name = null } = {}) {
    return new Promise((resolve, rejectect) => {
      if (name == null) return rejectect("category name is empty!");
      let sql = `SELECT COUNT(*) AS total FROM ${this.table_name}  WHERE category_name=?`;

      this.db.all(sql, name, (err, data) => {
        if (err) return rejectect(err);
        let total = Math.ceil(data[0]["total"] / this.limit);
        resolve(total);
      });
    });
  }
}

const post = new Post({ table_name: "post" });

module.exports = post;
