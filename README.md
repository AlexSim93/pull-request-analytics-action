# Pull request analytics action

![Version](https://img.shields.io/badge/version-3.1.2-blue) ![License](https://img.shields.io/badge/license-MIT-green)

This GitHub Action measures metrics for developers and/or teams. Reports are generated in issues based on user actions such as opening/closing pull requests, requesting/conducting reviews, opening discussions, and more. The action is designed to provide better insights into team strengths and identify bottlenecks.

## Table of Contents

- [Key Features](#key-features)
- [Getting started](#getting-started)
- [Configuration Examples](#configuration-examples)
- [Report examples](#report-examples)
- [Using GitHub Enterprise Server](#using-github-enterprise-server)
- [Detailed Report on Discussion Types](#detailed-report-on-discussion-types)
- [Pull Request Sizes](#pull-request-sizes)
- [Report Data Grouping, AMOUNT Parameter, and Time Calculation Logic](#detailed-report-on-discussion-types)
- [Configuration Parameters Overview](#configuration-parameters-overview)
- [Outputs](#outputs)
- [Privacy and Data Handling](#privacy-and-data-handling)
- [Usage Limitations](#usage-limitations)
- [Recommendations and Tips](#recommendations-and-tips)
- [How You Can Help](#how-you-can-help)

## Key Features:

- **Customizable Tables and Graphs for Review Timelines**: Generates user-friendly tables and graphs that mark critical milestones from PR opening to review, approval, and merge. Users can select the calculation method best suited for them, choosing from median, mean (average), or a selected percentile. This feature helps to identify bottlenecks in the code review process.

|   user    | Time in draft | Time to review request |   Time to review    |   Time to approve   |    Time to merge    | Total merged PRs |
| :-------: | :-----------: | :--------------------: | :-----------------: | :-----------------: | :-----------------: | :--------------: |
| **dev1**  |  34 minutes   |       17 minutes       | 3 hours 34 minutes  | 7 hours 32 minutes  | 14 hours 9 minutes  |        22        |
| **dev2**  |  21 minutes   |       20 minutes       |       4 hours       |       4 hours       |  23 hours 1 minute  |        13        |
| **dev3**  |  15 minutes   |       18 minutes       | 15 hours 16 minutes | 24 hours 7 minutes  | 53 hours 43 minutes |        2         |
| **dev4**  |  23 minutes   |       22 minutes       | 2 hours 41 minutes  | 9 hours 15 minutes  | 47 hours 41 minutes |        8         |
| **dev5**  |  13 minutes   |       12 minutes       | 5 hours 59 minutes  | 18 hours 55 minutes | 40 hours 7 minutes  |        2         |
| **total** |  27 minutes   |       18 minutes       | 4 hours 21 minutes  | 7 hours 36 minutes  | 26 hours 14 minutes |        47        |

```mermaid
gantt
title Pull requests timeline(percentile75) 12/2023 / minutes
dateFormat X
axisFormat %s
section dev1
Time in draft(34 minutes) :  0, 34
Time to review request(17 minutes) :  0, 17
Time to review(3 hours 34 minutes) :  0, 214
Time to approve(7 hours 32 minutes) :  0, 452
Time to merge(14 hours 9 minutes) :  0, 849

section dev2
Time in draft(27 minutes) :  0, 21
Time to review request(12 minutes) :  0, 20
Time to review(4 hours) :  0, 240
Time to approve(4 hours) :  0, 240
Time to merge(23 hours 1 minute) :  0, 1381

section dev3
Time in draft(27 minutes) :  0, 15
Time to review request(12 minutes) :  0, 18
Time to review(15 hours 16 minutes) :  0, 916
Time to approve(24 hours 7 minutes) :  0, 1447
Time to merge(53 hours 43 minutes) :  0, 3223

section dev4
Time in draft(27 minutes) :  0, 13
Time to review request(12 minutes) :  0, 12
Time to review(2 hours 41 minutes) :  0, 161
Time to approve(9 hours 15 minutes) :  0, 555
Time to merge(47 hours 41 minutes) :  0, 2861

section dev5
Time in draft(27 minutes) :  0, 27
Time to review request(12 minutes) :  0, 18
Time to review(5 hours 59 minutes) :  0, 359
Time to approve(18 hours 55 minutes) :  0, 1135
Time to merge(40 hours 7 minutes) :  0, 2407

section total
Time in draft(27 minutes) :  0, 27
Time to review request(12 minutes) :  0, 18
Time to review(4 hours 21 minutes) :  0, 261
Time to approve(7 hours 36 minutes) :  0, 456
Time to merge(26 hours 14 minutes) :  0, 1574

```

```mermaid
pie
title Review time total 12/2023
"0-1 hours(12)":12
"4-6 hours(7)":7
"6-9 hours(4)":4
"12+ hours(2)":2
```

- **Comprehensive Report on Merged PRs, Code Changes, and Reviews**: This feature compiles a report detailing the number of merged PRs, lines of code modified, and reviews conducted. It provides an approximate measure of the workload, both for individual developers and the team as a whole, offering a clear view of productivity and contribution.

|   user    | Total opened PRs | Total merged PRs | Additions/Deletions | PR size: xs/s/m/l/xl | Total comments | Reviews conducted |
| :-------: | :--------------: | :--------------: | :-----------------: | :------------------: | :------------: | :---------------: |
| **dev1**  |        24        |        22        |     +1448/-3110     |      14/5/4/0/1      |       41       |         8         |
| **dev2**  |        14        |        13        |     +813/-2062      |      7/4/1/2/0       |       6        |        20         |
| **dev3**  |        2         |        2         |       +15/-3        |      2/0/0/0/0       |       1        |        10         |
| **dev4**  |        8         |        8         |     +5416/-4600     |      6/0/1/0/1       |       7        |         9         |
| **dev5**  |        2         |        2         |      +838/-362      |      1/0/0/0/1       |       16       |         2         |
| **total** |        50        |        47        |    +8530/-10137     |      30/9/6/2/3      |       71       |        46         |

- **Quality Report on devInitiated PRs**: This feature generates a report analyzing the quality of PRs opened by developers. It collates data on the number of comments received, discussions held, and reasons for these discussions, along with the quantity of requested changes in open PRs, all presented in both tabular and graphical formats. This functionality aids in identifying the most problematic areas detected during code reviews and quantifying their extent.

|   user    | Total merged PRs | Changes requested received | Agreed / Disagreed / Total discussions received | Comments received |
| :-------: | :--------------: | :------------------------: | :---------------------------------------------: | :---------------: |
| **dev1**  |        22        |             3              |                   0 / 0 / 10                    |        20         |
| **dev2**  |        13        |             1              |                    0 / 0 / 2                    |         3         |
| **dev3**  |        2         |             0              |                    0 / 0 / 1                    |         1         |
| **dev4**  |        8         |             1              |                    0 / 0 / 4                    |         4         |
| **dev5**  |        2         |             1              |                    3 / 2 / 8                    |         9         |
| **total** |        47        |             6              |                   3 / 2 / 25                    |        37         |

```mermaid
pie
title Discussions types total 12/2023
"Bug(12)":12
"Performance(8)":8
"Code complexity(3)":3
"Test coverage(2)":2
"Formatting(9)":9
```

- **Developer Engagement in Code Review Process**: This feature assesses the level of developer participation in code reviews. It provides a table showing the discussions initiated, comments made, along with a breakdown of the number of code reviews conducted and the decisions made. This enables you to gauge the involvement of developers in the review process effectively.

|   user    | Total merged PRs | Agreed / Disagreed / Total discussions conducted | Comments conducted | PR size: xs/s/m/l/xl | Changes requested / Commented / Approved |
| :-------: | :--------------: | :----------------------------------------------: | :----------------: | :------------------: | :--------------------------------------: |
| **dev1**  |        22        |                    0 / 0 / 0                     |         0          |      5/2/0/1/0       |                0 / 0 / 8                 |
| **dev2**  |        13        |                    3 / 2 / 22                    |         33         |      10/3/4/0/3      |                5 / 8 / 20                |
| **dev3**  |        2         |                    0 / 0 / 2                     |         3          |      4/2/1/2/1       |                1 / 1 / 10                |
| **dev4**  |        8         |                    0 / 0 / 0                     |         0          |      6/2/1/0/0       |                0 / 0 / 9                 |
| **dev5**  |        2         |                    0 / 0 / 1                     |         1          |      2/0/0/0/0       |                0 / 1 / 2                 |
| **total** |        47        |                    3 / 2 / 25                    |         37         |      30/9/6/2/3      |               6 / 12 / 46                |

- **Response Time for Review Requests**: The table shows how quickly developers and the team respond to code review requests, as well as the ratio of requests to responses. This table provides insight into the developers' engagement in the review process.

|   user    | Review requests conducted | Reviews conducted | Time from opening to response | Time from initial request to response | Time from re-request to response |
| :-------: | :-----------------------: | :---------------: | :---------------------------: | :-----------------------------------: | :------------------------------: |
| **dev1**  |            259            |        88         |      10 hours 13 minutes      |          6 hours 37 minutes           |        2 hours 2 minutes         |
| **dev2**  |            271            |        56         |      10 hours 48 minutes      |          9 hours 42 minutes           |                                  |
| **dev3**  |            218            |        66         |      6 hours 59 minutes       |          6 hours 55 minutes           |        3 hours 2 minutes         |
| **dev4**  |            232            |        68         |      3 hours 20 minutes       |          2 hours 54 minutes           |            50 minutes            |
| **dev5**  |            236            |        35         |      7 hours 28 minutes       |           7 hours 7 minutes           |                                  |
| **total** |           1219            |        282        |      7 hours 15 minutes       |          6 hours 41 minutes           |        1 hour 57 minutes         |

- **Highlighted PRs List by Key Metrics**: One of the standout features of **pull-request-analytics-action** is the ability to generate a list of the most notable pull requests based on four key metrics: time from opening to review, time from review to approval, time from approval to merge, and the number of comments. This feature provides a list of links directly to these exceptional PRs, allowing for quick access and detailed analysis.

- **Highly Customizable for Specific Project Needs**: This action is designed with flexibility in mind, allowing for extensive customization of display parameters, statistics collection, and report generation. Users can tailor the tool to precisely fit the requirements of their specific projects, ensuring that the reports and analytics are as relevant and useful as possible.

- **GitHub-Integrated, Secure, and Open Source**: As a GitHub Action, **pull-request-analytics-action** operates entirely within the GitHub environment. It neither shares nor stores any data on external services, ensuring complete data security and privacy. Additionally, it is an open-source tool, providing full transparency in its operation, and is available to use at no cost, making it accessible for all GitHub users.

This GitHub Action, **pull-request-analytics-action**, is an essential tool for any team seeking to optimize their software development process, ensuring more efficient and effective project management.

## Getting started

To integrate **pull-request-analytics-action** into your GitHub repository, use the following steps. The provided code is a template and can be adjusted to fit your specific requirements:

1. **Create a Workflow File**:

   - Navigate to the `.github/workflows` directory in your repository.
   - Create a YAML file, for example, `pull-request-analytics.yml`.

2. **Choose the Trigger Event**: Decide on which GitHub event you want to trigger the report generation. You can refer to the [GitHub Events Documentation](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows) for a detailed understanding of different events. I recommend using one of the `pull_request`, `workflow_dispatch`, or `schedule` events, depending on your specific needs. For this setup, we will configure the `workflow_dispatch` event.

3. **Insert and Customize the Workflow Code**:

   - Open your new YAML file and paste the following example workflow. This is a starting template and you can modify it as needed:

     ```yaml
     name: "PR Analytics"
     on:
       workflow_dispatch:
         inputs:
           report_date_start:
             description: "Report date start(d/MM/yyyy)"
             required: false
           report_date_end:
             description: "Report date end(d/MM/yyyy)"
             required: false
     jobs:
       create-report:
         name: "Create report"
         runs-on: ubuntu-latest
         steps:
           - name: "Run script for analytics"
             uses: AlexSim93/pull-request-analytics-action@v3
             with:
               GITHUB_TOKEN: ${{ secrets.GENERATED_TOKEN }} # Generate a classic token, add it to Actions secrets, and use it in this field
               GITHUB_REPO_FOR_ISSUE: "repo" # Make sure to specify the name of the repository where the issue will be created
               GITHUB_OWNER_FOR_ISSUE: "owner" # Make sure to specify the owner of the repository where the issue will be created
               GITHUB_OWNERS_REPOS: "owner/repo" # Be sure to list the owner and repository name in the format owner/repo
               CORE_HOURS_START: "9:00"
               CORE_HOURS_END: "19:00"
               TIMEZONE: "Europe/Berlin"
               REPORT_DATE_START: ${{ inputs.report_date_start }}
               REPORT_DATE_END: ${{ inputs.report_date_end }}
     ```

   - In the `workflow_dispatch` section of the yml file, I have specified various inputs that can be adjusted each time the action is triggered. By utilizing the `required` and `default` fields, I've designated whether each input is mandatory and set predetermined values for ease of use. In the `with` section, I've included parameters that remain constant for each action run. For a detailed understanding of which parameters the action accepts and their functions, please refer to the [Parameters Overview section](#configuration-parameters-overview).
   - **GitHub Token:** The `GITHUB_TOKEN` is a special token used by the GitHub Actions runner to interact with your repositories. You can generate this token as per the [GitHub Documentation on Authentication](https://docs.github.com/en/rest/authentication/authenticating-to-the-rest-api?apiVersion=2022-11-28). When setting up the token, ensure you configure the necessary permissions. For **pull-request-analytics-action** to function correctly, **personal access token(classic)** requires **repo** and **read:org** scopes. Insert the token in your workflow file under the secrets context.
   - Adjust parameters to match your project's needs.

4. **Commit and Push the Workflow File**:

   - Save your changes and commit the file to your repository.
   - Push it to enable the GitHub Action workflow.

5. **Run the Workflow**:

   - In your repository, go to the 'Actions' tab.
   - Select **PR analytics** and start it via "Run workflow".
   - Fill in any necessary parameters and execute the action.

6. **Review the Generated Report**:

   - Once the action completes, your detailed PR report will be available.
   - If configured, check for a new issue in the specified repository containing the report.

This setup allows you to fully leverage **pull-request-analytics-action** for comprehensive PR analysis, tailored to your project’s needs.

## Configuration Examples

1. **Manual Execution for All Organization Repositories**: Includes options to set start and end dates for the statistics period and to customize the report title. [View config](https://github.com/AlexSim93/pull-request-analytics-action/blob/master/configs/manualTriggerForAllReposOfOrg.yml)

2. **Up-to-Date Statistics for Latest 200 Closed PRs**: Automatically updates the report with every PR closure, maintaining current statistics for the last 200 updated closed PRs.[View config](https://github.com/AlexSim93/pull-request-analytics-action/blob/master/configs/updateReportOnPRClose.yml)

3. **Yearly Statistics Update Every Monday**: Configured to update yearly statistics every Monday, with assignees set and excluding individual developer statistics. [View config](https://github.com/AlexSim93/pull-request-analytics-action/blob/master/configs/yearReportWithoutDevelopers.yml)

4. **Quarterly Report Update on the 1st of Each Month**: Updates the report for the last three months on the first day of each month, displaying only the average values for timelines and specifying assignees. [View config](https://github.com/AlexSim93/pull-request-analytics-action/blob/master/configs/lastMonthsReport.yml)

## Report Examples

Explore how **pull-request-analytics-action** works with these report examples in the project:

1. **Issue Creation with Comments**: Demonstrates the generation of a new issue with detailed comments for each report. [View Issue Example](https://github.com/AlexSim93/pull-request-analytics-action/issues/16#).

2. **Multi-Month Report**: Analysis over several months. [View Markdown Example](https://github.com/AlexSim93/pull-request-analytics-action/blob/master/examples/periodReport.md).

3. **Last N PRs Report**: Insights into the most recent pull requests. [View Markdown Example](https://github.com/AlexSim93/pull-request-analytics-action/blob/master/examples/nPRsReport.md).

4. **JSON Data Report**: Example of JSON data collected by the action, showcasing detailed analytics. [View JSON Example](https://github.com/AlexSim93/pull-request-analytics-action/blob/master/examples/collectionExample.json).

Click the links for detailed report formats and insights.

## Using GitHub Enterprise Server

**pull-request-analytics-action** supports integration with GitHub Enterprise Server. To use this feature, you need to set the `GITHUB_API_URL` environment variable:

1. In your workflow file, define the `GITHUB_API_URL` under the `env` key.
2. Set the value to your GitHub Enterprise Server API endpoint.

Example:

```yaml
env:
  GITHUB_API_URL: http(s)://HOSTNAME/api/v3
```

This configuration allows **pull-request-analytics-action** to interface with your GitHub Enterprise instance, enabling you to leverage the full capabilities of the action within your enterprise environment.

## Detailed Report on Discussion Types

To obtain a detailed report on the types of open discussions, it is necessary to include a specific label in the first message of each discussion, enclosed in double square brackets (`[[ ]]`). For example, use `[[Performance issue]]` to categorize a discussion as related to performance issues. The action will then provide a breakdown of discussions based on these labels, allowing for a more targeted and categorized analysis of discussion topics.

In addition, reactions of :+1: and :-1: on the initial message of a discussion will be collected and displayed in the columns for "discussions received" and "discussions conducted." These reactions help to more accurately gauge the usefulness and reception of the discussions initiated.

**Example Usage**:

- In the first comment of a pull request discussion, include a label like `[[Bug]]`, `[[Feature Request]]`, or any custom label of your choice.
- **pull-request-analytics-action** will recognize these labels and include them in the report, providing a categorized overview of discussions.

This feature enhances the analytical capabilities of **pull-request-analytics-action**, offering a deeper insight into the nature and distribution of discussions in your pull requests.

## Pull Request Sizes

**Calculating PR Size**: The size of a pull request is determined using the formula: `additions + deletions * 0.5`. This calculation considers both the lines of code added and a weighted count of deletions to assess the overall size.

Based on this calculation, pull requests are categorized into the following size brackets:

- `0-50`: `xs`
- `51-200`: `s`
- `201-400`: `m`
- `401-700`: `l`
- `701+`: `xl`

## Report Data Grouping, AMOUNT Parameter, and Time Calculation Logic

- **Data Grouping**: The report data is organized based on the closure date of each pull request.
- **Using AMOUNT Parameter**: When `AMOUNT` is specified without `REPORT_DATE_START`, the report includes the specified number of most recently modified pull requests. However, the report count may be less than the `AMOUNT` specified, as it only includes merged pull requests.

- **Excluding Weekends and Non-Working Hours**: The calculations for the report exclude weekends. Furthermore, when `CORE_HOURS_START` and `CORE_HOURS_END` are set, time outside of these core working hours is not considered in the time-related metrics.

## Configuration Parameters Overview

Below is a table outlining the various configuration parameters available for **pull-request-analytics-action**. These parameters allow you to customize the behavior of the action to fit your specific needs. Each parameter's name, description, requirement status, and default value (if applicable) are listed for your reference:

| Parameter Name            | Description                                                                                                                                                                                                                                                                                                                                                                                           | Default Value                                                           |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `GITHUB_TOKEN`            | `GITHUB_TOKEN` or personal access token. **repo** and **read:org** scopes required for **personal access token(classic)**. For scenarios involving data collection from multiple repositories or handling a large number of pull requests, it's recommended to use a **personal access token (classic)**. This parameter is **required**                                                              | -                                                                       |
| `GITHUB_OWNER_FOR_ISSUE`  | Owner of the repository where an issue with the report needs to be created. This parameter is mandatory if `EXECUTION_OUTCOME` includes `new-issue` or `existing-issue` values.                                                                                                                                                                                                                       | -                                                                       |
| `GITHUB_REPO_FOR_ISSUE`   | The repository where an issue with the report needs to be created. This parameter is mandatory if `EXECUTION_OUTCOME` includes `new-issue` or `existing-issue` values.                                                                                                                                                                                                                                | -                                                                       |
| `GITHUB_OWNERS_REPOS`     | Repositories to collect data from. Enter values in the format `owner/repo`, separated by commas. Either `GITHUB_OWNERS_REPOS` or `ORGANIZATIONS` must be set. Example: `owner/repo, owner/another-repo`                                                                                                                                                                                               | -                                                                       |
| `ORGANIZATIONS`           | Organizations from whose repositories data needs to be collected., separated by commas. Repositories from these organizations will be added to the `GITHUB_OWNERS_REPOS` list to create an array with unique repositories. Either `GITHUB_OWNERS_REPOS` or `ORGANIZATIONS` must be set.                                                                                                               | -                                                                       |
| `SHOW_STATS_TYPES`        | Stats types that should be displayed in report. Values must be separated by commas. Can take values: `timeline`, `workload`, `pr-quality`, `code-review-engagement`, `response-time`. Example: `timeline, workload, pr-quality, code-review-engagement, response-time`                                                                                                                                | `timeline, workload, pr-quality, code-review-engagement, response-time` |
| `AGGREGATE_VALUE_METHODS` | Aggregate value methods for timelines that should be displayed in report. Values must be separated by commas. Can take values: `percentile`, `average`, `median`. Example: `percentile, average`                                                                                                                                                                                                      | `percentile`                                                            |
| `AMOUNT`                  | The number of closed pull requests to generate the report for. Ignored if `REPORT_DATE_START` or `REPORT_PERIOD` are specified.                                                                                                                                                                                                                                                                       | `100`                                                                   |
| `REVIEW_TIME_INTERVALS`   | Enables viewing the percentage distribution among specified values for the time from opening to review, given in hours. Example: `4, 8, 12`                                                                                                                                                                                                                                                           | -                                                                       |
| `APPROVAL_TIME_INTERVALS` | Enables viewing the percentage distribution among specified values for the time from opening to approve, given in hours. Example: `4, 8, 12`                                                                                                                                                                                                                                                          | -                                                                       |
| `MERGE_TIME_INTERVALS`    | Enables viewing the percentage distribution among specified values for the time from opening to merge, given in hours. Example: `4, 8, 12`                                                                                                                                                                                                                                                            | -                                                                       |
| `TOP_LIST_AMOUNT`         | The number of pull request links to display in the lists for longest-pending reviews, longest-pending approvals, longest-pending merges, and The most commented PRs. Lists will be sorted in descending order, showing the PR title and its value.                                                                                                                                                    | `5`                                                                     |
| `REPORT_DATE_START`       | Sets the start of the period for generating the report. Use the format **d/MM/yyyy**. The end of the period can be specified with the `REPORT_DATE_END` input. `REPORT_PERIOD` takes precedence over `REPORT_DATE_START`. Example: `20/10/2023`                                                                                                                                                       | -                                                                       |
| `REPORT_DATE_END`         | Sets the end of the period for generating the report. Use the format **d/MM/yyyy**. The start of the period can be specified with the `REPORT_DATE_START` input. Example: `25/10/2023`                                                                                                                                                                                                                | -                                                                       |
| `REPORT_PERIOD`           | Allows generating a report for a specified time period starting from the action's execution time. If `REPORT_DATE_END` is specified, the period will be limited to this end date. Values format `[unit]:value` separated by commas. Supported units: `years`, `months`, `weeks`, `days`, `hours`, `minutes`, `seconds`. Example: `weeks:2`                                                            | -                                                                       |
| `PERIOD_SPLIT_UNIT`       | Allows for the additional display of reports with data broken down by years, quarters, or months for the reporting period. This extra analysis will be added as comments in the issue. This breakdown can be removed by using the value `none`. Can take values: `years`, `quarters`, `months`, `none`                                                                                                | `months`                                                                |
| `CORE_HOURS_START`        | Start of core hours. Excludes non-working hours from the calculations of time-related metrics. By default, a full day is counted. Time should be entered in the format **HH:mm**. The timezone corresponds to that specified in the `TIMEZONE` input (default is UTC). For correct operation, `CORE_HOURS_END` must also be specified and must be later than `CORE_HOURS_START`. Example: `10:00`     | -                                                                       |
| `CORE_HOURS_END`          | End of core hours. Excludes non-working hours from the calculations of time-related metrics. By default, a full day is counted. Time should be entered in the format **HH:mm**. The timezone corresponds to that specified in the `TIMEZONE` input (default is UTC). For correct operation, `CORE_HOURS_END` must also be specified and must be later than `CORE_HOURS_START`. Example: `19:00`       | -                                                                       |
| `HOLIDAYS`                | Dates to be excluded from the calculations of time-related metrics. Saturday and Sunday are already excluded by default. Dates should be entered in the format **d/MM/yyyy**, separated by commas. Example: `01/01/2024, 08/03/2024`                                                                                                                                                                  | -                                                                       |
| `TIMEZONE`                | Timezone that will be used in action. Examples: `Europe/Berlin` or `America/New_York`. See the full list of time zones [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)                                                                                                                                                                                                           | `UTC`                                                                   |
| `PERCENTILE`              | Percentile value for timeline. This parameter is mandatory if `percentile` is specified in the `SHOW_STATS_TYPES` input.                                                                                                                                                                                                                                                                              | `75`                                                                    |
| `ISSUE_TITLE`             | Title for the created/updated issue with report                                                                                                                                                                                                                                                                                                                                                       | `Pull requests report(d/MM/yyyy HH:mm)`                                 |
| `LABELS`                  | Labels for the created/updated issue with report separated by commas. Example: `Report`                                                                                                                                                                                                                                                                                                               | -                                                                       |
| `ASSIGNEES`               | Assignees for the created/updated issue with report separated by commas. Example: `AlexSim93`                                                                                                                                                                                                                                                                                                         | -                                                                       |
| `HIDE_USERS`              | Hides selected users from reports, while still including their data in the analytics. Use `total` to hide total stats. Users should be separated by commas.                                                                                                                                                                                                                                           | -                                                                       |
| `SHOW_USERS`              | Displays only specified users in reports, but includes all users in the background analytics. Use `total` to show total stats. Users should be separated by commas.                                                                                                                                                                                                                                   | -                                                                       |
| `EXCLUDE_LABELS`          | PRs with mentioned labels will be excluded from the report . Values should be separated by commas. Example: `bugfix, enhancement`                                                                                                                                                                                                                                                                     | -                                                                       |
| `INCLUDE_LABELS`          | Only PRs with mentioned labels will be included in the report. Values should be separated by commas. Example: `bugfix, enhancement`                                                                                                                                                                                                                                                                   | -                                                                       |
| `EXECUTION_OUTCOME`       | This parameter allows you to specify the format in which you wish to receive the report. Options include creating a new issue, updating an existing one, obtaining markdown, or JSON. Markdown and JSON will be available in outputs. Can take mulitple values separated by commas: `new-issue`, `markdown`, `collection`, `existing-issue`. This parameter is **required** Example: `existing-issue` | `new-issue`                                                             |
| `ISSUE_NUMBER`            | Issue number to update. Add `existing-issue` to `EXECUTION_OUTCOME` for updating existing issue. The specified issue must already exist at the time the action is executed. This parameter is mandatory if the `EXECUTION_OUTCOME` input includes `existing-issue` value                                                                                                                              | -                                                                       |
| `ALLOW_ANALYTICS`         | Allows sending non-sensitive inputs to mixpanel for better understanding user's needs. Set the value to `false` to disable data transmission to Mixpanel                                                                                                                                                                                                                                              | `true`                                                                  |

Use these parameters to tailor the **pull-request-analytics-action** to your project's specific requirements.

## Outputs

Below is a table describing the possible outputs of **pull-request-analytics-action**:

| Output Option     | Description                                                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JSON_COLLECTION` | A string output containing a JSON object with all the data collected by the action. To receive this output, add `collection` to `EXECUTION_OUTCOME`. |
| `MARKDOWN`        | An output containing the report as a markdown string. To receive this output, add `markdown` to `EXECUTION_OUTCOME`.                                 |

## Privacy and Data Handling

**pull-request-analytics-action** is designed with privacy and data security as paramount concerns. The action operates statelessly, meaning it neither stores nor transmits any data obtained during its execution. All operations are conducted entirely within the GitHub environment to ensure the utmost privacy and security of user data.

In version `v2`, to better understand user needs and to allocate resources more efficiently for the action's development, some non-sensitive input data are transmitted to Mixpanel. This is strictly limited to inputs that do not compromise the security or privacy of your projects. The complete list of inputs sent can be reviewed in [this file](https://github.com/AlexSim93/pull-request-analytics-action/tree/v2/src/analytics/sendActionRun.ts).

Data transmission to Mixpanel can be disabled by setting the `ALLOW_ANALYTICS` input to `false`. However, we strongly encourage you not to disable this feature. The data sent poses no threat to your project's security or privacy but can significantly aid in the development and improvement of **pull-request-analytics-action**.

## Usage Limitations

**pull-request-analytics-action** operates within GitHub's API rate limits and message size constraints, which are generally sufficient for detailed, long-term reporting. However, in rare cases of extremely large datasets, some adjustments might be necessary. For more information, refer to GitHub's documentation on [rate limiting](https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api). The length of the report generated by **pull-request-analytics-action** is limited to 65,536 characters due to GitHub Issue size constraints.

## Recommendations and Tips

- Use a **Personal Access Token (classic)** to generate reports for multiple repositories or to support teams.
- Utilize the `schedule` event for optimal report updates. You can refresh the report every few hours or days to avoid exceeding rate limits and to keep the report up to date.
- To hide individual metrics, specify users in the `HIDE_USERS` parameter or leave `total` and GitHub team names in the `SHOW_USERS` parameter.
- To avoid a long list of title changes when updating an existing issue, it is recommended to set the title yourself using the `ISSUE_TITLE` parameter.
- You can filter pull requests using labels with the `EXCLUDE_LABELS` and `INCLUDE_LABELS` parameters.

## How You Can Help

Contributions to **pull-request-analytics-action** are always welcome, no matter how large or small. Here are some ways you can help:

- **Star the Project**: If you find **pull-request-analytics-action** useful, consider giving it a star :star: on GitHub. This helps increase its visibility and shows support for our work.
- **Spread the Word**: Mention **pull-request-analytics-action** in your articles, blog posts, and social media. The more people know about it, the better it gets.
- **Contribute to the Code**: Follow our contribution guidelines to make code contributions. Every pull request helps!
- **Report Bugs**: Encountered an issue? Please let us know by opening an issue on GitHub. This is crucial for continuous improvement.
- **Share Ideas**: Have ideas on how to improve **pull-request-analytics-action**? Open an issue and tell us about your suggestions.
- **Participate in Surveys**: Occasionally, we conduct surveys to gather feedback. Your participation would be invaluable in shaping the future of **pull-request-analytics-action**.
- **Get Featured**: If your company or project uses **pull-request-analytics-action**, let us know! We'd be proud to mention your name in our list of users. It's a great way for you to showcase your commitment to quality in software development, and it helps us demonstrate the real-world effectiveness of our tool.

Your support and contributions greatly enhance this project. Together, we can make it the best tool for analyzing pull requests!
