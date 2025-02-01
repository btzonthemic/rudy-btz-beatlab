import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Database, Server, Users, FileText, Key } from "lucide-react";

export const AdminSupabase = () => {
  const { toast } = useToast();

  const { data: databaseStats } = useQuery({
    queryKey: ['supabase-stats'],
    queryFn: async () => {
      const { data: users } = await supabase.from('profiles').select('count');
      const { data: beats } = await supabase.from('beats').select('count');
      const { data: orders } = await supabase.from('orders').select('count');
      const { data: content } = await supabase.from('content').select('count');
      
      return {
        users: users?.[0]?.count || 0,
        beats: beats?.[0]?.count || 0,
        orders: orders?.[0]?.count || 0,
        content: content?.[0]?.count || 0,
      };
    }
  });

  const handleOpenSupabase = (path: string) => {
    window.open(`https://supabase.com/dashboard/project/gkndpuehqntqsjwvtqlt${path}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{databaseStats?.users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beats</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{databaseStats?.beats}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{databaseStats?.orders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Items</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{databaseStats?.content}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Database Management</CardTitle>
            <CardDescription>
              Manage your database tables, queries, and backups
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleOpenSupabase('/editor')}
            >
              SQL Editor
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleOpenSupabase('/database/tables')}
            >
              Database Tables
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleOpenSupabase('/database/backups')}
            >
              Backups
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API & Authentication</CardTitle>
            <CardDescription>
              Manage API settings, authentication, and storage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleOpenSupabase('/settings/api')}
            >
              API Settings
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleOpenSupabase('/auth/users')}
            >
              User Management
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleOpenSupabase('/storage/buckets')}
            >
              Storage
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};