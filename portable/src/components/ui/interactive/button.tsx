import { ComponentChildren } from "preact";

import { useClasses } from "@styles";

interface ButtonProps {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children?: ComponentChildren;
}

export function Button({
  className = "",
  disabled = false,
  onClick = () => {},
  children,
}: ButtonProps) {
  return (
    <button
      className={useClasses("button") + " " + className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

