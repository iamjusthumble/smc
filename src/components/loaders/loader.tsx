import * as React from "react";
import { PuffLoader as RingLoader } from "react-spinners";

const DataLoader = () => {
  return (
    <React.Fragment>
      <RingLoader size={20} color={"#F04444"} />
    </React.Fragment>
  );
};

export default DataLoader;
