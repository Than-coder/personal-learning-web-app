const path = require("path");
const sqlite = require("sqlite3");
// config
const config = require("../../config");

class DB {
  constructor({ table_name }) {
    this.table_name = table_name;
    this.limit = 10;
    this.db = new sqlite.Database(
      path.join(__dirname, "../../", `${config.DB_NAME}.sqlite`)
    );
    this.create_table_name();
  }

  create_table_name() {}

  find({ limit = this.limit, fields = [], sort = false, query = [] } = {}) {
    return new Promise((resolve, reject) => {
      if (typeof query == "string") return reject("query is array required!");

      let sql = `SELECT ${fields.length > 0 ? fields.join(",") : "*"} FROM ${
        this.table_name
      } ${
        query.length > 0 ? `WHERE ${query[0]}='${query[1]}'` : ""
      } ORDER BY date ${sort ? "ASC" : "DESC"} LIMIT ${limit}`;
      this.db.all(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  find_one({ query = [], fields = [] } = {}) {
    return new Promise((resolve, reject) => {
      if (query.length == 0) return reject("query is empty!");
      if (query.length == 0 || typeof query == "string")
        return reject("query is string value! && it should array value!");
      // set query repaire
      query = `${query[0]}='${query[1]}'`;
      let sql = `SELECT ${fields.length > 0 ? fields.join(",") : "*"} FROM ${
        this.table_name
      } WHERE ${query}`;
      this.db.get(sql, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  find_all({ sort = false, fields = [], query = [], limit = this.limit } = {}) {
    return new Promise((resolve, reject) => {
      if (query.length == 0) return reject("query is empty!");
      if (query.length == 0 || typeof query == "string")
        return reject("query is string value! && it should array value!");
      // set query repaire
      query = `${query[0]}='${query[1]}'`;

      let sql = `SELECT ${fields.length > 0 ? fields.join(",") : "*"} FROM ${
        this.table_name
      } WHERE ${query} ORDER BY name ${sort ? "ASC" : "DESC"} LIMIT ${limit}`;
      this.db.all(sql, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  update_by_id(id = null, object = {}) {
    let query = [];
    return new Promise((resolve, reject) => {
      if (id == null) return reject("ID is not found!");
      for (let key in object) {
        query.push(`${key}='${object[key]}'`);
      }

      let sql = `UPDATE ${this.table_name} SET ${query.join(",")} WHERE id=?`;
      this.db.run(sql, id, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  find_by_page({
    limit = this.limit,
    fields = [],
    page = 1,
    sort = false,
    query = []
  } = {}) {
    return new Promise((resolve, reject) => {
      if (typeof query == "string") return reject("query is array required!");
      let start = page * limit - limit;

      let sql = `SELECT ${fields.length > 0 ? fields.join(",") : "*"} FROM ${
        this.table_name
      } ${
        query.length > 0 ? `WHERE ${query[0]}='${query[1]}'` : ""
      }  ORDER BY date ${sort ? "ASC" : "DESC"} LIMIT ${start},${limit}`;
      this.db.all(sql, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  find_by_pages_total() {
    return new Promise((resolve, reject) => {
      let sql = `SELECT COUNT(*) AS total FROM ${this.table_name}`;

      this.db.all(sql, (err, data) => {
        if (err) return reject(err);
        let total = Math.ceil(data[0]["total"] / this.limit);
        resolve(total);
      });
    });
  }

  delete_one({ query = [] } = {}) {
    return new Promise((resolve, reject) => {
      if (query.length == 0) return reject("query is empty!");
      if (typeof query == "string") return reject("query is array required!");
      // set query
      query = `${query[0]}='${query[1]}'`;

      let sql = `DELETE FROM ${this.table_name} WHERE ${query}`;
      this.db.run(sql, err => {
        if (err) return reject(err);
        resolve("deleted");
      });
    });
  }
}

module.exports = DB;
