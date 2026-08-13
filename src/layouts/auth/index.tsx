import { useReactiveVar } from "@apollo/client";
import { FC } from "react";
import { useSearch, MakeGenerics, Navigate, Outlet } from "react-location";
import { currentTokenVar } from "../../apollo/cache/auth";
import bgImg from "../../assets/images/signin.jpg";

export type AuthLocationGenerics = MakeGenerics<{
  Search: {
    redirect?: string;
  };
}>;

const AuthLayout: FC = () => {
  const search = useSearch<AuthLocationGenerics>();
  const currentToken = useReactiveVar(currentTokenVar);

  if (currentToken) {
    // check if theres a token
    // if yes hit server to reauthenticate and redirect to app
    return <Navigate to={search?.redirect ?? "/"} replace />;
  }
  return (
    <div className="flex justify-between min-h-full  flex-1">
      <div
        style={{ flex: "3" }}
        className="flex flex-1 flex-col justify-around px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
      >
        <Outlet />
        <div className="mt-16 lg:mt-0">
          <p className="font-manrope text-gray-500 text-sm text-center">
            All rights reserved, {new Date().getFullYear()}. Powered by
            <a target="_blank" href="https://adjuma.io" rel="noreferrer">
              {" "}
              Molidom
            </a>
          </p>
        </div>
      </div>
      <div
        style={{ flex: "3" }}
        className="relative hidden w-0  lg:block lg:h-screen"
      >
        <img
          className="absolute inset-0 h-full w-full object-cover "
          src={bgImg}
          alt="signin"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
