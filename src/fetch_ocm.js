
'use strict';

import fetch from 'node-fetch';
import { pipeline } from 'node:stream';
import { promisify } from 'util';
import * as tar from 'tar';

const streamPipeline = promisify(pipeline);

export async function fetchOCM(octokit, ocmVersion, os, arch) {
    let release = null;
        
    if (ocmVersion === 'latest') {
        const { data: r } = await octokit.rest.repos.getLatestRelease({
            owner: 'open-component-model',
            repo: 'ocm'
        });

        release = r;
    } else {
        const { data: r } = await octokit.rest.repos.getReleaseByTag({
            owner: 'open-component-model',
            repo: 'ocm',
            tag: ocmVersion
        });

        release = r;
    }

    const asset = release.assets.find(asset => asset.name.includes(`${os}-${arch}`));
    if (asset) {
        const ocmDownloadURL = asset.browser_download_url;
        console.log(`Downloading ${ocmDownloadURL}`);
        
        const response = await fetch(ocmDownloadURL);

        if (!response.ok) {
            throw `Failed to fetch the ocm asset: ${response.statusText}`;
        }

        await streamPipeline(response.body, tar.x({
            cwd: '.',
            sync: true
        }));
    } else {
        throw `No ocm asset found for the version ${ocmVersion}`;
    }
}
