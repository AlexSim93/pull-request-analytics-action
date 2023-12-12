# Pull request analytics action

**pull-request-analytics-action**: A powerful tool designed for generating detailed code review reports. This action creates tables and graphs focused on key metrics derived from closed pull requests and reviews. These metrics are instrumental in identifying bottlenecks in the review process and measuring the productivity of both individual developers and the team as a whole. A significant advantage of **pull-request-analytics-action** is that all data processing is conducted within the GitHub environment, ensuring data privacy and security. This tool is completely free and open source, making it an attractive choice for a wide range of users.

## Table of Contents

- [Key Features](#key-features)
- [Getting started](#getting-started)
- [Report examples](#report-examples)
- [Detailed Report on Discussion Types](#detailed-report-on-discussion-types)
- [Report Data Grouping, AMOUNT Parameter, and Time Calculation Logic](#detailed-report-on-discussion-types)
- [Configuration Parameters Overview](#configuration-parameters-overview)
- [Privacy and Data Handling](#privacy-and-data-handling)
- [Usage Limitations](#usage-limitations)
- [License](#license)

## Key Features:

- **Customizable Tables and Graphs for Review Timelines**: Generates user-friendly tables and graphs that mark critical milestones from PR opening to review, approval, and merge. Users can select the calculation method best suited for them, choosing from median, mean (average), or a selected percentile. This feature helps to identify bottlenecks in the code review process.
  | user | Time to review | Time to approve | Time to merge | Total merged PRs |
  | :------: | :------: | :------: | :------: | :------: |
  | **Developer-1** | 1 hour 39 minutes | 1 hour 39 minutes | 17 hours 10 minutes | 7 |
  | **Developer-2** | 4 hours 20 minutes | 5 hours 48 minutes | 20 hours 33 minutes | 9 |
  | **Developer-3** | 5 hours 25 minutes | 26 hours 40 minutes | 48 hours 30 minutes | 2 |
  | **Developer-4** | 1 hour | 3 hours 27 minutes | 14 hours 14 minutes | 4 |
  | **total** | 2 hours 39 minutes | 4 hours 14 minutes | 20 hours 33 minutes | 22 |

```mermaid
gantt
title Pull requests timeline(percentile75) 12/2023 / minutes
dateFormat X
axisFormat %s
section Developer-1
Time to review :  0, 99
Time to approve :  0, 99
Time to merge :  0, 1030

section Developer-2
Time to review :  0, 260
Time to approve :  0, 348
Time to merge :  0, 1233

section Developer-3
Time to review :  0, 325
Time to approve :  0, 1600
Time to merge :  0, 2910

section Developer-4
Time to review :  0, 60
Time to approve :  0, 207
Time to merge :  0, 854

section total
Time to review :  0, 159
Time to approve :  0, 254
Time to merge :  0, 1233

```

- **Comprehensive Report on Merged PRs, Code Changes, and Reviews**: This feature compiles a report detailing the number of merged PRs, lines of code modified, and reviews conducted. It provides an approximate measure of the workload, both for individual developers and the team as a whole, offering a clear view of productivity and contribution.

|      user       | Total opened PRs | Total merged PRs | Additions/Deletions | Total comments | Reviews conducted |
| :-------------: | :--------------: | :--------------: | :-----------------: | :------------: | :---------------: |
| **Developer-1** |        7         |        7         |      +158/-113      |       0        |         9         |
| **Developer-2** |        10        |        9         |     +1010/-3690     |       3        |         5         |
| **Developer-3** |        2         |        2         |      +138/-108      |       15       |         3         |
| **Developer-4** |        4         |        4         |      +326/-142      |       12       |         3         |
| **Developer-5** |        0         |        0         |        +0/-0        |       0        |         3         |
|    **total**    |        23        |        22        |     +1632/-4053     |       30       |        21         |

- **Quality Report on Developer-Initiated PRs**: This feature generates a report analyzing the quality of PRs opened by developers. It collates data on the number of comments received, discussions held, and reasons for these discussions, along with the quantity of requested changes in open PRs, all presented in both tabular and graphical formats. This functionality aids in identifying the most problematic areas detected during code reviews and quantifying their extent.

  |      user       | Total merged PRs | Changes requested received | Discussions received | Comments received |
  | :-------------: | :--------------: | :------------------------: | :------------------: | :---------------: |
  | **Developer-1** |        7         |             0              |          0           |         0         |
  | **Developer-2** |        9         |             2              |          2           |         2         |
  | **Developer-3** |        2         |             1              |          6           |         8         |
  | **Developer-4** |        4         |             0              |          7           |         7         |
  |    **total**    |        22        |             3              |          15          |        17         |

```mermaid
pie
title Discussions types total 12/2023
"Bug(7)":7
"Performance(4)":4
"Code complexity(2)":2
"Test coverage(1)":1
```

- **Developer Engagement in Code Review Process**: This feature assesses the level of developer participation in code reviews. It provides a table showing the discussions initiated, comments made, along with a breakdown of the number of code reviews conducted and the decisions made. This enables you to gauge the involvement of developers in the review process effectively.

|      user       | Total merged PRs | Discussions conducted | Comments conducted | Changes requested / Comments / Approvals |
| :-------------: | :--------------: | :-------------------: | :----------------: | :--------------------------------------: |
| **Developer-1** |        7         |           9           |         11         |                3 / 2 / 9                 |
| **Developer-2** |        9         |           4           |         4          |                0 / 1 / 5                 |
| **Developer-3** |        2         |           0           |         0          |                0 / 0 / 3                 |
| **Developer-4** |        4         |           0           |         0          |                0 / 0 / 3                 |
| **Developer-5** |        0         |           2           |         2          |                0 / 0 / 3                 |
|    **total**    |        22        |          15           |         17         |                3 / 5 / 21                |

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
     name: "PR analytics workflow"
     on:
       workflow_dispatch:
         inputs:
           amount:
             description: "Amount of PRs"
             required: false
             default: "100"
           report_date_start:
             description: "Report date start(d/MM/yyyy)"
             required: false
           report_date_end:
             description: "Report date end(d/MM/yyyy)"
             required: false
           core_hours_start:
             description: "Core hours start(HH:mm)"
             required: false
             default: "09:00"
           core_hours_end:
             description: "Core hours end(HH:mm)"
             required: false
             default: "20:00"
           percentile:
             description: "Percentile"
             required: false
             default: "75"
     jobs:
       create-report:
         name: "Create report"
         runs-on: ubuntu-latest
         steps:
           - name: "Run Pull Request analytics action"
             uses: AlexSim93/pull-request-analytics-action@v1.3.0
             with:
               GITHUB_OWNERS_REPOS: owner-1/repo-1, owner-2/repo-2, owner-1/repo-3
               GITHUB_REPO_FOR_ISSUE: "repository-for-report-creation"
               GITHUB_OWNER_FOR_ISSUE: "owner-of-repository-for-report-creation"
               AMOUNT: ${{ inputs.amount }}
               CORE_HOURS_START: ${{ inputs.core_hours_start }}
               CORE_HOURS_END: ${{ inputs.core_hours_end }}
               PERCENTILE: ${{ inputs.percentile }}
               REPORT_DATE_START: ${{ inputs.report_date_start }}
               REPORT_DATE_END: ${{ inputs.report_date_end }}
               LABELS: report
               ASSIGNEES: assignee
               GITHUB_TOKEN: ${{ secrets.KEY }}
     ```
   - Adjust parameters to match your project's needs.

4. **Commit and Push the Workflow File**:

   - Save your changes and commit the file to your repository.
   - Push it to enable the GitHub Action workflow.

5. **Run the Workflow**:

   - In your repository, go to the 'Actions' tab.
   - Select **PR full report workflow** and start it via "Run workflow".
   - Fill in any necessary parameters and execute the action.

6. **Review the Generated Report**:
   - Once the action completes, your detailed PR report will be available.
   - If configured, check for a new issue in the specified repository containing the report.

This setup allows you to fully leverage **pull-request-analytics-action** for comprehensive PR analysis, tailored to your project’s needs.

## Report Examples

Explore how **pull-request-analytics-action** works with these report examples in the project:

1. **Multi-Month Report**: Analysis over several months. [View Example](https://github.com/AlexSim93/pull-request-analytics-action/blob/master/examples/periodReport.md).

2. **Last N PRs Report**: Insights into the most recent pull requests. [View Example](https://github.com/AlexSim93/pull-request-analytics-action/blob/master/examples/nPRsReport.md).

Click the links for detailed report formats and insights.

## Detailed Report on Discussion Types

To obtain a detailed report on the types of open discussions, it is necessary to include a specific label in the first message of each discussion, enclosed in double square brackets (`[[ ]]`). For example, use `[[Performance issue]]` to categorize a discussion as related to performance issues. The action will then provide a breakdown of discussions based on these labels, allowing for a more targeted and categorized analysis of discussion topics.

**Example Usage**:

- In the first comment of a pull request discussion, include a label like `[[Bug]]`, `[[Feature Request]]`, or any custom label of your choice.
- **pull-request-analytics-action** will recognize these labels and include them in the report, providing a categorized overview of discussions.

This feature enhances the analytical capabilities of **pull-request-analytics-action**, offering a deeper insight into the nature and distribution of discussions in your pull requests.

## Report Data Grouping, AMOUNT Parameter, and Time Calculation Logic

- **Data Grouping**: The report data is organized based on the closure date of each pull request.
- **Using AMOUNT Parameter**: When `AMOUNT` is specified without `REPORT_DATE_START`, the report includes the specified number of most recently modified pull requests. However, the report count may be less than the `AMOUNT` specified, as it only includes merged pull requests.

- **Excluding Weekends and Non-Working Hours**: The calculations for the report exclude weekends. Furthermore, when `CORE_HOURS_START` and `CORE_HOURS_END` are set, time outside of these core working hours is not considered in the time-related metrics.

## Configuration Parameters Overview

Below is a table outlining the various configuration parameters available for **pull-request-analytics-action**. These parameters allow you to customize the behavior of the action to fit your specific needs. Each parameter's name, description, requirement status, and default value (if applicable) are listed for your reference:

| Parameter Name            | Description                                                                                                  | Required | Default Value                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------- |
| `GITHUB_TOKEN`            | Github token                                                                                                 | Yes      | -                                       |
| `GITHUB_OWNERS_REPOS`     | Github owner/repository list separated by comma                                                              | Yes      | -                                       |
| `GITHUB_REPO_FOR_ISSUE`   | GitHub repository for issue creation                                                                         | Yes      | -                                       |
| `GITHUB_OWNER_FOR_ISSUE`  | Owner of the repository for issue                                                                            | Yes      | -                                       |
| `AGGREGATE_VALUE_METHODS` | Aggregate value methods for timelines separated by comma. Can take values: `percentile`, `average`, `median` | No       | `percentile`                            |
| `AMOUNT`                  | Number of pull requests in the report. Ignored if the `REPORT_DATE_START` is set                             | No       | `100`                                   |
| `REPORT_DATE_START`       | Start date for the report (d/MM/yyyy)                                                                        | No       | -                                       |
| `REPORT_DATE_END`         | End date for the report (d/MM/yyyy)                                                                          | No       | -                                       |
| `CORE_HOURS_START`        | Start of core hours (HH:mm)                                                                                  | No       | -                                       |
| `CORE_HOURS_END`          | End of core hours (HH:mm)                                                                                    | No       | -                                       |
| `TIMEZONE`                | Timezone that will be used in action                                                                         | No       | `UTC`                                   |
| `PERCENTILE`              | Percentile value for timeline                                                                                | No       | `75`                                    |
| `ISSUE_TITLE`             | Title for the created issue                                                                                  | No       | `Pull requests report(d/MM/yyyy HH:mm)` |
| `LABELS`                  | Labels for the created issue separated by comma                                                              | No       | -                                       |
| `ASSIGNEES`               | Assignees for the issue separated by comma                                                                   | No       | -                                       |
| `HIDE_USERS`              | Hidden users separated by comma                                                                              | No       | -                                       |
| `SHOW_USERS`              | Shown users separated by comma                                                                               | No       | -                                       |
| `EXCLUDE_LABELS`          | Excludes PRs with mentioned labels. Values should be separated by comma                                      | No       | -                                       |
| `INCLUDE_LABELS`          | Includes only PRs with mentioned labels. Values should be separated by comma                                 | No       | -                                       |

Use these parameters to tailor the **pull-request-analytics-action** to your project's specific requirements.

## Privacy and Data Handling

**pull-request-analytics-action** is designed with privacy and security in mind. It operates as a stateless application, ensuring it does not retain or store any user data externally. All processing is performed within your GitHub environment, maintaining strict data confidentiality. We prioritize the security of your information, ensuring no external data collection or storage, thereby safeguarding the integrity and privacy of your workflow.

## Usage Limitations

**pull-request-analytics-action** operates within GitHub's API rate limits and message size constraints, which are generally sufficient for detailed, long-term reporting. However, in rare cases of extremely large datasets, some adjustments might be necessary. For more information, refer to GitHub's documentation on [rate limiting](https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api). The length of the report generated by **pull-request-analytics-action** is limited to 65,536 characters due to GitHub Issue size constraints.

## License

**pull-request-analytics-action** is licensed under the [MIT License](https://opensource.org/licenses/MIT). This permits free use, modification, and distribution of the software, with the requirement of including the original copyright notice. For full license terms, see the [MIT License details](https://opensource.org/licenses/MIT).
