import { ReactElement } from "react";
import { ReactLocation, MakeGenerics } from "react-location";
import { parseSearch, stringifySearch } from "react-location-jsurl";

export type LocationGenerics = MakeGenerics<{
  Search: {
    token?: string;
    page?: number;
    pageSize?: number;
    search?: string;
    searchField?: string;
    redirect?: string;
    id?: string;
    sort?: string;
  };
  Params: Record<string, never>;
  RouteMeta: {
    layout?: "App" | "Auth";
  };
}>;

const location = new ReactLocation({
  parseSearch,
  stringifySearch,
});

export default location;
