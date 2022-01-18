const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const core = require('@actions/core');
const glob = require('@actions/glob');

exports.getClient = function(githubClient) {
    return {
        async parseFile(file) {
            core.debug(`Parsing living documentation file ${file}.`);

            const config = await readFile(file);

            const executionFile = config.execution.file;

            core.debug(`Find execution file ${executionFile}.`);

            const globber = await glob.create(`${path.dirname(file)}/**/${executionFile}`);
            const files = await globber.glob();

            if (files.length === 0) {
                core.warning(`${executionFile} not found in ${path.dirname(file)}.`);
                config.execution = null;
                return config;
            }
            
            config.execution.file = files[0];
            
            config.branches = await getBranches(config, githubClient);

            return config;
        }
    };
}

async function readFile(file) {    
    const content = await fs.promises.readFile(file);
    const json = yaml.load(content);
    return json;
}

async function getBranches(config, githubClient) {
    if (config.branch != undefined)
        return [ config.branch ];
    
    throw new Error('Not implemented');
}