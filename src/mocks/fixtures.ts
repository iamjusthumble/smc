import { UserPermission } from "../apollo/cache/auth";

// Placeholder image host (no upload, so it's fine to hit a real CDN for avatars).
const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    seed
  )}`;
const doc = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/400`;

let idCounter = 0;
export const genId = (prefix: string) => `${prefix}-${++idCounter}`;

export const FAKE_TOKEN = "mock-session-token";

export const FAKE_BUS_COMPANY = {
  _id: "company-001",
  name: "Adjuma Transport Ltd",
  mobileNumber: "+233241000000",
  email: "info@adjumatransport.com",
  companyDocuments: doc("company-docs"),
  contactPersonName: "Kwame Asante",
  contactPersonPhone: "+233241000001",
  contactPersonEmail: "kwame.asante@adjumatransport.com",
  contactPersonPosition: "Operations Manager",
  socials: [
    { name: "Twitter", link: "https://twitter.com/adjumatransport" },
  ] as [{ name: string; link: string }],
  tagline: "Moving Ghana, one trip at a time",
  logo: avatar("adjuma-transport-logo"),
  address: {
    country: "Ghana",
    state: "Greater Accra",
    city: "Accra",
    street: "12 Liberation Road",
  },
  status: "ACTIVE" as const,
  requestStatus: "APPROVED" as const,
  note: "",
};

// Shared singleton — reused for the seeded session AND the `MeAdmin`/`LoginAdmin`
// mocks so `currentUserVar` never gets a new object reference and re-triggers
// renders/loops. Deliberately left untyped (inferred, not `: IUser`) so it can
// also carry `createdAt`/`updatedAt` — fields the real `MeAdmin`/`LoginAdmin`
// queries select but that aren't part of the `IUser` interface; Apollo's cache
// warns (console error) if a selected field is missing from the mock response.
// The inferred type is still structurally assignable wherever `IUser` is
// expected, since it's passed by reference (not a fresh literal).
const now = new Date().toISOString();

export const FAKE_ADMIN_USER = {
  _id: "admin-001",
  fullName: "Ama Mensah",
  email: "ama.mensah@adjumatransport.com",
  phone: "+233241234567",
  profilePicture: avatar("Ama Mensah"),
  password: "",
  position: "Fleet Administrator",
  altEmail: "ama.alt@adjumatransport.com",
  bio: "Managing the fleet, one bus at a time.",
  jobTitle: "Fleet Administrator",
  busCompany: FAKE_BUS_COMPANY,
  isEmailVerified: true,
  role: {
    _id: "role-001",
    code: "ADMIN",
    name: "Administrator",
    description: "Full access administrator",
    permissions: [
      "*:*",
      "dashboard-*",
      "settings-*",
      "company-*",
    ] as UserPermission[],
    createdAt: now,
    updatedAt: now,
  },
  meta: { lastLoginAt: new Date() },
  createdAt: now,
  updatedAt: now,
};

// Generic entity for the reused "User" GraphQL operation (buses/update,
// trips/update, bookings/suspend|view, trips/delete) — a superset of every
// field any of those callers read, so one object satisfies all of them.
export const FAKE_GENERIC_USER = {
  _id: "user-001",
  profilePicture: avatar("generic-user"),
  phoneNumber: "+233247654321",
  resume: doc("resume"),
  fullName: "Kofi Boateng",
  portfolio: "https://kofiboateng.dev",
  email: "kofi.boateng@example.com",
  address: "Kumasi, Ashanti Region",
};

const GHANAIAN_NAMES = [
  "Emmanuel Dodoo",
  "Ama Serwaa",
  "Kwame Owusu",
  "Efua Asante",
  "Kojo Mensah",
  "Akosua Boateng",
  "Yaw Darko",
  "Abena Frimpong",
  "Kwabena Appiah",
  "Adjoa Nkrumah",
  "Fiifi Amankwah",
  "Esi Ansah",
  "Kwesi Adjei",
  "Afia Osei",
  "Nana Yeboah",
  "Akua Gyasi",
  "Kwaku Antwi",
  "Abla Sarpong",
  "Kwadwo Agyeman",
  "Aba Kyeremeh",
];

const CITIES = [
  "Accra",
  "Kumasi",
  "Takoradi",
  "Tamale",
  "Cape Coast",
  "Ho",
  "Koforidua",
  "Sunyani",
  "Wa",
  "Bolgatanga",
];

const BUS_STATUSES = ["ACTIVE", "DECOMMISSIONED"] as const;
const BUS_MODELS = [
  "Ford Transit Van",
  "Mercedes Sprinter",
  "Toyota Hiace",
  "Nissan Civilian",
  "Isuzu NPR",
];
const BUS_COLOURS = ["Blue", "White", "Silver", "Red", "Green"];

export const FAKE_BUSES = Array.from({ length: 22 }).map((_, i) => ({
  _id: genId("bus"),
  colour: BUS_COLOURS[i % BUS_COLOURS.length],
  model: BUS_MODELS[i % BUS_MODELS.length],
  vehicleNumber: `GE-${(300 + i).toString()}-${20 + (i % 5)}`,
  yearOfMake: 2015 + (i % 9),
  status: BUS_STATUSES[i % BUS_STATUSES.length],
  numberOfSeats: [14, 18, 25, 30][i % 4],
  roadWorthy: doc(`roadworthy-${i}`),
  insurance: doc(`insurance-${i}`),
}));

const DRIVER_STATUSES = ["ACTIVE", "RETIRED"] as const;
const LICENSE_CLASSES = ["A", "B", "C", "D"];

export const FAKE_DRIVERS = Array.from({ length: 18 }).map((_, i) => {
  const name = GHANAIAN_NAMES[i % GHANAIAN_NAMES.length];
  const bus = FAKE_BUSES[i % FAKE_BUSES.length];
  return {
    _id: genId("driver"),
    fullName: name,
    email: `${name.toLowerCase().replace(" ", ".")}@adjumatransport.com`,
    mobileNumber: `+23324${(1000000 + i).toString().slice(0, 7)}`,
    profilePicture: avatar(name),
    status: DRIVER_STATUSES[i % DRIVER_STATUSES.length],
    postalAddress: `P.O.BOX ${900 + i}`,
    digitalAddress: `GE-${310 + i}-${2000 + i}`,
    licenseClass: LICENSE_CLASSES[i % LICENSE_CLASSES.length],
    license: doc(`license-${i}`),
    bus: { _id: bus._id, vehicleNumber: bus.vehicleNumber },
  };
});

export const FAKE_LOCATIONS = CITIES.map((name) => ({
  _id: genId("location"),
  name,
}));

const PAYMENT_STATUSES = ["paid", "pending", "failed", "cancelled"] as const;

export const FAKE_BOOKINGS = Array.from({ length: 16 }).map((_, i) => {
  const bus = FAKE_BUSES[i % FAKE_BUSES.length];
  const origin = FAKE_LOCATIONS[i % FAKE_LOCATIONS.length];
  const destination = FAKE_LOCATIONS[(i + 1) % FAKE_LOCATIONS.length];
  return {
    _id: genId("booking"),
    code: `BK-${(1000 + i).toString()}`,
    Trip: {
      bus: { vehicleNumber: bus.vehicleNumber },
      origin: { name: origin.name },
      destination: { name: destination.name },
    },
    User: { phone: `+23320${(1000000 + i).toString().slice(0, 7)}` },
    seatNumber: (i % 30) + 1,
    paymentStatus: PAYMENT_STATUSES[i % PAYMENT_STATUSES.length],
  };
});

const TRIP_STATUSES = ["ACTIVE", "COMPLETED", "CANCELLED"];
const TRIP_TYPES = ["One-Time", "Recurring"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
];
const DAYS_IN_WORDS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const FAKE_TRIPS = Array.from({ length: 14 }).map((_, i) => {
  const origin = FAKE_LOCATIONS[i % FAKE_LOCATIONS.length];
  const destination = FAKE_LOCATIONS[(i + 2) % FAKE_LOCATIONS.length];
  return {
    _id: genId("trip"),
    origin: { name: origin.name },
    destination: { name: destination.name },
    numberOfBusAssigned: (i % 4) + 1,
    price: (20 + i * 5).toString(),
    tripStatus: TRIP_STATUSES[i % TRIP_STATUSES.length],
    tripType: TRIP_TYPES[i % TRIP_TYPES.length],
    timeScheduled: {
      startTime: `${6 + (i % 6)}:00 AM`,
      endTime: `${12 + (i % 6)}:00 PM`,
    },
    date: {
      year: 2026,
      dayInNumber: (i % 28) + 1,
      dayInWords: DAYS_IN_WORDS[i % DAYS_IN_WORDS.length],
      month: MONTHS[i % MONTHS.length],
    },
  };
});

const TEAM_ROLES = [
  { name: "Administrator", code: "ADMIN", description: "Full access" },
  { name: "Member", code: "MEMBER", description: "Standard team member" },
];

export const FAKE_TEAM = [
  {
    _id: FAKE_ADMIN_USER._id,
    role: TEAM_ROLES[0],
    email: FAKE_ADMIN_USER.email,
    profilePicture: FAKE_ADMIN_USER.profilePicture,
    fullName: FAKE_ADMIN_USER.fullName,
  },
  ...Array.from({ length: 7 }).map((_, i) => {
    const name = GHANAIAN_NAMES[(i + 3) % GHANAIAN_NAMES.length];
    return {
      _id: genId("team-member"),
      role: TEAM_ROLES[(i + 1) % TEAM_ROLES.length],
      email: `${name.toLowerCase().replace(" ", ".")}@adjumatransport.com`,
      profilePicture: avatar(name),
      fullName: name,
    };
  }),
];

export const FAKE_DASHBOARD_STATS = {
  totalCommission: 48250,
  busCount: FAKE_BUSES.length,
  driverCount: FAKE_DRIVERS.length,
  bookingCount: FAKE_BOOKINGS.length,
};
