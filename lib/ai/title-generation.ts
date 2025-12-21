import { createOpenAIResponse, extractOpenAIJsonText } from './openai';

const TITLE_GENERATION_SYSTEM_PROMPT = `You are an assistant that generates concise, descriptive titles for English reading passages.

Your task is to create a title that:
- Accurately reflects the main topic or theme of the passage
- Is concise (maximum 200 characters)
- Is appropriate for educational content
- Uses proper capitalization and grammar

Return ONLY a valid JSON object with NO markdown formatting.

Required JSON Schema:
{
  "title": "string"
}

CRITICAL RULES:
1. Output ONLY valid JSON - no markdown code blocks, no extra text
2. The title should be clear and descriptive
3. Keep the title under 200 characters
4. Use title case (capitalize important words)
5. Do not include quotation marks around the title in the JSON value`;

/**
 * Generate a title for a passage using GPT-4o-mini
 * @param content - The passage content
 * @returns Generated title
 */
export async function generatePassageTitle(content: string): Promise<string> {
  const userPrompt = `Generate a concise, descriptive title for the following English reading passage.

=== PASSAGE ===
${content}

Generate the title now in valid JSON format.`;

  try {
    const openaiResponse = await createOpenAIResponse({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: [{ type: 'input_text', text: TITLE_GENERATION_SYSTEM_PROMPT }] 
        },
        { 
          role: 'user', 
          content: [{ type: 'input_text', text: userPrompt }] 
        },
      ],
    });

    const jsonText = extractOpenAIJsonText(openaiResponse);
    const parsedJson = JSON.parse(jsonText) as { title: string };

    if (!parsedJson.title || typeof parsedJson.title !== 'string') {
      throw new Error('Invalid title format in OpenAI response');
    }

    // Trim and ensure it's not empty
    const title = parsedJson.title.trim();
    
    if (!title) {
      throw new Error('Generated title is empty');
    }

    // Fallback to first 50 chars if title is too long (shouldn't happen, but safety check)
    if (title.length > 200) {
      return title.substring(0, 197).trim() + '...';
    }

    return title;
  } catch (error) {
    console.error('Error generating title with GPT:', error);
    
    // Fallback to first 50 chars if GPT generation fails
    const fallbackTitle = content.substring(0, 50).trim();
    return fallbackTitle ? `${fallbackTitle}...` : 'Untitled Passage';
  }
}

