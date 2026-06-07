import { MouseEventHandler } from "preact";

import * as iconoir from "@attaditya/iconoir-preact/regular";
import { useClasses } from "@styles";

interface MenuButtonProps {
  icon: keyof typeof iconoir;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  badge?: number;
}

export function MenuButton({
  icon,
  disabled,
  onClick,
  badge,
}: MenuButtonProps & { badge?: number }) {
  const IconComponent = iconoir[icon] || (() => null);

  return (<>
    <button
      onClick={onClick}
      disabled={disabled}
      className={useClasses("menu-button")}
    >
      <IconComponent />

      {(badge !== undefined) && (badge > 0) && (
        <span className={useClasses("menu-button-badge")}>
          {badge}
        </span>
      )}
    </button>
  </>);
}

