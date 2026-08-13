import { FC, Fragment, useRef, PropsWithChildren } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Loader from "./loader";
import { classNames } from "../../utils";
import wrapClick from "../../utils/wrap-click";

interface ModalProps {
  title: string;
  description?: string | JSX.Element;
  descriptionType?: string;
  open: boolean;
  setOpen: (val: boolean) => void;
  renderActions?: () => JSX.Element;
  hideActions?: boolean;
  hideDefaultAction?: boolean;
  hidePadding?: boolean;
  size?: "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  loading?: boolean;
}

const sizeMap = {
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

const Modal: FC<PropsWithChildren<ModalProps>> = ({
  open,
  setOpen,
  children,
  renderActions,
  title,
  descriptionType,
  description,
  hideActions,
  hideDefaultAction,
  hidePadding,
  size = "3xl",
  loading,
}) => {
  // const theme = useReactiveVar(currentConfigVar);

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClose={() => {}}
      >
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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  sizeMap[size],
                  "relative w-full transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-dropdown transition-all"
                )}
              >
                <button
                  type="button"
                  className="absolute right-4 top-4 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="flex flex-col">
                  <div className="flex flex-shrink-0 flex-col items-start border-b border-gray-200 px-6 py-4 text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    {descriptionType === "string" ? (
                      description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {description}
                        </p>
                      )
                    ) : (
                      <>{description}</>
                    )}
                  </div>
                  <div
                    className={classNames(
                      hideActions || hidePadding
                        ? "overflow-hidden"
                        : "min-h-[50vh] overflow-y-auto p-6",
                      loading ? "min-h-[50vh]" : "",
                      "flex w-full max-h-[75vh] flex-1 flex-col"
                    )}
                  >
                    {loading ? <Loader /> : children}
                  </div>
                </div>
                {!hideActions && !loading && (
                  <div className="flex flex-row-reverse gap-x-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                    {renderActions?.()}
                    {!hideDefaultAction && (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        onClick={wrapClick(() => setOpen(false))}
                        ref={cancelButtonRef}
                      >
                        Close
                      </button>
                    )}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
