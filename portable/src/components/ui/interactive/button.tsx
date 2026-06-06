import { ComponentChildren } from "preact";

import { useClasses } from "@styles";

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children?: ComponentChildren;
}

export function Button({ className, onClick, children }: ButtonProps) {
  return (
    <button
      className={useClasses("button") + " " + className}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

