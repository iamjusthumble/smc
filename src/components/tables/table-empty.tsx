import { FC, ReactNode } from "react";
import { InboxIcon } from "@heroicons/react/24/outline";

interface TableEmptyComponentProps {
  title?: string;
  action?: ReactNode;
}

const TableEmptyComponent: FC<TableEmptyComponentProps> = ({
  title,
  action,
}) => {
  return (
    <div className="flex min-h-[400px] flex-1 items-center justify-center rounded-xl border border-gray-200">
      <div className="text-center">
        <InboxIcon
          className="mx-auto h-10 w-10 text-gray-300"
          aria-hidden="true"
        />
        <h3 className="mt-3 text-sm font-medium text-gray-900">
          No {title || "records"} yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          New {title || "records"} will show up here once they&apos;re added.
        </p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
};

export default TableEmptyComponent;
