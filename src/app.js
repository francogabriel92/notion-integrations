const express = require("express");
const app = express();

const dolarUpdate = require("./services/dolarUpdate");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/updatedolar/", async (req, res) => {
  try {
    const responseStatus = await dolarUpdate();
    res.send({ status: responseStatus, message: "Dolar updated in Notion" });
  } catch (e) {
    res.send({ status: 500, error: e.message });
  }
});

module.exports = app;
