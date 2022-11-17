import express, { Application, Request, Response } from 'express';
const app: Application  = express();

import { dolarUpdate } from './services/dolarUpdate';

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  try {    
    const responseStatus = await dolarUpdate();
    res.send({ status: responseStatus, message: "Dolar updated in Notion" });
  } catch (e) {
    // console.log(e);
    if (e instanceof Error) res.send({ status: 500, error: e.message});
  }
});

export default app;