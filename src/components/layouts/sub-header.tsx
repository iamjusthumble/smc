import _ from "lodash";
import { FC } from "react";

interface HeaderProps {
  renderActions?: FC;
  title: string;
}

const SubHeader: FC<HeaderProps> = ({ renderActions, title }) => {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900">
          {title}
        </h1>
        {_.isFunction(renderActions) && (
          <div className="flex flex-shrink-0 items-center space-x-3">
            {renderActions({})}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubHeader;
