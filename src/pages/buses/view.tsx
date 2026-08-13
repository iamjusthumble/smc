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

export const GET_BUS = gql`
  query GetBus($populate: [String], $filter: BusFilter) {
    getBus(populate: $populate, filter: $filter) {
      _id
      colour
      insurance
      model
      numberOfSeats
      roadWorthy
      vehicleNumber
      yearOfMake
      status
    }
  }
`;

export default function ViewRequest({
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
  const [fileListInsurance, setFileListInsurance] = useState<any>([]);
  const [fileListRoadWorthy, setFileListRoadWorthy] = useState<any>([]);

  const { data, loading } = useQuery(GET_BUS, {
    variables: {
      populate: ["busCompany"],
      filter: {
        _id: {
          eq: searchParams.id,
        },
      },
    },
    notifyOnNetworkStatusChange: false,
  });

  useEffect(() => {
    if (data) {
      setFileListInsurance([
        {
          uid: "-1",
          name: "Insurance File",
          status: "done",
          url: data?.getBus?.insurance,
        },
      ]);
      setFileListRoadWorthy([
        {
          uid: "-2",
          name: "Roadworthy File",
          status: "done",
          url: data?.getBus?.roadWorthy,
        },
      ]);
    }
  }, [data]);

  const InsuranceProps: UploadProps = {
    name: "insurance",
    multiple: false,
    listType: "picture",
    fileList: fileListInsurance,
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const roadWorthyProps: UploadProps = {
    name: "roadWorthy",
    multiple: false,
    fileList: fileListRoadWorthy,
    listType: "picture",
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
      title="Bus Information"
      description="Details of the bus are shown below"
    >
      {data?.getBus?._id ? (
        <>
          <div className="overflow-y-auto flex flex-col gap-y-6 pb-20  flex-1">
            <div className="grid grid-cols-3 gap-x-10 gap-y-8">
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Vehicle Number
                </label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {data?.getBus?.vehicleNumber}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Year of Make
                </label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {data?.getBus?.yearOfMake}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Number of Seats
                </label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {data?.getBus?.numberOfSeats}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Model
                </label>
                <p className=" w-72 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {data?.getBus?.model}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Colour
                </label>
                <p className=" w-72 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {data?.getBus?.colour}
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
                  Vehicle Insurance Document
                </label>

                <Dragger
                  style={{ border: "none" }}
                  className="h-0"
                  {...InsuranceProps}
                ></Dragger>
              </div>
              <div className="flex flex-1 flex-col">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Road Worthy Document
                </label>

                <Dragger
                  style={{ border: "none" }}
                  className="h-0 border-none"
                  {...roadWorthyProps}
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
