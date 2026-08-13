import { Add, ArrowDown2, FilterSearch, Refresh } from "iconsax-react";
import TableComponent from "../../components/tables/table";
import React, { Fragment, useEffect, useState } from "react";
import _, { last } from "lodash";
import useTableData from "../../utils/use-table-data";
import Shimmers from "../../components/tables/shimmers";
import { classNames, useUrlState } from "../../utils";
import ActionButton, { Action } from "../../components/buttons/action-button";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useNavigate, useSearch } from "react-location";
import { LocationGenerics } from "../../router/location";
import wrapClick from "../../utils/wrap-click";
import Search from "../../components/inputs/search";
import debounce from "lodash/debounce";
import { Menu, Transition } from "@headlessui/react";
import moment from "moment";
import SubHeader from "../../components/layouts/sub-header";
import withPermissions from "../../utils/with-permissions";
import { currentUserVar } from "../../apollo/cache/auth";
import CreateDriver from "./create";
import ViewDriver from "./view";

const filterItems = [
  {
    name: "Accepted",
    href: "?status=accepted",
  },
  {
    name: "Pending",
    href: "?status=pending",
  },
  {
    name: "Rejected",
    href: "?status=rejected",
  },
];

const GET_ALL_DRIVERS = gql`
  query GetAllDrivers(
    $pagination: Pagination!
    $populate: [String]
    $search: SearchOperator
    $filter: DriverFilter
  ) {
    getAllDrivers(
      pagination: $pagination
      populate: $populate
      search: $search
      filter: $filter
    ) {
      count
      rows {
        _id
        email
        fullName
        profilePicture
        mobileNumber
        status
        postalAddress
        digitalAddress
        licenseClass
      }
    }
  }
`;

const DriversPage = () => {
  const [skip, setSkip] = useState(0);
  const [networkStatus, setNetworkStatus] = useState(0);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useUrlState("modal");
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const currentUser = useReactiveVar(currentUserVar);

  const dispatchAction =
    (id: string, action: Exclude<Action, "expand" | "goto" | "clone">) =>
    () => {
      navigate({
        search: (old) => ({
          ...old,
          id,
          modal: action,
        }),
      });
    };

  const { loading, data, refetch } = useQuery(GET_ALL_DRIVERS, {
    variables: {
      pagination: {
        limit: limit,
        skip: skip,
      },
      populate: ["busCompany"],
      search: {
        fields: ["fullName", "email"],
        options: ["i"],
        query: search,
      },
      filter: {
        busCompany: {
          eq: currentUser?.busCompany?._id,
        },
      },
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  const requests = {
    rows: data?.getAllDrivers?.rows,
    count: data?.getAllDrivers.count,
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const debouncedSearch = debounce((value) => {
      setSearch(value);
    }, 300);

    debouncedSearch(searchTerm);
  };

  const records = useTableData(requests || {});
  return (
    <>
      <div className="">
        <SubHeader
          title="Drivers"
          renderActions={() => (
            <>
              {withPermissions(["*:*"])(
                <button
                  onClick={() => setModal("create")}
                  className="text-white flex items-center  bg-primary px-4 py-2 rounded-lg "
                >
                  <Add className="h-5 w-5" aria-hidden="true" />
                  Add New Driver
                </button>
              )}
            </>
          )}
        />

        <div className="mx-auto flex-1  max-w-7xl px-4 sm:px-6 lg:px-8">
          <Fragment>
            <div className="mt-5 flex md:flex-row ml-3 gap-y-3 md:ml-0 md:justify-between flex-wrap sm:flex-col items-center">
              <div className="w-80 md:w-96">
                {/* <Search /> */}
                {/* <GridLayoutComponent className="w-80 md:w-96" columns={5}> */}
                <Search
                  colspan={2}
                  handleSearchChange={handleSearchChange}
                  setValue={setSearch}
                  value={search}
                />{" "}
                <div className="col-span-2"></div>
                {/* </GridLayoutComponent> */}
              </div>
              <div className="flex gap-x-2">
                <div className="bg-white rounded-lg">
                  <Menu>
                    <Menu.Button className="flex max-w-xs items-center border rounded-lg text-sm">
                      <div className="flex w-full px-2.5 py-2 justify-center items-center">
                        <FilterSearch size="22" color="#6B7280" />
                      </div>
                    </Menu.Button>
                    <Transition
                      as={React.Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-36 mt-1 mr-20 transform -translate-x-1/2 z-10  w-36 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {filterItems.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={`${
                                  active ? "bg-gray-100" : ""
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
                <div
                  onClick={() => refetch()}
                  className="border bg-white cursor-pointer py-2 px-2.5 rounded-lg"
                >
                  <Refresh size="22" color="#6B7280" />
                </div>

                <div className=" rounded-none shadow-sm w-36  relative  flex flex-row items-center">
                  <div className="absolute right-0 pr-4">
                    <ArrowDown2 size={16} color="#6B7280" />
                  </div>
                  <select
                    id="pagination"
                    value={limit}
                    onChange={(e) => {
                      setLimit(parseInt(e.target.value));
                      setSkip(0);
                    }}
                    className="rounded-md border py-2 before:mr-3 select flex px-4 text-gray-500 font-light border-gray-300 appearance-none w-full  sm:text-sm sm:leading-5"
                  >
                    <option value={8}>8 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                  </select>
                </div>
              </div>
            </div>
          </Fragment>
          <div className="flex flex-1 overflow-y-auto">
            <div className="flex-1 min-h-full mx-auto min-w-0 overflow-hidden overflow-y-auto light flex">
              <TableComponent
                title={"Buses"}
                refetch={refetch}
                setSkip={setSkip}
                skip={skip}
                limit={limit}
                showTableHeader={false}
                isRefetching={loading && networkStatus === 4}
                loading={loading && ![4, 6].includes(networkStatus)}
                data={records}
                hasSearch={true}
                //   onSearchSubmit={onSearch}
                renderColumns={() => {
                  return (
                    <tr>
                      <th
                        scope="col"
                        className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                      >
                        Driver Name
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 border-y border-gray-200 bg-gray-50 px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                      >
                        Contact
                      </th>

                      <th
                        scope="col"
                        className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                      >
                        License Class
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="sticky top-0 border-y border-gray-200 bg-gray-50  px-6 py-3 text-left text-xs font-light text-gray-900  uppercase tracking-wider whitespace-nowrap"
                      >
                        Actions
                      </th>
                    </tr>
                  );
                }}
                renderLoader={() => (
                  <tr>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <Shimmers.AvatarShimmer />
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <Shimmers.DoubleShimmer />
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <Shimmers.DoubleShimmer />
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <Shimmers.DoubleShimmer />
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <Shimmers.SingleShimmer />
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <Shimmers.SingleShimmer />
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200">
                      <Shimmers.SingleShimmer />
                    </td>
                  </tr>
                )}
                renderItem={(item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={wrapClick(dispatchAction(item._id, "view"))}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200 ">
                      <div className="flex items-center gap-x-2">
                        <div>
                          <img
                            src={item?.profilePicture}
                            alt="logo"
                            className="h-8 w-8 rounded-full"
                          />
                        </div>
                        <div className="text-gray-900 font-manrope">
                          {item?.fullName || "N/A"}
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200 ">
                      <div className="text-gray-900 ">
                        {item?.email || "N/A"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200 ">
                      <div className="text-gray-900 ">
                        {item?.mobileNumber || "N/A"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200">
                      <div className="text-gray-900">
                        {item?.postalAddress || "N/A"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200">
                      <div className="text-gray-900 ">
                        {item?.licenseClass || "N/A"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200">
                      <span
                        className={classNames(
                          item?.status === "RETIRED"
                            ? `bg-blue-500 text-white`
                            : "",
                          item?.status === "ACTIVE"
                            ? `bg-green-400  text-white`
                            : "",
                          !item?.status
                            ? "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
                            : "",
                          "inline-flex rounded-full  px-2 py-1 text-xs items-center space-x-1"
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 10 10"
                          fill="currentColor"
                          className="w-1.5 h-1.5"
                        >
                          <circle
                            fillRule="evenodd"
                            cx="5"
                            cy="5"
                            r="5"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{_.startCase(item?.status || "Unknown")}</span>
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 border-b border-gray-200">
                      <div className="space-x-1">
                        <ActionButton
                          action="view"
                          onClick={dispatchAction(item._id, "view")}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              />
            </div>
          </div>
        </div>
        {!!searchParams.id?.length && (
          <>
            <ViewDriver
              open={modal === "view"}
              refetch={refetch}
              setOpen={(val: boolean) => setModal(val ? "view" : undefined)}
            />
          </>
        )}
        <CreateDriver
          open={modal === "create"}
          refetch={refetch}
          setOpen={(val: boolean) => setModal(val ? "create" : undefined)}
        />
      </div>
    </>
  );
};

export default DriversPage;
