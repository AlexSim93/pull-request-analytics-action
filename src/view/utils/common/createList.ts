type Item = {
  link: string;
  text: string;
};

export const createList = (title: string, items: Item[]) => {
  if (items.length === 0) return "";
  return `
### ${title}
${items
  .map((item, index) => `${index + 1}. [${item.text}](${item.link})`)
  .join("\n")}
    `;
};
