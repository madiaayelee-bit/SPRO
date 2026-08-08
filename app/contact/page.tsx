import { InfoPageShell } from "@/app/components/marketing/InfoPageShell";
import { SUPPORT_EMAIL } from "@/lib/site-info";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Contact — Garage Pro" };

export default function ContactPage() {
  return (
    <InfoPageShell
      eyebrow="📞 Contact"
      title="Contactez Garage Pro"
      intro={`Une question, un problème, une suggestion ? Écrivez-nous — ou directement à ${SUPPORT_EMAIL}.`}
    >
      <ContactForm />
    </InfoPageShell>
  );
}
