import { Add, ArrowDown2, FilterSearch, Refresh } from "iconsax-react";
import React, { Fragment, useEffect, useState } from "react";
import _, { last } from "lodash";
import { classNames, useUrlState } from "../../utils";
import ActionButton, { Action } from "../../components/buttons/action-button";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useNavigate, useSearch } from "react-location";
import { LocationGenerics } from "../../router/location";
import ListTrips from "../../components/list/list-trips";
import SubHeader from "../../components/layouts/sub-header";
import withPermissions from "../../utils/with-permissions";
import { currentUserVar } from "../../apollo/cache/auth";
import UpdateTrip from "./update";
import CreateTrip from "./create";

const GET_ALL_TRIPS = gql`
  query GetAllTrips(
    $pagination: Pagination!
    $filter: TripFilter
    $search: SearchOperator
    $populate: [String]
  ) {
    getAllTrips(
      pagination: $pagination
      filter: $filter
      search: $search
      populate: $populate
    ) {
      count
      rows {
        _id
        origin {
          name
        }
        destination {
          name
        }
        numberOfBusAssigned
        price
        tripStatus
        tripType
        timeScheduled {
          startTime
          endTime
        }
        date {
          year
          dayInNumber
          dayInWords
          month
        }
      }
    }
  }
`;

const TalentPage = () => {
  const [skip, setSkip] = React.useState(0);
  const [limit, setLimit] = React.useState(8);
  const [networkStatus, setNetworkStatus] = React.useState(0);

  const [search, setSearch] = React.useState("ACTIVE");
  const [modal, setModal] = useUrlState("modal");
  const searchParams = useSearch<LocationGenerics>();
  const [total, setTotal] = useState(0);
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

  const { loading, data, refetch } = useQuery(GET_ALL_TRIPS, {
    variables: {
      pagination: {
        skip,
        limit,
      },
      search: {
        query: search,
        options: ["i"],
        fields: ["tripStatus"],
      },
      filter: {
        busCompany: {
          eq: currentUser?.busCompany._id,
        },
      },
      populate: ["origin", "destination", "busCompany"],
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (data) {
      setTotal(data?.getAllTrips?.count || 0);
    }
  }, [data]);

  return (
    <>
      <div className="bg-background w-screen shadow-md ">
        <SubHeader
          title="Trips"
          renderActions={() => (
            <>
              {withPermissions(["*:*"])(
                <button
                  onClick={() => setModal("create")}
                  className="text-white flex items-center  bg-primary px-4 py-2 rounded-lg "
                >
                  <Add className="h-5 w-5" aria-hidden="true" />
                  Add New Trip
                </button>
              )}
            </>
          )}
        />

        <main className="px-2 md:px-0">
          <ListTrips
            data={data?.getAllTrips?.rows || []}
            limit={limit}
            loading={loading && ![4, 6].includes(networkStatus)}
            setLimit={setLimit}
            search={search}
            setSearch={setSearch}
            setSkip={setSkip}
            skip={skip}
            total={total}
            refetch={refetch}
            dispatchAction={dispatchAction}
            totalAvailable={data?.getAllTrips?.rows.length || 0}
            showTop
            showPagination
          />
        </main>

        {!!searchParams.id?.length && (
          <>
            <UpdateTrip
              open={modal === "update"}
              refetch={refetch}
              setOpen={(val: boolean) => setModal(val ? "update" : undefined)}
            />
          </>
        )}
        <CreateTrip
          open={modal === "create"}
          refetch={refetch}
          setOpen={(val: boolean) => setModal(val ? "create" : undefined)}
        />
      </div>
    </>
  );
};

export default TalentPage;
