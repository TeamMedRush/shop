import { useClasses } from "@styles";

interface LineBreakProps {}

export function LineBreak({}: LineBreakProps) {
  return (
    <div className={useClasses("line-break")} />
  );
}

