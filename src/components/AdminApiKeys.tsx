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

export const AdminApiKeys = () => {
  const { toast } = useToast();

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

  const handleGenerateKey = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user) return;

    const { data: newKey, error } = await supabase
      .rpc('generate_api_key');

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate API key.",
      });
      return;
    }

    const { error: insertError } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.user.id,
        name: `API Key ${format(new Date(), 'yyyy-MM-dd HH:mm')}`,
        key_value: newKey,
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
      description: "New API key generated.",
    });
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API Keys</h2>
        <Button onClick={handleGenerateKey}>Generate New Key</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
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