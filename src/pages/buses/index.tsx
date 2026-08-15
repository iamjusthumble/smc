import { Add, ArrowDown2, FilterSearch, Refresh } from "iconsax-react";
import TableComponent from "../../components/tables/table";
import React, { Fragment, useMemo, useState } from "react";
import _ from "lodash";
import useTableData from "../../utils/use-table-data";
import Shimmers from "../../components/tables/shimmers";
import { classNames, useUrlState } from "../../utils";
import ActionButton, { Action } from "../../components/buttons/action-button";
import ViewRequest from "./view";
import { useNavigate, useSearch } from "react-location";
import { LocationGenerics } from "../../router/location";
import wrapClick from "../../utils/wrap-click";
import Search from "../../components/inputs/search";
import debounce from "lodash/debounce";
import { Menu, Transition } from "@headlessui/react";
import SubHeader from "../../components/layouts/sub-header";
import withPermissions from "../../utils/with-permissions";
import CreateBus from "./create";
import UpdateBus from "./update";
import DeleteBus from "./delete";
import { useBuses } from "../../services/supabase/use-buses";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { BusStatus } from "../../services/supabase/types";

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

const STATUS_BADGE_CLASSES: Record<BusStatus, string> = {
  active: "bg-green-100 text-green-800",
  maintenance: "bg-amber-100 text-amber-800",
  decommissioned: "bg-red-100 text-red-800",
};

const BusesPage = () => {
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useUrlState("modal");
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();

  const { data: buses, isLoading, isError, error, refetch } = useBuses();

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const debouncedSearch = debounce((value) => {
      setSearch(value);
    }, 300);

    debouncedSearch(searchTerm);
  };

  // No server-side search/pagination for buses — fetch-all, filter/slice here.
  const filtered = useMemo(() => {
    if (!buses) return [];
    if (!search.trim()) return buses;
    const query = search.trim().toLowerCase();
    return buses.filter((bus) =>
      bus.vehicle_number.toLowerCase().includes(query)
    );
  }, [buses, search]);

  const requests = {
    rows: filtered.slice(skip, skip + limit),
    count: filtered.length,
  };

  const records = useTableData(requests || {});

  return (
    <>
      <div className="">
        <SubHeader
          title="Buses"
          renderActions={() => (
            <>
              {withPermissions(["*:*"])(
                <button
                  onClick={() => setModal("create")}
                  className="text-white flex items-center  bg-primary px-4 py-2 rounded-lg "
                >
                  <Add className="h-5 w-5" aria-hidden="true" />
                  Add New Bus
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
                    Couldn&apos;t load buses
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
                  title={"Buses"}
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
                        Add New Bus
                      </button>
                    ) as React.ReactNode
                  }
                  renderColumns={() => {
                    return (
                      <tr>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-center text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Vehicle Number
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50 px-6 py-3 text-center text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Model
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-center text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Year of Make
                        </th>

                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-center text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Colour
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-center text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Number of Seats
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-center text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-center text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
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
                  renderItem={(item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={wrapClick(dispatchAction(item.id, "view"))}
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-center text-gray-500 border-b border-gray-200 ">
                        <div className="text-gray-900 font-manrope">
                          {item?.vehicle_number || "N/A"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-center text-gray-500 border-b border-gray-200 ">
                        <div className="text-gray-900 font-manrope ">
                          {item?.model || "N/A"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-center text-gray-500 border-b border-gray-200 ">
                        <div className="text-gray-900 font-manrope">
                          {item?.make_year || "N/A"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-center text-gray-500 border-b border-gray-200">
                        <div className="text-gray-900 font-manrope">
                          {item?.color || "N/A"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-center text-gray-500 border-b border-gray-200">
                        <div className="text-gray-900 font-manrope">
                          {item?.seat_count || "N/A"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-center text-gray-500 border-b border-gray-200">
                        <span
                          className={classNames(
                            item?.status
                              ? STATUS_BADGE_CLASSES[item.status as BusStatus]
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
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-center text-gray-500 border-b border-gray-200">
                        <div className="space-x-1">
                          <ActionButton
                            action="view"
                            onClick={dispatchAction(item.id, "view")}
                          />
                          <ActionButton
                            action="update"
                            onClick={dispatchAction(item.id, "update")}
                          />
                          <ActionButton
                            action="decommission"
                            onClick={dispatchAction(item.id, "decommission")}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                />
              )}
            </div>
          </div>
        </div>
        {!!searchParams.id?.length && (
          <>
            <ViewRequest
              open={modal === "view"}
              setOpen={(val: boolean) => setModal(val ? "view" : undefined)}
            />
            <UpdateBus
              open={modal === "update"}
              setOpen={(val: boolean) => setModal(val ? "update" : undefined)}
            />
            <DeleteBus
              open={modal === "decommission"}
              setOpen={(val: boolean) =>
                setModal(val ? "decommission" : undefined)
              }
            />
          </>
        )}
        <CreateBus
          open={modal === "create"}
          setOpen={(val: boolean) => setModal(val ? "create" : undefined)}
        />
      </div>
    </>
  );
};

export default BusesPage;
