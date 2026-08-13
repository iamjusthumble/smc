import { FC } from "react";
import _ from "lodash";
import { classNames } from "../../utils";
import wrapImage from "../../utils/wrap-image";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  disabled?: boolean;
}

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "h-8 w-8 text-xs",
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-20 w-20 text-xl",
  xl: "h-28 w-28 text-2xl",
  "2xl": "h-36 w-36 text-3xl",
};

const Avatar: FC<AvatarProps> = ({ src, alt, size = "sm", disabled }) => {
  const hasImage = !!src && src.length > 1;

  if (hasImage) {
    const image = (
      <img
        className={classNames(
          sizeClasses[size],
          "rounded-full object-cover z-0"
        )}
        src={src}
        alt={alt}
      />
    );
    return disabled ? image : wrapImage(image);
  }

  const initials = _.chain(alt)
    .split(" ")
    .slice(0, 2)
    .map((s) => s.charAt(0))
    .join("")
    .upperCase()
    .value();

  return (
    <div
      className={classNames(
        sizeClasses[size],
        "flex flex-shrink-0 items-center justify-center rounded-full bg-primary font-medium text-white"
      )}
    >
      {initials}
    </div>
  );
};

export default Avatar;
