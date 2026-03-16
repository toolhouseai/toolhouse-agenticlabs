export interface Bindings {
  DB: D1Database;
  OPENAI_API_KEY: string;
}

export type AgentStatus = 'queued' | 'building' | 'ready' | 'failed';

export interface Agent {
  id: string;
  name: string;
  model: string;
  system_prompt: string;
  tools: string;
  raw_input: string;
  status: AgentStatus;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface ParsedAgentConfig {
  model: string;
  system_prompt: string;
  tools: string[];
}
