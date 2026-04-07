import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  return (
    <a
      aria-label="Open WhatsApp chat"
      className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-emerald-600 sm:right-5 sm:h-14 sm:w-14 lg:bottom-6"
      href="https://wa.me/917845927606"
      rel="noreferrer"
      target="_blank"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
