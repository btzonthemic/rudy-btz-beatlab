import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: users, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*, users!inner(*)')
        .ilike('users.email', `%${searchTerm}%`);
      
      if (error) throw error;
      return data;
    }
  });

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user role.",
      });
    } else {
      toast({
        title: "Success",
        description: "User role updated successfully.",
      });
      refetch();
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell>{user.users.email}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRoleUpdate(user.id, user.role === 'admin' ? 'user' : 'admin')}
                >
                  Toggle Admin
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};