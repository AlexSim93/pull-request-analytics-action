import set from "lodash/set";
import get from "lodash/get";

import { makeComplexRequest } from "../../requests";
import { invalidUserLogin } from "../constants";
import { Collection } from "../types";
import { getDiscussionType } from "./getDiscussionType";
import { checkUserInclusive } from "./calculations";

export const prepareDiscussions = (
  comments: Awaited<ReturnType<typeof makeComplexRequest>>["comments"],
  collection: Record<string, Record<string, Collection>>,
  index: number,
  dateKey: string,
  pullRequestLogin: string,
  teams: Record<string, string[]>
) => {
  const reviewComments = comments[index]?.filter(
    (comment) =>
      pullRequestLogin !== (comment.user?.login || invalidUserLogin) &&
      checkUserInclusive(comment.user?.login || invalidUserLogin)
  );

  const discussions = comments[index]?.filter((comment) => {
    const userLogin = comment.user?.login || invalidUserLogin;
    return (
      !comment.in_reply_to_id &&
      pullRequestLogin !== userLogin &&
      checkUserInclusive(userLogin)
    );
  });

  ["total", dateKey].forEach((key) => {
    discussions?.forEach((discussion) => {
      const userLogin = discussion.user?.login || invalidUserLogin;
      getDiscussionType(discussion.body).forEach((type) => {
        [userLogin, ...(teams[userLogin] || []), "total"].forEach((userKey) => {
          if (checkUserInclusive(userLogin)) {
            set(collection, [userKey, key, "discussionsTypes", type], {
              ...get(collection, [userKey, key, "discussionsTypes", type], {}),
              conducted: {
                total:
                  get(
                    collection,
                    [
                      userKey,
                      key,
                      "discussionsTypes",
                      type,
                      "conducted",
                      "total",
                    ],
                    0
                  ) + 1,
                agreed:
                  get(
                    collection,
                    [
                      userKey,
                      key,
                      "discussionsTypes",
                      type,
                      "conducted",
                      "agreed",
                    ],
                    0
                  ) + (discussion.reactions?.["+1"] ? 1 : 0),
                disagreed:
                  get(
                    collection,
                    [
                      userKey,
                      key,
                      "discussionsTypes",
                      type,
                      "conducted",
                      "disagreed",
                    ],
                    0
                  ) + (discussion.reactions?.["-1"] ? 1 : 0),
              },
            });
          }
        });

        [pullRequestLogin, ...(teams[pullRequestLogin] || []), "total"].forEach(
          (userKey) => {
            if (checkUserInclusive(userLogin)) {
              set(collection, [userKey, key, "discussionsTypes", type], {
                ...get(
                  collection,
                  [userKey, key, "discussionsTypes", type],
                  {}
                ),
                received: {
                  total:
                    get(
                      collection,
                      [
                        userKey,
                        key,
                        "discussionsTypes",
                        type,
                        "received",
                        "total",
                      ],
                      0
                    ) + 1,
                  agreed:
                    get(
                      collection,
                      [
                        userKey,
                        key,
                        "discussionsTypes",
                        type,
                        "received",
                        "agreed",
                      ],
                      0
                    ) + (discussion.reactions?.["+1"] ? 1 : 0),
                  disagreed:
                    get(
                      collection,
                      [
                        userKey,
                        key,
                        "discussionsTypes",
                        type,
                        "received",
                        "disagreed",
                      ],
                      0
                    ) + (discussion.reactions?.["-1"] ? 1 : 0),
                },
              });
            }
          }
        );
      });
    });

    comments[index]
      ?.filter((comment) =>
        checkUserInclusive(comment.user?.login || invalidUserLogin)
      )
      .forEach((comment) => {
        const userLogin = comment.user?.login || invalidUserLogin;
        if (pullRequestLogin !== userLogin) {
          [userLogin, "total", ...(teams[userLogin] || [])].forEach(
            (userKey) => {
              set(
                collection,
                [userKey, key, "commentsConducted"],
                get(collection, [userKey, key, "commentsConducted"], 0) + 1
              );
            }
          );
        }
      });

    if (pullRequestLogin && checkUserInclusive(pullRequestLogin)) {
      [pullRequestLogin, "total", ...(teams[pullRequestLogin] || [])].forEach(
        (userKey) => {
          set(
            collection,
            [userKey, key, "reviewComments"],
            (reviewComments?.length || 0) +
              get(collection, [userKey, key, "reviewComments"], 0)
          );
        }
      );
    }

    discussions?.forEach((discussion) => {
      const userLogin = discussion.user?.login || invalidUserLogin;
      [userLogin, "total", ...(teams[userLogin] || [])].forEach((userKey) => {
        set(collection, [userKey, key, "discussions"], {
          ...get(collection, [userKey, key, "discussions"], {}),
          conducted: {
            total:
              get(
                collection,
                [userKey, key, "discussions", "conducted", "total"],
                0
              ) + 1,
            agreed:
              get(
                collection,
                [userKey, key, "discussions", "conducted", "agreed"],
                0
              ) + (discussion.reactions?.["+1"] ? 1 : 0),
            disagreed:
              get(
                collection,
                [userKey, key, "discussions", "conducted", "disagreed"],
                0
              ) + (discussion.reactions?.["-1"] ? 1 : 0),
          },
        });
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
          if (checkUserInclusive(pullRequestLogin)) {
            set(collection, [userKey, key, "discussions"], {
              ...get(collection, [userKey, key, "discussions"], {}),
              received: {
                total:
                  get(
                    collection,
                    [userKey, key, "discussions", "received", "total"],
                    0
                  ) + (discussions?.length || 0),
                agreed:
                  get(
                    collection,
                    [userKey, key, "discussions", "received", "agreed"],
                    0
                  ) + (agreedDiscussions?.length || 0),
                disagreed:
                  get(
                    collection,
                    [userKey, key, "discussions", "received", "disagreed"],
                    0
                  ) + (disagreedDiscussions?.length || 0),
              },
            });
          }
        }
      );
    }
  });
};
