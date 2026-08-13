import { FC } from "react";
import _ from "lodash";
import { classNames } from "../../utils";

interface TextAreaProps {
  id: string;
  label: string;
  rows?: number;
  placeholder?: string;
  values: any;
  handleChange: any;
  handleBlur: any;
  errors?: any;
  touched?: any;
  required?: boolean;
}

const TextArea: FC<TextAreaProps> = ({
  id,
  rows,
  values,
  handleChange,
  handleBlur,
  placeholder,
  label,
  errors,
  touched,
  required,
}) => {
  return (
    <>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required ? <span className="text-red-500">*</span> : ""}
      </label>
      <div className="mt-1">
        <textarea
          name={id}
          id={id}
          value={_.get(values, id)}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder ?? ""}
          rows={rows ?? 3}
          required={required}
          className={classNames(
            _.get(errors, id) && _.get(touched, id)
              ? "focus:ring-red-500 focus:border-red-500 border-red-600"
              : "focus:ring-primary-500 focus:border-primary-500 border-gray-300",
            "shadow-sm block w-full sm:text-sm rounded placeholder:font-light placeholder:text-xs"
          )}
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

export default TextArea;
