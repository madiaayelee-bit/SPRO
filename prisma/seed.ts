import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("motdepasse123", 12);

  const garage = await prisma.garage.upsert({
    where: { id: "demo-garage" },
    update: {},
    create: {
      id: "demo-garage",
      name: "Garage Démo",
      phone: "01 23 45 67 89",
      email: "contact@garage-demo.fr",
      settings: { create: {} },
      subscription: { create: { plan: "FREE", status: "ACTIVE" } },
      users: {
        create: {
          email: "owner@garage-demo.fr",
          passwordHash,
          firstName: "Alex",
          lastName: "Dupont",
          role: "OWNER",
        },
      },
    },
  });

  console.log("Garage de démonstration prêt :", garage.name);
  console.log("Connexion : owner@garage-demo.fr / motdepasse123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
