import { ComponentChildren } from "preact";

interface ContainerProps {
  className?: string;
  attributes?: {[key: string]: string};
  children: ComponentChildren;
}

export function Container({
  className = "",
  attributes = {},
  children,
}: ContainerProps) {
  const stylePasser: {[key: string]: string} = {};

  for (const key in attributes) {
    const attrValue = attributes[key];
    const variableKey = `--${key}`;
    stylePasser[variableKey] = attrValue;
  }

  return (
    <div
      className={className}
      style={stylePasser}
      {...attributes}
    >
      {children}
    </div>
  );
}

