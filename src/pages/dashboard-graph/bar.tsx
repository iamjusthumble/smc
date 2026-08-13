import { ResponsiveBar } from "@nivo/bar";
import lodash from "lodash";
import { FC } from "react";

const MyResponsiveBar: FC<{
  data: any;
  fromDate: string;
  toDate: string;
  xLabel?: string;
  yLabel?: string;
  keys?: any[];
  indexBy?: string;
}> = ({ data, fromDate, toDate, xLabel, yLabel, indexBy, keys }) => (
  <ResponsiveBar
    data={data}
    keys={[
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]}
    indexBy="month"
    enableLabel={false}
    borderRadius={0}
    margin={{ top: 20, bottom: 50, left: 50 }}
    padding={0.3}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band", round: true }}
    colors={{ datum: "data.color" }}
    borderColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "month",
      legendPosition: "middle",
      legendOffset: 32,
      truncateTickAt: 0,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Bookings",
      legendPosition: "middle",
      legendOffset: -40,
      truncateTickAt: 0,
    }}
  />
);

export default MyResponsiveBar;
