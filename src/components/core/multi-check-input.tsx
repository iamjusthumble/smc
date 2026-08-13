import { FC } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import _ from "lodash";
import lodash from "lodash";
import { classNames } from "../../utils";

interface MultiCheckInputProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
  values: any;
  setFieldValue: any;
  handleBlur: any;
  errors?: any;
  touched?: any;
  itemsPerRow?: number;
}

const MultiCheckInput: FC<MultiCheckInputProps> = ({
  id,
  options,
  values,
  setFieldValue,
  label,
  errors,
  touched,
  required,
  itemsPerRow = 4,
}) => {
  return (
    <>
      <label htmlFor={id} className="block text-sm  font-manrope">
        {label} {required ? <span className="text-red-500">*</span> : ""}
      </label>
      <div className="mt-1 relative">
        <fieldset>
          <legend className="sr-only">{label}</legend>
          <div
            className={classNames(
              itemsPerRow === 3 ? "grid-cols-3" : "",
              itemsPerRow === 4 ? "grid-cols-4" : "",
              itemsPerRow === 5 ? "grid-cols-5" : "",
              "grid gap-x-6 overflow-wrap"
            )}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className="relative flex items-center h-[38px]"
              >
                <div className="flex h-5 items-center">
                  <input
                    id={id}
                    aria-describedby={`${option.value}-description`}
                    name={id}
                    type="checkbox"
                    onChange={(e) =>
                      setFieldValue(
                        id,
                        _.get(values, id)?.includes(option.value)
                          ? lodash.reject(
                              _.get(values, id),
                              (val) => val === option.value
                            )
                          : lodash.uniq([..._.get(values, id), e.target.value])
                      )
                    }
                    value={option.value}
                    checked={_.get(values, id)?.includes(option.value)}
                    className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500 rounded"
                  />
                </div>
                <div className="ml-3 text-sm space-x-3">
                  <label
                    htmlFor={option.value}
                    className="font-medium text-gray-700 whitespace-nowrap"
                  >
                    {option.label}
                  </label>
                  {option.description && (
                    <span
                      id={`${option.value}-description`}
                      className="text-gray-500 font-light"
                    >
                      {option.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
      {_.get(errors, id) && _.get(touched, id) ? (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {_.get(errors, id)}
        </p>
      ) : null}
    </>
  );
};

export default MultiCheckInput;
