export const createReferences = (links: { title: string; link: string }[]) => {
  return `
## References
${links.map((link) => `- [${link.title}](${link.link})`).join("\n")}
  `;
};
