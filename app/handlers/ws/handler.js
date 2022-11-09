import serverlessExpress from "@vendia/serverless-express";
import express from "express";
import NoAuth from "@/common/middleware";
import ListStatements from "@/handlers/ws/routes/crud/statement/list";
import CreateStatement from "@/handlers/ws/routes/crud/statement/create";
import GetStatement from "@/handlers/ws/routes/crud/statement/get";
import ListTransactions from "@/handlers/ws/routes/crud/transaction/list";
import CreateTransaction from "@/handlers/ws/routes/crud/transaction/create";
import GetTransaction from "@/handlers/ws/routes/crud/transaction/get";
import DeleteTransaction from "@/handlers/ws/routes/crud/transaction/delete";
import NotFound from "@/common/notfound";

const app = express();
app.use(express.json());

const routes = [
  { path: "/statement/", method: "get", class: ListStatements },
  { path: "/statement/", method: "post", class: CreateStatement },
  { path: "/statement/:id", method: "get", class: GetStatement },
  { path: "/transaction/", method: "get", class: ListTransactions },
  { path: "/transaction/", method: "post", class: CreateTransaction },
  { path: "/transaction/:id", method: "get", class: GetTransaction },
  { path: "/transaction/:id", method: "delete", class: DeleteTransaction },
];

routes.forEach((route) => {
  app[route.method].apply(app, [route.path, NoAuth, route.class["main"]]);
});

app.use(NotFound.main);

const handler = serverlessExpress({ app });

export async function main(event, context) {
  try {
    return await handler(event, context);
  } catch (error) {
    return error;
  }
}
