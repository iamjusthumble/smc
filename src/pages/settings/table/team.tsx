import { BsQuestionCircle } from "react-icons/bs";
import picture from "../../../assets/images/male.jpeg";
import Avatar from "../../../components/core/avatar";

const Table = ({ members }: any) => {
  console.log(members);

  return (
    <div className="border rounded-xl shadow-md p-4">
      <table className="table-auto w-full">
        <thead className="border-b-[0.5px] text-left text-black font-quicksand font-[700] text-[0.813rem] leading-5 tracking-wider">
          <tr className="">
            <th className="lg:px-2 lg:py-3 lg:text-md text-xs font-bold lg:font-medium px-1 py-2">
              <input type="checkbox" name="" id="" />
            </th>
            <th className="lg:px-2 text-gray-400 lg:py-3 lg:text-md text-xs font-bold lg:font-medium px-1 py-2">
              Name
            </th>
            <th className="flex items-center gap-x-1 text-gray-400 lg:px-2 lg:py-3 lg:text-md text-xs font-medium lg:font-medium px-1 py-2">
              Role
              <BsQuestionCircle className="text-gray-400 font-bold" />
            </th>
            <th className="lg:px-2 lg:py-3 lg:text-md text-xs font-bold lg:font-medium px-1 py-2"></th>
            <th className="lg:px-2 lg:py-3 lg:text-md text-xs font-bold lg:font-medium px-1 py-2"></th>
          </tr>
        </thead>
        <tbody className="">
          {members?.map((item: any, index: number) => (
            <tr
              className="border-t-[0.5px] text-left text-black-2 font-manrope font-[400] text-[0.813rem] leading-5 tracking-wider bg-white"
              key={item._id}
            >
              <td className="lg:px-2 lg:py-[10px] px-1 py-[4px] text-xs lg:text-md">
                <input type="checkbox" name="" id="" />
              </td>
              <td className="flex gap-x-3 items-center lg:px-2 lg:py-[10px] px-1 py-[4px] text-xs lg:text-md">
                <Avatar
                  src={item?.profilePicture}
                  disabled={true}
                  size="sm"
                  alt={
                    [
                      item?.fullName?.split(" ")[0]?.split("")[0] || "",
                      item?.fullName?.split(" ")[1]?.split("")[0] || "",
                    ]
                      .join(" ")
                      .trim() || "N A"
                  }
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-dark">
                    {item.fullName}
                  </span>
                  <span className="text-xs font-light text-gray-500">
                    {item.email}
                  </span>
                </div>
              </td>
              <td className=" lg:px-2 lg:py-[10px] px-1 py-[4px] text-xs lg:text-md">
                {item?.role?.code || "N/A"}
              </td>
              <td className=" lg:px-2 lg:py-[10px] px-1 py-[4px] text-xs lg:text-md">
                <button
                  type="button"
                  className="text-gray-500 text-xs font-semibold"
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="text-primary text-xs font-semibold"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
