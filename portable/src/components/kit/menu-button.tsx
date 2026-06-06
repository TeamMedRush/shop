import { MouseEventHandler } from "preact";

import * as iconoir from "@attaditya/iconoir-preact/regular";
import { useClasses } from "@styles";

interface MenuButtonProps {
  icon: keyof typeof iconoir;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function MenuButton({ icon, disabled, onClick }: MenuButtonProps) {
  const IconComponent = iconoir[icon] || (() => null);

  return (<>
    <button
      onClick={onClick}
      disabled={disabled}
      className={useClasses("menu-button")}
    >
      <IconComponent />
    </button>
  </>);
}

