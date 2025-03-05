const core = require('@actions/core');
const github = require('@actions/github');

try {
    const token = core.getInput('token');
    const ocmVersion = core.getInput('ocm-version');
    const baseURL = core.getInput('base-url');

    


} catch (error) {
    core.setFailed(error.message);
}

