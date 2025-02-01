import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminAnalytics } from "@/components/AdminAnalytics";
import { AdminUsers } from "@/components/AdminUsers";
import { AdminContent } from "@/components/AdminContent";
import { AdminApiKeys } from "@/components/AdminApiKeys";
import { AdminBlog } from "@/components/AdminBlog";
import { AdminAIAssistant } from "@/components/AdminAIAssistant";
import { AdminSupabase } from "@/components/AdminSupabase";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this area.",
        });
        navigate('/');
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="supabase">Supabase</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <AdminUsers />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <AdminContent />
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <AdminBlog />
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <AdminApiKeys />
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-4">
          <AdminAIAssistant />
        </TabsContent>

        <TabsContent value="supabase" className="space-y-4">
          <AdminSupabase />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;