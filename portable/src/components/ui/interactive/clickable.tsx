import { ComponentChildren } from "preact";

import { useClasses } from "@styles";

interface ClickableProps {
  onClick: () => void;
  onEventClick?: (event: MouseEvent) => void;
  className?: string;
  children: ComponentChildren;

  anchor?: {
    url: string;
    newTab?: boolean;
  };
}

export function Clickable({
  onClick,
  onEventClick,
  className,
  children,
  anchor,
}: ClickableProps) {
  if (anchor)
    return <a
      href={anchor.url}
      className={useClasses("clickable") + " " + className}

      onClick={(event) => {
        onClick();
        onEventClick?.(event);
      }}
    >
      {children}
    </a>;

  return <span
    className={useClasses("clickable") + " " + className}

    onClick={(event) => {
      onClick();
      onEventClick?.(event);
    }}
  >
    {children}
  </span>
}

