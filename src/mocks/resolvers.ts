import {
  FAKE_ADMIN_USER,
  FAKE_BOOKINGS,
  FAKE_BUSES,
  FAKE_DASHBOARD_STATS,
  FAKE_DRIVERS,
  FAKE_GENERIC_USER,
  FAKE_LOCATIONS,
  FAKE_TEAM,
  FAKE_TOKEN,
  FAKE_TRIPS,
  genId,
} from "./fixtures";

type Resolver = (variables: any) => any;

const paginate = <T,>(rows: T[], variables: any) => {
  const skip = variables?.pagination?.skip ?? 0;
  const limit = variables?.pagination?.limit ?? rows.length;
  return { rows: rows.slice(skip, skip + limit), count: rows.length };
};

const findById = <T extends { _id: string }>(
  rows: T[],
  id: string | undefined
): T => rows.find((row) => row._id === id) ?? rows[0];

const resolvers: Record<string, Resolver> = {
  // Auth / session
  LoginAdmin: () => ({
    loginAdmin: { user: FAKE_ADMIN_USER, token: FAKE_TOKEN },
  }),
  MeAdmin: () => ({ meAdmin: FAKE_ADMIN_USER }),
  UpdateAdmin: () => ({ updateAdmin: { _id: FAKE_ADMIN_USER._id } }),
  UpdateAdminPassword: () => ({ updateAdminPassword: true }),

  // Forgot password flow
  FindUserByEmail: (variables) => ({
    findUserByEmail: {
      user: {
        _id: FAKE_ADMIN_USER._id,
        email: variables?.input?.email || FAKE_ADMIN_USER.email,
      },
      status: "success",
    },
  }),
  VerifyCode: () => ({ verifyCode: { status: "success", token: FAKE_TOKEN } }),
  ResetPasswordAfterVerification: () => ({
    resetPasswordAfterVerification: {
      status: "success",
      message: "Password reset successfully",
    },
  }),

  // Dashboard
  GetDashboardStats: () => ({ getDashboardStats: [FAKE_DASHBOARD_STATS] }),

  // Buses
  GetAllBuses: (variables) => ({ getAllBuses: paginate(FAKE_BUSES, variables) }),
  GetBus: (variables) => ({
    getBus: findById(FAKE_BUSES, variables?.filter?._id?.eq),
  }),
  CreateBus: () => ({ createBus: { _id: genId("bus") } }),

  // Drivers
  GetAllDrivers: (variables) => ({
    getAllDrivers: paginate(FAKE_DRIVERS, variables),
  }),
  GetDriver: (variables) => ({
    getDriver: findById(FAKE_DRIVERS, variables?.filter?._id?.eq),
  }),
  CreateDriver: () => ({ createDriver: { _id: genId("driver") } }),

  // Bookings
  GetAllBookings: (variables) => ({
    getAllBookings: paginate(FAKE_BOOKINGS, variables),
  }),

  // Trips
  GetAllTrips: (variables) => ({ getAllTrips: paginate(FAKE_TRIPS, variables) }),
  CreateTrip: () => ({ createTrip: { _id: genId("trip") } }),

  // Team / settings
  GetAllAdmins: (variables) => ({
    getAllAdmins: paginate(FAKE_TEAM, variables),
  }),
  AddTeamMembers: () => ({ addTeamMembers: true }),

  // Shared/generic "talent" lookups reused across buses/trips/bookings modals
  User: () => ({ user: FAKE_GENERIC_USER }),
  SuspendUser: () => ({ suspendUser: { _id: genId("user") } }),

  // Pickers
  GetAllBusNumbers: () => ({
    getAllBusNumbers: FAKE_BUSES.map(({ _id, vehicleNumber }) => ({
      _id,
      vehicleNumber,
    })),
  }),
  Locations: () => ({ getAllLocations: { locations: FAKE_LOCATIONS } }),
};

export default resolvers;
