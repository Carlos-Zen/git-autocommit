import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { execSync } from 'child_process'
import { parseChanges, parseStagedChanges } from '../src/git'

// Mock execSync
vi.mock('child_process', () => ({
  execSync: vi.fn()
}))

describe('parseChanges', () => {
  it('should parse added files', () => {
    const output = 'A  src/new-file.ts'
    const changes = parseChanges(output)

    expect(changes).toHaveLength(1)
    expect(changes[0].file).toBe('src/new-file.ts')
    expect(changes[0].status).toBe('added')
  })

  it('should parse modified files', () => {
    const output = 'M  src/existing-file.ts'
    const changes = parseChanges(output)

    expect(changes).toHaveLength(1)
    expect(changes[0].file).toBe('src/existing-file.ts')
    expect(changes[0].status).toBe('modified')
  })

  it('should parse deleted files', () => {
    const output = 'D  src/old-file.ts'
    const changes = parseChanges(output)

    expect(changes).toHaveLength(1)
    expect(changes[0].file).toBe('src/old-file.ts')
    expect(changes[0].status).toBe('deleted')
  })

  it('should parse untracked files', () => {
    const output = '?? untracked-file.ts'
    const changes = parseChanges(output)

    expect(changes).toHaveLength(1)
    expect(changes[0].file).toBe('untracked-file.ts')
    expect(changes[0].status).toBe('added')
  })

  it('should parse multiple files', () => {
    const output = `M  src/file1.ts
A  src/file2.ts
D  src/file3.ts`
    const changes = parseChanges(output)

    expect(changes).toHaveLength(3)
    expect(changes[0].status).toBe('modified')
    expect(changes[1].status).toBe('added')
    expect(changes[2].status).toBe('deleted')
  })

  it('should handle empty output', () => {
    const changes = parseChanges('')
    expect(changes).toHaveLength(0)
  })
})

describe('parseStagedChanges', () => {
  it('should parse staged added files', () => {
    const output = 'A\tsrc/staged-file.ts'
    const changes = parseStagedChanges(output)

    expect(changes).toHaveLength(1)
    expect(changes[0].file).toBe('src/staged-file.ts')
    expect(changes[0].status).toBe('added')
  })

  it('should parse staged modified files', () => {
    const output = 'M\tsrc/modified.ts'
    const changes = parseStagedChanges(output)

    expect(changes).toHaveLength(1)
    expect(changes[0].status).toBe('modified')
  })

  it('should parse staged renamed files', () => {
    const output = 'R\tsrc/old.ts\tsrc/new.ts'
    const changes = parseStagedChanges(output)

    expect(changes).toHaveLength(1)
    expect(changes[0].status).toBe('renamed')
  })
})