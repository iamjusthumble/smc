import packageJson from "./../../package.json";
import firebaseConfig from "./firebase";

// Validate Env Variables
if (import.meta.env.NODE_ENV === "production") {
  const variables = [
    "VITE_SENTRY_DSN",
    "VITE_TEST_APOLLO_URI",
    "VITE_TEST_ASSET_URI",
    "VITE_PROD_ASSET_URI",
    "VITE_PROD_APOLLO_URI",
  ];
  for (const variable of variables) {
    if (!import.meta.env[variable]) {
      throw new Error(`Kindly Provide Variable ${variable} In Env`);
    }
  }
}

const apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_PROD_APOLLO_URI
    : import.meta.env.VITE_NODE_ENV === "test"
    ? import.meta.env.VITE_TEST_APOLLO_URI
    : import.meta.env.VITE_NODE_ENV === "development"
    ? import.meta.env.VITE_DEV_APOLLO_URI
    : null;

console.log(apiUrl, "apiUrl");

const assetUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_PROD_ASSET_URI
    : import.meta.env.VITE_NODE_ENV === "test"
    ? import.meta.env.VITE_TEST_ASSET_URI
    : import.meta.env.VITE_NODE_ENV === "development"
    ? import.meta.env.VITE_DEV_ASSET_URI
    : null;

interface Config {
  env: "production" | "staging" | "sandbox" | "test" | "development";
  name: string;
  mockBackend: boolean;
  asset: {
    uri: string;
  };
  apollo: {
    uri: string;
    name: string;
    version: string;
  };
  sentry: {
    dsn: string;
    env: "production" | "staging" | "sandbox" | "test";
  };
  cookies: {
    domain: string;
    secure: boolean;
    sameSite: "strict" | "Strict" | "lax" | "Lax" | "none" | "None";
  };
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
    vapidKey: string;
  };
  constants: {
    page: number;
    pageSize: number;
    dateFormat: string;
  };
}

const config: Config = {
  env: (import.meta.env.NODE_ENV as any) ?? "development",

  name: packageJson.name,
  // Backend is currently unreachable; the app answers every GraphQL/REST
  // call with local mock data unless VITE_MOCK_BACKEND=false is set.
  mockBackend: import.meta.env.VITE_MOCK_BACKEND !== "false",
  asset: {
    uri: assetUrl ?? "",
  },
  apollo: {
    uri: apiUrl ?? "",
    name: packageJson.name,
    version: packageJson.version,
  },
  sentry: {
    dsn:
      import.meta.env.VITE_SENTRY_DSN ??
      "https://examplePublicKey@o0.ingest.sentry.io/0",
    env: import.meta.env.VITE_SENTRY_ENV as any,
  },

  cookies: {
    domain: window.location.hostname?.split(".")?.slice(1)?.join("."),
    secure: true,
    sameSite: "strict",
  },
  firebase: firebaseConfig,
  constants: {
    page: 1,
    pageSize: 10,
    dateFormat: "",
  },
};

export default config;
