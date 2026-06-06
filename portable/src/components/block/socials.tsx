import { SocialLink } from "@components/kit/social-link";
import { Container } from "@components/ui/structure/container";
import { SOCIALS } from "@registry/socials";
import { useClasses } from "@styles";

export function Socials() {
  const socials = SOCIALS;

  return (
    <Container className={useClasses("socials-linklets")}>
      {socials.map((social, index) => (
        <SocialLink
          key={index}
          icon={social.icon as any}
          title={social.title}
          url={social.url}
        />
      ))}
    </Container>
  );
}

