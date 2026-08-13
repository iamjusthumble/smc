import { Dispatch, FC, SetStateAction, useState, useEffect } from "react";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { date } from "yup";
import { useNavigate } from "react-location";
import { useUrlState } from "../../utils";

interface Props {
  limit: number;
  skip: number;
  data: {
    rows: any;
    total: number;
  };
  height?: string;
  refetch: () => void;
  setSkip: Dispatch<SetStateAction<number>>;
}

const TableFooterComponent: FC<Props> = ({
  limit,
  data: { total: dat },

  setSkip,
  skip,
  height,
  refetch,
}) => {
  const navigate = useNavigate();
  const [page, setPage] = useUrlState("page");
  const [enteredPage, setEnteredPage] = useState(1);

  useEffect(() => {
    const page1 = Math.max(1, parseInt(page || "1", 10));

    if (page1) {
      const pageNumber = page1;
      setPage(pageNumber);
      setEnteredPage(pageNumber); //set entered page
      setSkip((pageNumber - 1) * limit);
    } else {
      setPage(1); //set page
      setEnteredPage(1); //set entered page
      setSkip(0); // set skip
    }
  }, [page, limit, setSkip]);

  const totalPages = Math.ceil(dat / limit);
  const maxPageNumbers = 5; // Number of page numbers to show before/after current page
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const renderPageNumbers = () => {
    if (totalPages <= maxPageNumbers) {
      return pageNumbers.map((pageNumber) => renderPageLink(pageNumber));
    }

    const pagesBeforeCurrent = Math.floor((maxPageNumbers - 1) / 2);
    const pagesAfterCurrent = maxPageNumbers - 1 - pagesBeforeCurrent;
    const startIndex = Math.max(page - pagesBeforeCurrent - 1, 0);
    const endIndex = Math.min(page + pagesAfterCurrent, totalPages - 1);

    const pages = [];

    if (startIndex > 0) {
      pages.push(renderPageLink(1));
      if (startIndex > 1) {
        pages.push(
          <span
            className="inline-flex h-8 w-8 items-center justify-center text-sm font-medium text-gray-400"
            key="ellipsis-start"
          >
            ...
          </span>
        );
      }
    }

    for (let i = startIndex; i <= endIndex; i++) {
      pages.push(renderPageLink(i + 1));
    }

    if (endIndex < totalPages - 1) {
      if (endIndex < totalPages - 2) {
        pages.push(
          <span
            className="inline-flex h-8 w-8 items-center justify-center text-sm font-medium text-gray-400"
            key="ellipsis-end"
          >
            ...
          </span>
        );
      }
      pages.push(renderPageLink(totalPages));
    }

    return pages;
  };

  const renderPageLink = (pageNumber: number) => (
    <div
      key={pageNumber}
      onClick={() => {
        setPage(pageNumber);
      }}
      className={`inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-sm font-medium transition-colors ${
        page === pageNumber
          ? "bg-primary text-white"
          : "text-gray-600 hover:bg-gray-200"
      }`}
      aria-current={page === pageNumber ? "page" : undefined}
    >
      {pageNumber}
    </div>
  );

  return (
    <nav className="flex h-16 items-center rounded-b-xl border border-gray-200 bg-gray-50 px-4 sm:px-6">
      <div className="flex flex-1 justify-start">
        <div
          onClick={() => {
            setPage(page - 1);
          }}
          className={`inline-flex cursor-pointer items-center gap-x-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 ${
            page === 1 ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <ArrowLongLeftIcon className="h-4 w-4" aria-hidden="true" />
          Previous
        </div>
      </div>
      <div className="hidden md:flex md:gap-x-1">{renderPageNumbers()}</div>
      <div className="flex flex-1 justify-end">
        <div
          onClick={() => {
            setPage(page + 1);
          }}
          className={`inline-flex cursor-pointer items-center gap-x-1.5 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 ${
            page === totalPages ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Next
          <ArrowLongRightIcon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
    </nav>
  );
};

export default TableFooterComponent;
