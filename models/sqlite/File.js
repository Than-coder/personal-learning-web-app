const DB = require("./DB");

class File extends DB {
  create_table() {
    let sql = `CREATE TABLE IF NOT EXISTS ${this.table_name} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      filename TEXT,
      type TEXT,
      size INTEGER,
      post_id INTEGER,
      date DATETIME ,`;
    return new Promise((succ, rej) => {
      this.db.run(sql, err => {
        if (err) return rej(err);
        succ(`${this.table} created`);
      });
    });
  }

  add({
    post_id = null,
    name = "",
    filename = "",
    type = "",
    size = "",
    date = new Date()
  } = {}) {
    return new Promise((resolve, reject) => {
      if (post_id == null) return reject("post_id is empty");

      let sql = `INSERT INTO ${this.table_name} (post_id,name,filename,type,size,date) VALUES (?,?,?,?,?,?)`;
      this.db.run(sql, post_id, name, filename, type, size, date, err => {
        if (err) return reject(err);
        resolve("added");
      });
    });
  }
}

const file = new File({ table_name: "file" });

module.exports = file;
