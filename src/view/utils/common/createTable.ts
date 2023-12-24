export const createTable = ({
  title,
  description,
  table,
}: {
  title: string;
  description: string;
  table: { headers: string[]; rows: string[][] };
}) => {
  return `
### ${title}
${description}
| ${table.headers.join(" | ")} |
| ${table.headers.map(() => ":------:").join(" | ")} |
${table.rows
  .map((row) => {
    return `| ${row.join(" | ")} |`;
  })
  .join("\n")}      
    `;
};
