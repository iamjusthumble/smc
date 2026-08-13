import { FC } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import _ from "lodash";
import { classNames } from "../../utils";

interface TextInputProps {
  id: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: "number" | "text" | "email" | "date" | "password";
  values: any;
  handleChange: any;
  handleBlur: any;
  errors?: any;
  touched?: any;
  step?: number;
  min?: number | string;
  max?: number | string;
  labelHidden?: boolean;
  maxLength?: number;
  minLength?: number;
  preText?: string;
  postText?: string;
}

const TextInput: FC<TextInputProps> = ({
  id,
  type,
  step,
  values,
  handleChange,
  handleBlur,
  placeholder,
  label,
  errors,
  touched,
  required,
  maxLength,
  minLength,
  disabled,
  min,
  max,
  labelHidden,
  postText,
  preText,
}) => {
  return (
    <>
      {!labelHidden && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} {required ? "*" : ""}
        </label>
      )}
      <div className={classNames(labelHidden ? "" : "mt-1.5", "relative flex")}>
        {preText && (
          <div className="pointer-events-none flex items-center whitespace-nowrap rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3">
            <span className="text-sm text-gray-500" id="price-currency">
              {preText}
            </span>
          </div>
        )}
        <input
          type={type ?? "text"}
          name={id}
          id={id}
          value={_.get(values, id)}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder ?? ""}
          step={step}
          min={min}
          max={max}
          maxLength={maxLength}
          minLength={minLength}
          style={{
            paddingRight: (postText?.length || 0) * 9,
          }}
          className={classNames(
            _.get(errors, id) && _.get(touched, id)
              ? "border-red-400 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-primary focus:ring-primary",
            disabled ? "cursor-not-allowed bg-gray-50 text-gray-500" : "bg-white",
            "block h-10 w-full rounded-md border px-3 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-1",
            preText ? "rounded-l-none" : ""
          )}
        />
        {_.get(errors, id) && _.get(touched, id) ? (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        ) : null}
        {postText && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              {postText}
            </span>
          </div>
        )}
      </div>
      {_.get(errors, id) && _.get(touched, id) ? (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {_.get(errors, id)}
        </p>
      ) : null}
    </>
  );
};

export default TextInput;
