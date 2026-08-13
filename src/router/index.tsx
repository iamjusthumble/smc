import { FC, PropsWithChildren } from "react";
// import { ReactLocationDevtools } from 'react-location-devtools';
import { Router } from "react-location";
import { useReactiveVar } from "@apollo/client";
import routes from "./routes";
import location from "./location";
import filterRoutes from "./filter";
import { currentUserVar } from "../apollo/cache/auth";
// import { currentConfigVar } from "apollo/cache/config";

const RoutesProvider: FC<PropsWithChildren> = ({ children }) => {
  // const currentTheme = useReactiveVar(currentConfigVar);
  const currentUser = useReactiveVar(currentUserVar);

  return (
    <div className={"light"}>
      <Router location={location} routes={routes} filterRoutes={filterRoutes()}>
        {/* <ReactLocationDevtools initialIsOpen={false} /> */}
        {children}
      </Router>
    </div>
  );
};

export default RoutesProvider;
