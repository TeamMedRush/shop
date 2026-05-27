import { useClasses } from "@styles";

interface NodeBGProps {
  rows: number;
  cols: number;
}

export function NodeBG({ rows, cols }: NodeBGProps) {
  return (
    <div
      className={useClasses("node-bg")}
      data-rows={rows}
      data-cols={cols}
    >
      {[...Array(rows * cols)].map((_, i) => <div
        key={i}
        className={useClasses("node-bg-node")}
      />)}
    </div>
  );
}

