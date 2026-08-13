import { Outlet, Route } from "react-location";
import LoginPage from "../pages/signin";
import DashBoardPage from "../pages/dashboard";
import { UserPermission } from "../apollo/cache/auth";
import CompanyPage from "../pages/drivers";
import TalentPage from "../pages/trips";
import SettingsPage from "../pages/settings";
import PasswordReset from "../pages/forgot-password";
import PasswordPage from "../pages/settings/password-reset";
import DetailsPage from "../pages/settings/user-details";
import TeamsPage from "../pages/settings/team";
import BusesPage from "../pages/buses";
import DriversPage from "../pages/drivers";
import BookingsPage from "../pages/bookings";

export type RouteProps = Omit<Route, "children"> & {
  withPermissions?: UserPermission[];
  navigation?: boolean;
  label?: string;
  children?: RouteProps[];
};

const routes: RouteProps[] = [
  {
    path: "/",
    element: <DashBoardPage />,
    label: "Dashboard",
    meta: {
      layout: "App",
    },
    withPermissions: ["*:*", "dashboard-*"],
  },
  {
    path: "forgot-password",
    element: <PasswordReset />,
    meta: {
      layout: "Auth",
    },
  },
  {
    path: "buses",
    element: <BusesPage />,
    label: "Buses",
    meta: {
      layout: "App",
    },
    withPermissions: ["*:*", "dashboard-*"],
  },
  {
    path: "drivers",
    element: <DriversPage />,
    label: "Drivers",
    meta: {
      layout: "App",
    },
    withPermissions: ["*:*", "dashboard-*"],
  },
  {
    path: "bookings",
    element: <BookingsPage />,
    label: "Bookings",
    meta: {
      layout: "App",
    },
    withPermissions: ["*:*", "dashboard-*"],
  },
  {
    path: "trips",
    element: <TalentPage />,
    label: "Trips",
    meta: {
      layout: "App",
    },
    withPermissions: ["*:*", "dashboard-*"],
  },
  {
    path: "signin",
    element: <LoginPage />,
    meta: {
      layout: "Auth",
    },
  },
  {
    path: "settings",
    element: <SettingsPage />,
    meta: {
      layout: "App",
    },
    withPermissions: ["*:*", "dashboard-*"],
    children: [
      {
        path: "password",
        element: <PasswordPage />,
        meta: {
          layout: "App",
        },
        withPermissions: ["*:*", "dashboard-*"],
      },
      {
        path: "teams",
        element: <TeamsPage />,
        meta: {
          layout: "App",
        },
        withPermissions: ["*:*", "dashboard-*"],
      },
      {
        path: "details",
        element: <DetailsPage />,
        meta: {
          layout: "App",
        },
        withPermissions: ["*:*", "dashboard-*"],
      },
    ],
  },
];

export default routes;
