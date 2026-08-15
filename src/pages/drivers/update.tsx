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
import { useDriver, useUpdateDriver } from "../../services/supabase/use-drivers";
import { DriverStatus } from "../../services/supabase/types";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Retired", value: "retired" },
];

interface FormValues {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  license_number: string;
  license_class: string;
  license_expiry: string;
  status: DriverStatus;
}

export default function UpdateDriver({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const { data: driver, isLoading } = useDriver(open ? searchParams.id : undefined);
  const updateDriver = useUpdateDriver();

  const form = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      full_name: driver?.full_name ?? "",
      email: driver?.email ?? "",
      phone: driver?.phone ?? "",
      address: driver?.address ?? "",
      license_number: driver?.license_number ?? "",
      license_class: driver?.license_class ?? "",
      license_expiry: driver?.license_expiry ?? "",
      status: driver?.status ?? "active",
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email address"),
      license_expiry: Yup.date().typeError("Enter a valid date"),
    }),
    onSubmit: async (values) => {
      if (!driver) return;

      try {
        const payload: Record<string, unknown> = {
          full_name: values.full_name,
          email: values.email || null,
          phone: values.phone || null,
          address: values.address || null,
          license_number: values.license_number || null,
          license_class: values.license_class || null,
          license_expiry: values.license_expiry || null,
          status: values.status,
        };

        await updateDriver.mutateAsync({ id: driver.id, payload });

        toast(
          JSON.stringify({ type: "success", title: "Driver Updated Successfully" })
        );
        setOpen(false);
      } catch (e: any) {
        if (e?.code === "23505") {
          form.setFieldError(
            "license_number",
            "A driver with this licence number already exists"
          );
        } else {
          toast(
            JSON.stringify({
              type: "failed",
              title: e?.message || "Something went wrong",
            })
          );
        }
      }
    },
  });

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
      title="Edit driver"
      description="Update the details of this driver"
      renderActions={() => (
        <>
          <button
            type="button"
            onClick={wrapClick(form.handleSubmit)}
            className="inline-flex justify-center px-4 md:px-16 py-2 ml-3  text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
          >
            {updateDriver.isLoading ? (
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
            Delete driver
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
                <TextInput
                  id="full_name"
                  label="Driver Full Name"
                  type="text"
                  placeholder="e.g. Emmanuel Dodoo"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="phone"
                  label="Phone Number"
                  type="text"
                  placeholder="e.g. +233241489576"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="email"
                  label="Email Address"
                  type="text"
                  placeholder="e.g. emmanueldodoo94@gmail.com"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="address"
                  label="Address"
                  type="text"
                  placeholder="e.g. P.O.BOX 932, Accra"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="license_number"
                  label="Licence Number"
                  type="text"
                  placeholder="e.g. DVLA-0012345"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="license_class"
                  label="Licence Class"
                  type="text"
                  placeholder="e.g. C"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="license_expiry"
                  label="Licence Expiry"
                  type="date"
                  {...form}
                />
              </div>
              <div className="">
                <SelectInput
                  id="status"
                  label="Status"
                  options={STATUS_OPTIONS}
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
