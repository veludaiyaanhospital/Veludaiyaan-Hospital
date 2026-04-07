import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <a
      aria-label="Open WhatsApp chat"
      className="fixed bottom-20 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-emerald-600 lg:bottom-6"
      href="https://wa.me/917845927606"
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
