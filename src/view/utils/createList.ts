type Item = {
  link: string;
  text: string;
};

export const createList = (title: string, items: Item[]) => {
  return `
### ${title}
${items
  .map((item, index) => `${index + 1}. [${item.text}](${item.link})`)
  .join("\n")}
    `;
};
