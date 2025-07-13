import { isBefore, parseISO } from "date-fns";
import { makeComplexRequest } from "../../../requests";
import { invalidUserLogin } from "../../constants";
import { checkUserInclusive } from "./checkUserInclusive";

export const getApproveTime = (
  reviews: Awaited<ReturnType<typeof makeComplexRequest>>["events"][number],
  requiredApprovals: number
) => {
  const statuses = Object.values(
    reviews?.reduce(
      (
        acc: Record<string, { state: string; submittedAt: string }>,
        review: any
      ) => {
        const user = review.user?.login || invalidUserLogin;
        if (!checkUserInclusive(user)) {
          return acc;
        }
        const statusesEntries = Object.keys(acc) as string[];
        const isApproved =
          statusesEntries.filter((user) => acc[user].state === "approved")
            .length >= requiredApprovals &&
          !statusesEntries.some(
            (user) => acc[user].state === "changes_requested"
          ) &&
          review.state !== "changes_requested";
        if (isApproved) {
          return acc;
        }
        if (["approved", "changes_requested"].includes(review.state)) {
          return {
            ...acc,
            [user]: { state: review.state, submittedAt: review.submitted_at },
          };
        }
        return {
          ...acc,
          [user]: { state: review.state, submittedAt: review.submitted_at },
        };
      },
      {}
    ) || {}
  );


  const isApproved =
    statuses.filter((status) => status.state === "approved").length >=
      requiredApprovals &&
    !statuses.some((status) => status.state === "changes_requested");

  return isApproved
    ? statuses.sort((a, b) =>
        isBefore(parseISO(a.submittedAt), parseISO(b.submittedAt)) ? 1 : -1
      )[0]?.submittedAt
    : null;
};
