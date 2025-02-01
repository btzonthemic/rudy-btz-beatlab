import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Image, Code, Bug, FileUp, Search, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AdminAIAssistant = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    {
      role: "assistant",
      content: "Hello! I'm your AI admin assistant powered by Google's Gemini. I can help you with various tasks like fixing bugs, generating images, creating new features, and more. How can I assist you today?"
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Subscribe to chat notifications
  useEffect(() => {
    const channel = supabase
      .channel('admin-chat')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'chats' },
        (payload) => {
          toast({
            title: "New Message",
            description: "You have received a new message",
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
          action: "chat"
        }
      });

      if (response.error) throw response.error;

      const assistantMessage = { 
        role: "assistant", 
        content: response.data.message 
      };
      setMessages(prev => [...prev, assistantMessage]);

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
          messages: action === "chat" ? messages : undefined
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

  // Save FCM token when available
  useEffect(() => {
    const saveFCMToken = async () => {
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('profiles')
              .update({ fcm_token: 'web-notification-enabled' })
              .eq('id', user.id);
          }
        } catch (error) {
          console.error('Error saving notification status:', error);
        }
      }
    };

    saveFCMToken();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              onClick={() => handleAction("fix-bugs")}
              disabled={isProcessing}
            >
              <Bug className="w-4 h-4 mr-2" />
              Fix Bugs
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction("generate-image")}
              disabled={isProcessing}
            >
              <Image className="w-4 h-4 mr-2" />
              Generate Image
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction("create-feature")}
              disabled={isProcessing}
            >
              <Code className="w-4 h-4 mr-2" />
              Create Feature
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction("upload")}
              disabled={isProcessing}
            >
              <FileUp className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction("search")}
              disabled={isProcessing}
            >
              <Search className="w-4 h-4 mr-2" />
              Search Web
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction("chat")}
              disabled={isProcessing}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
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
              placeholder="Type your message here..."
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