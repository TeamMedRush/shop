import { ComponentChildren } from "preact";

import { useClasses } from "@styles";

interface ScrollPopProps {
  className?: string;
  children: ComponentChildren;
}

export function ScrollPop({
  className = "",
  children,
}: ScrollPopProps) {
  return (
    <div className={useClasses("scrollpop") + " " + className}>
      {children}
    </div>
  );
}

