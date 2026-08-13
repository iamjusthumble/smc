import { FC, ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils";

type HeroIcon = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & RefAttributes<SVGSVGElement>
>;

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: HeroIcon;
  trend?: {
    direction: "increase" | "decrease";
    value: string;
  };
  loading?: boolean;
}

const StatCard: FC<StatCardProps> = ({ label, value, icon: Icon, trend, loading }) => {
  return (
    <div className="flex-1 rounded-xl border border-gray-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {Icon && (
          <span className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-x-2">
        <p className="text-2xl font-semibold tracking-tight text-gray-900">
          {loading ? (
            <span className="inline-block h-7 w-16 animate-pulse rounded-md bg-gray-200" />
          ) : (
            value
          )}
        </p>
        {trend && !loading && (
          <span
            className={classNames(
              trend.direction === "increase"
                ? "text-emerald-700 bg-emerald-50"
                : "text-red-700 bg-red-50",
              "inline-flex items-center gap-x-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium"
            )}
          >
            {trend.direction === "increase" ? (
              <ArrowUpIcon className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ArrowDownIcon className="h-3 w-3" aria-hidden="true" />
            )}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
