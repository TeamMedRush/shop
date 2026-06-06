import { useAsset } from "src/assets/assets";

import { Socials } from "@components/block/socials";
import { Container } from "@components/ui/structure/container";
import { Image } from "@components/ui/structure/image";
import { LimitWidth } from "@components/ui/structure/limit-width";
import { NodeBG } from "@components/ui/structure/node-bg";
import { Heading } from "@components/ui/text/heading";
import { LineBreak } from "@components/ui/text/line-break";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

export function Hero() {
  return (
    <LimitWidth>
      <Container className={useClasses("hero")}>
        <Container className={useClasses("hero-background")}>
          <NodeBG rows={0} cols={0} />
        </Container>

        <Image
          alt="MedRush Logo"
          src={useAsset("logo.png")}
          className={useClasses("hero-image")}
        />

        <Container className={useClasses("hero-content")}>
          <Container className={useClasses("hero-brand")}>
            <Heading size="max">
              MedRush
            </Heading>

            <Heading size="medium" className={useClasses("hero-subtitle")}>
              <Container>
                You take the meds,
              </Container>

              <Container>
                We'll get them to you!
              </Container>
            </Heading>
          </Container>
        </Container>
      </Container>
    </LimitWidth>
  );
}

