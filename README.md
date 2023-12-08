# Pull request analytics action

**pull-request-analytics-action** is a comprehensive tool designed to generate detailed reports on closed pull requests (PRs). This powerful GitHub Action aids in tracking and analyzing the efficiency and productivity of software development workflows.

## Key Features:

- **PR Timeline Analysis**: Generates a table showcasing the time taken from PR opening to the first review, approval, and final merge. This feature helps in understanding the responsiveness and review efficiency within the team.
- **Developer-Specific Metrics**: Calculates and presents both median and average values for each metric, broken down by individual developers. This allows for a granular analysis of each team member's performance.
- **Aggregate Statistics**: Provides an overall summary of all the metrics for the entire team, offering a bird's-eye view of the team's collective performance.
- **Customizable Time Frame**: Users can set the time period for which the report is generated, making the tool flexible and adaptable to different project timelines.
- **Graphical Representation**: Visualizes the timeline data in the form of clear, intuitive graphs for easier comprehension and presentation.
- **Additional Metrics**: Apart from timeline analysis, this Action also reports on the number of open PRs, lines of code added or deleted, comments received on PRs, and the count of code reviews conducted by each developer. This comprehensive data set offers a deeper insight into the coding and collaboration activities of the team.
- **Developer and Team Overview**: While providing detailed data for individual developers, it also compiles an aggregate summary, enabling both micro and macro-level analysis of team performance.

This GitHub Action, **pull-request-analytics-action**, is an essential tool for any team seeking to optimize their software development process, ensuring more efficient and effective project management.

## Setting Up and Running pull-request-analytics-action

To integrate **pull-request-analytics-action** into your GitHub repository, use the following steps. The provided code is a template and can be adjusted to fit your specific requirements:

1. **Create a Workflow File**:

   - Navigate to the `.github/workflows` directory in your repository.
   - Create a YAML file, for example, `pr-full-report-workflow.yml`.

2. **Insert and Customize the Workflow Code**:

   - Open your new YAML file and paste the following example workflow. This is a starting template and you can modify it as needed:
     ```yaml
     name: "PR full report workflow"
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
           - name: "Run PRs full report action"
             uses: AlexSim93/pull-request-analytics-action@v1.0.0
             with:
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
               GITHUB_OWNERS_REPOS: owner-1/repo-1, owner-2/repo-2, owner-1/repo-3
     ```
   - Adjust parameters to match your project's needs.

3. **Commit and Push the Workflow File**:

   - Save your changes and commit the file to your repository.
   - Push it to enable the GitHub Action workflow.

4. **Run the Workflow**:

   - In your repository, go to the 'Actions' tab.
   - Select **PR full report workflow** and start it via "Run workflow".
   - Fill in any necessary parameters and execute the action.

5. **Review the Generated Report**:
   - Once the action completes, your detailed PR report will be available.
   - If configured, check for a new issue in the specified repository containing the report.

This setup allows you to fully leverage **pull-request-analytics-action** for comprehensive PR analysis, tailored to your project’s needs.

## Report Examples

Explore how **pull-request-analytics-action** works with these report examples in the project:

1. **Multi-Month Report**: Analysis over several months. [View Example](https://github.com/AlexSim93/pull-request-analytics-action/blob/master/examples/periodReport.md).

2. **Last N PRs Report**: Insights into the most recent pull requests. [View Example](https://github.com/AlexSim93/pull-request-analytics-action/blob/master/examples/nPRsReport.md).

Click the links for detailed report formats and insights.

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
| `PERCENTILE`              | Percentile value for timeline                                                                                | No       | `75`                                    |
| `ISSUE_TITLE`             | Title for the created issue                                                                                  | No       | `Pull requests report(d/MM/yyyy HH:mm)` |
| `LABELS`                  | Labels for the created issue separated by comma                                                              | No       | -                                       |
| `ASSIGNEES`               | Assignees for the issue separated by comma                                                                   | No       | -                                       |
| `HIDE_USERS`              | Hidden users separated by comma                                                                              | No       | -                                       |
| `SHOW_USERS`              | Shown users separated by comma                                                                               | No       | -                                       |

Use these parameters to tailor the **pull-request-analytics-action** to your project's specific requirements.

## Privacy and Data Handling

**pull-request-analytics-action** is designed with privacy and security in mind. It operates as a stateless application, ensuring it does not retain or store any user data externally. All processing is performed within your GitHub environment, maintaining strict data confidentiality. We prioritize the security of your information, ensuring no external data collection or storage, thereby safeguarding the integrity and privacy of your workflow.

## Usage Limitations

**pull-request-analytics-action** operates within GitHub's API rate limits and message size constraints, which are generally sufficient for detailed, long-term reporting. However, in rare cases of extremely large datasets, some adjustments might be necessary. For more information, refer to GitHub's documentation on [rate limiting](https://docs.github.com/en/rest/overview/rate-limits-for-the-rest-api). The length of the report generated by **pull-request-analytics-action** is limited to 65,536 characters due to GitHub Issue size constraints.

## Upcoming Features and Roadmap

At **pull-request-analytics-action**, we are committed to continuous improvement and adding functionalities that enhance your experience and the utility of our tool. Here's a glimpse into some exciting features and enhancements planned for the near future:

1. **Multi-Repository Reporting**: We are working on a feature that will allow users to compile reports across multiple repositories simultaneously. This will enable a more comprehensive analysis for teams managing multiple projects, providing a holistic view of their development activities.

2. **Detailed Open PR Discussions and Review Analysis**: Understanding the quality and depth of discussions in PRs is crucial. We plan to introduce more detailed reporting on open PR discussions and code reviews, offering insights into the nature and effectiveness of team collaborations and feedback.

3. **Enhanced Customization Options for Reports**: Recognizing the diverse needs of different teams, we aim to expand the customization capabilities of our reports. This enhancement will allow users to tailor reports more precisely to their specific requirements, ensuring that the reports are as relevant and informative as possible.

These upcoming features are designed with your feedback and needs in mind, striving to make **pull-request-analytics-action** more adaptable, insightful, and supportive of your project management and development workflows.

Stay tuned for these updates, and feel free to contribute your ideas or suggestions!

## License

**pull-request-analytics-action** is licensed under the [MIT License](https://opensource.org/licenses/MIT). This permits free use, modification, and distribution of the software, with the requirement of including the original copyright notice. For full license terms, see the [MIT License details](https://opensource.org/licenses/MIT).
