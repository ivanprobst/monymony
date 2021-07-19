// Libs
import { TableCell } from "@material-ui/core";

export default function GridCell({
  value,
  type,
}: {
  value: number;
  type: string;
}) {
  const cellStyle: { [key: string]: string } = {};

  if (value === 0) {
    cellStyle.color = "#aaa";
  }

  if (type === "total") {
    cellStyle.background = "#C1D2D9";
  } else if (type === "profit") {
    cellStyle.background = value < 0 ? "#D98680" : "#D3D9A7";
  }

  return (
    <TableCell align="right" style={cellStyle}>
      {value.toLocaleString("en")}
    </TableCell>
  );
}
