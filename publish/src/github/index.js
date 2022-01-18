const core = require('@actions/core');
const github = require('@actions/github');

exports.getClient = function(token) {
    const octokit = github.getOctokit(token);

    return {
        async dispatchEvent(owner, repo, event) {
            core.debug(`Dispatching event ${event} to repository ${owner}/${repo}.`)
            
            octokit.rest.repos.createDispatchEvent({
                owner,
                repo,
                event_type: event
            });
        }
    };
}