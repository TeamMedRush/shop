import { useCallback } from "preact/hooks";

import * as iconoir from "@attaditya/iconoir-preact/regular";
import { Button } from "@components/ui/interactive/button";
import { Container } from "@components/ui/structure/container";
import { Heading } from "@components/ui/text/heading";
import { Text } from "@components/ui/text/text";
import { useClasses } from "@styles";

interface OpenSourceCardProps {
  icon: keyof typeof iconoir;
  title: string;
  info: string;
  mine: string;
  animation?: string;

  dist: {
    main: string;
    fork: string;
  }

  repo: {
    author: string;
    name: string;
  }

  fork: {
    author: string;
    name: string;
  }
}

export function OpenSourceCard({
  icon, title, info,
  mine, dist, repo,
  fork, animation,
}: OpenSourceCardProps) {
  const IconComponent = iconoir[icon];

  const openLink = useCallback((url: string) => {
    window.open(url, "_blank");
  }, []);

  return (
    <Container className={useClasses("open-source-card")}>
      <Container className={useClasses("open-source-card-icon")}>
        <IconComponent className={animation || ""} />
      </Container>

      <Container className={useClasses("open-source-card-content")}>
        <Container className={useClasses("open-source-card-meta")}>
          <Container className={useClasses("open-source-card-repo")}>
            <Text className={useClasses("open-source-card-repo-text")}>
              {repo.author} / {repo.name}
            </Text>
          </Container>

          <Heading
            className={useClasses("open-source-card-title")}
            size="medium"
          >
            {title}
          </Heading>

          <Container>
            <Text className={useClasses("open-source-card-info")}>
              {info}
            </Text>
          </Container>
        </Container>

        <Container className={useClasses("open-source-card-mine-container")}>
          <Text className={useClasses("open-source-card-mine")}>
            {mine}
          </Text>
        </Container>

        <Container className={useClasses("open-source-card-actions")}>
          <Button onClick={() => openLink(
            `https://github.com/${repo.author}/${repo.name}`
          )}>
            Check Original Repo
          </Button>

          <Button onClick={() => openLink(
            `https://github.com/${fork.author}/${fork.name}`
          )}>
            Check My Fork
          </Button>

          <Button onClick={() => openLink(dist.main)}>
            Try It Out
          </Button>

          <Button onClick={() => openLink(dist.fork)}>
            Try My Fork
          </Button>
        </Container>
      </Container>
    </Container>
  );
}

