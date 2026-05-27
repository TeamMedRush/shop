import { useClasses } from "@styles";
import { ComponentChildren } from "preact";

interface ScrollPopProps {
  className?: string;
  children: ComponentChildren;
}

export function ScrollPop({ className, children }: ScrollPopProps) {
  return (
    <div className={useClasses("scrollpop") + " " + className}>
      {children}
    </div>
  );
}

