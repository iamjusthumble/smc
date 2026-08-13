import { useCallback, useState } from "react";
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
import { useDropzone } from "react-dropzone";
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
import { Loader as PulseLoader } from "../../components/loaders";
import { currentUserVar } from "../../apollo/cache/auth";
import axios from "axios";
import { PlusIcon } from "@heroicons/react/24/outline";
import Loader from "../../components/layouts/loader";
import { BusPicker } from "../../containers/bus-picker";

export const CREATE_DRIVER = gql`
  mutation CreateDriver($input: CreateDriverInput!) {
    createDriver(input: $input) {
      _id
    }
  }
`;

interface FormValues {
  fullName: string;
  mobileNumber: string;
  email: string;
  postalAddress: string;
  digitalAddress: string;
  profilePicture: string;
  license: string;
  bus: string;
}
export default function CreateDriver({
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
  const [profilePicture, setProfilePicture] = useState("");
  const [profileUploadLoading, setProfileUploadLoading] = useState(false);
  const [profileUploadLoadingPercentage, setProfileUploadLoadingPercentage] =
    useState<number>();

  const [createDriver, { loading }] = useMutation(CREATE_DRIVER);

  const form = useFormik({
    initialValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      postalAddress: "",
      digitalAddress: "",
      profilePicture: "",
      license: "",
      bus: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      mobileNumber: Yup.string()
        .required("Mobile number is required")
        .matches(/^[0-9]{10}$/, "Invalid mobile number format"),

      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

      postalAddress: Yup.string().required("Postal address is required"),

      digitalAddress: Yup.string().required("Digital address is required"),

      profilePicture: Yup.mixed().required("Profile picture is required"),

      license: Yup.mixed().required("License is required"),
    }),
    onSubmit: async (values: FormValues) => {
      createDriver({
        variables: {
          input: {
            fullName: values.fullName,
            email: values.email,
            mobileNumber: values.mobileNumber,
            postalAddress: values.postalAddress,
            digitalAddress: values.digitalAddress,
            license: values.license,
            busId: values.bus,
            profilePicture: values.profilePicture,
            busCompanyId: currentUser?.busCompany?._id,
            createdByAdminId: currentUser?._id,
          },
        },
      })
        .then(({ data }) => {
          if (data?.createDriver?._id) {
            toast(
              JSON.stringify({
                type: "success",
                title: "Driver Created Successfully",
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

  const onDrop = useCallback((acceptedFiles: any[]) => {
    // Do something with the files
    setProfileUploadLoading(true);
    const file = acceptedFiles[0];
    setProfilePicture(file);
    console.log(file);
    const data = new FormData();
    data.append("profilePicture", file as any, file?.name as any);
    uploadFile(data, {
      onSuccess: (data) => {
        if (data) {
          console.log(data);
          setProfileUploadLoading(false);
          form.setFieldValue(
            "profilePicture",
            data?.data?.profilePicture[0]?.url
          );
        }
      },
      onError: (error: any) => {
        setProfileUploadLoading(false);
        toast(
          JSON.stringify({
            type: "failed",
            title: error?.message,
          })
        );
      },
    });
  }, []);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg"],
      "image/jpeg": [".jpeg"],
    },
  });

  const licenseProps: UploadProps = {
    name: "license",
    multiple: false,
    listType: "picture",
    customRequest: async ({ file, onSuccess, onError }: any) => {
      try {
        const data = new FormData();
        data.append("license", file);
        uploadFile(data, {
          onSuccess: (data) => {
            if (onSuccess) {
              onSuccess(data.data.license[0].url, file);
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
        form.setFieldValue("license", info.file.response);
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
      size="6xl"
      descriptionType="string"
      title="Add Driver"
      description="Provide the details to add new driver"
      renderActions={() => (
        <>
          <button
            type="button"
            onClick={wrapClick(form.handleSubmit)}
            className="inline-flex justify-center px-4 md:px-16 py-2 ml-3  text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
          >
            {loading ? (
              <PulseLoader />
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
          <div className="flex flex-1 w-full">
            <div className="grid grid-cols-2 col-span-3 flex-[1.5] gap-6 mt-2">
              <div className="">
                <TextInput
                  id="fullName"
                  label="Driver Full Name"
                  type="text"
                  placeholder="e.g. Emmanuel Dodoo"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="mobileNumber"
                  label="Mobile Number"
                  type="text"
                  // step={0.01}
                  // postText="GHS"
                  placeholder="e.g. +233241489576"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="email"
                  label="Email Address"
                  type="text"
                  // step={0.01}
                  // postText="GHS"
                  placeholder="e.g. emmanueldodoo94@gmail.com"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="postalAddress"
                  label="Postal Address"
                  type="text"
                  // step={0.01}
                  // postText="GHS"
                  placeholder="e.g. P.O.BOX 932"
                  {...form}
                />
              </div>
              <div className="">
                <TextInput
                  id="digitalAddress"
                  label="Digital Address"
                  type="text"
                  // step={0.01}
                  // postText="GHS"
                  placeholder="e.g. GE-310-2292"
                  {...form}
                />
              </div>
              <div className="">
                <BusPicker
                  id="bus"
                  label="Bus"
                  // step={0.01}
                  // postText="GHS"
                  placeholder="e.g. GE-310-2292"
                  {...form}
                />
              </div>
            </div>
            <div className="grid col-span-2 flex-1">
              <div className="flex justify-center">
                <button
                  type="button"
                  {...getRootProps()}
                  className="border border-dashed bg-gray-50 flex justify-center flex-col items-center border-gray-400 h-36 w-36 mt-5 rounded-full"
                >
                  {profileUploadLoading ? (
                    <Loader />
                  ) : form.values.profilePicture ? (
                    <img
                      className="h-32 w-32 rounded-full"
                      src={form.values.profilePicture}
                    />
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5" />
                      <span className="font-manrope">upload</span>
                    </>
                  )}
                  <input
                    {...getInputProps()}
                    id="file"
                    name="file"
                    type="file"
                    className="sr-only"
                  />
                </button>
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
                  Drivers License
                </label>
                <Dragger className="h-24" {...licenseProps}>
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
