import { Link } from "react-location";
import Bar from "../dashboard-graph/bar";

import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { currentUserVar } from "../../apollo/cache/auth";
import StatCard from "../../components/core/stat-card";
import Avatar from "../../components/core/avatar";
import {
  BanknotesIcon,
  TruckIcon,
  UserGroupIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

const GET_DASHBOARD_STAT = gql`
  query GetDashboardStats($getDashboardStatsId: ID) {
    getDashboardStats(id: $getDashboardStatsId) {
      totalCommission
      busCount
      driverCount
      bookingCount
    }
  }
`;

const barData = [
  {
    month: "Jan",
    Jan: 18,
    color: "#2465C2",
  },
  {
    month: "Feb",
    Feb: 8,
    color: "#2465C2",
  },
  {
    month: "Mar",
    Mar: 28,
    color: "#2465C2",
  },
  {
    month: "Apr",
    Apr: 16,
    color: "#2465C2",
  },
  {
    month: "May",
    May: 40,
    color: "#2465C2",
  },
  {
    month: "Jun",
    Jun: 9,
    color: "#2465C2",
  },
  {
    month: "July",
    Jul: 5,
    color: "#2465C2",
  },
  {
    month: "Aug",
    Aug: 22,
    color: "#2465C2",
  },
  {
    month: "Sep",
    Sep: 10,
    color: "#2465C2",
  },
  {
    month: "Oct",
    Oct: 14,
    color: "#2465C2",
  },
  {
    month: "Nov",
    Nov: 19,
    color: "#2465C2",
  },
  {
    month: "Dec",
    Dec: 18,
    color: "#2465C2",
  },
];

const fakeDriverDetails = [
  { name: "Emmanuel Dodoo", bus: "GM -3232-20" },
  { name: "Demi Wikinson", bus: "GM -3232-20" },
  { name: "Demi Wikinson", bus: "GM -3232-20" },
  { name: "Clifford Opoku", bus: "GM -3232-20" },
  { name: "Demi Wikinson", bus: "GM -3232-20" },
  { name: "Isaac Anane", bus: "GM -3232-20" },
  { name: "Demi Wikinson", bus: "GM -3232-20" },
  { name: "Demi Wikinson", bus: "GM -3232-20" },
  { name: "Demi Wikinson", bus: "GM -3232-20" },
  { name: "Demi Wikinson", bus: "GM -3232-20" },
  { name: "Demi Wikinson", bus: "GM -3232-20" },
  { name: "Demi Wikinson", bus: "GM -3232-20" },
  { name: "Demi Wikinson", bus: "GM -3232-20" },
  { name: "Rafiq Mohammed", bus: "GM -3232-20" },
];

const currencyFormatter = new Intl.NumberFormat("en-GH", {
  style: "currency",
  currency: "GHS",
  maximumFractionDigits: 0,
});

function Dashboard() {
  const currentUser = useReactiveVar(currentUserVar);
  const firstName = currentUser?.fullName?.split(" ")[0] || "there";

  const { data, loading } = useQuery(GET_DASHBOARD_STAT, {
    variables: {
      getDashboardStatsId: currentUser?._id,
    },
  });

  const stats = data?.getDashboardStats?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Efficiently manage your buses, drivers, bookings, and trips all in
          one place.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Commission"
          icon={BanknotesIcon}
          loading={loading}
          value={
            stats ? currencyFormatter.format(stats.totalCommission || 0) : 0
          }
        />
        <StatCard
          label="Number of Buses"
          icon={TruckIcon}
          loading={loading}
          value={stats?.busCount ?? 0}
        />
        <StatCard
          label="Drivers"
          icon={UserGroupIcon}
          loading={loading}
          value={stats?.driverCount ?? 0}
        />
        <StatCard
          label="Bookings"
          icon={TicketIcon}
          loading={loading}
          value={stats?.bookingCount ?? 0}
        />
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-card">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Bookings</h2>
          <p className="text-sm text-gray-500">
            Monthly booking volume over the past year
          </p>
        </div>
        <div className="h-72 px-2 py-4 sm:px-6">
          <Bar
            data={barData}
            keys={[
              {
                accessor: "postpaid",
                label: "Post-paid",
                color: "#4f46e5",
                bgColor: "bg-indigo-600",
              },
              {
                accessor: "prepaid",
                label: "Prepaid",
                color: "#c026d3",
                bgColor: "bg-fuchsia-600",
              },
            ]}
            fromDate={new Date().toISOString() as string}
            toDate={new Date().toISOString() as string}
            xLabel="Dates"
            yLabel="Count"
          />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Drivers</h2>
          <Link
            to="/drivers"
            className="text-sm font-medium text-primary hover:text-primary-600"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-x-8 px-6 py-2 sm:grid-cols-2">
          <div className="divide-y divide-gray-100">
            {fakeDriverDetails.slice(0, 7).map((item, index) => (
              <div key={index} className="flex items-center gap-x-3 py-3">
                <Avatar alt={item.name} size="xs" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">Bus: {item.bus}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="divide-y divide-gray-100 sm:border-l sm:border-gray-100 sm:pl-8">
            {fakeDriverDetails.slice(7, 14).map((item, index) => (
              <div key={index} className="flex items-center gap-x-3 py-3">
                <Avatar alt={item.name} size="xs" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">Bus: {item.bus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
