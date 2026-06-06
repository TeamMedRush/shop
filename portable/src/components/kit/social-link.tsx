import * as iconoir from "@attaditya/iconoir-preact/regular";
import { ArrowUpRightRegular, LinkRegular } from "@attaditya/iconoir-preact";
import { Link } from "@components/ui/interactive/link";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

interface SocialLinkProps {
  icon?: keyof typeof iconoir;
  title: string;
  url: string;
  newTab?: boolean;
}

export function SocialLink({
  icon,
  title,
  url,
  newTab = true,
}: SocialLinkProps) {
  const IconComponent = icon ? iconoir[icon] : () => null;
  const RefIcon = newTab ? ArrowUpRightRegular : LinkRegular;

  return (
    <Link url={url} newTab={newTab}>
      <Container className={useClasses("social-link")}>
        <Container className={useClasses("social-link-icon-container")}>
          <IconComponent className={useClasses("social-link-icon")} />
        </Container>

        <Container className={useClasses("social-link-hover")}>
          <RefIcon className={useClasses("social-link-hover-icon")} />
        </Container>
      </Container>
    </Link>
  );
}

