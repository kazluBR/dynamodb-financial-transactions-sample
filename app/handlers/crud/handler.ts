import serverlessExpress from "@vendia/serverless-express";
import express from "express";
import CreateStatement from "@/handlers/crud/routes/statement/create";
import GetStatement from "@/handlers/crud/routes/statement/get";

const app = express();
app.use(express.json());

const routes = [
  { path: "/statement/", method: "post", klass: CreateStatement },
  { path: "/statement/:id", method: "get", klass: GetStatement },
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
