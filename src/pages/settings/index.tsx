import { Link, Navigate } from "react-location";
import { Outlet } from "react-location";

const secondaryNavigation = [
  { name: "My Details", href: "/settings/details", current: false },
  { name: "Password", href: "/settings/password", current: false },
  { name: "Team", href: "/settings/teams", current: true },
];

const SettingsPage = () => {
  if (window.location.pathname === "/settings") {
    return <Navigate to="/settings/details" replace />;
  }

  return (
    <>
      <div className="w-screen mb-20">
        <div className="bg-white px-10 lg:px-28 flex items-center justify-between py-4 ">
          <header>
            <div className="">
              <h1 className="text-3xl font-medium leading-tight tracking-tight text-gray-900">
                Settings
              </h1>
            </div>
          </header>
        </div>
        <div className="border-b lg:px-28 border-white/5">
          {/* Secondary navigation */}
          <nav className="flex overflow-x-auto py-4">
            <ul className="flex min-w-full flex-none gap-x-6  text-sm font-semibold leading-6 text-gray-400 ">
              {secondaryNavigation.map((item, idx) => (
                <li key={item.name}>
                  <Link
                    key={idx}
                    to={item.href}
                    getActiveProps={() => ({
                      className: "bg-primary text-white",
                    })}
                    getInactiveProps={() => ({
                      className: "hover:bg-primary hover:text-white",
                    })}
                    className="rounded-md text-gray-600 px-3 py-2 text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default SettingsPage;
