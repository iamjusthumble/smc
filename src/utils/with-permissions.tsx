import lodash from "lodash";
import { currentUserVar, UserPermission } from "../apollo/cache/auth";

export default function withPermissions<T = any>(
  permissions: UserPermission[]
) {
  const currentUser = currentUserVar();
  return (val: T, alt?: T): T | null => {
    if (permissions.length > 0) {
      if (
        lodash.intersection(permissions, currentUser?.role?.permissions)
          .length > 0
      ) {
        return val;
      }
      return alt ?? null;
    }
    return val;
  };
}
