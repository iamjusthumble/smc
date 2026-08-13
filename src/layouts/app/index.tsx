import { Navigate, Outlet } from "react-location";
import Navbar from "../../components/navigation/navbar";
import { currentTokenVar, currentUserVar } from "../../apollo/cache/auth";
import { useReactiveVar } from "@apollo/client";

export default function Layout() {
  const currentToken = useReactiveVar(currentTokenVar);
  const currentUser = useReactiveVar(currentUserVar);

  if (!currentToken || !currentUser) {
    return (
      <Navigate
        to={"/signin"}
        // search={{ redirect: location.current.href }}
        replace
      />
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 overflow-y-auto bg-bg_light">
        <Outlet />
      </main>
    </div>
  );
}
