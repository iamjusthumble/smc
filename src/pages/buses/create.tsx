import { useState } from "react";
import Modal from "../../components/layouts/modal";
import { useNavigate } from "react-location";
import { LocationGenerics } from "../../router/location";
import wrapClick from "../../utils/wrap-click";
import { message, Upload, UploadProps } from "antd";
const { Dragger } = Upload;

import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import TextInput from "../../components/core/text-input";
import SelectInput from "../../components/core/select-input";
import { FiUploadCloud } from "react-icons/fi";
import { Loader } from "../../components/loaders";
import { useAuth } from "../../context/auth-context";
import { useCreateBus, useUpdateBus } from "../../services/supabase/use-buses";
import { uploadBusDocument } from "../../services/supabase/buses";
import { BusStatus } from "../../services/supabase/types";

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Maintenance", value: "maintenance" },
  { label: "Decommissioned", value: "decommissioned" },
];

const ALLOWED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5 MB

const validateDocumentFile = (file: File): boolean => {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
    message.error("Only PDF, JPG or PNG files are allowed.");
    return false;
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    message.error("File must be 5 MB or smaller.");
    return false;
  }
  return true;
};

interface FormValues {
  vehicle_number: string;
  model: string;
  make_year: string;
  color: string;
  seat_count: string;
  status: BusStatus;
  insurance_expiry: string;
  roadworthy_expiry: string;
}

const currentYear = new Date().getFullYear();

export default function CreateBus({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const navigate = useNavigate<LocationGenerics>();
  const { profile } = useAuth();
  const createBus = useCreateBus();
  const updateBus = useUpdateBus();
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [roadworthyFile, setRoadworthyFile] = useState<File | null>(null);

  const form = useFormik<FormValues>({
    initialValues: {
      vehicle_number: "",
      model: "",
      make_year: "",
      color: "",
      seat_count: "",
      status: "active",
      insurance_expiry: "",
      roadworthy_expiry: "",
    },
    validationSchema: Yup.object({
      vehicle_number: Yup.string()
        .required("Vehicle number is required")
        .max(50, "Vehicle number must be at most 50 characters"),

      model: Yup.string().max(100, "Model must be at most 100 characters"),

      make_year: Yup.number()
        .typeError("Year of make must be a number")
        .integer("Year of make must be an integer")
        .min(1970, "Year of make must be 1970 or later")
        .max(currentYear + 1, `Year of make must be ${currentYear + 1} or earlier`),

      color: Yup.string().max(30, "Colour must be at most 30 characters"),

      seat_count: Yup.number()
        .typeError("Seats must be a number")
        .required("Number of seats is required")
        .integer("Number of seats must be an integer")
        .positive("Number of seats must be a positive number"),
    }),
    onSubmit: async (values) => {
      if (!profile?.company_id) return;

      try {
        const bus = await createBus.mutateAsync({
          company_id: profile.company_id,
          vehicle_number: values.vehicle_number,
          model: values.model || undefined,
          make_year: values.make_year ? parseInt(values.make_year, 10) : undefined,
          color: values.color || undefined,
          seat_count: parseInt(values.seat_count, 10),
          status: values.status,
          insurance_doc_path: undefined,
          insurance_expiry: values.insurance_expiry || undefined,
          roadworthy_doc_path: undefined,
          roadworthy_expiry: values.roadworthy_expiry || undefined,
        });

        const updates: { insurance_doc_path?: string; roadworthy_doc_path?: string } = {};
        const uploadFailures: string[] = [];

        if (insuranceFile) {
          try {
            updates.insurance_doc_path = await uploadBusDocument(
              profile.company_id,
              bus.id,
              "insurance",
              insuranceFile
            );
          } catch {
            uploadFailures.push("insurance document");
          }
        }

        if (roadworthyFile) {
          try {
            updates.roadworthy_doc_path = await uploadBusDocument(
              profile.company_id,
              bus.id,
              "roadworthy",
              roadworthyFile
            );
          } catch {
            uploadFailures.push("roadworthy document");
          }
        }

        if (Object.keys(updates).length > 0) {
          await updateBus.mutateAsync({ id: bus.id, payload: updates });
        }

        if (uploadFailures.length > 0) {
          toast(
            JSON.stringify({
              type: "error",
              title: `Bus created, but couldn't upload: ${uploadFailures.join(", ")}. You can add these from Edit.`,
            })
          );
        } else {
          toast(
            JSON.stringify({ type: "success", title: "Bus Created Successfully" })
          );
        }

        form.resetForm();
        setInsuranceFile(null);
        setRoadworthyFile(null);
        setOpen(false);
      } catch (e: any) {
        if (e?.code === "23505") {
          form.setFieldError(
            "vehicle_number",
            "A bus with this vehicle number already exists"
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

  const InsuranceProps: UploadProps = {
    name: "insurance",
    multiple: false,
    listType: "picture",
    fileList: insuranceFile
      ? [{ uid: "-1", name: insuranceFile.name, status: "done" }]
      : [],
    beforeUpload: (file) => {
      if (!validateDocumentFile(file)) return Upload.LIST_IGNORE;
      setInsuranceFile(file);
      return false;
    },
    onRemove: () => setInsuranceFile(null),
  };

  const roadWorthyProps: UploadProps = {
    name: "roadworthy",
    multiple: false,
    listType: "picture",
    fileList: roadworthyFile
      ? [{ uid: "-1", name: roadworthyFile.name, status: "done" }]
      : [],
    beforeUpload: (file) => {
      if (!validateDocumentFile(file)) return Upload.LIST_IGNORE;
      setRoadworthyFile(file);
      return false;
    },
    onRemove: () => setRoadworthyFile(null),
  };

  const loading = createBus.isLoading || updateBus.isLoading;

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
      size="5xl"
      descriptionType="string"
      title="Add new bus"
      description="Provide the details to add a new bus"
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
              setInsuranceFile(null);
              setRoadworthyFile(null);
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
            <div className="grid grid-cols-3 gap-6 mt-2">
              <div className="">
                <TextInput
                  id="vehicle_number"
                  label="Vehicle Number"
                  type="text"
                  placeholder="e.g. GE-329-23"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="make_year"
                  label="Year of Make"
                  type="text"
                  placeholder="e.g. 2023"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="seat_count"
                  label="Seats"
                  type="text"
                  placeholder="e.g. 30"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="model"
                  label="Model"
                  type="text"
                  placeholder="e.g. Ford Transit Van"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="color"
                  label="Colour"
                  type="text"
                  placeholder="e.g. Colour"
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
          <div className="pt-6 pb-12">
            <div className="flex gap-x-10 w-full">
              <div className="flex flex-1 flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Vehicle Insurance Document
                </label>
                <Dragger className="h-24" {...InsuranceProps}>
                  <div className="flex justify-center items-center gap-x-5">
                    <p className="ant-upload-drag-icon flex justify-center">
                      <FiUploadCloud className="mt-3 text-gray-500" size={27} />
                    </p>
                    <div className="flex flex-col gap-y-1">
                      <p className=" text-gray-500 font-manrope text-sm">
                        <span className="text-primary_light">
                          Click to upload{" "}
                        </span>
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 font-manrope">
                        PDF, JPG or PNG (max. 5MB)
                      </p>
                    </div>
                  </div>
                </Dragger>
                <TextInput
                  id="insurance_expiry"
                  label="Insurance Expiry"
                  type="date"
                  {...form}
                />
              </div>
              <div className="flex flex-1 flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Road Worthy Document
                </label>
                <Dragger className="h-24" {...roadWorthyProps}>
                  <div className="flex justify-center items-center gap-x-5">
                    <p className="ant-upload-drag-icon flex justify-center">
                      <FiUploadCloud className="mt-3 text-gray-500" size={27} />
                    </p>
                    <div className="flex flex-col gap-y-1">
                      <p className=" text-gray-500 font-manrope text-sm">
                        <span className="text-primary_light">
                          Click to upload{" "}
                        </span>
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 font-manrope">
                        PDF, JPG or PNG (max. 5MB)
                      </p>
                    </div>
                  </div>
                </Dragger>
                <TextInput
                  id="roadworthy_expiry"
                  label="Roadworthy Expiry"
                  type="date"
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
