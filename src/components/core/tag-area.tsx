import { useState, useRef, FC, useMemo } from "react";
import _ from "lodash";
import wrapClick from "../../utils/wrap-click";
import { classNames, wrapOnchange } from "../../utils";

interface TagAreaProps {
  id: string;
  label: string;
  rows?: number;
  placeholder?: string;
  values: any;
  handleChange: any;
  handleBlur: any;
  setFieldValue: any;
  errors?: any;
  touched?: any;
  required?: boolean;
  labelHidden?: boolean;
}

const TagArea: FC<TagAreaProps> = ({
  id,
  values,
  setFieldValue,
  rows,
  touched,
  errors,
  handleBlur,
  required,
  labelHidden,
  label,
}) => {
  const tags = useMemo<string[]>(() => _.get(values, id), [values, id]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [currentTag, setCurrentTag] = useState<string>();

  const __setCurrentTag = (value: string) => {
    if (/^[A-Za-z]+$/.test(value)) {
      setCurrentTag(value);
    }
  };

  const removeTag = (idx: number) => () => {
    const _copy = [...tags];
    _copy.splice(idx, 1);
    setFieldValue(id, _copy);
  };

  const onKeyDown = (e: any) => {
    const val = e.target.value;
    if ((e.key === "," || e.key === " ") && val) {
      setFieldValue(id, [...tags, val]);
      // inputRef.current.value = null;
      setCurrentTag("");
    } else if (e.key === "Backspace" && !val) {
      removeTag(tags.length - 1)();
    }
  };

  const handlePaste = (e: any) => {
    e.preventDefault();
    const value = e.clipboardData.getData("Text");
    const newItems = value
      .split("\r\n")
      .join(",")
      .split("\r")
      .join(",")
      .split("\n")
      .join(",")
      .split(" ")
      .join(",")
      .split(",");
    setFieldValue(
      id,
      _.chain([...tags, ...newItems])
        .uniq()
        .map<string>(_.trim)
        .filter((item) => item.length > 0)
        .filter((item) => /^[A-Za-z]+$/.test(item))
        .sort()
        .value()
    );
    setCurrentTag("");
    e.stopPropagation();
  };

  const onKeyUp = (e: any) => {
    if (e.key === "," || e.key === " ") {
      // inputRef.current?.value = null;
      setCurrentTag("");
    }
  };

  return (
    <>
      {!labelHidden && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label} <span className="text-red-600">{required ? "*" : ""}</span>
        </label>
      )}
      <div
        onClick={wrapClick(() => inputRef.current?.focus())}
        className={classNames(
          labelHidden ? "" : "mt-1",
          _.get(errors, id) && _.get(touched, id)
            ? "focus-within:ring-red-500 focus-within:border-red-500 border-red-600"
            : "focus-within:ring-primary-500 focus-within:border-primary-500 border-gray-300",
          "appearance-none group w-full border flex-wrap space-x-1 shadow-sm sm:text-sm focus-within:ring-1 rounded-md max-h-20 min-h-[1rem] overflow-y-auto"
        )}
      >
        {tags.map((tag, key) => (
          <span
            key={key}
            className="inline-flex m-1 h-[28px] rounded-md items-center py-0.5 pl-2.5 pr-1 sm:text-sm bg-primary-100 text-gray-700"
          >
            {tag}
            <button
              onClick={wrapClick(removeTag(key))}
              type="button"
              className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:outline-none focus:bg-primary-500 focus:text-white"
            >
              <span className="sr-only">Remove {tag}</span>
              <svg
                className="h-2 w-2"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 8 8"
              >
                <path
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  d="M1 1l6 6m0-6L1 7"
                />
              </svg>
            </button>
          </span>
        ))}
        <input
          name={id}
          id={id}
          value={currentTag}
          onChange={wrapOnchange(__setCurrentTag)}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          ref={inputRef}
          onPaste={handlePaste}
          placeholder={tags.length > 0 ? "#add more" : "#serial number"}
          onBlur={handleBlur}
          required={required}
          className="outline-none w-full m-1 h-9 py-auto px-1 ring-0 border-0 placeholder:font-light placeholder:text-xs appearance-none border-transparent"
        />
      </div>
      {_.get(errors, id) && _.get(touched, id) ? (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {errors[id]}
        </p>
      ) : null}
    </>
  );
};

export default TagArea;
