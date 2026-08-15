import { Add } from "iconsax-react";
import React, { useMemo, useState } from "react";
import { useUrlState } from "../../utils";
import { Action } from "../../components/buttons/action-button";
import { useNavigate, useSearch } from "react-location";
import { LocationGenerics } from "../../router/location";
import ListTrips from "../../components/list/list-trips";
import SubHeader from "../../components/layouts/sub-header";
import withPermissions from "../../utils/with-permissions";
import UpdateTrip from "./update";
import CreateTrip from "./create";
import ViewTrip from "./view";
import CompleteTrip from "./complete";
import CancelTrip from "./cancel";
import DeleteTrip from "./delete";
import toast from "react-hot-toast";
import { TripTab } from "../../services/supabase/trips";
import { TripAvailabilityMap } from "../../components/list/list-trips/types";
import {
  useTripAvailabilities,
  useTrips,
  useUpdateTrip,
} from "../../services/supabase/use-trips";

const TripsPage = () => {
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);
  const [tab, setTab] = useState<TripTab>("upcoming");
  const [modal, setModal] = useUrlState("modal");
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();

  const { data: trips, isLoading, refetch } = useTrips(tab);
  const updateTrip = useUpdateTrip();

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

  const handleStart = (id: string, successMessage: string) => async () => {
    try {
      await updateTrip.mutateAsync({ id, payload: { status: "in_progress" } });
      toast(JSON.stringify({ type: "success", title: successMessage }));
    } catch (e: any) {
      toast(
        JSON.stringify({
          type: "failed",
          title: e?.message || "Couldn't start this trip. Please try again.",
        })
      );
    }
  };

  const total = trips?.length ?? 0;
  const visible = useMemo(
    () => (trips ?? []).slice(skip, skip + limit),
    [trips, skip, limit]
  );
  const visibleIds = useMemo(() => visible.map((t) => t.id), [visible]);
  const { data: availabilityRows } = useTripAvailabilities(visibleIds);
  const availability = useMemo(() => {
    const map: TripAvailabilityMap = {};
    (availabilityRows ?? []).forEach((row) => {
      map[row.trip_id] = row;
    });
    return map;
  }, [availabilityRows]);

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
            data={visible}
            availability={availability}
            limit={limit}
            loading={isLoading}
            setLimit={setLimit}
            tab={tab}
            setTab={setTab}
            setSkip={setSkip}
            skip={skip}
            total={total}
            refetch={refetch}
            dispatchAction={dispatchAction}
            handleStart={handleStart}
            totalAvailable={total}
            showTop
            showPagination
          />
        </main>

        {!!searchParams.id?.length && (
          <>
            <ViewTrip
              open={modal === "view"}
              setOpen={(val: boolean) => setModal(val ? "view" : undefined)}
            />
            <UpdateTrip
              open={modal === "update"}
              setOpen={(val: boolean) => setModal(val ? "update" : undefined)}
            />
            <CompleteTrip
              open={modal === "complete"}
              setOpen={(val: boolean) => setModal(val ? "complete" : undefined)}
            />
            <CancelTrip
              open={modal === "cancel"}
              setOpen={(val: boolean) => setModal(val ? "cancel" : undefined)}
            />
            <DeleteTrip
              open={modal === "delete"}
              setOpen={(val: boolean) => setModal(val ? "delete" : undefined)}
            />
          </>
        )}
        <CreateTrip
          open={modal === "create"}
          setOpen={(val: boolean) => setModal(val ? "create" : undefined)}
        />
      </div>
    </>
  );
};

export default TripsPage;
