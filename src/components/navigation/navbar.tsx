import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  Cog6ToothIcon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-location";
import _ from "lodash";
import routes from "../../router/routes";

import { classNames } from "../../utils";
import Logout from "../modals/logout";
import { SETTINGS } from "../../constants/page-paths";
import { withRoutePermissions } from "../../router/filter";
import { useReactiveVar } from "@apollo/client";
import { currentUserVar } from "../../apollo/cache/auth";
import Avatar from "../core/avatar";

function Navbar() {
  const currentUser = useReactiveVar(currentUserVar);
  const navigation = _.chain(routes)
    .filter((route) => _.get(route, "meta.layout") === "App")
    .filter((route) => _.get(route, "path") !== "settings")
    .thru(withRoutePermissions)
    .value();

  const [showLogoutModal, setshowLogoutModal] = useState(false);

  const handleShowModal = () => {
    setshowLogoutModal(true);
  };

  const initials =
    [
      currentUser?.fullName?.split(" ")[0]?.[0] || "",
      currentUser?.fullName?.split(" ")[1]?.[0] || "",
    ]
      .join(" ")
      .trim() || "N A";

  return (
    <>
      <Disclosure as="nav" className="sticky top-0 z-20 border-b border-gray-200 bg-white">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-x-10">
                  <Link to="/" className="flex flex-shrink-0 items-center">
                    <span className="text-xl font-extrabold tracking-tight text-gray-900">
                      Bus<span className="text-primary">Buk</span>
                    </span>
                  </Link>
                  <div className="hidden md:block">
                    <div className="flex items-center gap-x-1">
                      {navigation.map((item: any, idx) => (
                        <Link
                          key={idx}
                          to={item.path}
                          getActiveProps={() => ({
                            className: "bg-primary/10 text-primary",
                          })}
                          getInactiveProps={() => ({
                            className:
                              "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                          })}
                          className="rounded-lg px-3.5 py-2 text-sm font-medium transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center gap-x-2">
                    <Link
                      to={SETTINGS}
                      className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <span className="sr-only">Settings</span>
                      <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" />
                    </Link>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-1">
                      <Menu.Button className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <Avatar
                          src={currentUser?.profilePicture}
                          disabled={true}
                          size="xs"
                          alt={initials}
                        />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-dropdown ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-4 py-3">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {currentUser?.fullName}
                            </p>
                            <p className="truncate text-sm text-gray-500">
                              {currentUser?.email}
                            </p>
                          </div>
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={handleShowModal}
                                  className={classNames(
                                    active ? "bg-gray-50" : "",
                                    "flex w-full items-center gap-x-2 px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-400" />
                                  Sign out
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="border-t border-gray-200 md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item: any, idx) => (
                  <Disclosure.Button
                    key={idx}
                    as={Link}
                    to={item.path}
                    className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-gray-200 pb-3 pt-4">
                <div className="flex items-center px-4">
                  <Avatar
                    src={currentUser?.profilePicture}
                    disabled={true}
                    size="sm"
                    alt={initials}
                  />
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-gray-900">
                      {currentUser?.fullName}
                    </div>
                    <div className="mt-1 text-sm font-medium leading-none text-gray-500">
                      {currentUser?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <Disclosure.Button
                    onClick={handleShowModal}
                    className="flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400" />
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Logout
        setshowLogoutModal={setshowLogoutModal}
        showLogoutModal={showLogoutModal}
      />
    </>
  );
}

export default Navbar;
