import { SearchRegular } from "@attaditya/iconoir-preact";
import { Section } from "@components/kit/section";
import { Button } from "@components/ui/interactive/button";
import { Input } from "@components/ui/interactive/input";
import { Container } from "@components/ui/structure/container";
import { useClasses } from "@styles";

export function Navbar() {
  const categories = [
    "Daily Use",
    "First Aid",
    "Skin Care",
    "Supplements",
    "Ayurvedic",
  ]

  return (
    <nav className={useClasses("navbar")}>
      <Section className={useClasses("navbar-container")}>
        <Container className={useClasses("navbar-search")}>
          <Input
            containerClassName={useClasses("navbar-search-container")}
            placeholder="Search medicines..."
            leftChildren={<SearchRegular />}
          />

          <Button>
            Search
          </Button>
        </Container>

        <Container className={useClasses("navbar-categories")}>
          {categories.map((category) => (
            <Button key={category}>
              {category}
            </Button>
          ))}
        </Container>
      </Section>
    </nav>
  )
}

