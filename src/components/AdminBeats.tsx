import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  genre_id: z.string().optional(),
  bpm: z.string().transform((val) => (val ? parseInt(val, 10) : undefined)).optional(),
  key: z.string().optional(),
  price: z.string().transform((val) => parseFloat(val)).refine((val) => val >= 0, "Price must be positive"),
  audio_file: z.custom<File>((val) => val instanceof File, "Audio file is required"),
  artwork_file: z.custom<File>((val) => val instanceof File, "Artwork file is required").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AdminBeats = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      bpm: "",
      key: "",
      price: "",
    },
  });

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
    mutationFn: async (values: z.infer<typeof formSchema>) => {
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
      form.reset();
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

  const onSubmit = (values: FormValues) => {
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter beat title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter beat description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="genre_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genres?.map((genre) => (
                            <SelectItem key={genre.id} value={genre.id}>
                              {genre.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bpm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BPM</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter BPM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter price"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="audio_file"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Audio File</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="artwork_file"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Artwork</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Upload Beat</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>BPM</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {beats?.map((beat) => (
            <TableRow key={beat.id}>
              <TableCell>{beat.title}</TableCell>
              <TableCell>{beat.genres?.name || 'Uncategorized'}</TableCell>
              <TableCell>{beat.bpm || '-'}</TableCell>
              <TableCell>{beat.key || '-'}</TableCell>
              <TableCell>${beat.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
