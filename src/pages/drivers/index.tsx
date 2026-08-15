import { Add, ArrowDown2, FilterSearch, Refresh } from "iconsax-react";
import TableComponent from "../../components/tables/table";
import React, { Fragment, useMemo, useState } from "react";
import _ from "lodash";
import useTableData from "../../utils/use-table-data";
import Shimmers from "../../components/tables/shimmers";
import { classNames, useUrlState } from "../../utils";
import ActionButton, { Action } from "../../components/buttons/action-button";
import { useNavigate, useSearch } from "react-location";
import { LocationGenerics } from "../../router/location";
import wrapClick from "../../utils/wrap-click";
import Search from "../../components/inputs/search";
import debounce from "lodash/debounce";
import { Menu, Transition } from "@headlessui/react";
import SubHeader from "../../components/layouts/sub-header";
import withPermissions from "../../utils/with-permissions";
import CreateDriver from "./create";
import ViewDriver from "./view";
import UpdateDriver from "./update";
import SuspendDriver from "./suspend";
import RetireDriver from "./retire";
import DeleteDriver from "./delete";
import { useDrivers, useUpdateDriver } from "../../services/supabase/use-drivers";
import { getLicenseExpiryStatus } from "../../services/supabase/drivers";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { DriverStatus } from "../../services/supabase/types";
import toast from "react-hot-toast";

const filterItems = [
  {
    name: "Accepted",
    href: "?status=accepted",
  },
  {
    name: "Pending",
    href: "?status=pending",
  },
  {
    name: "Rejected",
    href: "?status=rejected",
  },
];

const STATUS_BADGE_CLASSES: Record<DriverStatus, string> = {
  active: "bg-green-100 text-green-800",
  suspended: "bg-amber-100 text-amber-800",
  retired: "bg-gray-200 text-gray-600",
};

const DriversPage = () => {
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useUrlState("modal");
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();

  const { data: drivers, isLoading, isError, error, refetch } = useDrivers();
  const updateDriver = useUpdateDriver();

  const dispatchAction =
    (id: string, action: Exclude<Action, "expand" | "goto" | "clone">) =>
    () => {
      navigate({
        search: (old) => ({
          ...old,
          id,
          modal: action,
        }),
      });
    };

  const handleReactivate = (id: string, fullName: string) => async () => {
    try {
      await updateDriver.mutateAsync({ id, payload: { status: "active" } });
      toast(JSON.stringify({ type: "success", title: `${fullName} reactivated` }));
    } catch (e: any) {
      toast(
        JSON.stringify({
          type: "failed",
          title: e?.message || "Couldn't reactivate this driver. Please try again.",
        })
      );
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const debouncedSearch = debounce((value) => {
      setSearch(value);
    }, 300);

    debouncedSearch(searchTerm);
  };

  // No server-side search/pagination for drivers — fetch-all, filter/slice here.
  const filtered = useMemo(() => {
    if (!drivers) return [];
    if (!search.trim()) return drivers;
    const query = search.trim().toLowerCase();
    return drivers.filter(
      (driver) =>
        driver.full_name.toLowerCase().includes(query) ||
        driver.email?.toLowerCase().includes(query)
    );
  }, [drivers, search]);

  const requests = {
    rows: filtered.slice(skip, skip + limit),
    count: filtered.length,
  };

  const records = useTableData(requests || {});

  return (
    <>
      <div className="">
        <SubHeader
          title="Drivers"
          renderActions={() => (
            <>
              {withPermissions(["*:*"])(
                <button
                  onClick={() => setModal("create")}
                  className="text-white flex items-center  bg-primary px-4 py-2 rounded-lg "
                >
                  <Add className="h-5 w-5" aria-hidden="true" />
                  Add New Driver
                </button>
              )}
            </>
          )}
        />

        <div className="mx-auto flex-1  max-w-7xl px-4 sm:px-6 lg:px-8">
          <Fragment>
            <div className="mt-5 flex md:flex-row ml-3 gap-y-3 md:ml-0 md:justify-between flex-wrap sm:flex-col items-center">
              <div className="w-80 md:w-96">
                <Search
                  colspan={2}
                  handleSearchChange={handleSearchChange}
                  setValue={setSearch}
                  value={search}
                />{" "}
                <div className="col-span-2"></div>
              </div>
              <div className="flex gap-x-2">
                <div className="bg-white rounded-lg">
                  <Menu>
                    <Menu.Button className="flex max-w-xs items-center border rounded-lg text-sm">
                      <div className="flex w-full px-2.5 py-2 justify-center items-center">
                        <FilterSearch size="22" color="#6B7280" />
                      </div>
                    </Menu.Button>
                    <Transition
                      as={React.Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-36 mt-1 mr-20 transform -translate-x-1/2 z-10  w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {filterItems.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={`${
                                  active ? "bg-gray-100" : ""
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div
                  onClick={() => refetch()}
                  className="border bg-white cursor-pointer py-2 px-2.5 rounded-lg"
                >
                  <Refresh size="22" color="#6B7280" />
                </div>

                <div className=" rounded-none shadow-sm w-36  relative  flex flex-row items-center">
                  <div className="absolute right-0 pr-4">
                    <ArrowDown2 size={16} color="#6B7280" />
                  </div>
                  <select
                    id="pagination"
                    value={limit}
                    onChange={(e) => {
                      setLimit(parseInt(e.target.value));
                      setSkip(0);
                    }}
                    className="rounded-md border py-2 before:mr-3 select flex px-4 text-gray-500 font-light border-gray-300 appearance-none w-full  sm:text-sm sm:leading-5"
                  >
                    <option value={8}>8 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>
              </div>
            </div>
          </Fragment>
          <div className="flex flex-1 overflow-y-auto">
            <div className="flex-1 min-h-full mx-auto min-w-0 overflow-hidden overflow-y-auto light flex">
              {isError ? (
                <div className="flex min-h-[400px] flex-1 flex-col items-center justify-center gap-y-3 rounded-xl border border-gray-200">
                  <ExclamationTriangleIcon
                    className="h-10 w-10 text-red-400"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-medium text-gray-900">
                    Couldn&apos;t load drivers
                  </p>
                  <p className="max-w-sm text-center text-sm text-gray-500">
                    {error instanceof Error
                      ? error.message
                      : "Something went wrong. Please try again."}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <TableComponent
                  title={"Drivers"}
                  refetch={refetch}
                  setSkip={setSkip}
                  skip={skip}
                  limit={limit}
                  showTableHeader={false}
                  loading={isLoading}
                  data={records}
                  hasSearch={true}
                  emptyStateAction={
                    withPermissions(["*:*"])(
                      <button
                        onClick={() => setModal("create")}
                        className="inline-flex items-center gap-x-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
                      >
                        <Add className="h-4 w-4" aria-hidden="true" />
                        Add New Driver
                      </button>
                    ) as React.ReactNode
                  }
                  renderColumns={() => {
                    return (
                      <tr>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Driver Name
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50 px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Contact
                        </th>

                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Address
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          License Class
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Actions
                        </th>
                      </tr>
                    );
                  }}
                  renderLoader={() => (
                    <tr>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <Shimmers.AvatarShimmer />
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <Shimmers.DoubleShimmer />
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <Shimmers.DoubleShimmer />
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <Shimmers.DoubleShimmer />
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <Shimmers.SingleShimmer />
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <Shimmers.SingleShimmer />
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200">
                        <Shimmers.SingleShimmer />
                      </td>
                    </tr>
                  )}
                  renderItem={(item) => {
                    const expiryStatus = getLicenseExpiryStatus(
                      item.license_expiry
                    );
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={wrapClick(dispatchAction(item.id, "view"))}
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200 ">
                          <div className="text-gray-900 font-manrope">
                            {item?.full_name || "N/A"}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200 ">
                          <div className="text-gray-900 ">
                            {item?.email || "N/A"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200 ">
                          <div className="text-gray-900 ">
                            {item?.phone || "N/A"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200">
                          <div className="text-gray-900">
                            {item?.address || "N/A"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200">
                          <div className="flex items-center gap-x-1.5 text-gray-900">
                            {item?.license_class || "N/A"}
                            {expiryStatus && (
                              <ExclamationTriangleIcon
                                data-tooltip-id="global-tooltip"
                                data-tooltip-content={
                                  expiryStatus === "expired"
                                    ? `Licence expired ${item.license_expiry}`
                                    : `Licence expires ${item.license_expiry}`
                                }
                                className={classNames(
                                  expiryStatus === "expired"
                                    ? "text-red-500"
                                    : "text-amber-500",
                                  "h-4 w-4 flex-shrink-0"
                                )}
                              />
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200">
                          <span
                            className={classNames(
                              item?.status
                                ? STATUS_BADGE_CLASSES[item.status as DriverStatus]
                                : "bg-gray-200 text-gray-800",
                              "inline-flex rounded-full  px-2 py-1 text-xs items-center space-x-1"
                            )}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 10 10"
                              fill="currentColor"
                              className="w-1.5 h-1.5"
                            >
                              <circle
                                fillRule="evenodd"
                                cx="5"
                                cy="5"
                                r="5"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{_.startCase(item?.status || "Unknown")}</span>
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200">
                          <div className="space-x-1">
                            <ActionButton
                              action="view"
                              onClick={dispatchAction(item.id, "view")}
                            />
                            <ActionButton
                              action="update"
                              onClick={dispatchAction(item.id, "update")}
                            />
                            {item.status !== "active" && (
                              <ActionButton
                                action="reactivate"
                                tooltip="Reactivate"
                                onClick={handleReactivate(item.id, item.full_name)}
                              />
                            )}
                            {item.status !== "suspended" && item.status !== "retired" && (
                              <ActionButton
                                action="suspend"
                                tooltip="Suspend"
                                onClick={dispatchAction(item.id, "suspend")}
                              />
                            )}
                            {item.status !== "retired" && (
                              <ActionButton
                                action="retire"
                                tooltip="Retire"
                                onClick={dispatchAction(item.id, "retire")}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {!!searchParams.id?.length && (
          <>
            <ViewDriver
              open={modal === "view"}
              setOpen={(val: boolean) => setModal(val ? "view" : undefined)}
            />
            <UpdateDriver
              open={modal === "update"}
              setOpen={(val: boolean) => setModal(val ? "update" : undefined)}
            />
            <SuspendDriver
              open={modal === "suspend"}
              setOpen={(val: boolean) => setModal(val ? "suspend" : undefined)}
            />
            <RetireDriver
              open={modal === "retire"}
              setOpen={(val: boolean) => setModal(val ? "retire" : undefined)}
            />
            <DeleteDriver
              open={modal === "delete"}
              setOpen={(val: boolean) => setModal(val ? "delete" : undefined)}
            />
          </>
        )}
        <CreateDriver
          open={modal === "create"}
          setOpen={(val: boolean) => setModal(val ? "create" : undefined)}
        />
      </div>
    </>
  );
};

export default DriversPage;
