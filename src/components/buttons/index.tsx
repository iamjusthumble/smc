import { BeatLoader } from "react-spinners";

export interface ButtonPropType {
  label: string;
  loading?: boolean;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: any;
  colspan?: number;
}

const Button = ({
  label,
  loading,
  className,
  onClick,
  colspan,
}: ButtonPropType) => {
  return (
    <div className="">
      <button
        data-testid={label.toLowerCase().replace(/[^A-Z0-9]+/gi, "_")}
        onClick={onClick}
        type={onClick ? "button" : "submit"}
        className={`${
          className
            ? className
            : "flex w-full items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        } disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-white`}
      >
        {loading ? (
          <>
            <div className={` flex justify-center items-center text-blue-800`}>
              <BeatLoader size={6} color={"#fff"} />
            </div>
          </>
        ) : (
          <>
            {/* <span className="self-center">{icon && icon}</span> */}
            <span className="self-center">{label}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Button;
