import * as React from "react";
import { PuffLoader as RingLoader } from "react-spinners";

const DataLoader = () => {
  return (
    <React.Fragment>
      <div className={"w-full h-screen flex justify-center items-center"}>
        <RingLoader size={40} color={"#f11f1f"} />
      </div>
    </React.Fragment>
  );
};

export default DataLoader;
