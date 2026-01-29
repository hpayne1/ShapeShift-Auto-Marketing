import OpenAI from 'openai';

let client: OpenAI | null = null;

/**
 * Get or create OpenAI client
 */
export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY environment variable is required.\n' +
        'Set it with: export OPENAI_API_KEY="sk-..."'
      );
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

/**
 * Generate content using GPT-4o
 */
export async function generateContent(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const openai = getOpenAIClient();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4096,
  });

  return response.choices[0]?.message?.content || '';
}

/**
 * Generate structured JSON content
 */
export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<T> {
  const openai = getOpenAIClient();
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt + '\n\nRespond with valid JSON only.' },
      { role: 'user', content: userPrompt }
    ],
    temperature: options?.temperature ?? 0.5,
    max_tokens: options?.maxTokens ?? 4096,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content || '{}';
  return JSON.parse(content) as T;
}
