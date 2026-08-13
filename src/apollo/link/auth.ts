import { ApolloLink, ServerError } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { clearAuth, currentTokenVar } from "../cache/auth";

const authMiddleware = new ApolloLink((operation, forward) => {
  // check if token has been cached
  const authorization = currentTokenVar();
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(authorization ? { authorization: authorization } : {}),
    },
  }));

  return forward(operation);
});

const resetAuthMiddleware = onError(({ networkError }) => {
  if (networkError) {
    if (networkError.name === "ServerError") {
      (networkError as any)?.result?.errors?.forEach(
        (error: { extensions: { code: string } }) => {
          if (error?.extensions?.code === "UNAUTHENTICATED") {
            clearAuth();
            return;
          }
        }
      );
    }
  }
});

export default authMiddleware.concat(resetAuthMiddleware);
