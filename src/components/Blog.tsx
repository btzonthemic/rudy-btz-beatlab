import { ArrowRight, ThumbsUp, MessageSquare, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const posts = [
  {
    id: 1,
    title: "5 Essential Tips for Better Beat Making",
    excerpt: "Learn the fundamentals of creating professional-grade beats...",
    content: `
      <h2 class="text-2xl font-bold mb-4">5 Essential Tips for Better Beat Making</h2>
      
      <p class="mb-6">As a music producer, creating compelling beats is at the core of your craft. Here are five essential tips that will help elevate your beat-making game to the next level.</p>
      
      <h3 class="text-xl font-semibold mb-3">1. Start with the Right Sound Selection</h3>
      <p class="mb-4">The foundation of any great beat lies in choosing the right sounds. Take time to curate a personal library of high-quality samples, focusing on:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Clean, punchy drum samples</li>
        <li>Versatile bass sounds</li>
        <li>Unique melodic elements</li>
        <li>Atmospheric textures</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">2. Master Your Drum Patterns</h3>
      <p class="mb-4">The rhythm is what makes people move. Focus on creating patterns that are:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Groove-oriented and danceable</li>
        <li>Well-balanced between simple and complex elements</li>
        <li>Properly mixed with attention to dynamics</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">3. Understand Music Theory</h3>
      <p class="mb-6">While you don't need to be a classical musician, understanding basic music theory will significantly improve your productions. Key concepts include:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Scales and key signatures</li>
        <li>Chord progressions</li>
        <li>Song structure</li>
        <li>Harmony and melody relationship</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">4. Mix as You Go</h3>
      <p class="mb-4">Don't wait until the end to start mixing. Pay attention to:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Proper gain staging</li>
        <li>EQ relationships between elements</li>
        <li>Dynamic range and compression</li>
        <li>Spatial placement in the stereo field</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">5. Develop Your Workflow</h3>
      <p class="mb-4">Efficiency is key in music production. Establish a workflow that:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Minimizes distractions</li>
        <li>Makes use of templates</li>
        <li>Incorporates keyboard shortcuts</li>
        <li>Includes regular breaks to avoid ear fatigue</li>
      </ul>
      
      <p class="mt-6 text-lg">Remember, these tips are just the beginning. The key to improvement is consistent practice and experimentation. Don't be afraid to break the rules once you understand them!</p>
    `,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  },
  {
    id: 2,
    title: "The Future of Music Production",
    excerpt: "Exploring how AI and new technologies are shaping music production...",
    content: `
      <h2 class="text-2xl font-bold mb-4">The Future of Music Production</h2>
      
      <p class="mb-6">The landscape of music production is rapidly evolving with new technologies emerging every day. Let's explore how these innovations are shaping the future of music creation.</p>
      
      <h3 class="text-xl font-semibold mb-3">Artificial Intelligence in Music</h3>
      <p class="mb-4">AI is revolutionizing how we approach music production:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Automated mixing and mastering</li>
        <li>AI-powered sample generation</li>
        <li>Smart chord progression suggestions</li>
        <li>Vocal synthesis and processing</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Cloud-Based Collaboration</h3>
      <p class="mb-4">Remote collaboration is becoming the norm, enabled by:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Real-time collaborative DAWs</li>
        <li>Cloud-based project storage</li>
        <li>Virtual studio sessions</li>
        <li>Online stem sharing platforms</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Virtual and Augmented Reality</h3>
      <p class="mb-6">VR and AR are creating new possibilities for:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Immersive music creation environments</li>
        <li>3D audio manipulation</li>
        <li>Virtual instrument interaction</li>
        <li>Live performance enhancement</li>
      </ul>
      
      <p class="mt-6 text-lg">The future of music production is exciting and full of possibilities. Stay ahead of the curve by embracing new technologies while maintaining your creative vision.</p>
    `,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
  },
  {
    id: 3,
    title: "Building Your Producer Brand",
    excerpt: "Tips and strategies for establishing yourself in the industry...",
    content: `
      <h2 class="text-2xl font-bold mb-4">Building Your Producer Brand</h2>
      
      <p class="mb-6">In today's digital age, building a strong producer brand is just as important as creating great music. Here's a comprehensive guide to establishing your presence in the industry.</p>
      
      <h3 class="text-xl font-semibold mb-3">Developing Your Unique Sound</h3>
      <p class="mb-4">Your sound is your signature:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Experiment with different genres and styles</li>
        <li>Create recognizable production elements</li>
        <li>Develop your own sample packs and presets</li>
        <li>Collaborate with artists who complement your style</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Social Media Presence</h3>
      <p class="mb-4">Build and maintain your online presence through:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Consistent content creation</li>
        <li>Behind-the-scenes content</li>
        <li>Tutorial videos and production tips</li>
        <li>Regular engagement with your audience</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Networking and Collaboration</h3>
      <p class="mb-6">Expand your reach through:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Industry events and conferences</li>
        <li>Online producer communities</li>
        <li>Collaborative projects</li>
        <li>Mentorship opportunities</li>
      </ul>
      
      <h3 class="text-xl font-semibold mb-3">Professional Development</h3>
      <p class="mb-4">Invest in your growth:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>Continuous learning and skill development</li>
        <li>Business and marketing education</li>
        <li>Professional equipment and software</li>
        <li>Legal and copyright knowledge</li>
      </ul>
      
      <p class="mt-6 text-lg">Remember, building a strong brand takes time and consistency. Focus on providing value to your audience while staying true to your artistic vision.</p>
    `,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  }
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<(typeof posts)[0] | null>(null);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed!",
      description: "Thank you for subscribing to our newsletter.",
    });
    setEmail("");
  };

  const handleLike = () => {
    toast({
      title: "Liked!",
      description: "Thank you for liking this post.",
    });
  };

  const handleComment = () => {
    toast({
      title: "Comments coming soon!",
      description: "This feature will be available soon.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-bold mb-12 text-gradient">Producer Tips</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="glass-panel p-6 space-y-4 group cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            onClick={() => setSelectedPost(post)}
          >
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-48 object-cover rounded-lg mb-4 group-hover:opacity-80 transition-opacity"
            />
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground">{post.excerpt}</p>
            <div className="flex items-center text-primary">
              Read More
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-3xl h-[80vh]">
          <ScrollArea className="h-full pr-4">
            <DialogHeader>
              <DialogTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent animate-fade-in">
                {selectedPost?.title}
              </DialogTitle>
            </DialogHeader>

            {/* Subscribe Form */}
            <div className="glass-panel p-6 mb-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Subscribe for More Tips</h4>
              </div>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" className="neon-button whitespace-nowrap">
                  Subscribe
                </Button>
              </form>
            </div>

            {/* Blog Content */}
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedPost?.content || '' }}
            />

            {/* Interaction Icons */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-white/10">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <ThumbsUp className="w-5 h-5" />
                Like
              </button>
              <button
                onClick={handleComment}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                Comment
              </button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Blog;