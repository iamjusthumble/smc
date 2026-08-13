import { makeVar } from "@apollo/client";
import Cookies from "js-cookie";
import config from "../../config";
import Permissions from "../data/permissions";

export const UserPermissions = Permissions.map(({ value }) => value);
export type UserPermission = (typeof UserPermissions)[number];

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  profilePicture: string;
  password: string;
  position: string;
  altEmail: string;
  bio: string;
  jobTitle: string;
  busCompany: {
    _id: string;
    name: string;
    mobileNumber: string;
    email: string;
    companyDocuments: string;
    contactPersonName: string;
    contactPersonPhone: string;
    contactPersonEmail: string;
    contactPersonPosition: string;
    socials: [
      {
        name: string;
        link: string;
      }
    ];
    tagline: string;
    logo: string;
    address: {
      country: string;
      state: string;
      city: string;
      street: string;
    };
    status?: "ACTIVE" | "INACTIVE";
    requestStatus?: "APPROVED" | "REJECTED" | "PENDING";
    note: string;
  };
  isEmailVerified: boolean;
  role: {
    _id: string;
    code: string;
    name: string;
    description: string;
    permissions: UserPermission[];
  };
  meta: {
    lastLoginAt: Date;
  };
}

export const isLoggedInVar = makeVar<boolean>(!!Cookies.get(`subs:auth:token`));
export const currentTokenVar = makeVar<string | null>(
  Cookies.get(`application:auth:token`) || null
);
export const currentUserVar = makeVar<IUser>(
  JSON.parse(Cookies.get(`application:auth:user`) ?? "{}") ?? null
);
export const currentPushTokenVar = makeVar<string | null>(
  Cookies.get(`application:auth:push-token`) || null
);

export const setAuth = ({ user, token }: { user: IUser; token: string }) => {
  currentUserVar(user);
  Cookies.set(`application:auth:user`, JSON.stringify(user), {
    ...config.cookies,
    expires: 1,
  });
  isLoggedInVar(true);
  currentTokenVar(token);
  Cookies.set(`application:auth:token`, token, {
    ...config.cookies,
    expires: 1,
  });
};

export const setMe = (user: IUser) => {
  currentUserVar(user);
  Cookies.set(`application:auth:user`, JSON.stringify(user), {
    ...config.cookies,
    expires: 1,
  });
};

export const setPushToken = (token: any) => {
  currentPushTokenVar(token);
  Cookies.set(`application:auth:push-token`, token, { ...config.cookies });
};

export const clearAuth = () => {
  isLoggedInVar(false);
  currentTokenVar(null);
  // TODO: handle extra checks for better user experience
  Object.keys(Cookies.get()).forEach((key) => {
    Cookies.remove(key, { ...config.cookies });
  });
};
