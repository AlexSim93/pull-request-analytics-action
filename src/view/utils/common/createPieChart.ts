export const createPieChart = (
  title: string,
  values: Record<string, number>
) => {
  return `
\`\`\`mermaid
pie
title ${title} 
${Object.entries(values)
  .map(([key, value]) => {
    return `"${key}(${value})":${value}`;
  })
  .join("\n")}
\`\`\`
    `;
};
