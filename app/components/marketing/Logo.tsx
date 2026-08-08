import Image from "next/image";

export function Wordmark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt="Garage Pro"
      width={512}
      height={512}
      className={className}
      priority
    />
  );
}
