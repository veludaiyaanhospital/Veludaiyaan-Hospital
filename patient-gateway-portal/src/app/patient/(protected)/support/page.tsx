"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  Camera,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Siren,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSupportMutations } from "@/hooks/use-patient-queries";

const callbackSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/),
  preferredSlot: z.string().min(2),
  reason: z.string().min(5),
});

const ticketSchema = z.object({
  category: z.enum(["Access", "Appointment", "Billing", "Medical Record", "Other"]),
  subject: z.string().min(4),
  message: z.string().min(10),
});

type CallbackValues = z.infer<typeof callbackSchema>;
type TicketValues = z.infer<typeof ticketSchema>;

const faqs = [
  {
    id: "faq-1",
    question: "When should I call immediately?",
    answer: "For severe trauma pain, accidents, fractures, dislocations, bleeding, or sudden swelling.",
  },
  {
    id: "faq-2",
    question: "How can I book faster?",
    answer: "Use WhatsApp with name, age, symptoms, and preferred visit date for quicker callback.",
  },
  {
    id: "faq-3",
    question: "Do you support follow-up visits?",
    answer: "Yes. Our doctors schedule follow-up and rehabilitation continuity visits after procedures.",
  },
];

export default function SupportPage() {
  const { callbackMutation, ticketMutation } = useSupportMutations();

  const callbackForm = useForm<CallbackValues>({
    resolver: zodResolver(callbackSchema),
    defaultValues: {
      mobile: "",
      preferredSlot: "Today 4 PM - 6 PM",
      reason: "",
    },
  });

  const ticketForm = useForm<TicketValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      category: "Appointment",
      subject: "",
      message: "",
    },
  });

  const submitCallback = callbackForm.handleSubmit((values) => {
    callbackMutation.mutate(values);
    callbackForm.reset({ mobile: "", preferredSlot: "Today 4 PM - 6 PM", reason: "" });
  });

  const submitTicket = ticketForm.handleSubmit((values) => {
    ticketMutation.mutate(values);
    ticketForm.reset({ category: "Appointment", subject: "", message: "" });
  });

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Siren className="h-4 w-4" />
          Emergency notice: For critical trauma cases, call immediately at +91 78459 27606.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl lg:col-span-1">
          <CardHeader>
            <CardTitle>Hospital Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <a className="flex items-center gap-2 hover:text-sky-700" href="tel:+917845927606">
              <Phone className="h-4 w-4 text-sky-600" />
              Mobile: +91 78459 27606
            </a>
            <a className="flex items-center gap-2 hover:text-sky-700" href="tel:+914142233606">
              <PhoneCall className="h-4 w-4 text-sky-600" />
              Landline: 04142 233606
            </a>
            <a className="flex items-center gap-2 hover:text-sky-700" href="https://wa.me/917845927606" rel="noreferrer" target="_blank">
              <MessageCircle className="h-4 w-4 text-emerald-600" />
              WhatsApp Chat
            </a>
            <a className="flex items-center gap-2 hover:text-sky-700" href="https://www.instagram.com/veludaiyaanhospital" rel="noreferrer" target="_blank">
              <Camera className="h-4 w-4 text-pink-600" />
              Instagram
            </a>
            <a className="flex items-center gap-2 hover:text-sky-700" href="https://www.linkedin.com/company/veludaiyaan-hospital" rel="noreferrer" target="_blank">
              <BriefcaseBusiness className="h-4 w-4 text-blue-600" />
              LinkedIn
            </a>
            <a
              className="flex items-center gap-2 hover:text-sky-700"
              href="https://maps.google.com/?q=Veludaiyaan+Hospital+Cuddalore"
              rel="noreferrer"
              target="_blank"
            >
              <MapPin className="h-4 w-4 text-rose-600" />
              Manjakuppam, Cuddalore
            </a>
          </CardContent>
        </Card>

        <Card className="rounded-2xl lg:col-span-1">
          <CardHeader>
            <CardTitle>Request Callback</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={submitCallback}>
              <div className="space-y-1">
                <Label htmlFor="callback-mobile">Mobile</Label>
                <Input id="callback-mobile" maxLength={10} {...callbackForm.register("mobile")} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="callback-slot">Preferred Slot</Label>
                <Input id="callback-slot" {...callbackForm.register("preferredSlot")} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="callback-reason">Reason</Label>
                <Textarea id="callback-reason" rows={3} {...callbackForm.register("reason")} />
              </div>
              <p className="text-xs text-rose-600">{Object.values(callbackForm.formState.errors)[0]?.message as string}</p>
              <Button className="w-full" disabled={callbackMutation.isPending} type="submit">
                {callbackMutation.isPending ? "Submitting..." : "Submit Callback Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-2xl lg:col-span-1">
          <CardHeader>
            <CardTitle>Help Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={submitTicket}>
              <div className="space-y-1">
                <Label htmlFor="ticket-category">Category</Label>
                <Input id="ticket-category" {...ticketForm.register("category")} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ticket-subject">Subject</Label>
                <Input id="ticket-subject" {...ticketForm.register("subject")} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="ticket-message">Message</Label>
                <Textarea id="ticket-message" rows={3} {...ticketForm.register("message")} />
              </div>
              <p className="text-xs text-rose-600">{Object.values(ticketForm.formState.errors)[0]?.message as string}</p>
              <Button className="w-full" disabled={ticketMutation.isPending} type="submit" variant="secondary">
                {ticketMutation.isPending ? "Submitting..." : "Raise Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion collapsible type="single">
            {faqs.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
