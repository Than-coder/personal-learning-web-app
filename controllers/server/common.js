function remove_tag(html) {
  html = html.replace(/<.*?>/gim, "");
  return html;
}

function page_to_array(page_number, current_number) {
  let pages = [];

  if (current_number > 1) {
    pages.push(1);
  }

  if (current_number - 2 > 1 && current_number - 2 != 1) {
    pages.push(current_number - 2);
  }
  if (current_number - 1 > 1 && current_number - 1 != 1) {
    pages.push(current_number - 1);
  }

  if (current_number > 0 && current_number < page_number) {
    pages.push(current_number);
  }
  if (current_number + 1 > 1 && current_number + 1 < page_number) {
    pages.push(current_number + 1);
  }
  if (current_number + 2 > 2 && current_number + 2 < page_number) {
    pages.push(current_number + 2);
  }

  pages.push(page_number);

  return pages;
}

module.exports = {
  remove_tag,
  page_to_array
};
