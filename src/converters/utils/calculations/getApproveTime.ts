import { formatISO, max, parseISO } from "date-fns";
import { makeComplexRequest } from "../../../requests";
import { invalidUserLogin } from "../../constants";

export const getApproveTime = (
  reviews: Awaited<ReturnType<typeof makeComplexRequest>>["reviews"][number]
) => {
  const statuses = Object.values(
    reviews?.reduce(
      (
        acc: Record<string, { state: string; submittedAt: string }>,
        review: any
      ) => {
        const user = review.user.login || invalidUserLogin;
        const statusesEntries = Object.keys(acc) as string[];
        const isApproved =
          statusesEntries.some((user) => acc[user].state === "APPROVED") &&
          !statusesEntries.some(
            (user) => acc[user].state === "CHANGES_REQUESTED"
          ) &&
          review.state !== "CHANGES_REQUESTED";
        if (isApproved) {
          return acc;
        }
        if (["APPROVED", "CHANGES_REQUESTED"].includes(review.state)) {
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
    statuses.some((status) => status.state === "APPROVED") &&
    !statuses.some((status) => status.state === "CHANGES_REQUESTED");

  return isApproved
    ? formatISO(max(statuses.map((status) => parseISO(status.submittedAt))))
    : null;
};
