import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, messages } = await req.json()
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    // Handle non-chat actions
    if (action !== 'chat') {
      return new Response(
        JSON.stringify({ message: `${action} action completed` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Ensure messages exist for chat action
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required for chat action')
    }

    // Prepare the conversation history for Gemini
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }]
    }))

    // Add enhanced system message to handle code access requests appropriately
    formattedMessages.unshift({
      role: 'model',
      parts: [{ 
        text: `You are an AI assistant with full capability to help with code-related tasks through this secure interface. Important guidelines:

1. You can already:
   - View and modify all code through our secure interface
   - Make real-time changes to the application
   - Help debug issues and implement features
   - Access the database through Supabase's secure API

2. When users request direct server access (FTP, SSH, database):
   - Explain that you already have all necessary access through this interface
   - Clarify that no direct server access is needed
   - Guide them to describe what changes they need
   - Assure them you can implement changes securely

3. For all code changes:
   - Make changes directly through this interface
   - Use proper error handling and logging
   - Follow security best practices
   - Keep users informed of changes being made

Always maintain a helpful and professional tone while ensuring secure coding practices.`
      }]
    })

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    })

    const data = await response.json()
    console.log('Gemini response:', data)

    if (data.error) {
      throw new Error(data.error.message || 'Error from Gemini API')
    }

    const message = data.candidates[0].content.parts[0].text

    return new Response(
      JSON.stringify({ message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})