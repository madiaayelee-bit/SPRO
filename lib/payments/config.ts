function isPlaceholder(value: string | undefined) {
  return !value || value.trim() === "" || value.includes("placeholder");
}

export function isPayDunyaConfigured() {
  return (
    !isPlaceholder(process.env.PAYDUNYA_MASTER_KEY) &&
    !isPlaceholder(process.env.PAYDUNYA_PRIVATE_KEY) &&
    !isPlaceholder(process.env.PAYDUNYA_TOKEN)
  );
}

export function getPayDunyaConfig() {
  return {
    masterKey: process.env.PAYDUNYA_MASTER_KEY ?? "",
    privateKey: process.env.PAYDUNYA_PRIVATE_KEY ?? "",
    token: process.env.PAYDUNYA_TOKEN ?? "",
    mode: process.env.PAYDUNYA_MODE === "live" ? "live" : ("sandbox" as const),
  };
}

export function isFlutterwaveConfigured() {
  return !isPlaceholder(process.env.FLUTTERWAVE_SECRET_KEY);
}

export function isStripeConfigured() {
  return !isPlaceholder(process.env.STRIPE_SECRET_KEY);
}
