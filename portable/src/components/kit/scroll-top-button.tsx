import { useCallback, useEffect, useState } from "preact/hooks";

import { MenuButton } from "@components/kit/menu-button";

export function ScrollTopButton() {
  const [canScroll, setCanScroll] = useState(false);

  const scrollToTop = useCallback(() => {
    const topElement = document.getElementById("top");
    topElement?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const topElement = document.getElementById("top");
    let scrollableParent = topElement?.parentElement;

    while (scrollableParent) {
      const scrollHeight = scrollableParent.scrollHeight;
      const clientHeight = scrollableParent.clientHeight;

      if (scrollHeight > clientHeight)
        break;

      scrollableParent = scrollableParent.parentElement;
    }

    const handleScroll = () => {
      setCanScroll(!!scrollableParent?.scrollTop);
    };

    handleScroll();

    scrollableParent?.addEventListener(
      "scroll", handleScroll
    );

    return () => {
      scrollableParent?.removeEventListener(
        "scroll", handleScroll
      );
    };
  }, []);

  return (
    <MenuButton
      icon="ArrowUpRegular"
      onClick={scrollToTop}
      disabled={!canScroll}
    />
  );
}

