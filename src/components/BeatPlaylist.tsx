import { Play, Heart, MessageCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const beats = [
  {
    id: 1,
    title: "Neon Dreams",
    artwork: "/placeholder.svg",
    description: "Dark trap beat with atmospheric synths",
    tags: ["Trap", "Dark", "Atmospheric"],
    likes: 245,
    comments: 18,
    price: 29.99
  },
  {
    id: 2,
    title: "Cyber Soul",
    artwork: "/placeholder.svg",
    description: "Melodic beat with futuristic elements",
    tags: ["Melodic", "Future", "R&B"],
    likes: 189,
    comments: 12,
    price: 24.99
  },
  {
    id: 3,
    title: "Digital Rain",
    artwork: "/placeholder.svg",
    description: "Lo-fi beat with cyberpunk vibes",
    tags: ["Lo-fi", "Cyberpunk", "Chill"],
    likes: 312,
    comments: 24,
    price: 19.99
  }
];

const BeatPlaylist = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-bold mb-12 text-gradient">Latest Beats</h2>
      
      <div className="glass-panel overflow-hidden">
        <div className="divide-y divide-white/10">
          {beats.map((beat) => (
            <div key={beat.id} className="beat-row p-4 flex items-center gap-4">
              <Button variant="ghost" className="p-2 hover:bg-primary/20">
                <Play className="w-6 h-6" />
              </Button>
              
              <img src={beat.artwork} alt={beat.title} className="w-16 h-16 rounded object-cover" />
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{beat.title}</h3>
                <p className="text-sm text-muted-foreground">{beat.description}</p>
                <div className="flex gap-2 mt-1">
                  {beat.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>{beat.likes}</span>
                </button>
                
                <button className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{beat.comments}</span>
                </button>
                
                <Button className="neon-button flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  ${beat.price}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BeatPlaylist;