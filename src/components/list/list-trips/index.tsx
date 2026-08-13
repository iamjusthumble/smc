/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment, useEffect, useState } from "react";
import { ITripData } from "./types";
import TripBody from "./body";
import { Menu, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "@iconify/react";
// import { DatePicker } from "antd";
import DatePicker from "react-datepicker";
import { faBarChart, faBars } from "@fortawesome/free-solid-svg-icons";
import { Calendar, FilterSearch, Refresh } from "iconsax-react";
import "react-datepicker/dist/react-datepicker.css";

import _, { set } from "lodash";
import { CenterLoader } from "../../loaders";
import EmptyComponent from "../../../assets/svgs/EmptyComponent";
import Pagination from "./pagination";
import DayPicker from "../../core/day-picker";
import WeekPicker from "../../core/week-picker";
import MonthPicker from "../../core/month-picker";
import QuarterPicker from "../../core/quarter-picker";
import CustomPicker from "../../core/custom-picker";
import wrapClick from "../../../utils/wrap-click";
import { classNames, useUrlState } from "../../../utils";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-location";
const filterItems = [
  {
    name: "One-time",
    href: "#",
  },
  {
    name: "Recurring",
    href: "#",
  },
  {
    name: "All",
    href: "#",
  },
];

type ListTripsProps = {
  data: ITripData[];
  showPagination?: boolean;
  showTop?: boolean;
  limit: number;
  skip: number;
  setLimit: any;
  search?: any;
  setSearch?: any;
  loading: boolean;
  refetch: any;
  totalAvailable: number;
  setSkip: any;
  dispatchAction: any;
  NoDataComponent?: JSX.Element;
  total: number;
};

function ListTrips({
  data,
  showPagination,
  showTop,
  limit,
  NoDataComponent,
  totalAvailable,
  refetch,
  skip,
  search,
  setSearch,
  loading,
  dispatchAction,
  setSkip,
  total,
}: ListTripsProps) {
  const currentDate = new Date();
  const views = ["day", "month", "custom"] as const;
  const [currentView, setCurrentView] = useUrlState("view");

  useEffect(() => {
    setCurrentView("day");
  }, []);

  const CustomDatePickerInput = ({ value, onClick }: any) => (
    <div className="relative w-32">
      <input
        type="text"
        value={value}
        onClick={onClick}
        readOnly
        placeholder="select dates"
        className="py-2.5 h-10 w-32 px-6 pl-10 border-[1.5px] rounded-lg text-gray-900 placeholder:text-gray-900 focus:outline-none focus:border-[1.5px] focus:border-blue-500"
      />
      <Calendar
        className="absolute top-[21px] left-1 transform -translate-y-1/2"
        size="20"
        color="#000"
      />
    </div>
  );
  return (
    <>
      <div className="mt-10 max-w-full  pb-10 lg:px-28">
        <div className="bg-white  rounded-xl border-[1.5px]  shadow-xl mt-5 overflow-y-auto max-h-[46rem] lg:px-10 py-12 overflow-x-auto">
          {showTop && (
            <div className="flex lg:justify-between gap-y-3  flex-wrap items-center">
              <div className="flex gap-x-2 md:gap-x-5 mx-2 pl-2 bg-gray-100 px-1 border pr-3 rounded-lg">
                <button
                  onClick={() => setSearch("ACTIVE")}
                  className={
                    search === "ACTIVE"
                      ? `bg-white my-1 px-3 py-1.5 border shadow text-sm text-gray-900 transition-all rounded-lg`
                      : `text-lightgray text-sm`
                  }
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setSearch("COMPLETED")}
                  className={
                    search === "COMPLETED"
                      ? `bg-white my-1 px-3 py-1.5 border shadow text-sm text-gray-900 transition-all rounded-lg`
                      : `text-lightgray text-sm`
                  }
                >
                  Completed
                </button>
                <button
                  onClick={() => setSearch("CANCELLED")}
                  className={
                    search === "CANCELLED"
                      ? `bg-white my-1 px-3 py-1.5 border shadow text-sm text-gray-900 transition-all rounded-lg`
                      : `text-lightgray text-sm`
                  }
                >
                  Cancelled
                </button>
              </div>
              <div className="flex gap-x-4 mx-2 md:mx-0 items-center">
                <div className="flex gap-x-4 items-center">
                  <div className="hidden md:ml-4 md:flex md:items-center space-x-3">
                    <Menu as="div" className="relative">
                      <Menu.Button
                        type="button"
                        className="flex items-center rounded-md border border-gray-300 bg-white py-2 pl-3 pr-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        {_.capitalize(currentView)} View
                        <ChevronDownIcon
                          className="ml-2 h-5 w-5 text-gray-400"
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
                        <Menu.Items className="absolute z-10 right-0 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                  </div>
                  <div onClick={wrapClick(refetch)}>
                    <div className="border bg-white cursor-pointer py-2 px-2.5 rounded-lg">
                      <Refresh
                        onClick={wrapClick(refetch)}
                        className={classNames(
                          loading ? "animate-spin" : "animate-none",
                          "h-5 w-5"
                        )}
                        size="22"
                        color="#6B7280"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {loading ? (
            <div className="font-light w-full h-full flex flex-col justify-center items-center">
              <CenterLoader />
            </div>
          ) : totalAvailable ? (
            <main className={"mt-10"}>
              {data.map((trip, index) => (
                <TripBody
                  dispatchAction={dispatchAction}
                  key={index}
                  data={trip}
                />
              ))}
            </main>
          ) : (
            <React.Fragment>
              {NoDataComponent ? (
                NoDataComponent
              ) : (
                <>
                  <div
                    style={{
                      height: "70vh",
                      width: "80vw",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                    className="font-light"
                  >
                    <EmptyComponent className="h-56 w-56" />
                    <span>Oops, no data available</span>
                  </div>
                </>
              )}
            </React.Fragment>
          )}
          {showPagination && (
            <Pagination
              height="1"
              limit={limit}
              setSkip={setSkip}
              skip={skip}
              total={total}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              refetch={() => {}}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ListTrips;
