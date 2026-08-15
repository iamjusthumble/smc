import { Dispatch, FC, SetStateAction, useState, useEffect } from "react";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

interface Props {
  total: number;
  limit: number;
  skip: number;

  height: string;
  refetch: () => void;
  setSkip: Dispatch<SetStateAction<number>>;
}

const Pagination: FC<Props> = ({
  total,
  limit,

  setSkip,
  skip,
  height,
  refetch,
}) => {
  //   const [addOrUpdateQueryParam] = useQueryParams();
  const [page, setPage] = useState(0);
  const [enteredPage, setEnteredPage] = useState(1);

  // page tracked page numbers only and never actually moved the data
  // window — sync it out to the real skip/limit state here.
  useEffect(() => {
    setSkip(page * limit);
  }, [page, limit, setSkip]);

  // A caller resetting skip to 0 (e.g. switching tabs) should reset the
  // page indicator too.
  useEffect(() => {
    if (skip === 0) setPage(0);
  }, [skip]);

  const totalPages = Math.ceil(total / limit);
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
            className="inline-flex items-center mt-4 py-2  border-transparent px-4  text-sm font-medium text-gray-500"
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
            className="inline-flex items-center mt-4 py-2  border-transparent px-4  text-sm font-medium text-gray-500"
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
        // addOrUpdateQueryParam("page", pageNumber);
        setPage(pageNumber - 1);
      }}
      className={`inline-flex cursor-pointer rounded-md items-center mt-4 py-2 hover:bg-gray-100 hover:rounded-md border-transparent px-4 text-sm font-medium text-gray-500 ${
        page === pageNumber - 1
          ? "bg-gray-100"
          : "hover:border-gray-300 hover:text-gray-700"
      }`}
      aria-current={page === pageNumber - 1 ? "page" : undefined}
    >
      {pageNumber}
    </div>
  );

  return (
    <nav
      className={`flex items-center h-${height} bg-white border-gray-200 px-4 pb-5 sm:px-0`}
    >
      <div className="flex w-0 flex-1 justify-start">
        <div
          onClick={() => {
            // addOrUpdateQueryParam("page", page - 1);
            setPage(Math.max(page - 1, 0));
          }}
          className={`flex items-center cursor-pointer flex-row-reverse hover:bg-gray-100 border mx-3 mt-4 rounded-md pr-3 py-1 border-gray-400 ${
            page === 0
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : "hover:border-gray-300 hover:text-gray-700"
          } `}
        >
          <p
            className={`inline-flex rounded-md items-center pl-1 text-sm font-medium text-gray-500`}
          >
            Previous
          </p>
          <ArrowLongLeftIcon
            className="ml-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="hidden md:flex md:gap-x-1">{renderPageNumbers()}</div>
      <div className="flex w-0 flex-1 justify-end">
        <div
          onClick={() => {
            // addOrUpdateQueryParam("page", page + 1);
            setPage(Math.min(page + 1, Math.max(totalPages - 1, 0)));
          }}
          className={`flex items-center cursor-pointer border mr-3 mt-4 rounded-md hover:bg-gray-100 px-2 py-1 border-gray-400 ${
            page === totalPages - 1
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : "hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <p
            className={`inline-flex rounded-md items-center pl-1 text-sm font-medium text-gray-500`}
          >
            Next
          </p>
          <ArrowLongRightIcon
            className="ml-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </nav>
  );
};

export default Pagination;
