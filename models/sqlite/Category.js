const DB = require("./DB");

class Category extends DB {
  create_table() {
    let sql = `CREATE TABLE IF NOT EXISTS ${this.table_name} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
      )`;
    return new Promise((succ, rej) => {
      this.db.run(sql, err => {
        if (err) return rej(err);
        succ(`${this.table} created`);
      });
    });
  }

  add({ name = null, date = new Date() } = {}) {
    return new Promise((resolve, reject) => {
      if (name == null) return reject("name fields is empty");
      let sql = `INSERT INTO ${this.table_name} (name,date) VALUES (?,?)`;
      this.db.run(sql, name, date, err => {
        if (err) return reject(err);
        resolve("added");
      });
    });
  }
}

const category = new Category({ table_name: "category" });

module.exports = category;
