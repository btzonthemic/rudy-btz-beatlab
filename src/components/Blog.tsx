import { ArrowRight } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "5 Essential Tips for Better Beat Making",
    excerpt: "Learn the fundamentals of creating professional-grade beats...",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    title: "The Future of Music Production",
    excerpt: "Exploring how AI and new technologies are shaping music production...",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    title: "Building Your Producer Brand",
    excerpt: "Tips and strategies for establishing yourself in the industry...",
    image: "/placeholder.svg"
  }
];

const Blog = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <h2 className="text-4xl font-bold mb-12 text-gradient">Producer Tips</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="glass-panel p-6 space-y-4 group cursor-pointer">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-48 object-cover rounded-lg mb-4"
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
    </div>
  );
};

export default Blog;