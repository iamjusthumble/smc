import { Tooltip } from "react-tooltip";
import NotificationProvider from "./notifications";
import LayoutProvider from "./layouts";
import ApolloProvider from "./apollo";
import RoutesProvider from "./router";
// import TranslationProvider from 'translation';

function App() {
  return (
    // <TranslationProvider>
    <ApolloProvider>
      <NotificationProvider>
        <RoutesProvider>
          <LayoutProvider />
          <Tooltip id="global-tooltip" />
        </RoutesProvider>
      </NotificationProvider>
    </ApolloProvider>
    // </TranslationProvider>
  );
}

export default App;
