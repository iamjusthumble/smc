import { FC, Fragment, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import DatePicker from "./date-picker";
import wrapClick from "../../utils/wrap-click";
import { useUrlState } from "../../utils";

const DATE_FORMAT = "YYYY-MM-DD";
const CALENDAR_FORMAT = {
  sameDay: "[Today]",
  nextDay: "[Tomorrow]",
  lastDay: "[Yesterday]",
  lastWeek: "dddd",
  sameElse: "Do MMMM, YYYY",
};

const DayPicker: FC = () => {
  const [fromDate, setFromDate] = useUrlState("fromDate");
  const [toDate, setToDate] = useUrlState("toDate");

  const previousDay = () => {
    setFromDate(
      moment(fromDate, DATE_FORMAT)
        .subtract(1, "day")
        .startOf("day")
        .format(DATE_FORMAT)
    );
    setToDate(
      moment(toDate, DATE_FORMAT)
        .subtract(1, "day")
        .endOf("day")
        .format(DATE_FORMAT)
    );
  };
  const nextDay = () => {
    setFromDate(
      moment(fromDate, DATE_FORMAT)
        .add(1, "day")
        .startOf("day")
        .format(DATE_FORMAT)
    );
    setToDate(
      moment(toDate, DATE_FORMAT).add(1, "day").endOf("day").format(DATE_FORMAT)
    );
  };
  const setCurrentDay = (date: Date) => {
    setFromDate(moment(date, DATE_FORMAT).startOf("day").format(DATE_FORMAT));
    setToDate(moment(date, DATE_FORMAT).endOf("day").format(DATE_FORMAT));
  };

  useEffect(() => {
    setCurrentDay(fromDate || moment().format(DATE_FORMAT));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex items-center rounded-md shadow-sm md:items-stretch">
      <button
        type="button"
        onClick={wrapClick(previousDay)}
        className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
      >
        <span className="sr-only">Previous day</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <Popover as={Fragment}>
        <Popover.Button
          as="button"
          type="button"
          className="hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
        >
          {moment(fromDate).calendar(null, CALENDAR_FORMAT)}
        </Popover.Button>

        <Transition
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <Popover.Panel
            as="div"
            className="absolute top-12 right-0 z-10 bg-white p-4 rounded-md flex flex-col overflow-hidden"
          >
            <DatePicker date={fromDate} setDate={setCurrentDay} />
          </Popover.Panel>
        </Transition>
      </Popover>
      <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
      <button
        type="button"
        onClick={wrapClick(nextDay)}
        className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
      >
        <span className="sr-only">Next day</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};

export default DayPicker;
