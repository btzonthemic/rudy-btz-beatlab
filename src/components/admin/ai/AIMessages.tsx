import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Message {
  role: string;
  content: string;
}

interface AIMessagesProps {
  messages: Message[];
  isProcessing: boolean;
}

export const AIMessages = ({ messages, isProcessing }: AIMessagesProps) => {
  return (
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
  );
};