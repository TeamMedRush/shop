import { ComponentChildren } from "preact";

import { Container } from "@components/ui/structure/container";
import { LimitWidth } from "@components/ui/structure/limit-width";
import { useClasses } from "@styles";

interface SectionProps {
  className?: string;
  children: ComponentChildren;
}

export function Section({
  className = "",
  children,
}: SectionProps) {
  return (
    <Container className={useClasses("section")}>
      <LimitWidth className={className + " " + useClasses("section-content")}>
        {children}
      </LimitWidth>
    </Container>
  );
}

