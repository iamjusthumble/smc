import { FC } from "react";
import { upperFirst } from "lodash";
import _ from "lodash";
import { classNames } from "../../utils";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface Option {
  label: string;
  value: string | number;
}

interface SelectInputProps {
  id: string;
  label: string;
  labelHidden?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  values: any;
  handleChange: any;
  handleBlur: any;
  errors?: any;
  touched?: any;
  options: (string | Option)[];
}

const SelectInput: FC<SelectInputProps> = ({
  id,
  disabled,
  required,
  options,
  values,
  handleChange,
  handleBlur,
  placeholder,
  label,
  errors,
  touched,
  labelHidden,
}) => {
  return (
    <>
      {!labelHidden && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required ? <span className="text-red-500">*</span> : ""}
        </label>
      )}
      <div
        className={classNames(
          labelHidden ? "relative" : "relative mt-1.5"
        )}
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
          <ChevronDownIcon className="h-4 w-4 text-gray-400" />
        </div>
        <select
          name={id}
          id={id}
          value={_.get(values, id, "")}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder ?? ""}
          className={classNames(
            "text-sm",
            _.get(errors, id) && _.get(touched, id)
              ? "border-red-400 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-primary focus:ring-primary",
            disabled ? "cursor-not-allowed bg-gray-50 text-gray-500" : "bg-white",
            "block h-10 w-full appearance-none rounded-md border pl-3 pr-8 shadow-sm transition-colors focus:outline-none focus:ring-1"
          )}
        >
          {options?.map((option, idx) => (
            <option key={idx} value={(option as Option)?.value ?? option}>
              {(option as Option)?.label ?? option}
            </option>
          ))}
        </select>
      </div>
      {_.get(errors, id) && _.get(touched, id) ? (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {_.get(errors, id)}
        </p>
      ) : null}
    </>
  );
};

export default SelectInput;
