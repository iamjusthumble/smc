import Modal from "../../components/layouts/modal";
import { useSearch, useNavigate } from "react-location";
import { LocationGenerics } from "../../router/location";
import { classNames } from "../../utils";
import { useDriver } from "../../services/supabase/use-drivers";
import { getLicenseExpiryStatus } from "../../services/supabase/drivers";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ViewDriver({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();

  const { data: driver, isLoading } = useDriver(open ? searchParams.id : undefined);
  const expiryStatus = getLicenseExpiryStatus(driver?.license_expiry);

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
      descriptionType="string"
      title="Driver Information"
      description="Details of the driver are shown below"
    >
      {driver?.id ? (
        <>
          <div className="overflow-y-auto flex flex-col gap-y-6 pb-20  flex-1">
            <div className="grid  grid-cols-3 gap-x-10 gap-y-8">
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Full Name
                </label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {driver?.full_name || "N/A"}
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
                  {driver?.email || "N/A"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Phone
                </label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {driver?.phone || "N/A"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Address
                </label>
                <p className=" w-72 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {driver?.address || "N/A"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Status
                </label>
                <p className=" w-72 border-gray-300 text-base font-manrope rounded-md  py-2 capitalize">
                  {driver?.status}
                </p>
              </div>
            </div>

            <div className="h-[1px] w-full bg-gray-300"></div>

            <div className="grid grid-cols-3 gap-x-10 gap-y-8">
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Licence Number
                </label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {driver?.license_number || "N/A"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Licence Class
                </label>
                <p className=" w-60 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {driver?.license_class || "N/A"}
                </p>
              </div>
              <div className="flex flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Licence Expiry
                </label>
                <p className="flex w-60 items-center gap-x-1.5 border-gray-300 text-base font-manrope rounded-md  py-2">
                  {driver?.license_expiry || "N/A"}
                  {expiryStatus && (
                    <ExclamationTriangleIcon
                      className={classNames(
                        expiryStatus === "expired"
                          ? "text-red-500"
                          : "text-amber-500",
                        "h-4 w-4 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </p>
                {expiryStatus === "expired" && (
                  <p className="text-xs text-red-500">Licence has expired</p>
                )}
                {expiryStatus === "expiring" && (
                  <p className="text-xs text-amber-500">
                    Licence expires soon
                  </p>
                )}
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
