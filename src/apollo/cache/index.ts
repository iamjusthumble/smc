import { InMemoryCache } from "@apollo/client";

const cache = new InMemoryCache({
  addTypename: true,
  resultCaching: true,
  possibleTypes: {},
  typePolicies: {
    Query: {
      fields: {
        // Add other policies here
        // entities: entitiesPolicy,
      },
    },
  },
});

export default cache;
