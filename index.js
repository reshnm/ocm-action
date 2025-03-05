'use strict';

import { join } from 'node:path';
import { tmpdir, platform, arch } from 'node:os';
import { promisify } from 'node:util';
import { mkdtemp } from 'node:fs';

import core from '@actions/core';
import github from '@actions/github';

import { fetchOCM } from './src/fetch_ocm.js';
import { createComponentVersion, transferComponentVersion } from './src/create_cv.js';


const mkdtempAsync = promisify(mkdtemp);

try {
    async function run() {
        const token = core.getInput('token');
        const baseURL = core.getInput('base-url');
        const ocmVersion = core.getInput('ocm-version');
        const componentsDefinitionPath = core.getInput('components-definition-path');
        const version = core.getInput('version');

        console.log(`Hello from the action!`);
        console.log(`OCM Version: ${ocmVersion}`);
        console.log(`Base URL: ${baseURL}`);
        console.log(`Components Descriptor: ${componentsDefinitionPath}`);
        console.log(`Version: ${version}`);

        console.log(`Getting the version "${ocmVersion}" of OCM`);
        
        const octokit = github.getOctokit(token);
    
        const os = platform();
        const architecture = arch();

        console.log(`OS: ${os}`);
        console.log(`Architecture: ${architecture}`);

        const workingDir = await mkdtempAsync(join(tmpdir(), 'ocm-'));

        await fetchOCM(octokit, ocmVersion, os, architecture);

        await createComponentVersion(componentsDefinitionPath, workingDir, version);
        await transferComponentVersion(workingDir, baseURL);
    }

    run();

} catch (error) {
    core.setFailed(error.message);
}

