import { execSync } from 'child_process'

export interface GitChange {
  file: string
  status: 'added' | 'modified' | 'deleted' | 'renamed'
  diff: string
}

export interface GitStatus {
  branch: string
  changes: GitChange[]
  stagedChanges: GitChange[]
  hasUnstagedChanges: boolean
  hasStagedChanges: boolean
}

/**
 * 获取当前Git状态
 */
export function getGitStatus(): GitStatus {
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim()

  // 获取未暂存的变更
  const unstagedOutput = execSync('git status --porcelain', { encoding: 'utf-8' })
  const stagedOutput = execSync('git diff --cached --name-status', { encoding: 'utf-8' })

  const changes = parseChanges(unstagedOutput)
  const stagedChanges = parseStagedChanges(stagedOutput)

  return {
    branch,
    changes,
    stagedChanges,
    hasUnstagedChanges: changes.length > 0,
    hasStagedChanges: stagedChanges.length > 0
  }
}

/**
 * 获取文件diff
 */
export function getFileDiff(file: string, staged = false): string {
  try {
    const cmd = staged
      ? `git diff --cached "${file}"`
      : `git diff "${file}"`
    return execSync(cmd, { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 10 })
  } catch {
    return ''
  }
}

/**
 * 获取所有变更的diff
 */
export function getAllDiff(staged = false): string {
  try {
    const cmd = staged
      ? 'git diff --cached'
      : 'git diff'
    return execSync(cmd, { encoding: 'utf-8', maxBuffer: 1024 * 1024 * 10 })
  } catch {
    return ''
  }
}

/**
 * 暂存所有变更
 */
export function stageAll(): void {
  execSync('git add -A')
}

/**
 * 暂存指定文件
 */
export function stageFile(file: string): void {
  execSync(`git add "${file}"`)
}

/**
 * 执行提交
 */
export function commit(message: string): void {
  execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`)
}

/**
 * 检查是否在Git仓库中
 */
export function isGitRepo(): boolean {
  try {
    execSync('git rev-parse --is-inside-work-tree', { encoding: 'utf-8' })
    return true
  } catch {
    return false
  }
}

/**
 * 解析git status输出
 */
export function parseChanges(output: string): GitChange[] {
  const changes: GitChange[] = []
  const lines = output.trim().split('\n').filter(Boolean)

  for (const line of lines) {
    const status = line.substring(0, 2).trim()
    const file = line.substring(3).trim()

    let changeStatus: GitChange['status']
    switch (status) {
      case 'A':
      case '??':
        changeStatus = 'added'
        break
      case 'D':
        changeStatus = 'deleted'
        break
      case 'R':
        changeStatus = 'renamed'
        break
      default:
        changeStatus = 'modified'
    }

    changes.push({
      file,
      status: changeStatus,
      diff: ''
    })
  }

  return changes
}

/**
 * 解析已暂存的变更
 */
export function parseStagedChanges(output: string): GitChange[] {
  const changes: GitChange[] = []
  const lines = output.trim().split('\n').filter(Boolean)

  for (const line of lines) {
    const parts = line.split('\t')
    if (parts.length < 2) continue

    const statusChar = parts[0]
    const file = parts[1]

    let status: GitChange['status']
    switch (statusChar) {
      case 'A':
        status = 'added'
        break
      case 'D':
        status = 'deleted'
        break
      case 'R':
        status = 'renamed'
        break
      default:
        status = 'modified'
    }

    changes.push({ file, status, diff: '' })
  }

  return changes
}