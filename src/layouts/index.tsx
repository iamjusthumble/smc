import _, { last } from "lodash";
import { FC, useEffect, useState } from "react";
import { useMatches } from "react-location";
import AppLayout from "./app";
import AuthLayout from "./auth";
import _404Layout from "./_404";

const LayoutProvider: FC = () => {
  const matches = useMatches();
  const [isMobile, setIsMobile] = useState(false);

  const meta = _.last(matches)?.route?.meta;

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 760);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="font-manrope px-5">
          Honey, let&apos;s step up our game and switch to a desktop device
          for a better experience.Trust me, it&apos;ll be worth it.
        </p>
      </div>
    );
  }

  switch (meta?.layout) {
    case "App": {
      return <AppLayout />;
    }
    case "Auth": {
      return <AuthLayout />;
    }
    default: {
      return <_404Layout />;
    }
  }
};

export default LayoutProvider;
