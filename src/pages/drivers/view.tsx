import { useEffect, useState } from "react";
import { gql, useMutation, useQuery, useReactiveVar } from "@apollo/client";
import Modal from "../../components/layouts/modal";
import { useSearch, useNavigate } from "react-location";
import { LocationGenerics } from "../../router/location";
import { Action } from "../../components/buttons/action-button";
import { currentConfigVar } from "../../apollo/cache/config";
import wrapClick from "../../utils/wrap-click";
import { classNames } from "../../utils";
import _, { last } from "lodash";
import fileIcon from "../../assets/images/fileIcon.png";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import Dragger from "antd/es/upload/Dragger";
import { UploadProps } from "antd";

export const GET_DRIVER = gql`
  query GetDriver($filter: DriverFilter, $populate: [String]) {
    getDriver(filter: $filter, populate: $populate) {
      _id
      fullName
      email
      mobileNumber
      digitalAddress
      license
      profilePicture
      postalAddress
      licenseClass
      status
      bus {
        vehicleNumber
        _id
      }
    }
  }
`;

export default function ViewDriver({
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
  const [fileListLicense, setFileListLicense] = useState<any>([]);

  const { data, loading } = useQuery(GET_DRIVER, {
    variables: {
      filter: {
        _id: {
          eq: searchParams?.id,
        },
      },
      populate: ["busCompany", "bus"],
    },
    notifyOnNetworkStatusChange: false,
  });

  useEffect(() => {
    if (data) {
      setFileListLicense([
        {
          uid: "-1",
          name: "License File",
          status: "done",
          url: data?.getDriver?.license,
        },
      ]);
    }
  }, [data]);

  const LicenseProps: UploadProps = {
    name: "license",
    multiple: false,
    listType: "picture",
    fileList: fileListLicense,
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
      loading={loading}
      hideActions={false}
      descriptionType="string"
      title="Driver Information"
      description="Details of the driver are shown below"
    >
      {data?.getDriver?._id ? (
        <>
          <div className="overflow-y-auto flex flex-col gap-y-6 pb-20  flex-1">
            <div className="grid grid-cols-3 gap-x-10 gap-y-8">
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Full Name
                </label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {data?.getDriver?.fullName || "N/A"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Email
                </label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {data?.getDriver?.email || "N/A"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Digital Address
                </label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {data?.getDriver?.digitalAddress || "N/A"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Postal Address
                </label>
                <p className=" w-72 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {data?.getDriver?.postalAddress || "N/A"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Bus
                </label>
                <p className=" w-72 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {data?.getDriver?.bus?.vehicleNumber || "N/A"}
                </p>
              </div>
            </div>

            <div className="h-[1px] w-full bg-gray-300"></div>

            <div className="flex flex-col gap-y-24 w-full">
              <div className="flex flex-1 flex-col">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  License
                </label>

                <Dragger
                  style={{ border: "none" }}
                  className="h-0"
                  {...LicenseProps}
                ></Dragger>
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
