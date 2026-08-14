import { Navigate, Outlet, useLocation } from "react-location";
import Navbar from "../../components/navigation/navbar";
import { CenterLoader } from "../../components/loaders";
import { useAuth } from "../../context/auth-context";

export default function Layout() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <CenterLoader />;
  }

  if (!session) {
    return (
      <Navigate
        to={"/signin"}
        search={{ redirect: location.current.pathname }}
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
