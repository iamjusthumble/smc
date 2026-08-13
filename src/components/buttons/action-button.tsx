import { FC } from "react";
import {
  EyeIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  CalculatorIcon,
  ArrowsPointingOutIcon,
  PaperAirplaneIcon,
  CalendarDaysIcon,
  UserPlusIcon,
  UserIcon,
  UserMinusIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathRoundedSquareIcon,
  MagnifyingGlassPlusIcon,
  ArrowTopRightOnSquareIcon,
  Cog8ToothIcon,
  XCircleIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import "react-tooltip/dist/react-tooltip.css";
import wrapClick from "../../utils/wrap-click";
import { classNames } from "../../utils";

const Actions = [
  "update",
  "view",
  "delete",
  "configure",
  "calculate",
  "create",
  "assign",
  "schedule",
  "suspend",
  "send",
  "resolve",
  "approve",
  "reject",
  "reassign",
  "expand",
  "goto",
  "clone",
  "decommission",
  "investigate",
  "cancel",
  "disapprove",
] as const;
export type Action = (typeof Actions)[number];
const ActionIcons: { [key in Action]: typeof EyeIcon } = {
  approve: HandThumbUpIcon,
  disapprove: HandThumbDownIcon,
  assign: UserPlusIcon,
  calculate: CalculatorIcon,
  configure: Cog8ToothIcon,
  reassign: UserIcon,
  suspend: UserMinusIcon,
  delete: TrashIcon,
  reject: ArrowPathRoundedSquareIcon,
  resolve: ClipboardDocumentListIcon,
  schedule: CalendarDaysIcon,
  send: PaperAirplaneIcon,
  update: PencilSquareIcon,
  view: EyeIcon,
  decommission: TrashIcon,
  create: PlusIcon,
  expand: ArrowsPointingOutIcon,
  goto: ArrowTopRightOnSquareIcon,
  clone: DocumentDuplicateIcon,
  investigate: MagnifyingGlassPlusIcon,
  cancel: XCircleIcon,
};

interface ActionButtonProps {
  action: Action;
  tooltip?: string;
  color?: string;
  onClick: (...val: any) => any;
  disabled?: boolean;
}

const ActionButton: FC<ActionButtonProps> = ({
  action,
  onClick,
  color,
  disabled = false,
  tooltip,
}) => {
  const Icon = ActionIcons[action];

  return (
    <button
      data-tooltip-delay-show={1000}
      data-tooltip-id="global-tooltip"
      data-tooltip-content={tooltip || action}
      type="button"
      onClick={wrapClick(onClick)}
      disabled={disabled}
      className={classNames(
        disabled
          ? "cursor-not-allowed text-gray-300"
          : "text-gray-400 hover:bg-gray-100 hover:text-gray-700",
        "inline-flex items-center rounded-full border border-transparent p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
    >
      <Icon color={color} className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};
export default ActionButton;
