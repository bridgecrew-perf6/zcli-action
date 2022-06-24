const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const shell = require('shelljs');

async function run() {
  try {
    const dateTime = (new Date()).toLocaleString('pt-BR');

    const { 
      ref,
      eventName
    } = github.context;

    const {
      repository
    } = github.context.payload

    shell.echo(`💡 Job started at ${dateTime}`);
    shell.echo(`🖥️ Job was automatically triggered by ${eventName} event`);
    shell.echo(`🔎 The name of your branch is ${ref} and your repository is ${repository.name}.`)
    
    shell.echo(`🐧 Setting up the environment...`);

    await exec.exec('npm install @zendesk/zcli --location=global')
    await exec.exec('npm install yarn --location=global')
    await exec.exec('npm install typescript --location=global')
    
    shell.echo(`🔎 Building & Validating...`);
    await exec.exec('yarn install')
    await exec.exec('yarn build')
    await exec.exec('zcli apps:validate dist')

    shell.echo(`🚀 Deploying the application...`);
    //await exec.exec('zcli apps:update dist')

    shell.echo(`🎉 Job has been finished`);
  } catch (error) {
    core.setFailed(error.message);
  }
}


run();