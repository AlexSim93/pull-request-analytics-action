import { makeComplexRequest } from "../../../requests";

export const getApproveTime = (
  reviews: Awaited<ReturnType<typeof makeComplexRequest>>["reviews"][number]
) => {
  const reviewChangesRequested = reviews?.reduce((acc, review) => {
    if (review.state === "CHANGES_REQUESTED") {
      const login = review.user?.login || "invalid";
      return { ...acc, [login]: true };
    }
    return acc;
  }, {}) as Record<string, boolean> | undefined;
  const reviewApproved = reviews?.reduce((acc, review) => {
    if (review.state === "APPROVED") {
      const login = review.user?.login || "invalid";
      return { ...acc, [login]: review.submitted_at };
    }
    return acc;
  }, {}) as Record<string, string> | undefined;
  const usersRequestedChanges = reviewChangesRequested
    ? Object.keys(reviewChangesRequested)
    : [];
  if (usersRequestedChanges.length === 0) {
    return reviews?.find((review) => review.state === "APPROVED")?.submitted_at;
  }

  const approveEntry = Object.entries(reviewApproved || {}).find(([user]) => {
    if (reviewChangesRequested?.[user]) {
      reviewChangesRequested[user] = false;

      return !Object.values(reviewChangesRequested).some(
        (value) => value === true
      );
    }
    return false;
  });

  return approveEntry?.[1];
};
