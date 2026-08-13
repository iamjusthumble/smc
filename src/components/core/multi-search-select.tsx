import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/solid";
import _ from "lodash";
import { FC, useMemo, useState } from "react";
import { classNames } from "../../utils";

interface Option {
  label: {
    title: string;
    imageUrl?: string;
  };
  value: string | object;
}

interface SearchSelectInputProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  labelHidden?: boolean;
  values: any;
  errors?: any;
  touched?: any;
  options: Option[];
  optionsLoading?: boolean;
  setFieldValue: any;
  position?: "top" | "bottom";
  className?: string;
}

const MultiSearchSelectInput: FC<SearchSelectInputProps> = ({
  id,
  options: __options,
  values,
  setFieldValue,
  placeholder,
  label,
  errors,
  touched,
  required,
  labelHidden,
  disabled,
  position = "bottom",
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const options = useMemo(
    () =>
      __options.map(({ label, value }) => ({
        label,
        value: _.isObject(value) ? _.omit(value, "__typename") : value,
      })),
    [__options]
  );

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) => {
          return option.label.title.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      disabled={disabled}
      multiple={true}
      value={_.get(values, id, null)}
      onChange={(val) => setFieldValue(id, val)}
    >
      {!labelHidden && (
        <Combobox.Label className="block text-sm font-manrope">
          {label} <span className="text-red-600">{required ? "*" : ""}</span>
        </Combobox.Label>
      )}
      <div className={classNames(labelHidden ? "" : "mt-1", "relative")}>
        <Combobox.Input
          className={classNames(
            disabled ? "cursor-not-allowed bg-gray-100" : "bg-white",
            "w-full rounded-md border border-gray-300 py-2.5 pl-3 pr-10 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm placeholder:font-light placeholder:text-xs",
            className
          )}
          placeholder={placeholder}
          autoComplete="none"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(option: any) =>
            options.find((o) => _.isEqual(o.value, option))?.label?.title ?? ""
          }
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredOptions.length > 0 && (
          <Combobox.Options
            className={classNames(
              position === "top" ? "mb-1 bottom-10" : "mt-1",
              "absolute z-10 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            )}
          >
            {position === "bottom" && (
              <Combobox.Option
                value={""}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9 font-light",
                    active ? "bg-primary-600 text-white" : "text-gray-500"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <span className={""}>Select One</span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-primary-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            )}
            {filteredOptions.map((option) => (
              <Combobox.Option
                key={JSON.stringify(option.value)}
                value={option.value}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-primary-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      {option.label.imageUrl && (
                        <img
                          src={option.label.imageUrl}
                          alt=""
                          className="h-6 w-6 flex-shrink-0 rounded-full object-cover"
                        />
                      )}
                      <span
                        className={classNames(
                          option.label.imageUrl ? "ml-3" : "",
                          "truncate",
                          selected ? "font-semibold" : ""
                        )}
                      >
                        {option.label.title}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-primary-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
            {position === "top" && (
              <Combobox.Option
                value={""}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9 font-light",
                    active ? "bg-primary-600 text-white" : "text-gray-500"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <span className={""}>Select One</span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-primary-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            )}
          </Combobox.Options>
        )}
      </div>
      {_.get(errors, id) && _.get(touched, id) ? (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {JSON.stringify(_.get(errors, id))}
        </p>
      ) : null}
    </Combobox>
  );
};

export default MultiSearchSelectInput;
