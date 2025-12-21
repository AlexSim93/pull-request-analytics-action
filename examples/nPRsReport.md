## Pull Request report

To learn more about the project and its configuration, please visit [Pull request analytics action](https://github.com/AlexSim93/pull-request-analytics-action).

Below are the settings applied for this report:

```
GITHUB_OWNERS_REPOS: example-owner/example-repo
SHOW_STATS_TYPES: timeline, workload, pr-quality, code-review-engagement, response-time
REVIEW_TIME_INTERVALS: 2,5,9,14,18,27
APPROVAL_TIME_INTERVALS: 2,5,9,14,18,27
TOP_LIST_AMOUNT: 0
AGGREGATE_VALUE_METHODS: percentile, average, median
HIDE_USERS: dev6
PERCENTILE: 75
CORE_HOURS_START: 08:00
CORE_HOURS_END: 20:00
AMOUNT: 200
PERIOD_SPLIT_UNIT: none
EXECUTION_OUTCOME: markdown
```

### Pull requests timeline(75th percentile) total

**Time to review** - time from PR creation to first review.
**Time to approve** - time from PR creation to first approval without requested changes.
**Time to merge** - time from PR creation to merge.
| user | Time in draft | Time to review request | Time to review | Time to Review After Re-request | Time to merge | Total merged PRs |
| :------: | :------: | :------: | :------: | :------: | :------: | :------: |
| **dev1** | 5 minutes | 5 minutes | 7 hours 52 minutes | 13 minutes | 55 hours 56 minutes | 50 |
| **dev2** | 4 minutes | 4 minutes | 4 hours 40 minutes | | 50 hours 12 minutes | 14 |
| **dev3** | 5 minutes | 5 minutes | 6 hours 45 minutes | 3 minutes | 26 hours 59 minutes | 18 |
| **dev4** | 18 minutes | 18 minutes | 7 hours 28 minutes | 1 hour 5 minutes | 45 hours 7 minutes | 26 |
| **dev5** | 5 minutes | 5 minutes | 10 hours 36 minutes | 2 hours 3 minutes | 73 hours 49 minutes | 27 |
| **total** | 5 minutes | 5 minutes | 8 hours 26 minutes | 57 minutes | 58 hours 11 minutes | 145 |

### Pull requests timeline(average) total

**Time to review** - time from PR creation to first review.
**Time to approve** - time from PR creation to first approval without requested changes.
**Time to merge** - time from PR creation to merge.
| user | Time in draft | Time to review request | Time to review | Time to Review After Re-request | Time to merge | Total merged PRs |
| :------: | :------: | :------: | :------: | :------: | :------: | :------: |
| **dev1** | 40 minutes | 36 minutes | 8 hours 8 minutes | 14 minutes | 28 hours 14 minutes | 50 |
| **dev2** | 4 minutes | 4 minutes | 6 hours 51 minutes | | 35 hours 42 minutes | 14 |
| **dev3** | 33 minutes | 36 minutes | 4 hours 49 minutes | 5 minutes | 25 hours 28 minutes | 18 |
| **dev4** | 2 hours 2 minutes | 2 hours 2 minutes | 8 hours 44 minutes | 17 hours 13 minutes | 39 hours 38 minutes | 26 |
| **dev5** | 38 minutes | 41 minutes | 9 hours 12 minutes | 8 hours 14 minutes | 82 hours 48 minutes | 27 |
| **total** | 43 minutes | 45 minutes | 7 hours 41 minutes | 7 hours 52 minutes | 41 hours 38 minutes | 145 |

### Pull requests timeline(median) total

**Time to review** - time from PR creation to first review.
**Time to approve** - time from PR creation to first approval without requested changes.
**Time to merge** - time from PR creation to merge.
| user | Time in draft | Time to review request | Time to review | Time to Review After Re-request | Time to merge | Total merged PRs |
| :------: | :------: | :------: | :------: | :------: | :------: | :------: |
| **dev1** | 4 minutes | 4 minutes | 3 hours 33 minutes | 8 minutes | 11 hours 31 minutes | 50 |
| **dev2** | | 3 minutes | 30 minutes | | 28 hours 27 minutes | 14 |
| **dev3** | | | 2 hours 54 minutes | 2 minutes | 10 hours 25 minutes | 18 |
| **dev4** | 5 minutes | 5 minutes | 1 hour 5 minutes | 38 minutes | 13 hours 48 minutes | 26 |
| **dev5** | 4 minutes | 4 minutes | 4 hours 42 minutes | 1 hour 10 minutes | 35 hours 32 minutes | 27 |
| **total** | 4 minutes | 4 minutes | 2 hours 51 minutes | 12 minutes | 17 hours 26 minutes | 145 |

### Review time total

|   users   |   0-2h    |   2-5h    |   5-9h    |   9-14h   | 14-18h  | 18-27h  |   27+h    |
| :-------: | :-------: | :-------: | :-------: | :-------: | :-----: | :-----: | :-------: |
| **dev1**  | 16(33.3%) | 13(27.1%) | 9(18.8%)  | 5(10.4%)  |    0    |    0    | 5(10.4%)  |
| **dev2**  | 9(64.3%)  |  1(7.1%)  |  1(7.1%)  |  1(7.1%)  |    0    |    0    | 2(14.3%)  |
| **dev3**  | 7(38.9%)  | 3(16.7%)  | 5(27.8%)  | 2(11.1%)  | 1(5.6%) |    0    |     0     |
| **dev4**  | 15(57.7%) |  1(3.8%)  | 4(15.4%)  |  1(3.8%)  |    0    |    0    | 5(19.2%)  |
| **dev5**  | 12(35.3%) | 6(17.6%)  |  3(8.8%)  | 7(20.6%)  |    0    | 2(5.9%) | 4(11.8%)  |
| **total** | 67(44.4%) | 25(16.6%) | 23(15.2%) | 16(10.6%) | 1(0.7%) | 2(1.3%) | 17(11.3%) |

### Contribution stats total

**Reviews conducted** - number of reviews conducted. 1 PR may have only single review.
**PR Size** - determined using the formula: `additions + deletions * 0.2`. Based on this calculation: 0-50: xs, 51-200: s, 201-400: m, 401-700: l, 701+: xl
**Total reverted PRs** - The number of reverted PRs based on the branch name pattern `/^revert-d+/`. This pattern is used for reverts made via GitHub.
| user | Total opened PRs | Total merged PRs | Total reverted PRs | PRs w/o review | PRs w/o approval | Additions / Deletions | PR size: xs/s/m/l/xl |
| :------: | :------: | :------: | :------: | :------: | :------: | :------: | :------: |
| **dev1** | 71 | 50 | 1 | 23 | 71 | +21316/-30038 | 41/16/5/2/7 |
| **dev2** | 27 | 14 | 0 | 13 | 27 | +1753/-2303 | 18/7/1/1/0 |
| **dev3** | 20 | 18 | 0 | 2 | 20 | +2579/-2091 | 9/5/5/0/1 |
| **dev4** | 27 | 26 | 0 | 1 | 27 | +8184/-3333 | 5/9/7/3/3 |
| **dev5** | 38 | 27 | 3 | 4 | 38 | +9089/-6754 | 22/7/5/1/3 |
| **total** | 200 | 145 | 4 | 49 | 200 | +44439/-45023 | 106/47/25/8/14 |

### Pull request quality total

**Agreed** - discussions with at least 1 reaction :+1:.
**Disagreed** - discussions with at least 1 reaction :-1:.
| user | Total merged PRs | Changes requested received | Agreed / Disagreed / Total discussions received | Comments received |
| :------: | :------: | :------: | :------: | :------: |
| **dev1** | 50 | 6 | 0 / 0 / 17 | 52 |
| **dev2** | 14 | 1 | 0 / 0 / 26 | 39 |
| **dev3** | 18 | 1 | 0 / 0 / 10 | 15 |
| **dev4** | 26 | 4 | 0 / 0 / 28 | 28 |
| **dev5** | 27 | 7 | 0 / 0 / 16 | 20 |
| **total** | 145 | 21 | 0 / 0 / 100 | 159 |

### Code review engagement total

**PR Size** - determined using the formula: `additions + deletions * 0.2`. Based on this calculation: 0-50: xs, 51-200: s, 201-400: m, 401-700: l, 701+: xl
**Changes requested / Comments / Approvals** - number of reviews conducted by user. For a single pull request, only one review of each status will be counted for a user.
**Agreed** - discussions with at least 1 reaction :+1:.
**Disagreed** - discussions with at least 1 reaction :-1:.
| user | Reviews conducted | Agreed / Disagreed / Total discussions conducted | Comments conducted | PR size: xs/s/m/l/xl | Changes requested / Commented / Approved |
| :------: | :------: | :------: | :------: | :------: | :------: |
| **dev1** | 50 | 0 / 0 / 63 | 75 | 28/9/7/1/5 | 10 / 12 / 48 |
| **dev3** | 55 | 0 / 0 / 23 | 29 | 23/16/10/3/3 | 9 / 10 / 51 |
| **dev4** | 19 | 0 / 0 / 4 | 4 | 8/6/4/0/1 | 1 / 1 / 19 |
| **dev5** | 28 | 0 / 0 / 7 | 8 | 18/5/3/1/1 | 0 / 5 / 27 |
| **total** | 151 | 0 / 0 / 100 | 159 | 78/36/22/5/10 | 21 / 35 / 146 |

### Review Response Time(75th percentile) total

**Time from re-request to response** - time from a review re-request to the response. Multiple re-requests and responses can occur in a single pull request
| user | Review requests conducted | Reviews conducted | Time from opening to response | Time from initial request to response | Time from re-request to response |
| :------: | :------: | :------: | :------: | :------: | :------: |
| **dev1** | 111 | 50 | 5 hours 19 minutes | 5 hours 16 minutes | 2 hours 22 minutes |
| **dev3** | 155 | 55 | 12 hours 15 minutes | 11 hours 37 minutes | 31 minutes |
| **dev4** | 138 | 19 | 7 hours 10 minutes | 6 hours 36 minutes | |
| **dev5** | 137 | 28 | 13 hours 43 minutes | 13 hours 56 minutes | |
| **total** | 584 | 151 | 8 hours 32 minutes | 8 hours 32 minutes | 57 minutes |

### Review Response Time(average) total

**Time from re-request to response** - time from a review re-request to the response. Multiple re-requests and responses can occur in a single pull request
| user | Review requests conducted | Reviews conducted | Time from opening to response | Time from initial request to response | Time from re-request to response |
| :------: | :------: | :------: | :------: | :------: | :------: |
| **dev1** | 111 | 50 | 8 hours 14 minutes | 8 hours 43 minutes | 14 hours 14 minutes |
| **dev3** | 155 | 55 | 11 hours 20 minutes | 10 hours 30 minutes | 22 minutes |
| **dev4** | 138 | 19 | 5 hours 28 minutes | 4 hours 30 minutes | 4 minutes |
| **dev5** | 137 | 28 | 14 hours 18 minutes | 14 hours 6 minutes | |
| **total** | 584 | 151 | 9 hours 33 minutes | 9 hours 35 minutes | 7 hours 52 minutes |

### Review Response Time(median) total

**Time from re-request to response** - time from a review re-request to the response. Multiple re-requests and responses can occur in a single pull request
| user | Review requests conducted | Reviews conducted | Time from opening to response | Time from initial request to response | Time from re-request to response |
| :------: | :------: | :------: | :------: | :------: | :------: |
| **dev1** | 111 | 50 | 28 minutes | 54 minutes | 20 minutes |
| **dev3** | 155 | 55 | 5 hours 51 minutes | 3 hours 34 minutes | 11 minutes |
| **dev4** | 138 | 19 | 2 hours 19 minutes | 2 hours 18 minutes | 4 minutes |
| **dev5** | 137 | 28 | 5 hours 11 minutes | 4 hours 1 minute | |
| **total** | 584 | 151 | 2 hours 23 minutes | 2 hours 25 minutes | 12 minutes |
