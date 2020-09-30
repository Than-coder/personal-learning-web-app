const path = require("path");
const uuid = require("uuid");
const multer = require("multer");
const fs = require("fs");

// model
const { file_model } = require("../../../models/Control_DB");
// common
const common = require("../common");

const mp3_dir = path.join(__dirname, "../../../public/upload/mp3");

// file table
async function file_table(req, res) {
  let [files, page, limit, pages, query] = [[], 1, undefined, [], req.query];

  if (query.page) {
    page = parseInt(query.page);
  }
  if (query.limit) {
    limit = query.limit;
  }

  try {
    files = await file_model.find_by_page({
      page,
      limit
    });
    // pagination
    let page_number = await file_model.find_by_pages_total();
    pages = common.page_to_array(page_number, 1);

    res.render("dashboard/file_table", {
      files,
      pages,
      page,
      page_name: "file"
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

////////////////////////////////////
// api
////////////////////////////////////

const storage = multer.diskStorage({
  destination: mp3_dir,
  filename: (req, file, cb) => {
    let filename = `${uuid.v4()}${path.extname(file.originalname)}`;

    cb(null, filename);
  }
});

// file filter
async function fileFilter(req, file, cb) {
  try {
    let file_ = await file_model.find_one({
      query: ["name", file.originalname]
    });
    if (file_ != undefined) return cb("file already exists", false);
    // file not found!
    cb(null, true);
  } catch (error) {
    console.log(`fileFilter: ${error}`);
  }
}

const multer_upload = multer({ storage, fileFilter }).single("file");

async function mp3_file_upload(req, res) {
  multer_upload(req, res, async error => {
    if (error) {
      res.status(500).json({ error });
    } else {
      // success
      //   add
      const file = req.file;
      const post_id = req.query.post_id;

      await file_model.add({
        post_id,
        name: file.originalname,
        filename: file.filename,
        type: file.mimetype,
        size: file.size
      });
      res.status(201).json({ message: "file uploaded" });
    }
  });
}

// delete
async function mp3_file_delete(req, res) {
  let [file, query, file_id] = [null, req.query, null];
  if (query.file_id) {
    file_id = query.file_id;
  }
  try {
    if (file_id == null) throw "file_id query not found!";

    file = await file_model.find_one({ query: ["id", file_id] });

    // delete from db
    await file_model.delete_one({ query: ["id", file_id] });
    // delete from upload dir
    fs.unlinkSync(`${mp3_dir}/${file.filename}`);

    // send client
    res.status(200).json({ message: "file deleted" });
  } catch (error) {
    console.log(`mp3_file_delete: ${error}`);
  }
}

// update
async function mp3_file_update(req, res) {
  let [file_id, query] = [null, req.query];
  if (query.file_id) {
    file_id = query.file_id;
  }
  try {
    if (file_id == null) throw "file_id query is empty";

    // update
    await file_model.update_by_id(file_id, req.body);
    // send client
    res.status(200).json({ message: "File Updated" });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// find by id files
async function mp3_file_by_postId(req, res) {
  let [post_id, query] = [null, req.query];
  if (query.post_id) {
    post_id = query.post_id;
  }
  try {
    if (post_id == null) throw "post_id query is empty";

    let files = await file_model.find({ query: ["post_id", post_id] });

    res.status(200).json({ files, message: "file fetched" });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = {
  file_table,
  // api
  mp3_file_upload,
  mp3_file_delete,
  mp3_file_update,
  mp3_file_by_postId
};
