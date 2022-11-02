const { Client } = require("@notionhq/client");
const { dolarApiUrl, notionUrl } = require("../constants/constants.js");
const config = require("../config");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const getDolarValue = async () => {
  const response = await fetch(dolarApiUrl);
  const data = await response.json();
  return data;
};

const getPages = async (key, id) => {
  const notion = new Client({ auth: key });
  const response = await notion.databases.query({ database_id: id });
  return response.results;
};

const dolarUpdate = async () => {
  console.log("dolar");
  const notionKey = config.NOTION_KEY;
  const databaseId = config.DATABASE_ID;
  const dolars = await getDolarValue();
  const pages = await getPages(notionKey, databaseId);

  await Promise.all(
    await dolars.map(async (d) => {
      const { nombre, compra, venta } = d.casa;
      const page = pages.filter(
        (p) =>
          p.properties.Name.title[0].plain_text.toLowerCase().trim() ===
          nombre.toLowerCase()
      )[0];
      if (!page?.id) return;
      const payload = JSON.stringify({
        properties: {
          Sell: {
            number: parseFloat(venta),
          },
          Buy: {
            number:
              typeof parseFloat(compra) === typeof NaN
                ? parseFloat(venta)
                : parseFloat(compra),
          },
        },
      });

      const response = await fetch(notionUrl + "pages/" + page.id, {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "Notion-Version": "2022-06-28",
          Authorization: `Bearer ${notionKey}`,
        },
        method: "patch",
        body: payload,
      });
      return response.status;
    })
  );
};

module.exports = dolarUpdate;
