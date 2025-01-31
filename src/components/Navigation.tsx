import { Button } from "@/components/ui/button";
import { Github, Twitter, Instagram } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel mx-4 mt-4 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-gradient">Rudy Btz</div>
        
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
               className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
               className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
          {user ? (
            <Button onClick={signOut} className="neon-button">
              Logout
            </Button>
          ) : (
            <Button onClick={() => navigate("/auth")} className="neon-button">
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;