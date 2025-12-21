export const getDiscussionType = (text: string, pattern: string) => {
  if (!pattern) return [];
  const regex = new RegExp(pattern, "g");
  return text.match(regex)?.filter((el) => el) || [];
};
