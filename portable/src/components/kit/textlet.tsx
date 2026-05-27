import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";
import * as iconoir from "@attaditya/iconoir-preact/regular";

interface TextletProps {
  icon: keyof typeof iconoir;
  title: string;
  description?: string;
}

export function Textlet({ icon, title, description }: TextletProps) {
  const IconComponent = iconoir[icon];

  return (
    <Container className={useClasses("textlet")}>
      <Container>
        <IconComponent className={useClasses("textlet-icon")} />
      </Container>

      <Container className={useClasses("textlet-content")}>
        <Container className={useClasses("textlet-title")}>
          <Heading size="medium">
            {title}
          </Heading>
        </Container>

        {description && <Text>
          {description}
        </Text>}
      </Container>
    </Container>
  );
}

