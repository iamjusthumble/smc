import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, useSearch } from "react-location";
import toast from "react-hot-toast";
import { LocationGenerics } from "../../router/location";
import {
  useDeleteDriver,
  useDriver,
  useTripCountForDriver,
  useUpdateDriver,
} from "../../services/supabase/use-drivers";

export default function DeleteDriver({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();
  const { data: driver } = useDriver(open ? searchParams.id : undefined);
  const { data: tripCount, isLoading: countLoading } = useTripCountForDriver(
    open ? searchParams.id : undefined
  );
  const deleteDriver = useDeleteDriver();
  const updateDriver = useUpdateDriver();

  const close = () => {
    setOpen(false);
    navigate({
      search: (old) => ({ ...old, modal: undefined, id: undefined }),
    });
  };

  const handleDelete = async () => {
    if (!driver) return;
    try {
      await deleteDriver.mutateAsync(driver.id);
      toast(
        JSON.stringify({
          type: "success",
          title: `${driver.full_name} deleted successfully`,
        })
      );
      close();
    } catch (e: any) {
      toast(
        JSON.stringify({
          type: "failed",
          title: e?.message || "Couldn't delete this driver. Please try again.",
        })
      );
    }
  };

  const handleRetireInstead = async () => {
    if (!driver) return;
    try {
      await updateDriver.mutateAsync({
        id: driver.id,
        payload: { status: "retired" },
      });
      toast(
        JSON.stringify({
          type: "success",
          title: `${driver.full_name} marked as retired`,
        })
      );
      close();
    } catch (e: any) {
      toast(
        JSON.stringify({
          type: "failed",
          title: e?.message || "Couldn't retire this driver. Please try again.",
        })
      );
    }
  };

  const blocked = (tripCount ?? 0) > 0;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] transition-opacity" />
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
                    onClick={close}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {countLoading ? (
                  <div className="py-8 text-center text-sm text-gray-500">
                    Checking trip history...
                  </div>
                ) : blocked ? (
                  <div className="sm:flex sm:items-start justify-center">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 sm:mx-0">
                        <ArchiveBoxIcon
                          className="h-5 w-5 text-amber-600"
                          aria-hidden="true"
                        />
                      </div>
                      <Dialog.Title
                        as="h3"
                        className="mt-3 text-base text-center font-semibold leading-6 text-gray-900 sm:text-left"
                      >
                        Can&apos;t delete {driver?.full_name ?? "this driver"}
                      </Dialog.Title>
                      <div className="mt-2 w-60 md:w-72 mb-7">
                        <p className="text-sm text-gray-700 text-center sm:text-left break-words">
                          This driver is linked to {tripCount} trip
                          {tripCount === 1 ? "" : "s"} and can&apos;t be deleted.
                          Retire them instead to keep their records.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="sm:flex sm:items-start justify-center">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 sm:mx-0">
                        <ExclamationTriangleIcon
                          className="h-5 w-5 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <Dialog.Title
                        as="h3"
                        className="mt-3 text-base text-center font-semibold leading-6 text-gray-900 sm:text-left"
                      >
                        Delete {driver?.full_name ?? "this driver"}?
                      </Dialog.Title>
                      <div className="mt-2 w-60 md:w-72 mb-7">
                        <p className="text-sm text-gray-700 text-center sm:text-left break-words">
                          This permanently removes{" "}
                          {driver?.full_name ?? "this driver"}. This can&apos;t
                          be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!countLoading && (
                  <div className="mt-5 sm:mt-4 sm:flex gap-x-3 px-2 justify-center sm:justify-start">
                    {blocked ? (
                      <button
                        type="button"
                        disabled={updateDriver.isLoading}
                        className="inline-flex w-28 md:w-32 mr-2 md:mr-0 justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 disabled:opacity-60 sm:ml-3"
                        onClick={handleRetireInstead}
                      >
                        {updateDriver.isLoading ? "Saving..." : "Retire instead"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={deleteDriver.isLoading}
                        className="inline-flex w-28 md:w-32 mr-2 md:mr-0 justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-60 sm:ml-3"
                        onClick={handleDelete}
                      >
                        {deleteDriver.isLoading ? "Deleting..." : "Delete"}
                      </button>
                    )}
                    <button
                      type="button"
                      className="mt-3 inline-flex w-28 md:w-32 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0"
                      onClick={close}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
