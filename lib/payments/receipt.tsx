import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { PaymentTransaction, Garage } from "@/app/generated/prisma/client";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#666", marginBottom: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#eee" },
  label: { color: "#666" },
  value: { fontWeight: 700 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingTop: 16, marginTop: 8 },
  totalLabel: { fontSize: 13, fontWeight: 700 },
  totalValue: { fontSize: 13, fontWeight: 700 },
  footer: { marginTop: 32, fontSize: 9, color: "#999" },
});

/**
 * Génère un reçu PDF — n'est appelé QUE pour une transaction dont le statut
 * en base est déjà `SUCCESS` (vérifié par l'appelant, jamais ici sur la foi
 * d'un état côté client). Le reçu ne prétend jamais un paiement "payé" sans
 * cette confirmation serveur préalable.
 */
export async function generateReceiptPdf(
  transaction: PaymentTransaction,
  garage: Pick<Garage, "name">
): Promise<Buffer> {
  if (transaction.status !== "SUCCESS") {
    throw new Error("Un reçu ne peut être généré que pour un paiement confirmé (SUCCESS).");
  }

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Garage Pro</Text>
        <Text style={styles.subtitle}>Reçu de paiement N° {transaction.reference}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>
            {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short" }).format(
              transaction.confirmedAt ?? transaction.initiatedAt
            )}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Garage</Text>
          <Text style={styles.value}>{garage.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Offre</Text>
          <Text style={styles.value}>{transaction.planTier ?? "—"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Méthode de paiement</Text>
          <Text style={styles.value}>{transaction.channel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Référence de transaction</Text>
          <Text style={styles.value}>{transaction.reference}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Statut</Text>
          <Text style={styles.value}>Payé</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Montant total</Text>
          <Text style={styles.totalValue}>
            {Number(transaction.amount).toLocaleString("fr-FR")} {transaction.currency}
          </Text>
        </View>

        <Text style={styles.footer}>
          Ce reçu confirme un paiement traité et vérifié par notre serveur, en lien avec le
          prestataire de paiement concerné.
        </Text>
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
