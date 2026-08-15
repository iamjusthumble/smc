import React from "react";
import dayjs from "dayjs";
import { FaLocationDot } from "react-icons/fa6";
import { RiRecordCircleFill } from "react-icons/ri";
import { TripAvailabilityMap, TripWithRelations } from "./types";
import { Action } from "../../buttons/action-button";
import { classNames } from "../../../utils";

const STATUS_BADGE_CLASSES: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

type ListTripsProps = {
  data: TripWithRelations;
  availability: TripAvailabilityMap;
  dispatchAction: (
    id: string,
    action: Exclude<Action, "expand" | "goto" | "clone">
  ) => () => void;
  handleStart: (id: string, label: string) => () => void;
};

function TripBody({ data, availability, dispatchAction, handleStart }: ListTripsProps) {
  const avail = availability[data.id];
  const routeLabel = data.route
    ? [data.route.origin, data.route.destination]
    : ["Unassigned", "Unassigned"];

  const occupancyText = () => {
    if (!data.bus || !avail?.total_seats) return "—";
    const ratio = avail.seats_taken / avail.total_seats;
    return { text: `${avail.seats_taken} / ${avail.total_seats}`, ratio };
  };
  const occupancy = occupancyText();

  return (
    <>
      <div className="w-full h-40 min-w-[70rem] mx-3 md:mx-0 relative rounded-xl mb-7 shadow-md  border border-slate-200">
        <div className="flex justify-around">
          <div
            style={{ flex: "1" }}
            className="flex flex-col justify-center items-start px-8"
          >
            <h3 className="text-red-500 text-xl pl-1 font-manrope">
              {dayjs(data.departure_time).format("ddd")}
            </h3>
            <h1 className="text-red-400 font-medium text-5xl font-manrope">
              {dayjs(data.departure_time).format("D")}
            </h1>
          </div>
          <div style={{ flex: "3" }} className="flex gap-x-6 items-center py-7">
            <div className="h-24 w-[0.7px] bg-gray-500" />
            <div className="flex flex-col items-center">
              <RiRecordCircleFill className="text-gray-500" />
              <div className="h-8 border-r-2 border-dashed border-gray-500 " />
              <FaLocationDot className="text-gray-500" />
            </div>
            <div className="flex flex-col gap-y-5 justify-center">
              <h4 className="text-gray-500 font-medium">{routeLabel[0]}</h4>
              <h4 className="text-gray-500 font-medium">{routeLabel[1]}</h4>
            </div>
          </div>
          <div style={{ flex: "2" }} className="flex flex-col gap-y-2 justify-center">
            <div className="h-24 w-[0.7px] bg-gray-500 -ml-6" />
            <h4 className="text-gray-500 font-medium text-sm">
              Bus: {data.bus?.vehicle_number ?? "Unassigned"}
            </h4>
            <h4 className="text-gray-500 font-medium text-sm">
              Driver: {data.driver?.full_name ?? "Unassigned"}
            </h4>
          </div>
          <div style={{ flex: "2" }} className="flex flex-col gap-y-1 justify-center">
            <div className="h-24 w-[0.7px] bg-gray-500 -ml-6" />
            <h4 className="text-gray-500 font-medium text-sm">
              {dayjs(data.departure_time).format("h:mm A")}
              {data.arrival_time
                ? ` - ${dayjs(data.arrival_time).format("h:mm A")}`
                : ""}
            </h4>
            <span
              className={classNames(
                STATUS_BADGE_CLASSES[data.status] ?? "bg-gray-200 text-gray-800",
                "inline-flex w-fit rounded-full px-2 py-1 text-xs items-center"
              )}
            >
              {data.status.replace("_", " ")}
            </span>
          </div>
          <div style={{ flex: "2" }} className="flex flex-col gap-y-2 justify-center">
            <div className="h-24 w-[0.7px] bg-gray-500 -ml-6" />
            <h4 className="text-gray-500 font-medium text-sm">GHS {data.fare}</h4>
            <h4
              className={classNames(
                typeof occupancy === "string"
                  ? "text-gray-500"
                  : occupancy.ratio >= 1
                  ? "text-red-600"
                  : occupancy.ratio >= 0.9
                  ? "text-amber-600"
                  : "text-gray-500",
                "font-medium text-sm"
              )}
            >
              {typeof occupancy === "string" ? occupancy : occupancy.text}
            </h4>
          </div>
          <div style={{ flex: "1" }} className="flex flex-col justify-center">
            <button
              onClick={dispatchAction(data.id, "view")}
              className="hover:text-white text-primary hover:bg-primary mx-4 py-1.5 rounded-lg text-sm"
            >
              View
            </button>
            <button
              onClick={dispatchAction(data.id, "update")}
              className="hover:text-white text-primary hover:bg-primary mx-4 py-1.5 rounded-lg text-sm"
            >
              Edit
            </button>
            {data.status === "scheduled" && (
              <button
                onClick={handleStart(data.id, "Trip started")}
                className="hover:text-white text-primary hover:bg-primary mx-4 py-1.5 rounded-lg text-sm"
              >
                Start
              </button>
            )}
            {data.status === "in_progress" && (
              <button
                onClick={dispatchAction(data.id, "complete")}
                className="hover:text-white text-primary hover:bg-primary mx-4 py-1.5 rounded-lg text-sm"
              >
                Complete
              </button>
            )}
            {(data.status === "scheduled" || data.status === "in_progress") && (
              <button
                onClick={dispatchAction(data.id, "cancel")}
                className="hover:text-white text-primary hover:bg-primary mx-4 py-1.5 rounded-lg text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TripBody;
