const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const core = require('@actions/core');
const glob = require('@actions/glob');

exports.getClient = function(githubClient) {
    return {
        async parseFile(file) {
            core.debug(`Parsing living documentation file ${file}.`);

            const config = await getConfig(file);

            if (config.results != undefined) {
                config.results.file = await findTestResult(path.dirname(file), config);
            }
            
            config.branches = await getBranches(config, githubClient);

            return config;
        }
    };
}

async function getConfig(file) {    
    const content = await fs.promises.readFile(file);
    const json = yaml.load(content);
    return json;
}

async function findTestResult(dir, config) {
    if (config.results?.file == undefined)
        return;
    
    core.debug(`Find test result ${config.results.file}.`);

    const globber = await glob.create(`${dir}/**/${config.results.file}`);
    const files = await globber.glob();

    if (files.length === 0) {
        core.warning(`${config.results.file} not found in ${path.dirname(file)}.`);
        return;
    }
    
    return files[0];
}

async function getBranches(config, githubClient) {
    if (config.branch != undefined)
        return [ config.branch ];
    
    //TODO: find branches based on config.hash or config.version
    throw new Error('Not implemented');
}