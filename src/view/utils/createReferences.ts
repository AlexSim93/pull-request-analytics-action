export const createReferences = (links: { title: string; link: string }[]) => {
  if (links.length === 0) return "";
  return `
## References
${links.map((link) => `- [${link.title}](${link.link})`).join("\n")}
  `;
};
