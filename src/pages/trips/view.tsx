import dayjs from "dayjs";
import Modal from "../../components/layouts/modal";
import { useSearch, useNavigate } from "react-location";
import { LocationGenerics } from "../../router/location";
import { useTrip, useTripAvailabilities } from "../../services/supabase/use-trips";

export default function ViewTrip({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const { data: trip, isLoading } = useTrip(open ? searchParams.id : undefined);
  const { data: availabilityRows } = useTripAvailabilities(
    open && trip ? [trip.id] : []
  );
  const availability = availabilityRows?.[0];

  return (
    <Modal
      open={open}
      setOpen={() => {
        setOpen?.(false);
        navigate({
          search: (old) => ({
            ...old,
            modal: undefined,
            id: undefined,
          }),
        });
      }}
      loading={isLoading}
      hideActions={false}
      descriptionType="string"
      title="Trip Information"
      description="Details of the trip are shown below"
    >
      {trip?.id ? (
        <>
          <div className="overflow-y-auto flex flex-col gap-y-6 pb-20  flex-1">
            <div className="grid grid-cols-3 gap-x-10 gap-y-8">
              <div className="flex flex-col gap-y-2">
                <label className="block text-sm font-manrope">Route</label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {trip.route
                    ? `${trip.route.origin} → ${trip.route.destination}`
                    : "Unassigned"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label className="block text-sm font-manrope">Bus</label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {trip.bus?.vehicle_number ?? "Unassigned"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label className="block text-sm font-manrope">Driver</label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {trip.driver?.full_name ?? "Unassigned"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label className="block text-sm font-manrope">Departure</label>
                <p className=" w-72 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {dayjs(trip.departure_time).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label className="block text-sm font-manrope">Arrival</label>
                <p className=" w-72 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {trip.arrival_time
                    ? dayjs(trip.arrival_time).format("MMM D, YYYY h:mm A")
                    : "N/A"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label className="block text-sm font-manrope">Status</label>
                <p className=" w-72 border-gray-300 text-base font-manrope rounded-md  py-2 capitalize">
                  {trip.status.replace("_", " ")}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label className="block text-sm font-manrope">Fare</label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  GHS {trip.fare}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label className="block text-sm font-manrope">Occupancy</label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {trip.bus && availability?.total_seats
                    ? `${availability.seats_taken} / ${availability.total_seats}`
                    : "—"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2 col-span-3">
                <label className="block text-sm font-manrope">Notes</label>
                <p className=" w-full border-gray-300 text-base font-manrope rounded-md  py-2">
                  {trip.notes ?? "N/A"}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 w-full max-h-[65vh] overflow-y-auto  sm:p-6">
          <div>
            <h1>NO DATA</h1>
          </div>
        </div>
      )}
    </Modal>
  );
}
