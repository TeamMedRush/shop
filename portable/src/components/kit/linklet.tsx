import { Link } from "@components/ui/interactive/link";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";
import { ArrowUpRightRegular, LinkRegular } from "@attaditya/iconoir-preact";
import * as iconoir from "@attaditya/iconoir-preact/regular";

interface LinkletProps {
  icon?: keyof typeof iconoir;
  title: string;
  url: string;
  newTab?: boolean;
}

export function Linklet({
  icon,
  title,
  url,
  newTab = true,
}: LinkletProps) {
  const IconComponent = icon ? iconoir[icon] : () => null;
  const RefIcon = newTab ? ArrowUpRightRegular : LinkRegular;

  return (
    <Link url={url} newTab={newTab}>
      <Container className={useClasses("linklet")}>
        <Container className={useClasses("linklet-icon-container")}>
          <IconComponent className={useClasses("linklet-icon")} />
        </Container>

        <Container className={useClasses("linklet-ref")}>
          <RefIcon className={useClasses("linklet-ref-icon")} />
        </Container>

        <Container className={useClasses("linklet-content")}>
          <Heading size="medium">
            {title}
          </Heading>

          {newTab && <Text className={useClasses("linklet-url")}>
            {url}
          </Text>}
        </Container>

        <Container className={useClasses("linklet-hover")}>
          <RefIcon className={useClasses("linklet-hover-icon")} />

          <Text className={useClasses("linklet-hover-url")}>
            {url}
          </Text>
        </Container>
      </Container>
    </Link>
  );
}

