import { useAsset } from "@assets";
import { Link } from "@components/ui/interactive/link";
import { Container } from "@components/ui/structure/container";
import { Image } from "@components/ui/structure/image";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

export function MenuBrand() {
  return (
    <Link url="/" anchor>
      <Container className={useClasses("menu-brand-container")}>
        <Image
          alt="MedRush Logo"
          src={useAsset("logo.png")}
          className={useClasses("menu-brand-image")}
          />

        <Text className={useClasses("menu-brand")}>
          MedRush
        </Text>
      </Container>
    </Link>
  );
}

