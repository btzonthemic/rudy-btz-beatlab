import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, Send, Image, Code, Bug, FileUp, Search, 
  MessageSquare, Database, Key, Settings, Table 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AdminAIAssistant = () => {
  const [input, setInput] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    try {
      setIsProcessing(true);
      const userMessage = { role: "user", content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput("");

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
          await supabase.rpc('execute_admin_command', { command });
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
          <div className="flex gap-2 mb-4 flex-wrap">
            <Button 
              variant="outline" 
              onClick={() => handleAction("database")}
              disabled={isProcessing}
            >
              <Database className="w-4 h-4 mr-2" />
              Database
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction("storage")}
              disabled={isProcessing}
            >
              <FileUp className="w-4 h-4 mr-2" />
              Storage
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction("functions")}
              disabled={isProcessing}
            >
              <Code className="w-4 h-4 mr-2" />
              Functions
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction("tables")}
              disabled={isProcessing}
            >
              <Table className="w-4 h-4 mr-2" />
              Tables
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction("api-keys")}
              disabled={isProcessing}
            >
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction("settings")}
              disabled={isProcessing}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>

          <ScrollArea className="h-[400px] mb-4 p-4 border rounded-lg">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-4 rounded-lg ${
                  message.role === "assistant"
                    ? "bg-secondary"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {message.content}
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to manage your Supabase backend..."
              disabled={isProcessing}
              className="flex-1"
            />
            <Button type="submit" disabled={isProcessing}>
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};