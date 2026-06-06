import * as iconoir from "@attaditya/iconoir-preact/regular";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

interface InfoletProps {
  icon: keyof typeof iconoir;
  title: string;
  description: string;
}

export function Infolet({ icon, title, description }: InfoletProps) {
  const IconComponent = iconoir[icon];

  return (
    <Container className={useClasses("infolet")}>
      <Container className={useClasses("infolet-icon-container")}>
        <IconComponent className={useClasses("infolet-icon")} />
      </Container>

      <Container className={useClasses("infolet-content")}>
        <Heading size="medium">
          {title}
        </Heading>

        <Text>
          {description}
        </Text>
      </Container>
    </Container>
  );
}

