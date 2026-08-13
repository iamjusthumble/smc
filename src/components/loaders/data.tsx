import * as React from "react";
import { PuffLoader as RingLoader } from "react-spinners";

const DataLoader = () => {
  return (
    <React.Fragment>
      <div
        style={{
          height: "50vh",
          width: "70vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
        className={"font-light"}
      >
        <RingLoader size={60} color={"#f11f1f"} />
      </div>
    </React.Fragment>
  );
};

export default DataLoader;
