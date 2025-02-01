import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AIChat } from "./admin/ai/AIChat";
import { AIActions } from "./admin/ai/AIActions";
import { AIMessages } from "./admin/ai/AIMessages";

export const AdminAIAssistant = () => {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    {
      role: "assistant",
      content: "Hello! I'm your AI admin assistant. I can help you manage your Supabase backend, including database operations, storage management, and function deployment. How can I assist you today?"
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Subscribe to database changes
  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public' },
        (payload) => {
          toast({
            title: "Database Change",
            description: `Table ${payload.table} was modified`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleSubmit = async (input: string) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const userMessage = { role: "user", content: input };
      setMessages(prev => [...prev, userMessage]);

      const response = await supabase.functions.invoke('admin-ai-assistant', {
        body: { 
          messages: [...messages, userMessage],
          action: "chat",
          context: {
            database: true,
            storage: true,
            functions: true
          }
        }
      });

      if (response.error) throw response.error;

      const assistantMessage = { 
        role: "assistant", 
        content: response.data.message 
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Execute any database commands if present in the response
      if (response.data.dbCommands) {
        for (const command of response.data.dbCommands) {
          // Use appropriate Supabase functions based on command type
          if (command.type === 'create_table') {
            await supabase.rpc('create_table', { 
              table_name: command.table_name,
              table_schema: command.schema
            });
          } else if (command.type === 'analytics') {
            await supabase.rpc('get_analytics_summary');
          } else if (command.type === 'generate_key') {
            await supabase.rpc('generate_api_key');
          }
          // Add more command types as needed
        }
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAction = async (action: string) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const response = await supabase.functions.invoke('admin-ai-assistant', {
        body: { 
          action,
          messages: action === "chat" ? messages : undefined,
          context: {
            database: true,
            storage: true,
            functions: true
          }
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: `${action} completed successfully.`,
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to execute ${action}. Please try again.`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <AIActions isProcessing={isProcessing} onAction={handleAction} />
          <AIMessages messages={messages} isProcessing={isProcessing} />
          <AIChat isProcessing={isProcessing} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
};