import { useState } from "react";
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import Modal from "../../components/layouts/modal";
import { useSearch, useNavigate } from "react-location";
import { LocationGenerics } from "../../router/location";
import { Action } from "../../components/buttons/action-button";
import { currentConfigVar } from "../../apollo/cache/config";
import wrapClick from "../../utils/wrap-click";
import { classNames } from "../../utils";
import male from "../../assets/images/male.jpeg";
import _, { last } from "lodash";
import fileIcon from "../../assets/images/fileIcon.png";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import TextInput from "../../components/core/text-input";
import { Loader } from "../../components/loaders";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import LocationPicker from "../../containers/location-picker";
import SelectInput from "../../components/core/select-input";
import { BusesPicker, BusPicker } from "../../containers/bus-picker";
import { currentUserVar } from "../../apollo/cache/auth";

export const CREATE_TRIP = gql`
  mutation CreateTrip($input: CreateTripInput!) {
    createTrip(input: $input) {
      _id
    }
  }
`;

interface FormValues {
  date: Date;
  numberOfBusesAssigned: string;
  origin: any;
  destination: any;
  timeScheduled: any;
  tripType: string;
  price: string;
  bus: any;
}

export default function CreateTrip({
  open,
  setOpen,
  refetch,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  refetch?: () => void;
}) {
  const { pollInterval } = useReactiveVar(currentConfigVar);
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const currentUser = useReactiveVar(currentUserVar);

  const [createTrip, { loading }] = useMutation(CREATE_TRIP);

  const form = useFormik({
    initialValues: {
      date: "" as unknown as Date,
      bus: "" as any,
      destination: "",
      numberOfBusesAssigned: "",
      origin: "",
      price: "",
      timeScheduled: null as any,
      tripType: "",
    },
    validationSchema: Yup.object({}),
    onSubmit: async (values: FormValues) => {
      createTrip({
        variables: {
          input: {
            date: values.date,
            origin: values?.origin?.id,
            destination: values?.destination?.id,
            numberOfBusAssigned: values.numberOfBusesAssigned,
            timeScheduled: {
              startTime: dayjs(values.timeScheduled[0]).format("h:mm A"),
              endTime: dayjs(values.timeScheduled[1]).format("h:mm A"),
            },
            tripStatus: "ACTIVE",
            tripType: values.tripType,
            busCompany: currentUser?.busCompany?._id,
            bus: values?.bus.id,
            price: values.price,
            createdBy: currentUser?._id,
          },
        },
      })
        .then(({ data }) => {
          if (data?.createTrip?._id) {
            toast(
              JSON.stringify({
                type: "success",
                title: "Trip Created Successfully",
              })
            );
            refetch?.();
            setOpen(false);
          }
        })
        .catch((e) => {
          toast(
            JSON.stringify({
              type: "failed",
              title: e?.message,
            })
          );
        });
    },
  });

  const dispatchAction =
    (action: Exclude<Action, "expand" | "goto" | "clone">) => () => {
      navigate({
        search: (old) => ({
          ...old,
          modal: action,
        }),
      });
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
      hideActions={false}
      hideDefaultAction={true}
      size="2xl"
      descriptionType="string"
      title="Add new trip"
      description="Provide the details to add a new trip"
      renderActions={() => (
        <>
          <button
            type="button"
            onClick={wrapClick(form.handleSubmit)}
            className="inline-flex justify-center px-4 md:px-16 py-2 ml-3  text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <span>Add</span>
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
                <div className="flex flex-col gap-y-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-manrope"
                  >
                    Trip Date
                  </label>
                  <DatePicker
                    className="border w-72 border-gray-300 text-base font-manrope rounded-md pl-4 py-2"
                    size="middle"
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf("day");
                    }}
                    onChange={(_date, dateString) => {
                      form.setFieldValue("date", _date);
                    }}
                    value={form.values.date}
                    placeholder="select date for this trip"
                  />
                </div>
              </div>
              <div className="">
                <TextInput
                  id="numberOfBusesAssigned"
                  label="Number Of Bus(es) assigned"
                  type="text"
                  placeholder="e.g. 5"
                  {...form}
                />
              </div>
              <div className="">
                <LocationPicker
                  id="origin"
                  label="Origin"
                  placeholder="e.g. RUKOMOVO"
                  {...form}
                />
              </div>
              <div className="">
                <div className="">
                  <LocationPicker
                    id="destination"
                    label="Destination"
                    placeholder="e.g. LOMOTIV"
                    {...form}
                  />
                </div>
              </div>
              <div className="">
                <div className="flex flex-col gap-y-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-manrope"
                  >
                    Time Scheduled
                  </label>
                  <TimePicker.RangePicker
                    className="border w-72 text-base font-manrope border-gray-300 rounded-md pl-4 py-2"
                    onChange={(_time, timeString) => {
                      console.log(timeString);
                      console.log(_time);
                      form.setFieldValue("timeScheduled", _time);
                    }}
                    value={form.values.timeScheduled}
                    placeholder={["Trip Start", "End Time"]}
                  />
                </div>
              </div>
              <div>
                <SelectInput
                  id="tripType"
                  label="Trip Type"
                  placeholder="Trip Type"
                  required={true}
                  options={[
                    { label: "--Select trip type", value: "" },
                    { label: "One-Time", value: "One-Time" },
                    { label: "Recurring", value: "Recurring" },
                  ]}
                  {...form}
                  values={form.values}
                />
              </div>
              <div className="">
                <TextInput
                  id="price"
                  label="Price"
                  type="number"
                  placeholder="e.g. 20"
                  {...form}
                />
              </div>
              <div className="">
                <BusPicker
                  id="bus"
                  label="Bus Assigned"
                  placeholder="select bus assigned"
                  {...form}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
