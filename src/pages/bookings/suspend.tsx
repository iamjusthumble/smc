import { useState } from "react";
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
      status
      address
    }
  }
`;

const SUSPEND_TALENT = gql`
  mutation SuspendUser($input: suspendUser!) {
    suspendUser(input: $input) {
      _id
    }
  }
`;

export default function SuspendTalent({
  open,
  setOpen,
  refetch,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  refetch?: () => void;
}) {
  const [reason, setReason] = useState("");
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();

  const { data, loading } = useQuery(GET_TALENT, {
    variables: {
      userId: searchParams.id,
    },
    notifyOnNetworkStatusChange: false,
  });

  const [suspendTalent, { loading: acceptLoading }] =
    useMutation(SUSPEND_TALENT);

  const handleSuspend = async () => {
    const res = await suspendTalent({
      variables: {
        input: {
          _id: searchParams.id,
          reason: reason,
        },
      },
    });

    if (res.data?.suspendUser._id) {
      toast(
        JSON.stringify({
          type: "success",
          title: "Talent suspended Successfully",
        })
      );
      refetch?.();
      setOpen?.(false);
    }
  };

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
      title="Suspend Talent"
      descriptionType="HTML"
      description={
        <>
          <div className="flex items-center mt-1 gap-x-5">
            <p className="text-yellow-500 text-sm font-inter">Talent Status</p>
            <div>
              <span
                className={classNames(
                  "bg-gray-100 text-gray-800",

                  data?.user?.status === "SUSPENDED"
                    ? `text-red-600 bg-gray-50 border border-red-600`
                    : "",

                  data?.user?.status === "ACTIVE"
                    ? `text-green-600 bg-gray-50 border border-green-600`
                    : "",

                  !data?.user?.status ? "bg-gray-200 text-gray-800  " : "",
                  "inline-flex rounded-full  px-2 py-0.5 text-xs items-center space-x-1"
                )}
              >
                <span>{_.startCase(data?.user?.status || "Unknown")}</span>
              </span>
            </div>
          </div>
        </>
      }
      renderActions={() => (
        <>
          {data?.user?.status === "ACTIVE" && (
            <>
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={wrapClick(handleSuspend)}
              >
                {acceptLoading ? "Loading..." : "Suspend"}
              </button>
            </>
          )}
          {data?.user?.status === "SUSPENDED" && (
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={wrapClick(dispatchAction("resolve"))}
            >
              N/A
            </button>
          )}
        </>
      )}
    >
      {data?.user?._id ? (
        <>
          <div className="flex-1 w-full max-h-[65vh] overflow-y-auto">
            <div>
              <h2>Reason</h2>
              <p className="text-sm text-gray-400 font-manrope">
                State the reason to suspend the talent
              </p>
            </div>
            <div className="w-full h-full mt-5">
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                className="w-full h-72 border p-3 rounded-md border-gray-200"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 w-full max-h-[65vh] overflow-y-auto">
          <div>
            <h1>NO DATA</h1>
          </div>
        </div>
      )}
    </Modal>
  );
}
