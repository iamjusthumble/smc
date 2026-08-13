import { FC, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import wrapClick from "../../utils/wrap-click";
import { useUrlState } from "../../utils";

const DATE_FORMAT = "YYYY-MM-DD";
const CALENDAR_FORMAT = "[Week] W, YYYY";

const WeekPicker: FC = () => {
  const [fromDate, setFromDate] = useUrlState("fromDate");
  const [toDate, setToDate] = useUrlState("toDate");

  const previousWeek = () => {
    setFromDate(
      moment(fromDate, DATE_FORMAT)
        .subtract(1, "week")
        .startOf("week")
        .format(DATE_FORMAT)
    );
    setToDate(
      moment(toDate, DATE_FORMAT)
        .subtract(1, "week")
        .endOf("week")
        .format(DATE_FORMAT)
    );
  };
  const nextWeek = () => {
    setFromDate(
      moment(fromDate, DATE_FORMAT)
        .add(1, "week")
        .startOf("week")
        .format(DATE_FORMAT)
    );
    setToDate(
      moment(toDate, DATE_FORMAT)
        .add(1, "week")
        .endOf("week")
        .format(DATE_FORMAT)
    );
  };
  const setCurrentWeek = (date: Date) => {
    setFromDate(moment(date, DATE_FORMAT).startOf("week").format(DATE_FORMAT));
    setToDate(moment(date, DATE_FORMAT).endOf("week").format(DATE_FORMAT));
  };

  useEffect(() => {
    setCurrentWeek(fromDate || moment().format(DATE_FORMAT));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center rounded-md shadow-sm md:items-stretch">
      <button
        type="button"
        onClick={wrapClick(previousWeek)}
        className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
      >
        <span className="sr-only">Previous week</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
      >
        {moment(fromDate).format(CALENDAR_FORMAT)}
      </button>
      <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
      <button
        type="button"
        onClick={wrapClick(nextWeek)}
        className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
      >
        <span className="sr-only">Next week</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};

export default WeekPicker;
