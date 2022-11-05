import serverlessExpress from "@vendia/serverless-express";
import express from "express";
import ListStatements from "@/handlers/crud/routes/statement/list";
import CreateStatement from "@/handlers/crud/routes/statement/create";
import GetStatement from "@/handlers/crud/routes/statement/get";
import ListTransactions from "@/handlers/crud/routes/transaction/list";
import CreateTransaction from "@/handlers/crud/routes/transaction/create";
import GetTransaction from "@/handlers/crud/routes/transaction/get";
import DeleteTransaction from "@/handlers/crud/routes/transaction/delete";
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

const middleware = async (req, res, next) => {
  next();
};

routes.forEach((route) => {
  app[route.method].apply(app, [route.path, middleware, route.class["main"]]);
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
