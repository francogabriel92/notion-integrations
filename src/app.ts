import express, { Application, Request, Response } from 'express';
import { dolarUpdate } from './services/dolarUpdate';

const app: Application  = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response) => {
  try {    
    const responseStatus = await dolarUpdate();
    res.send({ status: responseStatus, message: "Dolar updated in Notion" });
  } catch (e) {
    if (e instanceof Error) res.send({ status: 500, error: e.message});
  }
});

export default app;