#!/usr/bin/env node
import { Command } from 'commander'
import inquirer from 'inquirer'
import chalk from 'chalk'
import ora from 'ora'
import { getGitStatus, getAllDiff, stageAll, commit, isGitRepo } from './git'
import { getConfig, setConfig, setAIConfig, isConfigured } from './config'
import { generateCommitMessage } from './ai'

const program = new Command()

program
  .name('git-autocommit')
  .alias('gac')
  .description('AI-powered Git commit message generator')
  .version('0.1.0')
  .option('-s, --stage', 'Auto stage all changes before commit')
  .option('-y, --yes', 'Skip confirmation and commit directly')
  .option('-e, --edit', 'Edit the generated message before commit')
  .action(async (options) => {
    await main(options)
  })

program
  .command('config')
  .description('Configure AI settings')
  .action(async () => {
    await configureSettings()
  })

async function main(options: { stage?: boolean; yes?: boolean; edit?: boolean }) {
  // 检查是否在Git仓库
  if (!isGitRepo()) {
    console.error(chalk.red('Error: Not a Git repository'))
    process.exit(1)
  }

  // 检查配置
  if (!isConfigured()) {
    console.log(chalk.yellow('AI not configured. Please run `git-autocommit config` first.'))
    await configureSettings()
  }

  const config = getConfig()
  const status = getGitStatus()

  // 显示状态
  console.log(chalk.blue(`\nBranch: ${status.branch}\n`))

  // 检查变更
  if (!status.hasUnstagedChanges && !status.hasStagedChanges) {
    console.log(chalk.green('No changes to commit.'))
    process.exit(0)
  }

  // 显示变更
  if (status.hasUnstagedChanges) {
    console.log(chalk.yellow('Unstaged changes:'))
    status.changes.forEach(c => {
      console.log(`  ${c.status}: ${c.file}`)
    })
  }

  if (status.hasStagedChanges) {
    console.log(chalk.green('\nStaged changes:'))
    status.stagedChanges.forEach(c => {
      console.log(`  ${c.status}: ${c.file}`)
    })
  }

  // 自动暂存
  if (options.stage || config.autoStage) {
    const spinner = ora('Staging changes...').start()
    stageAll()
    spinner.succeed('Changes staged')
  }

  // 获取diff
  const diff = getAllDiff(true)
  if (!diff) {
    console.log(chalk.red('No staged changes. Use --stage or git add first.'))
    process.exit(1)
  }

  // 生成提交信息
  const spinner = ora('Generating commit message...').start()
  try {
    let message = await generateCommitMessage(
      diff,
      config.ai,
      config.language,
      config.style
    )
    spinner.succeed('Message generated')

    console.log(chalk.cyan('\nGenerated commit message:'))
    console.log(chalk.white(`  ${message}\n`))

    // 编辑模式
    if (options.edit) {
      const { editedMessage } = await inquirer.prompt([{
        type: 'editor',
        name: 'editedMessage',
        message: 'Edit commit message:',
        default: message
      }])
      message = editedMessage.trim()
    }

    // 确认提交
    let shouldCommit = options.yes
    if (!shouldCommit) {
      const { confirm } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirm',
        message: 'Commit with this message?',
        default: true
      }])
      shouldCommit = confirm
    }

    if (shouldCommit) {
      commit(message)
      console.log(chalk.green('\n✓ Committed successfully!'))
    } else {
      console.log(chalk.yellow('Commit cancelled.'))
    }
  } catch (error: any) {
    spinner.fail('Failed to generate message')
    console.error(chalk.red(error.message))
    process.exit(1)
  }
}

async function configureSettings() {
  const config = getConfig()

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Select AI provider:',
      choices: ['openai', 'claude', 'deepseek'],
      default: config.ai.provider
    },
    {
      type: 'password',
      name: 'apiKey',
      message: 'Enter API key:',
      mask: '*',
      validate: (input) => input.length > 0 || 'API key is required'
    },
    {
      type: 'list',
      name: 'language',
      message: 'Commit message language:',
      choices: ['zh', 'en'],
      default: config.language
    },
    {
      type: 'list',
      name: 'style',
      message: 'Commit message style:',
      choices: ['conventional', 'simple', 'detailed'],
      default: config.style
    },
    {
      type: 'confirm',
      name: 'autoStage',
      message: 'Auto stage changes before commit?',
      default: config.autoStage
    }
  ])

  setAIConfig({
    provider: answers.provider,
    apiKey: answers.apiKey
  })

  setConfig({
    language: answers.language,
    style: answers.style,
    autoStage: answers.autoStage
  })

  console.log(chalk.green('\n✓ Configuration saved!'))
}

program.parse()