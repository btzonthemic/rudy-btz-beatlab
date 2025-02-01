import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, messages, context } = await req.json()
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    // Initialize Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

    // Handle non-chat actions
    if (action !== 'chat') {
      let response = ''
      
      switch(action) {
        case 'database':
          const { data: tables } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
          response = `Database tables: ${tables?.map(t => t.table_name).join(', ')}`
          break;
          
        case 'storage':
          const { data: buckets } = await supabase
            .storage
            .listBuckets()
          response = `Storage buckets: ${buckets?.map(b => b.name).join(', ')}`
          break;
          
        case 'functions':
          response = 'Edge Functions management initiated'
          break;
          
        default:
          response = `${action} action completed`
      }

      return new Response(
        JSON.stringify({ message: response }),
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

    // Add enhanced system message for Supabase management
    formattedMessages.unshift({
      role: 'model',
      parts: [{ 
        text: `You are an AI assistant with full capability to help manage Supabase backend through this secure interface. You can:

1. Database Management:
   - Create, modify, and delete tables
   - Manage data and relationships
   - Handle migrations and backups

2. Storage Management:
   - Create and configure storage buckets
   - Manage file uploads and permissions
   - Handle storage policies

3. Function Management:
   - Deploy and update Edge Functions
   - Monitor function performance
   - Handle function logs

4. Security:
   - Manage Row Level Security (RLS) policies
   - Handle API keys and authentication
   - Configure access controls

Always maintain security best practices and provide clear explanations of actions taken.`
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
      JSON.stringify({ 
        message,
        dbCommands: data.candidates[0].content.parts[0].dbCommands || [] 
      }),
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