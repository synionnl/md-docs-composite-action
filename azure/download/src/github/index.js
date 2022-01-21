const core = require('@actions/core');
const github = require('@actions/github');

exports.getClient = function(token, repository) {
    const octokit = github.getOctokit(token);    
    return {
        async branches(owner, repo) {
            core.info(`Downloading branches from repository ${owner}/${repo}.`);
            
            const branches = [];

            let page = 0;
            do {
                page++;

                const response = await octokit.rest.repos.listBranches({
                    owner,
                    repo,
                    per_page: 100,
                    page: page
                });

                core.debug(`Downloaded branches ${response.data.map(b => b.name).join(', ')}`);

                branches.push(...response.data.map(b => b.name));
            }
            while (page > 0 && branches.length % 100 === 0);            
            
            core.info(`Downloaded ${branches.length} branches.`);

            return branches;
        }
    };
}