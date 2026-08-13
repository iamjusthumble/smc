import { FC, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import wrapClick from "../../utils/wrap-click";
import { classNames } from "../../utils";
import moment, { Moment } from "moment";
import _ from "lodash";

const START_YEAR = 2016;
const DATE_FORMAT = "YYYY-MM-DD";

const DatePicker: FC<{
  date: any;
  setDate: any;
}> = ({ date, setDate }) => {
  const [view, setView] = useState<"days" | "months" | "years">("days");
  const [startYear, setStartYear] = useState<number>(START_YEAR);
  const [tempDate, setTempDate] = useState<Moment>(moment(date, DATE_FORMAT));

  const __setMonth = (newMonth: number) => {
    setTempDate(moment(tempDate).set("month", newMonth));
    setView("days");
  };

  const __setYear = (newYear: number) => {
    setTempDate(moment(tempDate).set("year", newYear));
    setView("months");
  };

  const __setDate = (newDate: Moment | Date) => {
    setDate(moment(newDate).format(DATE_FORMAT));
  };

  switch (view) {
    case "days": {
      return (
        <div className="text-center w-64">
          <div className="flex items-center text-gray-900">
            <button
              type="button"
              onClick={wrapClick(() =>
                setTempDate(moment(tempDate).subtract(1, "month"))
              )}
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={wrapClick(() => setView("months"))}
              className="flex-auto font-semibold"
            >
              {moment(tempDate).format("MMMM, YYYY")}
            </button>
            <button
              type="button"
              onClick={wrapClick(() =>
                setTempDate(moment(tempDate).add(1, "month"))
              )}
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            {_.times(
              moment(tempDate)
                .endOf("month")
                .endOf("week")
                .diff(
                  moment(tempDate).startOf("month").startOf("week"),
                  "days"
                ) + 1,
              (dayIdx) => {
                const day = moment(tempDate)
                  .startOf("month")
                  .startOf("week")
                  .add(dayIdx, "days");
                const isToday = day.isSame(moment(), "days");
                const isSelected = day.isSame(
                  moment(date, DATE_FORMAT),
                  "days"
                );
                const isCurrentMonth = day.month() === moment(tempDate).month();
                const daysDiff =
                  moment(tempDate)
                    .endOf("month")
                    .endOf("week")
                    .diff(
                      moment(tempDate).startOf("month").startOf("week"),
                      "days"
                    ) + 1;

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={wrapClick(() => __setDate(day))}
                    className={classNames(
                      "py-1.5 hover:bg-gray-100 focus:z-10",
                      isCurrentMonth ? "bg-white" : "bg-gray-50",
                      isSelected || isToday ? "font-semibold" : "",
                      isSelected ? "text-white" : "",
                      !isSelected && isCurrentMonth && !isToday
                        ? "text-gray-900"
                        : "",
                      !isSelected && !isCurrentMonth && !isToday
                        ? "text-gray-400"
                        : "",
                      isToday && !isSelected ? "text-primary-600" : "",
                      dayIdx === 0 ? "rounded-tl-lg" : "",
                      dayIdx === 6 ? "rounded-tr-lg" : "",
                      dayIdx === daysDiff - 7 ? "rounded-bl-lg" : "",
                      dayIdx === daysDiff - 1 ? "rounded-br-lg" : ""
                    )}
                  >
                    <time
                      dateTime={day.toISOString()}
                      className={classNames(
                        "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                        isSelected && isToday ? "bg-primary-600" : "",
                        isSelected && !isToday ? "bg-gray-900" : ""
                      )}
                    >
                      {day.format("D")}
                    </time>
                  </button>
                );
              }
            )}
          </div>
        </div>
      );
    }
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
            {_.times(12, (monthIdx) => (
              <button
                key={monthIdx}
                type="button"
                onClick={wrapClick(() => __setMonth(monthIdx))}
                className={classNames(
                  "py-1.5 hover:bg-gray-100 focus:z-10",
                  moment().month() === monthIdx ? "bg-white" : "bg-gray-50",
                  monthIdx === moment(tempDate).month() ? "font-semibold" : "",
                  monthIdx === moment(tempDate).month() ? "text-white" : "",
                  moment().month() === monthIdx &&
                    !(monthIdx === moment(tempDate).month())
                    ? "text-primary-600"
                    : "",
                  monthIdx === 0 ? "rounded-tl-lg" : "",
                  monthIdx === 3 ? "rounded-tr-lg" : "",
                  monthIdx === 12 - 4 ? "rounded-bl-lg" : "",
                  monthIdx === 12 - 1 ? "rounded-br-lg" : "",
                  monthIdx === moment(tempDate).month()
                    ? "bg-primary-600 hover:bg-primary-700"
                    : ""
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
            ))}
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

export default DatePicker;
