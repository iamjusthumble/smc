import Modal from "../../components/layouts/modal";
import { useSearch, useNavigate } from "react-location";
import { LocationGenerics } from "../../router/location";
import { message } from "antd";
import { useBus } from "../../services/supabase/use-buses";
import { getDocumentUrl } from "../../services/supabase/buses";

const DocumentLink = ({ path, label }: { path?: string; label: string }) => {
  if (!path) {
    return (
      <p className=" w-60 border-gray-300 text-base font-manrope rounded-md py-2 text-gray-500">
        Not uploaded
      </p>
    );
  }
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          const url = await getDocumentUrl(path);
          window.open(url, "_blank", "noreferrer");
        } catch {
          message.error("Couldn't open document. Please try again.");
        }
      }}
      className=" w-60 text-left text-base font-manrope rounded-md py-2 text-primary hover:text-primary-600"
    >
      View {label}
    </button>
  );
};

export default function ViewRequest({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const searchParams = useSearch<LocationGenerics>();
  const navigate = useNavigate<LocationGenerics>();

  const { data: bus, isLoading } = useBus(open ? searchParams.id : undefined);

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
      title="Bus Information"
      description="Details of the bus are shown below"
    >
      {bus?.id ? (
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
                  {bus?.vehicle_number}
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
                  {bus?.make_year ?? "N/A"}
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
                  {bus?.seat_count}
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
                  {bus?.model ?? "N/A"}
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
                  {bus?.color ?? "N/A"}
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
                  {bus?.status}
                </p>
              </div>
            </div>

            <div className="h-[1px] w-full bg-gray-300"></div>

            <div className="flex flex-col gap-y-8 w-full">
              <div className="flex flex-1 flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Vehicle Insurance Document
                </label>
                <DocumentLink path={bus?.insurance_doc_path} label="insurance document" />
              </div>
              <div className="flex flex-1 flex-col gap-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-manrope"
                >
                  Road Worthy Document
                </label>
                <DocumentLink path={bus?.roadworthy_doc_path} label="roadworthy document" />
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
