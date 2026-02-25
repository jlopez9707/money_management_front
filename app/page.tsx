import AuthForm from "@/components/auth/AuthForm";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background font-sans transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <AuthForm type="sign-in" />
    </div>
  );
}
