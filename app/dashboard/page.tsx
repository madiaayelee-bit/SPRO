import { requireStaffSession } from "@/lib/session";
import { prisma, scopedPrisma } from "@/lib/prisma";

const PLAN_LABELS: Record<string, string> = {
  FREE: "Gratuit",
  PRO: "Pro",
  PREMIUM: "Premium",
};

export default async function DashboardHomePage() {
  const { garageId, name } = await requireStaffSession();
  const db = scopedPrisma(garageId);

  const [garage, clientCount, repairsInProgress, pendingQuotes, inventoryItems] =
    await Promise.all([
      prisma.garage.findUnique({
        where: { id: garageId },
        include: { subscription: true },
      }),
      db.client.count(),
      db.repairOrder.count({
        where: { status: { notIn: ["COMPLETED", "CANCELLED"] } },
      }),
      db.quote.count({ where: { status: { in: ["DRAFT", "SENT"] } } }),
      db.inventoryItem.findMany({ select: { quantityInStock: true, lowStockThreshold: true } }),
    ]);

  const lowStockCount = inventoryItems.filter(
    (i) => i.quantityInStock <= i.lowStockThreshold
  ).length;

  const stats = [
    { label: "Clients", value: clientCount },
    { label: "Réparations en cours", value: repairsInProgress },
    { label: "Devis en attente", value: pendingQuotes },
    { label: "Alertes stock", value: lowStockCount },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Bonjour, {name.split(" ")[0]} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {garage?.name} —{" "}
          <span className="font-medium text-primary">
            Formule {PLAN_LABELS[garage?.subscription?.plan ?? "FREE"]}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
