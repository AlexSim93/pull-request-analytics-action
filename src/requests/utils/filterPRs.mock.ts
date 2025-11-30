// Mock data: 10 PRs with different branches and labels
export const mockPullRequests = [
  // PRs with fix/ branch
  {
    number: 1,
    head: { ref: "fix/authentication-bug" },
    base: { ref: "main" },
    labels: [{ name: "bug" }, { name: "enhancement" }],
  },
  {
    number: 2,
    head: { ref: "fix/ui-glitch" },
    base: { ref: "develop" },
    labels: [{ name: "ui-kit" }, { name: "bug" }],
  },
  {
    number: 3,
    head: { ref: "fix/validation-error" },
    base: { ref: "main" },
    labels: [],
  },

  // PRs with feature/ branch
  {
    number: 4,
    head: { ref: "feature/user-dashboard" },
    base: { ref: "develop" },
    labels: [{ name: "enhancement" }, { name: "ui-kit" }],
  },
  {
    number: 5,
    head: { ref: "feature/export-functionality" },
    base: { ref: "develop" },
    labels: [{ name: "enhancement" }],
  },
  {
    number: 6,
    head: { ref: "feature/user-profile-page" },
    base: { ref: "main" },
    labels: [{ name: "enhancement" }, { name: "docs" }],
  },

  // PRs with refactor/ branch
  {
    number: 7,
    head: { ref: "refactor/authentication-module" },
    base: { ref: "develop" },
    labels: [{ name: "enhancement" }],
  },
  {
    number: 8,
    head: { ref: "refactor/api-endpoints" },
    base: { ref: "main" },
    labels: [],
  },

  // PRs with cursor/ branch
  {
    number: 9,
    head: { ref: "cursor/code-improvements" },
    base: { ref: "main" },
    labels: [{ name: "enhancement" }],
  },
  {
    number: 10,
    head: { ref: "cursor/ui-fixes" },
    base: { ref: "develop" },
    labels: [{ name: "ui-kit" }, { name: "bug" }],
  },
];
