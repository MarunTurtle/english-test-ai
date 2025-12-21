import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Content item for OpenAI Responses API
 */
type ContentItem = {
  type: 'input_text';
  text: string;
};

/**
 * Message structure for OpenAI Responses API
 */
type Message = {
  role: 'system' | 'user' | 'assistant';
  content: ContentItem[];
};

/**
 * Parameters for creating an OpenAI response
 */
type CreateResponseParams = {
  model: string;
  messages: Message[];
};

/**
 * OpenAI response structure
 */
type OpenAIResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

/**
 * Create an OpenAI response using the Chat Completions API
 * 
 * This function converts the Responses API format to Chat Completions API format
 * and handles the OpenAI API call.
 * 
 * @param params - Configuration including model and messages
 * @returns OpenAI response object
 */
export async function createOpenAIResponse(
  params: CreateResponseParams
): Promise<OpenAIResponse> {
  const { model, messages } = params;

  // Convert messages from Responses API format to Chat Completions format
  const chatMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content.map((item) => item.text).join('\n'),
  }));

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages: chatMessages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      // Note: gpt-5-mini only supports temperature: 1 (default)
      // For other models, you can specify temperature: 0.7
      ...(model !== 'gpt-5-mini' && { temperature: 0.7 }),
      response_format: { type: 'json_object' }, // Ensure JSON output
    });

    // Return in a consistent format
    return {
      id: completion.id,
      object: completion.object,
      created: completion.created,
      model: completion.model,
      choices: completion.choices.map((choice) => ({
        index: choice.index,
        message: {
          role: choice.message.role,
          content: choice.message.content || '',
        },
        finish_reason: choice.finish_reason || 'stop',
      })),
      usage: completion.usage
        ? {
            prompt_tokens: completion.usage.prompt_tokens,
            completion_tokens: completion.usage.completion_tokens,
            total_tokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(
      `Failed to generate response from OpenAI: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

/**
 * Extract JSON text from OpenAI response
 * 
 * Extracts the content from the first choice in the response.
 * 
 * @param response - OpenAI response object
 * @returns Extracted JSON text string
 */
export function extractOpenAIJsonText(response: OpenAIResponse): string {
  if (!response.choices || response.choices.length === 0) {
    throw new Error('No choices in OpenAI response');
  }

  const content = response.choices[0].message.content;

  if (!content) {
    throw new Error('No content in OpenAI response');
  }

  // Remove markdown code blocks if present
  let jsonText = content.trim();
  
  // Remove ```json and ``` markers if present
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.slice(7);
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.slice(3);
  }
  
  if (jsonText.endsWith('```')) {
    jsonText = jsonText.slice(0, -3);
  }

  return jsonText.trim();
}

/**
 * Get the OpenAI client instance
 * Useful for direct access if needed
 */
export function getOpenAIClient(): OpenAI {
  return openai;
}

