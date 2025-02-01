import { useState } from "react";
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
import { Database, Server, Users, FileText, Key, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const AdminSupabase = () => {
  const { toast } = useToast();
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [isApiSettingsDialogOpen, setIsApiSettingsDialogOpen] = useState(false);
  const [tableName, setTableName] = useState("");
  const [tableSchema, setTableSchema] = useState("");
  const [apiKeyName, setApiKeyName] = useState("");
  const [apiKeyValue, setApiKeyValue] = useState("");

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

  const handleCreateTable = async () => {
    try {
      const { error } = await supabase
        .from('admin_audit_logs')
        .insert({
          admin_id: (await supabase.auth.getUser()).data.user?.id,
          action: 'CREATE_TABLE',
          entity_type: 'table',
          changes: { table_name: tableName, schema: tableSchema }
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Table creation request logged. Please use SQL Editor to create the table.",
      });
      setIsTableDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log table creation request",
      });
      console.error("Error:", error);
    }
  };

  const handleSaveApiKey = async () => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .insert({
          name: apiKeyName,
          key_value: apiKeyValue,
          service_type: 'custom'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key saved successfully.",
      });
      setIsApiSettingsDialogOpen(false);
      setApiKeyName("");
      setApiKeyValue("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save API key",
      });
      console.error("Error:", error);
    }
  };

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
            <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Create New Table
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Table</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tableName">Table Name</Label>
                    <Input
                      id="tableName"
                      value={tableName}
                      onChange={(e) => setTableName(e.target.value)}
                      placeholder="Enter table name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tableSchema">SQL Schema</Label>
                    <Textarea
                      id="tableSchema"
                      value={tableSchema}
                      onChange={(e) => setTableSchema(e.target.value)}
                      placeholder="Enter SQL schema"
                      className="h-32"
                    />
                  </div>
                  <Button onClick={handleCreateTable} className="w-full">
                    Create Table
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
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
            <Dialog open={isApiSettingsDialogOpen} onOpenChange={setIsApiSettingsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Add API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New API Key</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiKeyName">Key Name</Label>
                    <Input
                      id="apiKeyName"
                      value={apiKeyName}
                      onChange={(e) => setApiKeyName(e.target.value)}
                      placeholder="Enter key name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apiKeyValue">API Key</Label>
                    <Input
                      id="apiKeyValue"
                      type="password"
                      value={apiKeyValue}
                      onChange={(e) => setApiKeyValue(e.target.value)}
                      placeholder="Enter API key"
                    />
                  </div>
                  <Button onClick={handleSaveApiKey} className="w-full">
                    Save API Key
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

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