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

export const GET_TALENT = gql`
  query User($userId: ID!) {
    user(id: $userId) {
      _id
      profilePicture
      phoneNumber
      resume
      fullName
      portfolio
      email
      address
    }
  }
`;

export default function ViewTalent({
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

  const { data, loading } = useQuery(GET_TALENT, {
    variables: {
      userId: searchParams.id,
    },
    notifyOnNetworkStatusChange: false,
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
      loading={loading}
      hideActions={false}
      title="Talent Details"
      description="Details of the talent is shown below"
    >
      {data?.user?._id ? (
        <>
          <div className="flex-1 w-full max-h-[65vh] overflow-y-auto  sm:p-6">
            <div className="">
              <img
                src={
                  data?.user?.profilePicture.length > 1
                    ? data?.user?.profilePicture
                    : male || male
                }
                className="w-12 h-12 rounded-full"
                alt="company-logo"
              />
              <div className="grid  grid-cols-3 gap-x-10 mt-5  gap-y-7">
                <p className="font-manrope flex flex-col font-500 text-sm">
                  <span className="italic font-normal">Name</span>
                  <span>{data?.user?.fullName || "N/A"}</span>
                </p>
                <p className="font-manrope flex flex-col font-500 text-sm">
                  <span className="italic font-normal">Email</span>
                  <span>{data?.user?.email || "N/A"}</span>
                </p>
                <p className="font-manrope flex flex-col font-500 text-sm">
                  <span className="italic font-normal">Phone</span>
                  <span>{data?.user?.phoneNumber || "N/A"}</span>
                </p>

                <p className="font-manrope flex flex-col font-500 text-sm">
                  <span className="italic font-normal">City/ Region</span>
                  {data?.user?.address}
                </p>
                <p className="font-manrope flex flex-col font-500 text-sm">
                  <span className="italic font-normal">portfolio</span>
                  <span>{data?.user?.portfolio || "N/A"}</span>
                </p>
              </div>
            </div>
            <div className="mt-10">
              <p className="font-manrope flex flex-col font-500 text-sm">
                <span className="italic font-normal">CV/ Resume</span>
                {data?.user?.resume ? (
                  <a
                    href={data?.user?.resume || "#"}
                    className="border mt-5 flex justify-between items-center cursor-pointer  border-primary p-4 rounded-md"
                  >
                    <div className="flex items-center gap-x-4">
                      <img
                        src={fileIcon}
                        alt="doc-icon"
                        className="w-7 h-7 object-cover"
                      />
                      <a target="_blank" href={data?.user?.resume || "#"} rel="noreferrer">
                        {data?.user?.fullName || "N/A"} resume
                      </a>
                    </div>
                    <div>
                      <CheckCircleIcon className="w-5 h-5 text-primary" />
                    </div>
                  </a>
                ) : (
                  <button
                    type="button"
                    className="relative block w-full mt-5 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
                      />
                    </svg>
                    <span className="mt-2 block text-sm font-semibold text-gray-900">
                      No Resume Available for this Talent
                    </span>
                  </button>
                )}
              </p>
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
