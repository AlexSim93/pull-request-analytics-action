export const getDiscussionType = (text: string) => {
  const regex = /\[\[(.*?)\]\]/g;
  return (
    text
      .match(regex)
      ?.map((el) => el.replace(/[\[\]]/g, ""))
      .filter((el) => el) || []
  );
};
