import { MarketingHeader } from "@/app/components/marketing/MarketingHeader";
import { LoginForm } from "./LoginForm";

export default function ConnexionPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Propriétaire, employé ou client — connectez-vous avec votre email.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}
