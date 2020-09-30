// init value

// editor
const editor = CKEDITOR.replace("editor");

function go_back() {
  window.history.back();
}

// update
async function post_update(is_public = true) {
  const id = document.querySelector("#post-id").value;
  const title = document.querySelector("#title").value;
  const category = document.querySelector("#categories").value;
  const body = editor.getData();
  if (is_public) {
    is_public = 1;
  } else {
    is_public = 0;
  }
  try {
    let res = await axios.put(
      `/dashboard/post-table-update-post/?post_id=${id}`,
      { title, category_name: category, body, is_public },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    // success
    M.toast({ html: res.data.message });
    // reload
    setTimeout(() => {
      window.location.reload();
    }, 1300);
  } catch (error) {
    console.log(error.response);
    M.toast({ html: error.response.statusText });
  }
}
