import { FC, Fragment, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import _ from "lodash";
import wrapClick from "../../utils/wrap-click";
import { classNames, useUrlState } from "../../utils";

const DATE_FORMAT = "YYYY-MM-DD";
const CALENDAR_FORMAT = "[Q]Q, YYYY";

const QuarterPicker: FC = () => {
  const [fromDate, setFromDate] = useUrlState("fromDate");
  const [toDate, setToDate] = useUrlState("toDate");

  const previousQuarter = () => {
    setFromDate(
      moment(fromDate, DATE_FORMAT)
        .subtract(1, "quarter")
        .startOf("quarter")
        .format(DATE_FORMAT)
    );
    setToDate(
      moment(toDate, DATE_FORMAT)
        .subtract(1, "quarter")
        .endOf("quarter")
        .format(DATE_FORMAT)
    );
  };
  const nextQuarter = () => {
    setFromDate(
      moment(fromDate, DATE_FORMAT)
        .add(1, "quarter")
        .startOf("quarter")
        .format(DATE_FORMAT)
    );
    setToDate(
      moment(toDate, DATE_FORMAT)
        .add(1, "quarter")
        .endOf("quarter")
        .format(DATE_FORMAT)
    );
  };
  const setCurrentQuarter = (date: Date) => {
    setFromDate(
      moment(date, DATE_FORMAT).startOf("quarter").format(DATE_FORMAT)
    );
    setToDate(moment(date, DATE_FORMAT).endOf("quarter").format(DATE_FORMAT));
  };

  const __setQuarter = (quarter: number) => {
    const date = moment(fromDate, DATE_FORMAT).set("quarter", quarter);
    setFromDate(
      moment(date, DATE_FORMAT).startOf("quarter").format(DATE_FORMAT)
    );
    setToDate(moment(date, DATE_FORMAT).endOf("quarter").format(DATE_FORMAT));
  };
  const __setYear = (year: number) => {
    const date = moment(fromDate, DATE_FORMAT).set("year", year);
    setFromDate(
      moment(date, DATE_FORMAT).startOf("quarter").format(DATE_FORMAT)
    );
    setToDate(moment(date, DATE_FORMAT).endOf("quarter").format(DATE_FORMAT));
  };

  useEffect(() => {
    setCurrentQuarter(fromDate || moment().format(DATE_FORMAT));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center rounded-md shadow-sm md:items-stretch">
      <button
        type="button"
        onClick={wrapClick(previousQuarter)}
        className="flex items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-white py-2 pl-3 pr-4 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
      >
        <span className="sr-only">Previous quarter</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      <Popover as={Fragment}>
        <Popover.Button
          as="button"
          type="button"
          className="hidden border-t border-b border-gray-300 bg-white px-3.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:relative md:block"
        >
          {moment(fromDate).format(CALENDAR_FORMAT)}
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
            className="absolute top-14 z-10 bg-white p-4 rounded-md h-48 flex flex-col overflow-hidden"
          >
            <div className="inline-flex flex-1 divide-x divide-gray-300 overflow-hidden">
              <div className="flex flex-col pr-3 space-y-2 overflow-y-auto">
                {_.times(4, (quarter) => (
                  <button
                    key={quarter}
                    onClick={wrapClick(() => __setQuarter(quarter + 1))}
                    type="button"
                    className={classNames(
                      moment(fromDate, DATE_FORMAT).quarter() === quarter + 1
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-white hover:bg-gray-100",
                      "rounded-md px-2.5 py-0.5 text-sm"
                    )}
                  >
                    Q{quarter + 1}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 pl-3 gap-2 overflow-y-auto">
                {_.times(moment().diff(moment([2015]), "years") + 30)
                  .map((idx) => 2015 + idx)
                  .map((year) => (
                    <button
                      key={year}
                      onClick={wrapClick(() => __setYear(year))}
                      type="button"
                      className={classNames(
                        moment(fromDate, DATE_FORMAT).year() === year
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-white hover:bg-gray-100",
                        "rounded-md px-2.5 py-0.5 text-sm"
                      )}
                    >
                      {year}
                    </button>
                  ))}
              </div>
            </div>
            {/* <div className="col-span-2 flex-shrink-0">
              hello
            </div> */}
          </Popover.Panel>
        </Transition>
      </Popover>
      <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
      <button
        type="button"
        onClick={wrapClick(nextQuarter)}
        className="flex items-center justify-center rounded-r-md border border-l-0 border-gray-300 bg-white py-2 pl-4 pr-3 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:px-2 md:hover:bg-gray-50"
      >
        <span className="sr-only">Next quarter</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
};

export default QuarterPicker;
