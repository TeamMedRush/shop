import { ComponentChildren } from "preact";

import { useClasses } from "@styles";

interface HeadingProps {
  size: "max" | "large" | "medium" | "small";
  className?: string;
  children?: string | ComponentChildren;
}

export function Heading({
  size = "medium",
  className = "",
  children,
}: HeadingProps) {
  if (size === "max")
    return (
      <h1 className={useClasses("heading-max") + " " + className}>
        {children}
      </h1>
    );

  if (size === "large")
    return (
      <h2 className={useClasses("heading-large") + " " + className}>
        {children}
      </h2>
    );

  if (size === "small")
    return (
      <h4 className={useClasses("heading-small") + " " + className}>
        {children}
      </h4>
    );

  return (
    <h3 className={useClasses("heading-medium") + " " + className}>
      {children}
    </h3>
  );
}

