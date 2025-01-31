import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const AdminApiKeys = () => {
  const { toast } = useToast();
  const [keyName, setKeyName] = useState("");
  const [keyValue, setKeyValue] = useState("");
  const [serviceType, setServiceType] = useState("custom");

  const { data: apiKeys, refetch } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleSaveKey = async () => {
    if (!keyValue.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an API key.",
      });
      return;
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user) return;

    const { error: insertError } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.user.id,
        name: keyName || `${serviceType.toUpperCase()} API Key ${format(new Date(), 'yyyy-MM-dd HH:mm')}`,
        key_value: keyValue,
        service_type: serviceType,
      });

    if (insertError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save API key.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "API key saved successfully.",
    });
    setKeyName("");
    setKeyValue("");
    refetch();
  };

  const handleDeactivateKey = async (keyId: string) => {
    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', keyId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to deactivate API key.",
      });
    } else {
      toast({
        title: "Success",
        description: "API key deactivated successfully.",
      });
      refetch();
    }
  };

  const services = [
    { value: "custom", label: "Custom" },
    { value: "gemini", label: "Google Gemini" },
    { value: "openai", label: "OpenAI" },
    { value: "deepseek", label: "DeepSeek" },
    { value: "huggingface", label: "Hugging Face" },
    { value: "stripe", label: "Stripe" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API Keys</h2>
      </div>

      <div className="grid gap-4 p-4 border rounded-lg bg-card">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="keyName" className="text-sm font-medium">
              Key Name
            </label>
            <Input
              id="keyName"
              placeholder="Enter key name"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="keyValue" className="text-sm font-medium">
              API Key
            </label>
            <Input
              id="keyValue"
              type="password"
              placeholder="Enter API key"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="serviceType" className="text-sm font-medium">
              Service Type
            </label>
            <select
              id="serviceType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              {services.map((service) => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button onClick={handleSaveKey} className="w-full md:w-auto">
          Save API Key
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys?.map((key) => (
            <TableRow key={key.id}>
              <TableCell>{key.name}</TableCell>
              <TableCell>
                <span className="capitalize">{key.service_type || 'custom'}</span>
              </TableCell>
              <TableCell>
                <code className="bg-muted px-2 py-1 rounded">
                  {key.key_value.substring(0, 10)}...
                </code>
              </TableCell>
              <TableCell>
                {format(new Date(key.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-sm ${key.is_active ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {key.is_active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                {key.is_active && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeactivateKey(key.id)}
                  >
                    Deactivate
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};