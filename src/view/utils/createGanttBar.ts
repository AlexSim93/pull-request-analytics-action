type Bar = {
  name: string;
  type?: string;
  state?: string;
  start: number;
  end: number;
};

type Section = {
  name: string;
  bars: Bar[];
};

export const createGanttBar = ({
  title,
  sections,
}: {
  title: string;
  sections: Section[];
}) => {
  return `
\`\`\`mermaid
gantt
title ${title}
dateFormat X
axisFormat %s
${sections
  .map((section) => {
    return `section ${section.name}
                ${section.bars
                  .map(
                    (bar) =>
                      `${bar.name}(${bar.end}) :${bar.type ? `${bar.type},` : ""} ${
                        bar.state ? `${bar.state},` : ""
                      } ${bar.start}, ${bar.end}`
                  )
                  .join("\n")}
        `;
  })
  .join("\n")}
\`\`\`
    `;
};
