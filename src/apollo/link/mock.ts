import { ApolloLink, FetchResult, Observable } from "@apollo/client";
import resolvers from "../../mocks/resolvers";

// Terminating link used while the real backend is unreachable — answers
// every operation from src/mocks/resolvers.ts instead of hitting the network.
const mockLink = new ApolloLink((operation) => {
  const resolve = resolvers[operation.operationName];

  if (!resolve) {
    // eslint-disable-next-line no-console
    console.warn(
      `[mock] No mock resolver for operation "${operation.operationName}" — returning empty data.`
    );
  }

  return new Observable<FetchResult>((observer) => {
    const timer = setTimeout(() => {
      try {
        const data = resolve ? resolve(operation.variables) : {};
        observer.next({ data });
        observer.complete();
      } catch (error) {
        observer.error(error);
      }
    }, 300 + Math.random() * 300);

    return () => clearTimeout(timer);
  });
});

export default mockLink;
