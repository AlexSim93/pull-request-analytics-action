import { makeComplexRequest } from "../../requests";
import { invalidUserLogin } from "../constants";
import { Collection } from "../types";
import { getDiscussionType } from "./getDiscussionType";

export const prepareDiscussions = (
  comments: Awaited<ReturnType<typeof makeComplexRequest>>["comments"],
  collection: Record<string, Record<string, Collection>>,
  index: number,
  dateKey: string,
  pullRequestLogin: string
) => {
  const reviewComments = comments[index]?.filter(
    (comment) => pullRequestLogin !== comment.user?.login
  );

  const discussions = comments[index]?.filter((comment) => {
    const userLogin = comment.user?.login || invalidUserLogin;
    return !comment.in_reply_to_id && pullRequestLogin !== userLogin;
  });

  ["total", dateKey].forEach((key) => {
    discussions?.forEach((discussion) => {
      const userLogin = discussion.user?.login || invalidUserLogin;
      if (collection[userLogin][key].discussionsTypes === undefined) {
        collection[userLogin][key].discussionsTypes = {};
      }
      if (collection[pullRequestLogin][key].discussionsTypes === undefined) {
        collection[pullRequestLogin][key].discussionsTypes = {};
      }
      if (collection.total[key].discussionsTypes === undefined) {
        collection.total[key].discussionsTypes = {};
      }
      getDiscussionType(discussion.body).forEach((type) => {
        collection[userLogin][key].discussionsTypes![type] = {
          ...(collection[userLogin][key].discussionsTypes![type] || {}),
          conducted: {
            total:
              (collection[userLogin][key].discussionsTypes![type]?.conducted
                ?.total || 0) + 1,
          },
        };
        collection[pullRequestLogin][key].discussionsTypes![type] = {
          ...(collection[pullRequestLogin][key].discussionsTypes![type] || {}),
          received: {
            total:
              (collection[pullRequestLogin][key].discussionsTypes![type]
                ?.received?.total || 0) + 1,
          },
        };
        collection.total[key].discussionsTypes![type] = {
          ...(collection.total[key].discussionsTypes![type] || {}),
          conducted: {
            total:
              (collection.total[key].discussionsTypes![type]?.conducted
                ?.total || 0) + 1,
          },
          received: {
            total:
              (collection.total[key].discussionsTypes![type]?.received?.total ||
                0) + 1,
          },
        };
      });
    });

    comments[index]?.forEach((comment) => {
      const userLogin = comment.user?.login || invalidUserLogin;
      if (pullRequestLogin !== userLogin) {
        collection[userLogin][key].commentsConducted =
          (collection[userLogin][key].commentsConducted || 0) + 1;
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
      const userLogin = discussion.user?.login || invalidUserLogin;
      collection[userLogin][key].discussionsConducted =
        (collection[userLogin][key].discussionsConducted || 0) + 1;
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
