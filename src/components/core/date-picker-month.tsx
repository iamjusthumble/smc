import { FC, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import moment, { Moment } from "moment";
import _ from "lodash";
import wrapClick from "../../utils/wrap-click";
import { classNames } from "../../utils";

const START_YEAR = 2016;
const DATE_FORMAT = "YYYY-MM-DD";

const DatePickerMonth: FC<{
  date: any;
  setDate: any;
}> = ({ date, setDate }) => {
  const [view, setView] = useState<"months" | "years">("months");
  const [startYear, setStartYear] = useState<number>(START_YEAR);
  const [tempDate, setTempDate] = useState<Moment>(moment(date, DATE_FORMAT));

  const __setMonth = (newMonth: number) => {
    setDate(moment(tempDate).set("month", newMonth).format(DATE_FORMAT));
  };

  const __setYear = (newYear: number) => {
    setTempDate(moment(tempDate).set("year", newYear));
    setView("months");
  };

  switch (view) {
    case "months": {
      return (
        <div className="text-center w-64">
          <div className="flex items-center text-gray-900">
            <button
              type="button"
              onClick={wrapClick(() =>
                setTempDate(moment(tempDate).subtract(1, "year"))
              )}
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous year</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={wrapClick(() => setView("years"))}
              className="flex-auto font-semibold"
            >
              {moment(tempDate).format("YYYY")}
            </button>
            <button
              type="button"
              onClick={wrapClick(() =>
                setTempDate(moment(tempDate).add(1, "year"))
              )}
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next year</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="isolate mt-2 grid grid-cols-4 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            {_.times(12, (monthIdx) => {
              const monthDate = moment(tempDate).set("month", monthIdx);
              const isSelected = monthDate.isSame(
                moment(date, DATE_FORMAT),
                "month"
              );
              const isCurrentMonth = moment().isSame(
                moment(date, DATE_FORMAT),
                "month"
              );
              return (
                <button
                  key={monthIdx}
                  type="button"
                  onClick={wrapClick(() => __setMonth(monthIdx))}
                  className={classNames(
                    "py-1.5 hover:bg-gray-100 focus:z-10 bg-white",
                    isSelected ? "font-semibold" : "",
                    isSelected ? "text-white" : "",
                    isCurrentMonth && !isSelected ? "text-primary-600" : "",
                    monthIdx === 0 ? "rounded-tl-lg" : "",
                    monthIdx === 3 ? "rounded-tr-lg" : "",
                    monthIdx === 12 - 4 ? "rounded-bl-lg" : "",
                    monthIdx === 12 - 1 ? "rounded-br-lg" : "",
                    isSelected ? "bg-primary-600 hover:bg-primary-700" : ""
                  )}
                >
                  <span
                    className={classNames(
                      "mx-auto flex h-7 w-7 items-center justify-center "
                    )}
                  >
                    {moment().set("month", monthIdx).format("MMM")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }
    case "years": {
      return (
        <div className="text-center w-64">
          <div className="flex items-center text-gray-900">
            <button
              type="button"
              disabled={startYear <= START_YEAR}
              onClick={wrapClick(() => setStartYear(startYear - 12))}
              className={classNames(
                startYear <= START_YEAR
                  ? "cursor-not-allowed"
                  : "cursor-pointer",
                "-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              )}
            >
              <span className="sr-only">Previous years</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex-auto font-semibold">
              {startYear} - {startYear + 11}
            </div>
            <button
              type="button"
              onClick={wrapClick(() => setStartYear(startYear + 12))}
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next years</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="isolate mt-2 grid grid-cols-4 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            {_.times(12, (idx) => {
              const yearIdx = startYear + idx;

              return (
                <button
                  key={yearIdx}
                  type="button"
                  onClick={wrapClick(() => __setYear(yearIdx))}
                  className={classNames(
                    "py-1.5 hover:bg-gray-100 focus:z-10",
                    moment().year() === yearIdx ? "bg-white" : "bg-gray-50",
                    yearIdx === moment(tempDate).year() ? "font-semibold" : "",
                    yearIdx === moment(tempDate).year() ? "text-white" : "",
                    moment().year() === yearIdx &&
                      !(yearIdx === moment(tempDate).year())
                      ? "text-primary-600"
                      : "",
                    idx === 0 ? "rounded-tl-lg" : "",
                    idx === 3 ? "rounded-tr-lg" : "",
                    idx === 12 - 4 ? "rounded-bl-lg" : "",
                    idx === 12 - 1 ? "rounded-br-lg" : "",
                    yearIdx === moment(tempDate).year()
                      ? "bg-primary-600 hover:bg-primary-700"
                      : ""
                  )}
                >
                  <span
                    className={classNames(
                      "mx-auto flex h-7 w-7 items-center justify-center "
                    )}
                  >
                    {moment().set("year", yearIdx).format("YYYY")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }
  }
};

export default DatePickerMonth;
