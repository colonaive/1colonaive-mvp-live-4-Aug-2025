// src/utils/getChatbotResponse.ts
interface ChatbotApiResponse {
  reply: string;
  isMocked?: boolean;
  note?: string;
  error?: string;
  details?: string;
}

interface ChatbotResult {
  response: string;
  isMocked?: boolean;
  error?: string;
}

const SUPABASE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chatbot`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function getChatbotResponse(
  message: string, 
  conversationHistory: string[] = []
): Promise<ChatbotResult> {
  try {
    // Check for missing environment variables
    if (!import.meta.env.VITE_SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return {
        response: "Chatbot service is temporarily unavailable. Please contact support.",
        error: "Configuration error"
      };
    }

    console.log("Sending message to chatbot:", message);
    console.log("With history:", conversationHistory);

    const response = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: message,
        conversationHistory: conversationHistory,
        useMock: true // You can change this to false when you want to use real OpenAI
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ChatbotApiResponse = await response.json();
    
    if (data.error) {
      return {
        response: "Sorry, I'm having trouble responding right now. Please try again later.",
        error: data.error
      };
    }

    return {
      response: data.reply,
      isMocked: data.isMocked,
      error: undefined
    };

  } catch (error) {
    console.error("Error calling chatbot:", error);
    
    // Fallback response with local knowledge
    const fallbackResponse = getFallbackResponse(message);
    
    return {
      response: fallbackResponse,
      error: error instanceof Error ? error.message : "Unknown error",
      isMocked: true
    };
  }
}

// Fallback responses when API fails
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('early signs') || lowerMessage.includes('symptoms')) {
    return `Early signs of colorectal cancer may include: changes in bowel habits, blood in stool, persistent abdominal discomfort, unexplained weight loss, and fatigue. However, many of these symptoms can have other causes, so it's important to consult with a healthcare provider for proper evaluation. 👉 https://www.colonaive.ai/get-screened`;
  }
  
  if (lowerMessage.includes('colonoscopy')) {
    return `A colonoscopy is the gold standard for colorectal cancer detection because it allows direct visual examination and immediate polyp removal. If you're scared or uncomfortable, there are now HSA-cleared blood tests available in Singapore as a first step. 👉 https://www.colonaive.ai/get-screened`;
  }
  
  if (lowerMessage.includes('screen') || lowerMessage.includes('test')) {
    return `In Singapore, you have several screening options including HSA-cleared blood tests, FIT tests, and colonoscopy. Blood-based tests are non-invasive and great for those who feel uncomfortable with other methods. 👉 https://www.colonaive.ai/get-screened`;
  }
  
  if (lowerMessage.includes('scared') || lowerMessage.includes('afraid') || lowerMessage.includes('mafan')) {
    return `Don't worry, Champion! Many Singaporeans feel the same way. There are now easier, non-invasive blood tests available that are HSA-cleared. Better to check early than wait for problems. 👉 https://www.colonaive.ai/get-screened`;
  }
  
  return `I'm here to help with colorectal cancer awareness and support, Champion! I can share info about symptoms, screening options, prevention, and local resources in Singapore. What would you like to know? 👉 https://www.colonaive.ai/get-screened`;
}

// Alternative function if you want to use OpenAI directly (bypass Supabase)
export async function getChatbotResponseDirect(
  message: string, 
  conversationHistory: string[] = []
): Promise<ChatbotResult> {
  try {
    // This would call your src/api/chat.ts endpoint if you set up Express
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history: conversationHistory
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      response: data.reply,
      isMocked: false,
      error: undefined
    };

  } catch (error) {
    console.error("Error calling OpenAI directly:", error);
    
    return {
      response: getFallbackResponse(message),
      error: error instanceof Error ? error.message : "Unknown error",
      isMocked: true
    };
  }
}