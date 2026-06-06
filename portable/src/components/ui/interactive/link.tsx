import { ComponentChildren } from "preact";

import { Clickable } from "@components/ui/interactive/clickable";

interface LinkProps {
  url: string;
  className?: string;
  newTab?: boolean;
  anchor?: boolean;
  children: ComponentChildren;
}

export function Link({
  url,
  className,
  newTab = false,
  anchor = true,
  children,
}: LinkProps) {
  return (
    <Clickable
      anchor={anchor ? { url, newTab } : undefined}
      className={className}

      onClick={() => {
        if (newTab) {
          window.open(url, "_blank");
        } else {
          window.location.href = url;
        }
      }}
    >
      {children}
    </Clickable>
  );
}

