import Link from "next/link";
import { MarketingHeader } from "@/app/components/marketing/MarketingHeader";
import { RegisterForm } from "./RegisterForm";

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <main className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">Créer votre garage</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cette inscription crée votre espace garage et votre compte propriétaire. Vos employés
            et vos clients recevront une invitation depuis votre tableau de bord.
          </p>
          <div className="mt-6">
            <RegisterForm />
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/connexion" className="font-medium text-primary hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
