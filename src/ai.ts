import { AIConfig } from './config'

interface AIProviderConfig {
  endpoint: string
  model: string
  headers: (apiKey: string) => Record<string, string>
  buildBody: (prompt: string, model: string) => object
  parseResponse: (data: any) => string
}

const PROVIDERS: Record<string, AIProviderConfig> = {
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    buildBody: (prompt, model) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    }),
    parseResponse: (data) => data.choices[0].message.content
  },
  claude: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    }),
    buildBody: (prompt, model) => ({
      model,
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }]
    }),
    parseResponse: (data) => data.content[0].text
  },
  deepseek: {
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    model: 'deepseek-chat',
    headers: (apiKey) => ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }),
    buildBody: (prompt, model) => ({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.7
    }),
    parseResponse: (data) => data.choices[0].message.content
  }
}

function buildPrompt(diff: string, language: 'en' | 'zh', style: string): string {
  const styleGuide = {
    conventional: language === 'zh'
      ? '使用 Conventional Commits 格式：type(scope): description'
      : 'Use Conventional Commits format: type(scope): description',
    simple: language === 'zh'
      ? '简洁明了，一句话描述变更'
      : 'Simple and concise, one line description',
    detailed: language === 'zh'
      ? '详细描述变更内容和原因'
      : 'Detailed description of changes and reasons'
  }

  const typeGuide = language === 'zh'
    ? `类型说明：
- feat: 新功能
- fix: 修复bug
- docs: 文档变更
- refactor: 重构
- test: 测试
- chore: 构建/工具`
    : `Types:
- feat: new feature
- fix: bug fix
- docs: documentation
- refactor: code refactoring
- test: tests
- chore: build/tools`

  return `${styleGuide[style as keyof typeof styleGuide]}

${typeGuide}

分析以下Git diff，生成合适的提交信息：

\`\`\`diff
${diff}
\`\`\`

只输出提交信息，不要其他解释。`
}

export async function generateCommitMessage(
  diff: string,
  aiConfig: AIConfig,
  language: 'en' | 'zh' = 'zh',
  style: string = 'conventional'
): Promise<string> {
  const provider = PROVIDERS[aiConfig.provider]
  const model = aiConfig.model || provider.model
  const prompt = buildPrompt(diff, language, style)

  const response = await fetch(provider.endpoint, {
    method: 'POST',
    headers: provider.headers(aiConfig.apiKey),
    body: JSON.stringify(provider.buildBody(prompt, model))
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`AI API Error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return provider.parseResponse(data).trim()
}