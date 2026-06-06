import * as iconoir from "@attaditya/iconoir-preact/regular";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

interface EducationCardProps {
  icon: keyof typeof iconoir;
  title: string;
  degree: string;
  grade: string;
}

export function EducationCard({
  icon,
  title,
  degree,
  grade,
}: EducationCardProps) {
  const IconComponent = iconoir[icon];

  return (
    <Container className={useClasses("education-card")}>
      <Container className={useClasses("education-card-icon-container")}>
        <IconComponent className={useClasses("education-card-icon")} />
      </Container>

      <Container className={useClasses("education-card-content")}>
        <Heading
          className={useClasses("education-card-title")}
          size="small"
        >
          {title}
        </Heading>

        <Text className={useClasses("education-card-degree")}>
          {degree}
        </Text>

        <Text className={useClasses("education-card-grade")}>
          {grade}
        </Text>
      </Container>

      <Container
        className={useClasses("education-card-separator")}
        children={null}
      />
    </Container>
  );
}

