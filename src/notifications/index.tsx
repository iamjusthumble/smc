import { FC, PropsWithChildren, useEffect } from "react";
import { isSupported, MessagePayload } from "firebase/messaging";
import toast from "react-hot-toast";
import Toaster from "./toaster";

const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};

export default NotificationProvider;
