import { onError } from "@apollo/client/link/error";
import { SentryLink, excludeGraphQLFetch } from "apollo-link-sentry";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import toast from "react-hot-toast";
import config from "../../config";
import { BrowserTracing } from "@sentry/react";

Sentry.init({
  environment: config.sentry.env,
  dsn: config.sentry.dsn,
  integrations: [
    new BrowserTracing({
      traceFetch: false,
    }),
  ],
  beforeBreadcrumb: excludeGraphQLFetch,
  // Only enable in dev when a real DSN is configured — without one this
  // falls back to a non-functional placeholder DSN that just spams 400s.
  enabled: config.env === "development" && !!import.meta.env.VITE_SENTRY_DSN,

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const sentryMiddleware = new SentryLink({
  uri: config.apollo.uri,
  setTransaction: true,
  setFingerprint: true,
});

const errorMiddleware = onError((errors) => {
  if (errors.graphQLErrors)
    errors.graphQLErrors.forEach(
      ({ message, locations, path, originalError }) => {
        toast(JSON.stringify({ type: "error", title: message }));
      }
    );

  if (errors.networkError) {
    toast(
      JSON.stringify({ type: "error", title: errors.networkError.message })
    );
  }
  Sentry.captureException(errors);
}).split(() => config.env === "production", sentryMiddleware);

export default errorMiddleware;
