import Conf from 'conf'

export interface AIConfig {
  provider: 'openai' | 'claude' | 'deepseek'
  apiKey: string
  model?: string
}

export interface AppConfig {
  ai: AIConfig
  language: 'en' | 'zh'
  style: 'conventional' | 'simple' | 'detailed'
  autoStage: boolean
}

const config = new Conf<AppConfig>({
  projectName: 'git-autocommit',
  defaults: {
    ai: {
      provider: 'openai',
      apiKey: '',
      model: 'gpt-4o-mini'
    },
    language: 'zh',
    style: 'conventional',
    autoStage: false
  }
})

export function getConfig(): AppConfig {
  return config.store
}

export function setConfig(newConfig: Partial<AppConfig>): void {
  config.set(newConfig)
}

export function setAIConfig(aiConfig: Partial<AIConfig>): void {
  const current = config.get('ai')
  config.set('ai', { ...current, ...aiConfig })
}

export function isConfigured(): boolean {
  return !!config.get('ai').apiKey
}

export function clearConfig(): void {
  config.clear()
}