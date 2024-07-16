import { makeComplexRequest } from "../../requests";
import { invalidUserLogin } from "../constants";
import { Collection } from "../types";
import { getDiscussionType } from "./getDiscussionType";

export const prepareDiscussions = (
  comments: Awaited<ReturnType<typeof makeComplexRequest>>["comments"],
  collection: Record<string, Record<string, Collection>>,
  index: number,
  dateKey: string,
  pullRequestLogin: string,
  teams: Record<string, string[]>
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
      [
        userLogin,
        pullRequestLogin,
        "total",
        ...(teams[userLogin] || []),
        ...(teams[pullRequestLogin] || []),
      ].forEach((checkingKey) => {
        if (collection[checkingKey][key].discussionsTypes === undefined) {
          collection[checkingKey][key].discussionsTypes = {};
        }
      });
      getDiscussionType(discussion.body).forEach((type) => {
        [userLogin, ...(teams[userLogin] || [])].forEach((userKey) => {
          collection[userKey][key].discussionsTypes![type] = {
            ...(collection[userKey][key].discussionsTypes![type] || {}),
            conducted: {
              total:
                (collection[userKey][key].discussionsTypes![type]?.conducted
                  ?.total || 0) + 1,
              agreed:
                (collection[userKey][key].discussionsTypes![type]?.conducted
                  ?.agreed || 0) + (discussion.reactions?.["+1"] ? 1 : 0),
              disagreed:
                (collection[userKey][key].discussionsTypes![type]?.conducted
                  ?.disagreed || 0) + (discussion.reactions?.["-1"] ? 1 : 0),
            },
          };
        });

        [pullRequestLogin, ...(teams[pullRequestLogin] || [])].forEach(
          (userKey) => {
            collection[userKey][key].discussionsTypes![type] = {
              ...(collection[userKey][key].discussionsTypes![type] || {}),
              received: {
                total:
                  (collection[userKey][key].discussionsTypes![type]?.received
                    ?.total || 0) + 1,
                agreed:
                  (collection[userKey][key].discussionsTypes![type]?.received
                    ?.agreed || 0) + (discussion.reactions?.["+1"] ? 1 : 0),
                disagreed:
                  (collection[userKey][key].discussionsTypes![type]?.received
                    ?.disagreed || 0) + (discussion.reactions?.["-1"] ? 1 : 0),
              },
            };
          }
        );

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
        if (!collection[userLogin]) {
          collection[userLogin] = {};
        }
        if (!collection[userLogin][key]) {
          collection[userLogin][key] = {};
        }
        [userLogin, "total", ...(teams[userLogin] || [])].forEach((userKey) => {
          collection[userKey][key].commentsConducted =
            (collection[userKey][key].commentsConducted || 0) + 1;
        });
      }
    });

    if (pullRequestLogin) {
      [pullRequestLogin, "total", ...(teams[pullRequestLogin] || [])].forEach(
        (userKey) => {
          collection[userKey][key]["reviewComments"] =
            (reviewComments?.length || 0) +
            (collection[userKey][key].reviewComments || 0);
        }
      );
    }

    discussions?.forEach((discussion) => {
      const userLogin = discussion.user?.login || invalidUserLogin;
      [userLogin, "total", ...(teams[userLogin] || [])].forEach((userKey) => {
        collection[userKey][key].discussions = {
          ...collection[userKey][key].discussions,
          conducted: {
            total:
              (collection[userKey][key].discussions?.conducted?.total || 0) + 1,
            agreed:
              (collection[userKey][key].discussions?.conducted?.agreed || 0) +
              (discussion.reactions?.["+1"] ? 1 : 0),
            disagreed:
              (collection[userKey][key].discussions?.conducted?.disagreed ||
                0) + (discussion.reactions?.["-1"] ? 1 : 0),
          },
        };
      });
    });

    if (pullRequestLogin) {
      const agreedDiscussions = discussions?.filter(
        (discussion) => discussion.reactions?.["+1"]
      );
      const disagreedDiscussions = discussions?.filter(
        (discussion) => discussion.reactions?.["-1"]
      );

      [pullRequestLogin, "total", ...(teams[pullRequestLogin] || [])].forEach(
        (userKey) => {
          collection[userKey][key].discussions = {
            ...collection[userKey][key].discussions,
            received: {
              total:
                (collection[userKey][key].discussions?.received?.total || 0) +
                (discussions?.length || 0),
              agreed:
                (collection[userKey][key].discussions?.received?.agreed || 0) +
                (agreedDiscussions?.length || 0),
              disagreed:
                (collection[userKey][key].discussions?.received?.disagreed ||
                  0) + (disagreedDiscussions?.length || 0),
            },
          };
        }
      );
    }
  });
};
