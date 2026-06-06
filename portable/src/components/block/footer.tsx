import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { useClasses } from "@styles";

interface FooterProps {}

export function Footer({}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={useClasses("footer")}>
      <Container className={useClasses("footer-content")}>
        <Heading size="max">
          MedRush
        </Heading>

        <Heading size="small">
          © {year} Team MedRush
        </Heading>
      </Container>
    </footer>
  );
};

