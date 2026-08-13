import { FC, Fragment, useEffect, useRef, useState } from "react";
import {
  MagnifyingGlassIcon,
  Squares2X2Icon as Squares2X2IconSolid,
  Bars4Icon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import useKeyboardJs from "react-use/lib/useKeyboardJs";
import { Listbox, Transition } from "@headlessui/react";
import _ from "lodash";
import SelectInput from "../core/select-input";
import { classNames, useUrlState, wrapOnchange } from "../../utils";
import wrapClick from "../../utils/wrap-click";

interface TableHeaderComponentProps {
  title: string;
  renderFilter?: FC<{
    filterOpen: boolean;
    setFilterOpen: (val: boolean) => void;
  }>;
  renderExport?: FC<{
    exportOpen: boolean;
    setExportOpen: (val: boolean) => void;
  }>;
  renderHeaderItems?: FC;
  searchOptions?: { label: string; value: string }[];
  gridable?: boolean;
  refetch: () => void;
  hasSearch?: boolean;
  defaultSearchField?: string;
  loading?: boolean;
  onSearchSubmit?: (search: string, searchField: string) => void;
  defaultView?: "grid" | "list";
}

const limits = [10, 20, 50, 100];

const TableHeaderComponent: FC<TableHeaderComponentProps> = ({
  defaultView,
  title,
  loading,
  renderFilter,
  gridable,
  renderExport,
  refetch,
  renderHeaderItems,
  hasSearch,
  onSearchSubmit,
  searchOptions = [],
  defaultSearchField = "",
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [searchPressed] = useKeyboardJs("command > k");
  const [escapePressed] = useKeyboardJs("esc");
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>("");
  const [searchField, setSearchField] = useState<string>(defaultSearchField);
  const [pageSize, setPageSize] = useUrlState("pageSize");
  const [page, setPage] = useUrlState("page");
  const [viewType, setViewType] = useUrlState("view-type");
  useEffect(() => {
    if (searchPressed === true) {
      searchRef?.current?.focus();
    }
  }, [searchPressed]);

  useEffect(() => {
    if (escapePressed === true) {
      searchRef?.current?.blur();
    }
  }, [escapePressed]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, pageSize]);

  useEffect(() => {
    if (defaultView && !viewType) {
      setViewType(defaultView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultView]);

  return (
    <div className="px-4 sm:px-6 md:px-0">
      <div className="block">
        <div className="flex flex-row items-center">
          <div className="flex-1 flex space-x-6 xl:space-x-8" aria-label="Tabs">
            {hasSearch && (
              <div className="flex items-center">
                {searchOptions.length > 0 && (
                  <SelectInput
                    id={"searchField"}
                    // labelHidden={true}
                    label=""
                    values={{ searchField }}
                    handleChange={(e: any) => setSearchField(e.target.value)}
                    handleBlur={undefined}
                    options={[
                      {
                        label: "Search By",
                        value: "",
                      },
                      ...searchOptions,
                    ]}
                  />
                )}

                <div
                  className={classNames(
                    "w-96 relative  text-gray-500  focus-within:text-gray-500",
                    searchOptions?.length ? "ml-2" : ""
                  )}
                >
                  <label htmlFor="search" className="sr-only">
                    Search {title ? _.startCase(title) : ""}
                  </label>
                  <input
                    ref={searchRef}
                    id="search"
                    type="search"
                    placeholder={`Search ${title ? _.startCase(title) : ""}`}
                    onChange={wrapOnchange(setSearch)}
                    className="block h-10 w-full appearance-none rounded-md border border-gray-300 pl-8 text-sm placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-2">
                    <MagnifyingGlassIcon
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>
                  {search?.trim?.() === "" ? (
                    <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center justify-center">
                      <span
                        className="hidden sm:block text-gray-500  text-sm leading-5 py-0.5 px-1.5 border border-gray-300 rounded-md"
                        style={{ opacity: 1 }}
                      >
                        <span className="sr-only">Press </span>
                        <kbd className="font-sans">
                          <abbr title="Command" className="no-underline">
                            ⌘
                          </abbr>
                        </kbd>
                        <span className="sr-only"> and </span>
                        <kbd className="font-sans">K</kbd>
                        <span className="sr-only"> to search</span>
                      </span>
                    </div>
                  ) : null}
                </div>
                <button
                  onClick={wrapOnchange(() =>
                    onSearchSubmit?.(search, searchField)
                  )}
                  className="mx-1 h-10 rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                >
                  Search
                </button>
              </div>
            )}
          </div>
          {renderHeaderItems && renderHeaderItems({})}
          {gridable && (
            <div className="hidden ml-6 bg-gray-100  p-0.5 rounded-lg items-center sm:flex">
              <button
                type="button"
                onClick={wrapClick(() => setViewType("list"))}
                className={classNames(
                  viewType !== "grid"
                    ? "bg-white  shadow-sm"
                    : "hover:bg-white  hover:shadow-sm",
                  "p-1.5 rounded-md text-gray-500  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                )}
              >
                <Bars4Icon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Use list view</span>
              </button>
              <button
                type="button"
                onClick={wrapClick(() => setViewType("grid"))}
                className={classNames(
                  viewType === "grid"
                    ? "bg-white  shadow-sm"
                    : "hover:bg-white  hover:shadow-sm",
                  "ml-0.5 p-1.5 rounded-md text-gray-500  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                )}
              >
                <Squares2X2IconSolid className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Use grid view</span>
              </button>
            </div>
          )}
          <div className="hidden ml-3 items-center bg-gray-100  rounded-lg p-0.5 sm:flex">
            <button
              type="button"
              onClick={wrapClick(refetch)}
              className="bg-gray-100  hover:bg-white border  p-1.5 rounded-md shadow-sm text-gray-500  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
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

          {renderExport && renderFilter ? (
            <div className="hidden ml-3 items-center bg-gray-100  rounded-lg p-0.5 sm:flex divide-x  divide-gray-300 ">
              <button
                type="button"
                onClick={wrapClick(() => setFilterOpen(true))}
                className="bg-gray-100  hover:bg-white   p-1.5 rounded-l-md shadow-sm text-gray-500  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Filter items</span>
              </button>
              <button
                type="button"
                onClick={wrapClick(() => setExportOpen(true))}
                className="bg-gray-100  hover:bg-white   p-1.5 rounded-r-md shadow-sm text-gray-500  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Export data</span>
              </button>
            </div>
          ) : (
            <>
              {renderFilter && (
                <div className="hidden ml-3 items-center bg-gray-100  rounded-lg p-0.5 sm:flex">
                  <button
                    type="button"
                    onClick={wrapClick(() => setFilterOpen(true))}
                    className="bg-gray-100  hover:bg-white   p-1.5 rounded-md shadow-sm text-gray-500  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  >
                    <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Filter items</span>
                  </button>
                </div>
              )}
              {renderExport && (
                <div className="hidden ml-3 items-center bg-gray-100 rounded-lg p-0.5 sm:flex">
                  <button
                    type="button"
                    onClick={wrapClick(() => setExportOpen(true))}
                    className="bg-gray-100  hover:bg-white   p-1.5 rounded-md shadow-sm text-gray-500  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Export data</span>
                  </button>
                </div>
              )}
            </>
          )}

          <div className="ml-3">
            <Listbox value={pageSize} onChange={setPageSize}>
              {({ open }) => (
                <>
                  <Listbox.Label className="sr-only">
                    Change limit
                  </Listbox.Label>
                  <div className="relative">
                    <div className="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-gray-300 border border-gray-200">
                      <div className="relative bg-white items-center inline-flex px-2 border border-transparent rounded-l-lg text-gray-700">
                        {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                        <p className="text-sm font-medium whitespace-nowrap">
                          {pageSize} items per page
                        </p>
                      </div>
                      <Listbox.Button className="relative inline-flex items-center bg-white p-2 py-2 rounded-l-none rounded-r-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:z-10 focus:none focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500">
                        <span className="sr-only">Change limit</span>
                        <ChevronDownIcon
                          className="h-5 w-5 text-gray-700"
                          aria-hidden="true"
                        />
                      </Listbox.Button>
                    </div>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="origin-top-right absolute z-10 right-0 mt-2 w-16 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200  ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {limits.map((limit) => (
                          <Listbox.Option
                            key={limit}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "text-white  bg-primary-500"
                                  : "text-gray-900 ",
                                "cursor-default select-none relative p-2 text-sm"
                              )
                            }
                            value={limit}
                          >
                            {({ selected, active }) => (
                              <div className="flex flex-col">
                                <div className="flex justify-between items-center">
                                  <p
                                    className={
                                      selected ? "font-semibold" : "font-normal"
                                    }
                                  >
                                    {limit}
                                  </p>
                                  {selected ? (
                                    <span
                                      className={
                                        active
                                          ? "text-white"
                                          : "text-primary-500"
                                      }
                                    >
                                      <CheckIcon
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              )}
            </Listbox>
          </div>
        </div>
      </div>
      {renderFilter && renderFilter({ filterOpen, setFilterOpen })}
      {renderExport && renderExport({ exportOpen, setExportOpen })}
    </div>
  );
};

export default TableHeaderComponent;
