import TableComponent from "../../components/tables/table";
import React, { Fragment, useEffect, useState } from "react";
import _ from "lodash";
import useTableData from "../../utils/use-table-data";
import Shimmers from "../../components/tables/shimmers";
import { classNames, useUrlState } from "../../utils";
import { Action } from "../../components/buttons/action-button";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { Link, useNavigate, useSearch } from "react-location";
import { LocationGenerics } from "../../router/location";
import wrapClick from "../../utils/wrap-click";
import Search from "../../components/inputs/search";

import debounce from "lodash/debounce";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  TicketIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import SubHeader from "../../components/layouts/sub-header";
import StatCard from "../../components/core/stat-card";
import { currentUserVar } from "../../apollo/cache/auth";
import DayPicker from "../../components/core/day-picker";
import WeekPicker from "../../components/core/week-picker";
import MonthPicker from "../../components/core/month-picker";
import QuarterPicker from "../../components/core/quarter-picker";
import CustomPicker from "../../components/core/custom-picker";

const stats = [
  {
    name: "All Bookings",
    stat: "200,000",
    changeType: "increase" as const,
    change: "4.05%",
    icon: TicketIcon,
  },
  {
    name: "Successfully Booked Trips",
    stat: "26,000",
    changeType: "increase" as const,
    change: "4.05%",
    icon: CheckCircleIcon,
  },
  {
    name: "Failed Booked Trips",
    stat: "12",
    changeType: "increase" as const,
    change: "4.05%",
    icon: XCircleIcon,
  },
];

const dateRanges = ["12 months", "30 days", "7 days", "24 hours"] as const;

const GET_ALL_BOOKINGS = gql`
  query GetAllBookings(
    $pagination: Pagination!
    $populate: [String]
    $search: SearchOperator
    $filter: BookingFilter
  ) {
    getAllBookings(
      pagination: $pagination
      populate: $populate
      search: $search
      filter: $filter
    ) {
      count
      rows {
        _id
        code
        Trip {
          bus {
            vehicleNumber
          }
          origin {
            name
          }
          destination {
            name
          }
        }
        User {
          phone
        }
        seatNumber
        paymentStatus
      }
    }
  }
`;

const BookingsPage = () => {
  const [skip, setSkip] = React.useState(0);
  const [limit, setLimit] = React.useState(8);
  const [networkStatus, setNetworkStatus] = React.useState(0);
  const views = ["day", "month", "custom"] as const;

  const [search, setSearch] = React.useState("");
  const [dateRange, setDateRange] = useState<(typeof dateRanges)[number]>(
    "12 months"
  );
  const [modal, setModal] = useUrlState("modal");
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const currentUser = useReactiveVar(currentUserVar);
  const [currentView, setCurrentView] = useUrlState("view");

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

  const { loading, data, refetch } = useQuery(GET_ALL_BOOKINGS, {
    variables: {
      pagination: {
        skip,
        limit,
      },
      populate: ["Trip", "Trip.bus", "Trip.origin", "Trip.destination", "User"],
      search: {
        query: search,
        options: ["i"],
        fields: ["status"],
      },
      filter: {
        busCompany: {
          eq: currentUser.busCompany._id,
        },
      },
    },
  });

  useEffect(() => {
    refetch();
    setCurrentView("day");
  }, []);

  const requests = {
    rows: data?.getAllBookings?.rows,
    count: data?.getAllBookings?.count,
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const debouncedSearch = debounce((value) => {
      setSearch(value);
    }, 300);

    debouncedSearch(searchTerm);
  };

  const records = useTableData(requests || {});
  return (
    <>
      <SubHeader title="Bookings" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          {dateRanges.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setDateRange(range)}
              className={classNames(
                dateRange === range
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-50",
                "rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors"
              )}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <StatCard
              key={item.name}
              label={item.name}
              value={item.stat}
              icon={item.icon}
              trend={{ direction: item.changeType, value: item.change }}
            />
          ))}
        </div>

        <div className="mt-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="w-full sm:w-96">
              <Search
                placeholder="Search booking code"
                colspan={2}
                handleSearchChange={handleSearchChange}
                setValue={setSearch}
                value={search}
              />
            </div>
            <div className="flex items-center gap-x-3">
              <Menu as="div" className="relative">
                <Menu.Button
                  type="button"
                  className="flex h-10 items-center rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {_.capitalize(currentView)} View
                  <ChevronDownIcon
                    className="ml-2 h-4 w-4 text-gray-400"
                    aria-hidden="true"
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right overflow-hidden rounded-lg bg-white shadow-dropdown ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {views.map((view) => (
                        <Menu.Item key={view}>
                          {({ active }) => (
                            <Link
                              search={(search) => ({ ...search, view })}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              {_.startCase(view)} View
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              {currentView === "day" && <DayPicker />}
              {currentView === "week" && <WeekPicker />}
              {currentView === "month" && <MonthPicker />}
              {currentView === "quarter" && <QuarterPicker />}
              {currentView === "custom" && <CustomPicker />}
              <button
                type="button"
                onClick={wrapClick(refetch)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
              >
                <ArrowPathIcon
                  className={classNames(
                    loading ? "animate-spin" : "animate-none",
                    "h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                <span className="sr-only">Refresh</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-1 overflow-y-auto">
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden overflow-y-auto">
              <TableComponent
                title={"Bookings"}
                refetch={refetch}
                setSkip={setSkip}
                skip={skip}
                limit={limit}
                showTableHeader={false}
                isRefetching={loading && networkStatus === 4}
                loading={loading && ![4, 6].includes(networkStatus)}
                data={records}
                hasSearch={true}
                renderColumns={() => {
                  return (
                    <tr>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Vehicle Number
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Trip
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Booking ID
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Customer Contact
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Seat Number
                      </th>
                      <th
                        scope="col"
                        className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        Payment Status
                      </th>
                    </tr>
                  );
                }}
                renderLoader={() => (
                  <tr>
                    <td className="px-6 py-4">
                      <Shimmers.SingleShimmer />
                    </td>
                    <td className="px-6 py-4">
                      <Shimmers.DoubleShimmer />
                    </td>
                    <td className="px-6 py-4">
                      <Shimmers.DoubleShimmer />
                    </td>
                    <td className="px-6 py-4">
                      <Shimmers.DoubleShimmer />
                    </td>
                    <td className="px-6 py-4">
                      <Shimmers.SingleShimmer />
                    </td>
                    <td className="px-6 py-4">
                      <Shimmers.SingleShimmer />
                    </td>
                  </tr>
                )}
                renderItem={(item) => (
                  <tr
                    key={item._id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={wrapClick(dispatchAction(item._id, "view"))}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {item?.Trip?.bus?.vehicleNumber || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <div className="flex gap-x-1">
                          <p className="text-sm text-primary">Origin</p>
                          <span>-</span>
                          <p>{item?.Trip?.origin?.name || "N/A"}</p>
                        </div>
                        <div className="flex gap-x-1">
                          <p className="text-sm text-primary">Destination</p>
                          <span>-</span>
                          <p>{item?.Trip?.destination?.name || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {item?.code || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {item?.User?.phone || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {item?.seatNumber || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <span
                        className={classNames(
                          item?.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "",
                          item?.paymentStatus === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "",
                          item?.paymentStatus === "failed"
                            ? "bg-red-100 text-red-700"
                            : "",
                          item?.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "",
                          !item?.paymentStatus ? "bg-gray-100 text-gray-700" : "",
                          "inline-flex items-center space-x-1 rounded-full px-2.5 py-1 text-xs font-medium"
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 10 10"
                          fill="currentColor"
                          className="h-1.5 w-1.5"
                        >
                          <circle cx="5" cy="5" r="5" />
                        </svg>
                        <span>
                          {_.startCase(item?.paymentStatus || "Unknown")}
                        </span>
                      </span>
                    </td>
                  </tr>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingsPage;
