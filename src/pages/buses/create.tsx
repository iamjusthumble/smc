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
import { message, Upload, UploadProps } from "antd";
const { Dragger } = Upload;
import { useMutation as useMutationTanStack } from "@tanstack/react-query";

import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import TextInput from "../../components/core/text-input";
import { FiUploadCloud } from "react-icons/fi";
import { FileServer } from "../../services";
import { Loader } from "../../components/loaders";
import { currentUserVar } from "../../apollo/cache/auth";

export const CREATE_BUS = gql`
  mutation CreateBus($input: CreateBusInput!) {
    createBus(input: $input) {
      _id
    }
  }
`;

interface FormValues {
  vehicleNumber: string;
  model: string;
  yearOfMake: string;
  colour: string;
  seats: string;
  insurance: string;
  roadWorthy: string;
}

export default function CreateBus({
  open,
  setOpen,
  refetch,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  refetch?: () => void;
}) {
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const currentUser = useReactiveVar(currentUserVar);

  const [createBus, { loading }] = useMutation(CREATE_BUS);

  const form = useFormik({
    initialValues: {
      vehicleNumber: "",
      model: "",
      yearOfMake: "",
      colour: "",
      seats: "",
      insurance: "",
      roadWorthy: "",
    },
    validationSchema: Yup.object({
      vehicleNumber: Yup.string()
        .required("Vehicle number is required")
        .matches(/^[A-Za-z0-9\s]+$/, "Invalid vehicle number format")
        .max(20, "Vehicle number must be at most 20 characters"),

      model: Yup.string()
        .required("Model is required")
        .max(50, "Model must be at most 50 characters")
        .matches(/^[A-Z][a-zA-Z]*$/, "Model must start with a capital letter"),

      yearOfMake: Yup.number()
        .required("Year of make is required")
        .integer("Year of make must be an integer")
        .min(1900, "Invalid year of make")
        .max(new Date().getFullYear(), "Invalid year of make"),

      colour: Yup.string()
        .required("Colour is required")
        .max(30, "Colour must be at most 30 characters")
        .matches(/^[A-Z][a-zA-Z]*$/, "Colour must start with a capital letter"),

      seats: Yup.number()
        .required("Number of seats is required")
        .integer("Number of seats must be an integer")
        .min(1, "Invalid number of seats")
        .max(30, "Invalid number of seats"),

      insurance: Yup.string().required("Insurance document is required"),

      roadWorthy: Yup.string().required("Roadworthy document is required"),
    }),
    onSubmit: async (values: FormValues) => {
      createBus({
        variables: {
          input: {
            busCompany: currentUser?.busCompany?._id,
            colour: values.colour,
            createdBy: currentUser?._id,
            insurance: values.insurance,
            model: values.model,
            numberOfSeats: parseInt(values.seats, 10),
            roadWorthy: values.roadWorthy,
            status: "ACTIVE",
            vehicleNumber: values.vehicleNumber,
            yearOfMake: parseInt(values.yearOfMake, 10),
          },
        },
      })
        .then(({ data }) => {
          if (data?.createBus?._id) {
            toast(
              JSON.stringify({
                type: "success",
                title: "Bus Created Successfully",
              })
            );
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

  console.log(form.values);
  console.log(form.errors);

  const { mutate: uploadFile } = useMutationTanStack({
    mutationKey: ["uploadFile"],
    mutationFn: FileServer.UPLOAD_FILE,
  });

  const InsuranceProps: UploadProps = {
    name: "insurance",
    multiple: false,
    listType: "picture",
    customRequest: async ({ file, onSuccess, onError }: any) => {
      try {
        const data = new FormData();
        data.append("insurance", file);
        uploadFile(data, {
          onSuccess: (data) => {
            if (onSuccess) {
              onSuccess(data.data.insurance[0].url, file);
            }
          },
        });
      } catch (error: any) {
        if (onError) {
          onError(error);
        }
      }
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        form.setFieldValue("insurance", info.file.response);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const roadWorthyProps: UploadProps = {
    name: "roadWorthy",
    multiple: false,
    listType: "picture",
    customRequest: async ({ file, onSuccess, onError }: any) => {
      try {
        const data = new FormData();
        data.append("roadWorthy", file);
        uploadFile(data, {
          onSuccess: (data) => {
            if (onSuccess) {
              onSuccess(data.data.roadWorthy[0].url, file);
            }
          },
        });
      } catch (error: any) {
        if (onError) {
          onError(error);
        }
      }
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        form.setFieldValue("roadWorthy", info.file.response);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
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
                  id="vehicleNumber"
                  label="Vehicle Number"
                  type="text"
                  // step={0.01}
                  // postText="GHS"
                  placeholder="e.g. GE-329-23"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="yearOfMake"
                  label="Year of Make"
                  type="text"
                  // step={0.01}
                  // postText="GHS"
                  placeholder="e.g. 2023"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="seats"
                  label="Seats"
                  type="text"
                  // step={0.01}
                  // postText="GHS"
                  placeholder="e.g. 30"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="model"
                  label="Model"
                  type="text"
                  // step={0.01}
                  // postText="GHS"
                  placeholder="e.g. Ford Transit Van"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="colour"
                  label="Colour"
                  type="text"
                  // step={0.01}
                  // postText="GHS"
                  placeholder="e.g. Colour"
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
                        pdf or JPG (max. 800x400px)
                      </p>
                    </div>
                  </div>
                </Dragger>
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
                        pdf or JPG (max. 800x400px)
                      </p>
                    </div>
                  </div>
                </Dragger>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}
