'use strict';

import { exec } from 'child_process';
import { promisify } from 'util';


const execAsync = promisify(exec);

export async function createComponentVersion(componentDefinitionPath, componentArchivePath, version) {
    console.log(`Creating component version for ${componentDefinitionPath} in ${componentArchivePath}`);
    
    // call the ocm CLI to create the component version
    const { stdout, stderr } = await execAsync(`ocm add componentversions --create --file ${componentArchivePath} ${componentDefinitionPath} -- VERSION=${version}`);
}

export async function transferComponentVersion(componentArchivePath, targetRegistry) {
    console.log(`Transfering component version from ${componentArchivePath} to ${targetRegistry}`);
    
    // call the ocm CLI to transfer the component version
    const { stdout, stderr } = await execAsync(`ocm transfer ctf --copy-resources --recursive ${componentArchivePath} ${targetRegistry}`);
}