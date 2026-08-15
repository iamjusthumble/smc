import { useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import Modal from "../../components/layouts/modal";
import { useSearch, useNavigate } from "react-location";
import { LocationGenerics } from "../../router/location";
import wrapClick from "../../utils/wrap-click";

import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import TextInput from "../../components/core/text-input";
import SelectInput from "../../components/core/select-input";
import { Loader } from "../../components/loaders";
import { useRoutes, useTrip, useUpdateTrip } from "../../services/supabase/use-trips";
import { useBuses } from "../../services/supabase/use-buses";
import { useDrivers } from "../../services/supabase/use-drivers";
import { findScheduleConflicts } from "../../services/supabase/trips";
import { TripWithRelations } from "../../services/supabase/types";

interface FormValues {
  route_id: string;
  bus_id: string;
  driver_id: string;
  departure_time: string;
  arrival_time: string;
  fare: string;
  notes: string;
}

const toLocalInput = (iso?: string) =>
  iso ? dayjs(iso).format("YYYY-MM-DDTHH:mm") : "";

export default function UpdateTrip({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const { data: trip, isLoading } = useTrip(open ? searchParams.id : undefined);
  const updateTrip = useUpdateTrip();
  const { data: routes } = useRoutes();
  const { data: buses } = useBuses();
  const { data: drivers } = useDrivers();

  const [arrivalTouched, setArrivalTouched] = useState(false);
  const [driverConflict, setDriverConflict] = useState<TripWithRelations | null>(
    null
  );
  const driverConflictAcknowledgedRef = useRef(false);

  const activeBuses = useMemo(
    () => (buses ?? []).filter((b) => b.status === "active"),
    [buses]
  );
  const activeDrivers = useMemo(
    () => (drivers ?? []).filter((d) => d.status === "active"),
    [drivers]
  );

  const routeOptions = [
    { label: "Select a route", value: "" },
    ...(routes ?? []).map((r) => ({
      label: `${r.origin} → ${r.destination}`,
      value: r.id,
    })),
  ];
  const busOptions = [
    { label: "Unassigned", value: "" },
    ...activeBuses.map((b) => ({ label: b.vehicle_number, value: b.id })),
  ];
  const driverOptions = [
    { label: "Unassigned", value: "" },
    ...activeDrivers.map((d) => ({ label: d.full_name, value: d.id })),
  ];

  const form = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      route_id: trip?.route_id ?? "",
      bus_id: trip?.bus_id ?? "",
      driver_id: trip?.driver_id ?? "",
      departure_time: toLocalInput(trip?.departure_time),
      arrival_time: toLocalInput(trip?.arrival_time),
      fare: trip?.fare !== undefined ? String(trip.fare) : "",
      notes: trip?.notes ?? "",
    },
    validationSchema: Yup.object({
      route_id: Yup.string().required("Route is required"),
      departure_time: Yup.string().required("Departure is required"),
      arrival_time: Yup.string().test(
        "after-departure",
        "Arrival must be after departure",
        function (value) {
          return (
            !value ||
            !this.parent.departure_time ||
            new Date(value) > new Date(this.parent.departure_time)
          );
        }
      ),
      fare: Yup.number()
        .typeError("Fare must be a number")
        .required("Fare is required")
        .min(0, "Fare must be zero or greater"),
    }),
    onSubmit: async (values) => {
      if (!trip) return;

      try {
        const departureIso = new Date(values.departure_time).toISOString();
        const arrivalIso = values.arrival_time
          ? new Date(values.arrival_time).toISOString()
          : undefined;

        const conflicts = await findScheduleConflicts(
          values.bus_id || undefined,
          values.driver_id || undefined,
          departureIso,
          arrivalIso ?? departureIso,
          trip.id
        );

        if (conflicts.busConflict) {
          form.setFieldError(
            "bus_id",
            `This bus is already scheduled for another trip departing ${dayjs(
              conflicts.busConflict.departure_time
            ).format("MMM D, h:mm A")}`
          );
          return;
        }

        if (conflicts.driverConflict && !driverConflictAcknowledgedRef.current) {
          setDriverConflict(conflicts.driverConflict);
          return;
        }

        const payload: Record<string, unknown> = {
          route_id: values.route_id,
          bus_id: values.bus_id || undefined,
          driver_id: values.driver_id || undefined,
          departure_time: departureIso,
          arrival_time: arrivalIso,
          fare: parseFloat(values.fare),
          notes: values.notes || undefined,
        };

        await updateTrip.mutateAsync({ id: trip.id, payload });

        toast(
          JSON.stringify({ type: "success", title: "Trip Updated Successfully" })
        );
        setDriverConflict(null);
        driverConflictAcknowledgedRef.current = false;
        setOpen(false);
      } catch (e: any) {
        toast(
          JSON.stringify({
            type: "failed",
            title: e?.message || "Something went wrong",
          })
        );
      }
    },
  });

  const deriveArrival = (departure: string, routeId: string) => {
    const route = routes?.find((r) => r.id === routeId);
    if (route?.duration_minutes && departure) {
      return dayjs(departure)
        .add(route.duration_minutes, "minute")
        .format("YYYY-MM-DDTHH:mm");
    }
    return null;
  };

  const handleRouteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    form.handleChange(e);
    setDriverConflict(null);
    driverConflictAcknowledgedRef.current = false;
    setArrivalTouched(false);
    const derived = deriveArrival(form.values.departure_time, e.target.value);
    if (derived) form.setFieldValue("arrival_time", derived);
  };

  const handleDepartureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.handleChange(e);
    setDriverConflict(null);
    driverConflictAcknowledgedRef.current = false;
    if (!arrivalTouched) {
      const derived = deriveArrival(e.target.value, form.values.route_id);
      if (derived) form.setFieldValue("arrival_time", derived);
    }
  };

  const handleArrivalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.handleChange(e);
    setArrivalTouched(true);
    setDriverConflict(null);
    driverConflictAcknowledgedRef.current = false;
  };

  const handleAssignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    form.handleChange(e);
    setDriverConflict(null);
    driverConflictAcknowledgedRef.current = false;
  };

  const handleAcknowledgeConflict = () => {
    driverConflictAcknowledgedRef.current = true;
    setDriverConflict(null);
    form.handleSubmit();
  };

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
      hideDefaultAction={true}
      size="5xl"
      descriptionType="string"
      title="Edit trip"
      description="Update the details of this trip"
      renderActions={() => (
        <>
          <button
            type="button"
            onClick={wrapClick(form.handleSubmit)}
            className="inline-flex justify-center px-4 md:px-16 py-2 ml-3  text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
          >
            {updateTrip.isLoading ? (
              <Loader />
            ) : (
              <>
                <span>Save</span>
              </>
            )}
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 md:px-16 py-2 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-gray-50 focus:outline-none"
            onClick={() => {
              form.resetForm();
              setOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="mr-auto text-sm font-medium text-gray-400 hover:text-red-600 focus:outline-none"
            onClick={() => {
              navigate({
                search: (old) => ({ ...old, modal: "delete" }),
              });
            }}
          >
            Delete trip
          </button>
        </>
      )}
    >
      <form
        onSubmit={form.handleSubmit}
        className="flex-1 flex flex-col overflow-y-scroll"
      >
        <div className="space-y-6 divide-y divide-gray-200  flex-1">
          <div>
            <div className="grid grid-cols-2 gap-6 mt-2">
              <div className="">
                <SelectInput
                  id="route_id"
                  label="Route"
                  options={routeOptions}
                  required
                  {...form}
                  handleChange={handleRouteChange}
                />
              </div>
              <div className="">
                <TextInput
                  id="fare"
                  label="Fare"
                  type="number"
                  min={0}
                  placeholder="e.g. 80"
                  {...form}
                />
              </div>
              <div className="">
                <SelectInput
                  id="bus_id"
                  label="Bus"
                  options={busOptions}
                  {...form}
                  handleChange={handleAssignmentChange}
                />
              </div>
              <div className="">
                <SelectInput
                  id="driver_id"
                  label="Driver"
                  options={driverOptions}
                  {...form}
                  handleChange={handleAssignmentChange}
                />
              </div>
              <div className="">
                <TextInput
                  id="departure_time"
                  label="Departure"
                  type="datetime-local"
                  required
                  {...form}
                  handleChange={handleDepartureChange}
                />
              </div>
              <div className="">
                <TextInput
                  id="arrival_time"
                  label="Arrival"
                  type="datetime-local"
                  {...form}
                  handleChange={handleArrivalChange}
                />
              </div>
              <div className="col-span-2">
                <TextInput
                  id="notes"
                  label="Notes"
                  type="text"
                  placeholder="Optional notes about this trip"
                  {...form}
                />
              </div>
            </div>

            {driverConflict && (
              <div className="mt-4 rounded-md bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm text-amber-800">
                  This driver is already assigned to another trip departing{" "}
                  {dayjs(driverConflict.departure_time).format("MMM D, h:mm A")}.
                  You can schedule this trip anyway.
                </p>
                <button
                  type="button"
                  onClick={handleAcknowledgeConflict}
                  className="mt-2 text-sm font-medium text-amber-900 underline"
                >
                  Save anyway
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
