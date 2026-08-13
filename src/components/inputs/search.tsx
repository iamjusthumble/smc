/* eslint-disable @typescript-eslint/no-explicit-any */
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils";

interface Props {
  label?: any;
  value?: any;
  setValue?: any;
  placeholder?: any;
  colspan?: any;
  required?: any;
  disabled?: any;
  handleSearchChange: any;
}

// Tailwind's scanner needs literal class names, so `col-span-${n}` can't be
// built dynamically — map the supported spans explicitly instead.
const COL_SPAN_CLASSES: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
};

const Search = ({
  label,
  value,
  setValue,
  placeholder = "Search",
  colspan,
  required,
  handleSearchChange,
  disabled,
}: Props) => {
  return (
    <div className={COL_SPAN_CLASSES[colspan] ?? COL_SPAN_CLASSES[1]}>
      {label && (
        <label
          htmlFor="search"
          className="block pb-1.5 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-700">*</span>}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
        </div>
        <input
          data-testid="table-component-search"
          id="search"
          type="search"
          name="search"
          value={value}
          onChange={handleSearchChange}
          required={required}
          disabled={disabled}
          className={classNames(
            disabled ? "cursor-not-allowed bg-gray-50 text-gray-500" : "bg-white",
            "block h-10 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          )}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default Search;
