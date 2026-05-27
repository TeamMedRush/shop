import { useClasses } from "@styles";
import { ComponentChildren } from "preact";

interface ClickableProps {
  onClick: () => void;
  onEventClick?: (event: MouseEvent) => void;
  className?: string;
  children: ComponentChildren;
}

export function Clickable({
  onClick,
  onEventClick,
  className,
  children,
}: ClickableProps) {
  return <span
    className={useClasses("clickable") + " " + className}
    onClick={(event) => {
      onClick();
      onEventClick?.(event);
    }}
  >
    {children}
  </span>;
}

