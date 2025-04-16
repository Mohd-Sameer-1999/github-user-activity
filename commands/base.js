import chalk from "chalk"
async function fetchUserEvents(username = "") {
  try{
      const response = await fetch(`https://api.github.com/users/${username}/events`, {
              headers: {
                  "Accept": "application/vnd.github+json",
                  "User-Agent": "github-user-activity"
              }
          });
      
      if(!response.ok){
          throw new Error(`Gtihub API Error: ${response.status}- ${response.statusText}`);
      }
      const events = await response.json();
      return events.map(event => formatEvent(event));

  } catch(error) {
      throw new Error(`Error fetching events - ${error}`);
  }
}

function formatEvent(event) {
    const repoName = chalk.blueBright(event.repo?.name);
  
    switch (event.type) {
      case 'PushEvent':
        const commitCount = event.payload.size;
        const commits = chalk.yellow(`${commitCount} commit${commitCount !== 1 ? 's' : ''}`);
        return `- Pushed ${commits} to ${repoName}`;
  
      case 'IssuesEvent':
        const action = event.payload.action;
        const issueNum = chalk.yellow(`#${event.payload.issue.number}`);
        return `- ${action.charAt(0).toUpperCase() + action.slice(1)} issue ${issueNum} in ${repoName}`;
  
      case 'WatchEvent':
        return `- Starred repository ${repoName}`;
  
      case 'PullRequestEvent':
        const prAction = event.payload.action;
        const prNum = chalk.yellow(`#${event.payload.number}`);
        return `- ${prAction.charAt(0).toUpperCase() + prAction.slice(1)} PR ${prNum} in ${repoName}`;
  
      case 'ForkEvent':
        return `- Forked ${repoName} to ${chalk.blueBright(event.payload.forkee.full_name)}`;
  
      case 'IssueCommentEvent':
        const commentAction = event.payload.action;
        const commentedIssue = chalk.yellow(`#${event.payload.issue.number}`);
        return `- ${commentAction} comment on issue ${commentedIssue} in ${repoName}`;
  
      default:
        return `- Performed ${chalk.gray(event.type)} in ${repoName}`;
    }
}

export default fetchUserEvents;