import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";

export const prepareDiscussions = (
  comments: Awaited<ReturnType<typeof makeComplexRequest>>["comments"],
  collection: Record<string, Record<string, Collection>>,
  index: number,
  dateKey: string,
  pullRequestLogin: string | undefined
) => {
  const reviewComments = comments[index]?.filter(
    (comment) => pullRequestLogin !== comment.user.login
  );

  const discussions = comments[index]?.filter(
    (comment) =>
      !comment.in_reply_to_id && pullRequestLogin !== comment.user.login
  );

  ["total", dateKey].forEach((key) => {
    comments[index]?.forEach((comment) => {
      if (pullRequestLogin !== comment.user.login) {
        collection[comment.user.login][key].commentsConducted =
          (collection[comment.user.login][key].commentsConducted || 0) + 1;
        collection.total[key].commentsConducted =
          (collection.total[key].commentsConducted || 0) + 1;
      }
    });

    if (pullRequestLogin) {
      collection[pullRequestLogin][key]["reviewComments"] =
        (reviewComments?.length || 0) +
        (collection[pullRequestLogin][key].reviewComments || 0);
      collection.total[key]["reviewComments"] =
        (reviewComments?.length || 0) +
        (collection.total[key].reviewComments || 0);
    }

    discussions?.forEach((discussion) => {
      collection[discussion.user.login][key].discussionsConducted =
        (collection[discussion.user.login][key].discussionsConducted || 0) + 1;
      collection.total[key].discussionsConducted =
        (collection.total[key].discussionsConducted || 0) + 1;
    });
    
    if (pullRequestLogin) {
      collection[pullRequestLogin][key]["discussions"] =
        (discussions?.length || 0) +
        (collection[pullRequestLogin][key].discussions || 0);
      collection.total[key]["discussions"] =
        (discussions?.length || 0) + (collection.total[key].discussions || 0);
    }
  });
};
