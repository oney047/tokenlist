const { test } = require("uvu");
const https = require("https");
const assert = require("uvu/assert");
const { getVersionUpgrade, minVersionBump } = require("@uniswap/token-lists");
const schema = require("./schema");

test("Validate Schema", () => {
  const list = getCurrentList();
  schema.parse(list);
});

test("Validate Correct Bump", async () => {
  const masterList = await getListFromMaster();
  const current = getCurrentList();
  const bump = getVersionUpgrade(masterList.version, current.version);
  const min = minVersionBump(masterList.tokens, current.tokens);
  assert.ok(
    bump >= min,
    `Version bump needs to be bigger than min. Got: Bump=${bump}, min=${min}`
  );
});

function getCurrentList() {
  const data = require("../src/tokenlist.json");
  return data;
}

async function getListFromMaster() {
  return new Promise((resolve, reject) =>
    https
      .get(
        "https://raw.githubusercontent.com/diffusion-fi/tokenlist/main/src/tokenlist.json",
        (res) => {
          let body = "";

          res.on("data", (chunk) => {
            body += chunk;
          });

          res.on("end", () => {
            try {
              let json = JSON.parse(body);
              // do something with JSON
              resolve(json);
            } catch (error) {
              reject(error);
              console.error(error.message);
            }
          });
        }
      )
      .on("error", (error) => {
        reject(error);
        console.error(error.message);
      })
  );
}

test.run();
