import serverlessExpress from "@vendia/serverless-express";
import express from "express";
import NotFound from "@/common/notfound";

const app = express();
app.use(express.json());

app.use(NotFound.main);

const handler = serverlessExpress({ app });

export async function main(event, context) {
  try {
    return await handler(event, context);
  } catch (error) {
    return error;
  }
}
