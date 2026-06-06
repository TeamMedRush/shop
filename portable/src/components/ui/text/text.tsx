import { ComponentChildren } from 'preact';

import { useClasses } from '@styles';

interface TextProps {
  className?: string;
  children: string | ComponentChildren;
}

export function Text({ className, children }: TextProps) {
  return <span className={useClasses("text") + " " + className}>
    {children}
  </span>;
}

