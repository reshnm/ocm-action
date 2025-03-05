const core = require('@actions/core');
const github = require('@actions/github');

try {
    const token = core.getInput('token');
    const ocmVersion = core.getInput('ocm-version');
    const baseURL = core.getInput('base-url');


    console.log(`Hello from the action!`);
    console.log(`OCM Version: ${ocmVersion}`);
    console.log(`Base URL: ${baseURL}`);
    
    // I want to get the latest release of github.com/open-component-model/ocm
    const octokit = github.getOctokit(token);
    octokit.repos.getLatestRelease({
        owner: 'open-component-model',
        repo: 'ocm'
    }).then(response => {
        console.log(response.data.tag_name);
        core.setOutput('tag', response.data.tag_name);
    });

} catch (error) {
    core.setFailed(error.message);
}

