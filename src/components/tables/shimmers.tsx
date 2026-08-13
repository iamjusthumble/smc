import lodash from "lodash";

const SingleShimmer = () => (
  <div
    role="div"
    className="flex h-10 w-full min-w-[120px] flex-col justify-center space-y-2"
  >
    <div className="h-3 w-full animate-pulse rounded-md bg-gray-200" />
  </div>
);

const DoubleShimmer = () => (
  <div className="flex h-10 w-full min-w-[120px] flex-col justify-center space-y-2">
    <div className="h-3 w-full animate-pulse rounded-md bg-gray-200" />
    <div className="h-3 w-2/3 animate-pulse rounded-md bg-gray-100" />
  </div>
);

const AvatarShimmer = () => (
  <div className="flex h-10 items-center space-x-3">
    <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
    <div className="flex-1 space-y-2 min-w-[120px]">
      <div className="h-3 w-full animate-pulse rounded-md bg-gray-200" />
      <div className="h-3 w-2/3 animate-pulse rounded-md bg-gray-100" />
    </div>
  </div>
);

const ActionsShimmer = ({ actionsCount }: { actionsCount: number }) => (
  <div className="flex h-10 items-center space-x-1">
    {lodash.times(actionsCount, (idx) => (
      <div
        key={idx}
        className="h-6 w-6 animate-pulse rounded-full odd:bg-gray-200 even:bg-gray-100"
      />
    ))}
  </div>
);

const Shimmers = {
  SingleShimmer,
  DoubleShimmer,
  AvatarShimmer,
  ActionsShimmer,
};
export default Shimmers;
export { SingleShimmer, DoubleShimmer, AvatarShimmer, ActionsShimmer };
