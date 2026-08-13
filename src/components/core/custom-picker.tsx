import { FC, useEffect } from "react";
import moment from "moment";
import { useUrlState, wrapOnchange } from "../../utils";

const DATE_FORMAT = "YYYY-MM-DD";

const CustomPicker: FC = () => {
  const [fromDate, setFromDate] = useUrlState("fromDate");
  const [toDate, setToDate] = useUrlState("toDate");

  const __setFromDate = (date: string | Date) => {
    setFromDate(moment(date, DATE_FORMAT).startOf("day").format(DATE_FORMAT));
  };
  const __setToDate = (date: string | Date) => {
    setToDate(moment(date, DATE_FORMAT).endOf("day").format(DATE_FORMAT));
  };
  const setCurrentDay = (date: Date) => {
    __setFromDate(date);
    __setToDate(date);
  };

  useEffect(() => {
    setCurrentDay(fromDate || moment().format(DATE_FORMAT));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center rounded-md shadow-sm md:items-stretch">
      <div className="flex rounded-md shadow-sm">
        <input
          type="date"
          name="fromDate"
          id="fromDate"
          value={fromDate}
          onChange={wrapOnchange(__setFromDate)}
          className="block w-full min-w-0 flex-1 h-[38px] rounded-l-md border-gray-300 px-3 py-1.5 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
      <span className="inline-flex items-center border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
        to
      </span>
      <div className="flex rounded-md shadow-sm">
        <input
          type="date"
          name="toDate"
          id="toDate"
          value={toDate}
          onChange={wrapOnchange(__setToDate)}
          className="block w-full min-w-0 flex-1 h-[38px]  rounded-r-md  border-gray-300 border-l-0 px-3 py-1.5 focus:border-l focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default CustomPicker;
