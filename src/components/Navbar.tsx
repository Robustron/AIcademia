
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">AI University</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Button variant="outline">Log In</Button>
          <Button>Sign Up</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
