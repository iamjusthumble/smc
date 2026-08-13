import { from, HttpLink } from "@apollo/client";
import activityMiddleware from "./activity";
import analyticsMiddleware from "./analytics";
import authMiddleware from "./auth";
import errorMiddleware from "./error";
// import persistedQueriesMiddleware from "./pq";
import retryMiddleware from "./retry";
import mockLink from "./mock";
import config from "../../config";

const httpLink = new HttpLink({ uri: config.apollo.uri });

const link = from([
  authMiddleware,
  activityMiddleware,
  analyticsMiddleware,
  errorMiddleware,
  // persistedQueriesMiddleware,
  ...(config.mockBackend ? [mockLink] : [retryMiddleware, httpLink]),
]);

export default link;
