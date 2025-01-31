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

export const AdminBlog = () => {
  const { toast } = useToast();

  const { data: posts, refetch } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('blog_posts')
      .update({ 
        published: !currentStatus,
        published_at: !currentStatus ? new Date().toISOString() : null
      })
      .eq('id', postId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update post status.",
      });
    } else {
      toast({
        title: "Success",
        description: "Post status updated successfully.",
      });
      refetch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Button>New Post</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts?.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>{post.blog_categories?.name || 'Uncategorized'}</TableCell>
              <TableCell>
                {format(new Date(post.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-sm ${post.published ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTogglePublish(post.id, post.published)}
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};