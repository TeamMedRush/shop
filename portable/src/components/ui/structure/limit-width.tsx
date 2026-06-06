import { ComponentChildren } from "preact";

import { useClasses } from "@styles";

interface LimitWidthProps {
  className?: string;
  children: ComponentChildren;
}

export function LimitWidth({ className, children }: LimitWidthProps) {
  return <div className={useClasses("limit-width")}>
    <div className={className}>
      {children}
    </div>
  </div>
}

