import { filterPRs } from "./filterPRs";
import { mockPullRequests } from "./filterPRs.mock";

describe("filterPRs", () => {
  describe("Label filtering", () => {
    it("should return all PRs when no filters are provided", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: [],
        filterHeadBranchesPattern: "",
        filterBaseBranchesPattern: "",
      });

      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it("should filter PRs by include labels (bug)", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: ["bug"],
        filterBaseBranchesPattern: "",
        filterHeadBranchesPattern: "",
      });

      expect(result).toEqual([1, 2, 10]);
    });

    it("should filter PRs by multiple include labels (bug OR enhancement)", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: ["bug", "enhancement"],
        filterBaseBranchesPattern: "",
        filterHeadBranchesPattern: "",
      });

      // PRs that have at least one of the labels
      expect(result).toEqual([1, 2, 4, 5, 6, 7, 9, 10]);
    });

    it("should filter PRs by exclude labels (bug)", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: ["bug"],
        includeLabels: [],
        filterBaseBranchesPattern: "",
        filterHeadBranchesPattern: "",
      });

      // All PRs except those with "bug" label
      expect(result).toEqual([3, 4, 5, 6, 7, 8, 9]);
    });

    it("should filter PRs by multiple exclude labels (bug AND ui-kit)", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: ["bug", "ui-kit"],
        includeLabels: [],
        filterBaseBranchesPattern: "",
        filterHeadBranchesPattern: "",
      });

      // PRs that don't have any of the excluded labels
      expect(result).toEqual([3, 5, 6, 7, 8, 9]);
    });

    it("should filter PRs with both include and exclude labels", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: ["bug"],
        includeLabels: ["enhancement"],
        filterBaseBranchesPattern: "",
        filterHeadBranchesPattern: "",
      });

      // PRs that have "enhancement" but not "bug"
      expect(result).toEqual([4, 5, 6, 7, 9]);
    });

    it("should return only PRs without any labels when including non-existent label", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: ["non-existent-label"],
        filterBaseBranchesPattern: "",
        filterHeadBranchesPattern: "",
      });

      expect(result).toEqual([]);
    });

    it("should return all PRs when excluding non-existent label", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: ["non-existent-label"],
        includeLabels: [],
        filterBaseBranchesPattern: "",
        filterHeadBranchesPattern: "",
      });

      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
  });

  describe("Branch filtering", () => {
    it("should filter PRs by include branch pattern (fix/)", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: [],
        filterHeadBranchesPattern: "^fix/",
        filterBaseBranchesPattern: "",
      });

      expect(result).toEqual([1, 2, 3]);
    });

    it("should filter PRs by multiple branch patterns (fix/ OR feature/)", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: [],
        filterHeadBranchesPattern: "^(fix|feature)/",
        filterBaseBranchesPattern: "",
      });

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should filter PRs by exclude branch pattern (fix/)", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: [],
        filterHeadBranchesPattern: "^(?!fix/)",
        filterBaseBranchesPattern: "",
      });

      // All PRs except those starting with "fix/"
      expect(result).toEqual([4, 5, 6, 7, 8, 9, 10]);
    });

    it("should filter PRs by multiple exclude branch patterns (cursor/ AND refactor/)", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: [],
        filterHeadBranchesPattern: "^(?!cursor|refactor).*",
        filterBaseBranchesPattern: "",
      });

      // PRs that don't start with "cursor/" or "refactor/"
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("should filter PRs with both include and exclude branch patterns", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: [],
        filterHeadBranchesPattern: "^feature/(?!.*dashboard).*",
        filterBaseBranchesPattern: "",
      });

      // PRs that start with "feature/" but don't contain "dashboard"
      expect(result).toEqual([5, 6]);
    });

    it("should filter PRs by branch pattern containing specific keyword", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: [],
        filterHeadBranchesPattern: "ui",
        filterBaseBranchesPattern: "",
      });

      // PRs with "ui" in branch name
      expect(result).toEqual([2, 10]);
    });
  });

  describe("Combined filtering (labels + branches)", () => {
    it("should filter PRs by include label and include branch pattern", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: ["bug"],
        filterHeadBranchesPattern: "^fix/",
        filterBaseBranchesPattern: "",
      });

      // PRs with "bug" label AND starting with "fix/"
      expect(result).toEqual([1, 2]);
    });

    it("should filter PRs by include label and exclude branch pattern", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: ["ui-kit"],
        filterHeadBranchesPattern: "^(?!cursor/).*",
        filterBaseBranchesPattern: "",
      });

      // PRs with "ui-kit" label AND not starting with "cursor/"
      expect(result).toEqual([2, 4]);
    });

    it("should filter PRs by exclude label and include branch pattern", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: ["bug"],
        includeLabels: [],
        filterHeadBranchesPattern: "^feature/",
        filterBaseBranchesPattern: "",
      });

      // PRs starting with "feature/" AND not having "bug" label
      expect(result).toEqual([4, 5, 6]);
    });

    it("should filter PRs by exclude label and exclude branch pattern", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: ["docs"],
        includeLabels: [],
        filterHeadBranchesPattern: "^(?!fix/).*",
        filterBaseBranchesPattern: "",
      });

      // PRs not starting with "fix/" AND not having "docs" label
      expect(result).toEqual([4, 5, 7, 8, 9, 10]);
    });

    it("should filter PRs with all filters applied", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: ["bug"],
        includeLabels: ["enhancement"],
        filterHeadBranchesPattern: "^(feature|refactor)/(?!cursor/).*",
        filterBaseBranchesPattern: "",
      });

      // PRs with "enhancement" label, without "bug" label,
      // starting with "feature/" or "refactor/", and not starting with "cursor/"
      expect(result).toEqual([4, 5, 6, 7]);
    });

    it("should return empty array when filters exclude all PRs", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: ["non-existent"],
        filterHeadBranchesPattern: "^non-existent/",
        filterBaseBranchesPattern: "",
      });

      expect(result).toEqual([]);
    });
  });

  describe("Base branch filtering", () => {
    it("should filter PRs by include base branch pattern (main)", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: [],
        filterHeadBranchesPattern: "",
        filterBaseBranchesPattern: "^main$",
      });

      // PRs with base branch = main
      expect(result).toEqual([1, 3, 6, 8, 9]);
    });

    it("should filter PRs by exclude base branch pattern (main)", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: [],
        filterHeadBranchesPattern: "",
        filterBaseBranchesPattern: "^(?!main$).*",
      });

      // All PRs except those with base branch = main
      expect(result).toEqual([2, 4, 5, 7, 10]);
    });

    it("should filter PRs by both head and base branch patterns", () => {
      const result = filterPRs(mockPullRequests, {
        excludeLabels: [],
        includeLabels: [],
        filterHeadBranchesPattern: "^feature/",
        filterBaseBranchesPattern: "^develop$",
      });

      // PRs starting with "feature/" OR with base branch = develop
      expect(result).toEqual([4, 5]);
    });
  });
});
