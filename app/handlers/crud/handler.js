import serverlessExpress from "@vendia/serverless-express";
import express from "express";
import CreateStatement from "@/handlers/crud/routes/statement/create";
import GetStatement from "@/handlers/crud/routes/statement/get";
import CreateTransaction from "@/handlers/crud/routes/transaction/create";
import GetTransaction from "@/handlers/crud/routes/transaction/get";
import DeleteTransaction from "@/handlers/crud/routes/transaction/delete";

const app = express();
app.use(express.json());

const routes = [
  { path: "/statement/", method: "post", klass: CreateStatement },
  { path: "/statement/:id", method: "get", klass: GetStatement },
  { path: "/transaction/", method: "post", klass: CreateTransaction },
  { path: "/transaction/:id", method: "get", klass: GetTransaction },
  { path: "/transaction/:id", method: "delete", klass: DeleteTransaction },
];

const middleware = async (req, res, next) => {
  next();
};

for (let route of routes) {
  if (route.klass) {
    app[route.method].apply(app, [route.path, middleware, route.klass["main"]]);
  }
}

const handler = serverlessExpress({ app });

export async function main(event, context) {
  try {
    return await handler(event, context);
  } catch (error) {
    return error;
  }
}
