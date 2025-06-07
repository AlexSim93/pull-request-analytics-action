export const createXYChart = ({
  title,
  xAxis,
  yAxis,
  lines,
}: {
  title: string;
  xAxis: string[];
  yAxis: { min: number; max: number; title: string };
  lines: { color: string; name: string; values: number[] }[];
}) => {
  if (!lines.length) return "";
  return `
${lines.map((line) => `\`${line.color}\`${line.name}`).join(",")}
\`\`\`mermaid
---
config:
    xyChart:
        width: 900
        height: 600
    themeVariables:
        xyChart:
            titleColor: "black"
            plotColorPalette: "${lines
              .map((line) => line.color || "#000000")
              .join(", ")}"
---
xychart-beta
    title "${title}"
    x-axis [${xAxis.map((name) => `"${name}"`).join(", ")}]
    y-axis "${yAxis.title}" ${yAxis.min} --> ${yAxis.max}
    ${lines.map((line) => `line [${line.values.join(", ")}]`).join("\n")}
\`\`\``;
};
