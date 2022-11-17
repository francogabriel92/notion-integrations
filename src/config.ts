require("dotenv").config();

const NOTION_KEY = process.env.NOTION_KEY;
const DATABASE_ID = process.env.DATABASE_ID;
const PORT = process.env.PORT;

export {
  NOTION_KEY,
  DATABASE_ID,
  PORT,
};
