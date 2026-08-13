import lodash from "lodash";
import { rankRoutes } from "react-location-rank-routes";
import { RouteProps } from "./routes";
import { currentUserVar } from "../apollo/cache/auth";

export const withRoutePermissions = (routes: RouteProps[]) => {
  const currentUser = currentUserVar();
  return lodash.filter(routes, (route) =>
    route?.withPermissions && route?.withPermissions.length > 0
      ? lodash.intersection(
          route?.withPermissions,
          currentUser?.role?.permissions || []
        ).length > 0
      : true
  );
};
/**
 *
 * @param permissions permissions associated with the current user. pass this if you are using permissions
 * @returns a list of filtered routes
 */
const filterRoutes = () => {
  return lodash.flow([rankRoutes, withRoutePermissions]);
};

export default filterRoutes;
