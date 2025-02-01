import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface AIChatProps {
  isProcessing: boolean;
  onSubmit: (input: string) => void;
}

export const AIChat = ({ isProcessing, onSubmit }: AIChatProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    onSubmit(input);
    setInput("");
  };

  return (
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
  );
};