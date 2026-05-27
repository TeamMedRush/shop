import { ComponentChildren } from "preact";

interface ContainerProps {
  className?: string;
  children: ComponentChildren;
}

export function Container({ className, children }: ContainerProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

