import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BeatUploadForm, FormValues } from "./admin/beats/BeatUploadForm";
import { BeatsTable } from "./admin/beats/BeatsTable";

export const AdminBeats = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('genres')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: beats, refetch } = useQuery({
    queryKey: ['beats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('beats')
        .select('*, genres(name)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const createBeat = useMutation({
    mutationFn: async (values: FormValues) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      let audioUrl = "";
      let artworkUrl = "";

      if (values.audio_file) {
        audioUrl = await uploadFile(values.audio_file, 'beats');
      }

      if (values.artwork_file) {
        artworkUrl = await uploadFile(values.artwork_file, 'artwork');
      }

      const { data: producerData } = await supabase
        .from('producers')
        .select('id')
        .eq('user_id', userData.user.id)
        .single();

      if (!producerData) throw new Error("Producer not found");

      const { error } = await supabase
        .from('beats')
        .insert([{
          title: values.title,
          description: values.description,
          genre_id: values.genre_id,
          bpm: values.bpm,
          key: values.key,
          price: values.price,
          audio_url: audioUrl,
          artwork_url: artworkUrl,
          producer_id: producerData.id,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Beat uploaded successfully.",
      });
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload beat.",
      });
      console.error("Error uploading beat:", error);
    },
  });

  const handleSubmit = (values: FormValues) => {
    createBeat.mutate(values);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Beats</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Upload Beat</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Upload New Beat</DialogTitle>
            </DialogHeader>
            <BeatUploadForm 
              genres={genres}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <BeatsTable beats={beats} />
    </div>
  );
};