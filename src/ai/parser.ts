import OpenAI from 'openai';
import type { ParsedAgentConfig } from '../types';

const SYSTEM_PROMPT = `You are an AI agent configuration parser. Given freeform JSON describing a desired AI agent, extract a structured configuration.

Determine:
1. **model** — the best AI model for this agent's purpose (e.g., "gpt-5", "gpt-4o-mini", "claude-sonnet-4-5-20250514"). Default to "gpt-5" if unclear.
2. **system_prompt** — a well-crafted system prompt that defines the agent's behavior, personality, and capabilities based on the input.
3. **tools** — a list of tool names the agent should have access to (e.g., "web_search", "code_interpreter", "file_reader", "calculator"). Return an empty array if no tools are needed.`;

export async function parseAgentConfig(
  apiKey: string,
  rawInput: string,
): Promise<ParsedAgentConfig> {
  const client = new OpenAI({ apiKey, maxRetries: 0, timeout: 30_000 });

  const response = await client.responses.create({
    model: 'gpt-5',
    instructions: SYSTEM_PROMPT,
    input: `Parse the following into an agent configuration:\n\n${rawInput}`,
    text: {
      format: {
        type: 'json_schema',
        name: 'agent_config',
        strict: true,
        schema: {
          type: 'object',
          properties: {
            model: { type: 'string', description: 'The AI model to use for this agent' },
            system_prompt: { type: 'string', description: 'The system prompt defining agent behavior' },
            tools: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of tool names the agent needs',
            },
          },
          required: ['model', 'system_prompt', 'tools'],
          additionalProperties: false,
        },
      },
    },
  });

  const textOutput = response.output.find((o) => o.type === 'message');
  if (!textOutput || textOutput.type !== 'message') {
    throw new Error('No message output from OpenAI');
  }

  const content = textOutput.content.find((c) => c.type === 'output_text');
  if (!content || content.type !== 'output_text') {
    throw new Error('No text content from OpenAI');
  }

  const parsed = JSON.parse(content.text) as ParsedAgentConfig;

  if (!parsed.model || !parsed.system_prompt || !Array.isArray(parsed.tools)) {
    throw new Error('Invalid agent config returned from OpenAI');
  }

  return parsed;
}
