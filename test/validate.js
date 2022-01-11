const schema = require("./schema");

validate();

function validate() {
  const list = getList();
  schema.parse(list);
}

function getList() {
  const data = require("../src/tokenlist.json");
  return data;
}
