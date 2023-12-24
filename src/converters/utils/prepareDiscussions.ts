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
            agreed:
              (collection[userLogin][key].discussionsTypes![type]?.conducted
                ?.agreed || 0) + (discussion.reactions?.["+1"] ? 1 : 0),
            disagreed:
              (collection[userLogin][key].discussionsTypes![type]?.conducted
                ?.disagreed || 0) + (discussion.reactions?.["-1"] ? 1 : 0),
          },
        };
        collection[pullRequestLogin][key].discussionsTypes![type] = {
          ...(collection[pullRequestLogin][key].discussionsTypes![type] || {}),
          received: {
            total:
              (collection[pullRequestLogin][key].discussionsTypes![type]
                ?.received?.total || 0) + 1,
            agreed:
              (collection[userLogin][key].discussionsTypes![type]?.received
                ?.agreed || 0) + (discussion.reactions?.["+1"] ? 1 : 0),
            disagreed:
              (collection[userLogin][key].discussionsTypes![type]?.received
                ?.disagreed || 0) + (discussion.reactions?.["-1"] ? 1 : 0),
          },
        };
        collection.total[key].discussionsTypes![type] = {
          ...(collection.total[key].discussionsTypes![type] || {}),
          conducted: {
            total:
              (collection.total[key].discussionsTypes![type]?.conducted
                ?.total || 0) + 1,
            agreed:
              (collection.total[key].discussionsTypes![type]?.conducted
                ?.agreed || 0) + (discussion.reactions?.["+1"] ? 1 : 0),
            disagreed:
              (collection.total[key].discussionsTypes![type]?.conducted
                ?.disagreed || 0) + (discussion.reactions?.["-1"] ? 1 : 0),
          },
          received: {
            total:
              (collection.total[key].discussionsTypes![type]?.received?.total ||
                0) + 1,
            agreed:
              (collection.total[key].discussionsTypes![type]?.received
                ?.agreed || 0) + (discussion.reactions?.["+1"] ? 1 : 0),
            disagreed:
              (collection.total[key].discussionsTypes![type]?.received
                ?.disagreed || 0) + (discussion.reactions?.["-1"] ? 1 : 0),
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
      collection[userLogin][key].discussions = {
        ...collection[userLogin][key].discussions,
        conducted: {
          total:
            (collection[userLogin][key].discussions?.conducted?.total || 0) + 1,
          agreed:
            (collection[userLogin][key].discussions?.conducted?.agreed || 0) +
            (discussion.reactions?.["+1"] ? 1 : 0),
          disagreed:
            (collection[userLogin][key].discussions?.conducted?.disagreed ||
              0) + (discussion.reactions?.["-1"] ? 1 : 0),
        },
      };
      collection.total[key].discussions = {
        ...collection.total[key].discussions,
        conducted: {
          total: (collection.total[key].discussions?.conducted?.total || 0) + 1,
          agreed:
            (collection.total[key].discussions?.conducted?.agreed || 0) +
            (discussion.reactions?.["+1"] ? 1 : 0),
          disagreed:
            (collection.total[key].discussions?.conducted?.disagreed || 0) +
            (discussion.reactions?.["-1"] ? 1 : 0),
        },
      };
    });

    if (pullRequestLogin) {
      const agreedDiscussions = discussions?.filter(
        (discussion) => discussion.reactions?.["+1"]
      );
      const disagreedDiscussions = discussions?.filter(
        (discussion) => discussion.reactions?.["-1"]
      );

      collection[pullRequestLogin][key].discussions = {
        ...collection[pullRequestLogin][key].discussions,
        received: {
          total:
            (collection[pullRequestLogin][key].discussions?.received?.total ||
              0) + (discussions?.length || 0),
          agreed:
            (collection[pullRequestLogin][key].discussions?.received?.agreed ||
              0) + (agreedDiscussions?.length || 0),
          disagreed:
            (collection[pullRequestLogin][key].discussions?.received
              ?.disagreed || 0) + (disagreedDiscussions?.length || 0),
        },
      };
      collection.total[key].discussions = {
        ...collection.total[key].discussions,
        received: {
          total:
            (collection.total[key].discussions?.received?.total || 0) +
            (discussions?.length || 0),
          agreed:
            (collection.total[key].discussions?.received?.agreed || 0) +
            (agreedDiscussions?.length || 0),
          disagreed:
            (collection.total[key].discussions?.received?.disagreed || 0) +
            (disagreedDiscussions?.length || 0),
        },
      };
    }
  });
};
