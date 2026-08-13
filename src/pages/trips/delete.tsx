import { Fragment, useState } from "react";
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
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const GET_TRIP = gql`
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

const DELETE_TRIP = gql`
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

  const { data, loading } = useQuery(GET_TRIP, {
    variables: {
      userId: searchParams.id,
    },
    notifyOnNetworkStatusChange: false,
  });

  const [deleteTrip, { loading: deleteLoading }] = useMutation(DELETE_TRIP);

  const handleDelete = async () => {
    const res = await deleteTrip({
      variables: {
        input: {
          _id: searchParams.id,
          reason: reason,
        },
      },
    });

    if (res.data?.deleteTrip._id) {
      toast(
        JSON.stringify({
          type: "success",
          title: "Trip deleted Successfully",
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
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-dark bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start justify-center">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base text-center font-semibold leading-6 text-gray-900"
                    >
                      Delete Trip
                    </Dialog.Title>
                    <div className="mt-2 w-60 md:w-52 mb-7">
                      <p className="text-sm text-gray-700 text-center break-all">
                        Are you sure you want to delete this trip?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex gap-x-3 px-2 justify-center">
                  <button
                    type="button"
                    className="inline-flex w-28 md:w-32 mr-2 md:mr-0 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3"
                    onClick={() => {
                      handleDelete();
                    }}
                  >
                    {deleteLoading ? (
                      <span>Loading...</span>
                    ) : (
                      <>
                        <span>Delete</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-28 md:w-32 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
