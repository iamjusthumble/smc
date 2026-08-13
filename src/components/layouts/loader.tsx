import { FC } from "react";
import { BarLoader } from "react-spinners";

const Loader: FC = () => {
  return (
    <div className="flex-1 flex flex-col space-y-6 items-center justify-center">
      <span className="text-gray-600 text-sm">Loading details...</span>
      <BarLoader
        color={"#2465C2"}
        loading={true}
        cssOverride={{ width: "30%" }}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
