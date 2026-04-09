export interface Patient {
  id: string;
  uhid: string;
  firstName: string;
  lastName: string;
  age: number;
  sex: "Male" | "Female" | "Other";
  bloodGroup: string;
  mobile: string;
  email?: string;
  address: string;
  emergencyContact: string;
  primaryDoctor: string;
  department: string;
  nextFollowUp: string;
  avatarUrl?: string;
}

export type TokenStage = "Visit" | "Waiting" | "Seen";

export interface TokenTimelineStep {
  label: string;
  stage: TokenStage;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface TokenStatus {
  tokenNumber: string;
  queuePosition: number;
  patientsAhead: number;
  consultationRoom: string;
  status: TokenStage;
  estimatedWaitMinutes: number;
  updatedAt: string;
  isNext: boolean;
  timeline: TokenTimelineStep[];
}

export interface Appointment {
  id: string;
  dateTime: string;
  doctorName: string;
  department: string;
  type: "New" | "Follow-up" | "Review";
  mode: "In Person" | "Video";
  status: "Visit" | "Waiting" | "Seen";
  notes?: string;
  room?: string;
}

export interface PrescriptionMedicine {
  medicine: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  visitDate: string;
  doctorName: string;
  department: string;
  diagnosisSummary: string;
  medicines: PrescriptionMedicine[];
  status: "Ready" | "Pending";
  pdfUrl: string;
}

export interface Report {
  id: string;
  testName: string;
  type: "Lab" | "Imaging" | "Cardio";
  orderedDate: string;
  updatedDate: string;
  status: "Processing" | "Ready" | "Reviewed";
  previewSummary: string;
  fileUrl: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  category: string;
  status: "Paid" | "Unpaid";
  amount: number;
  paymentMode: "UPI" | "Card" | "Cash" | "Insurance" | "Net Banking";
  receiptUrl: string;
}

export interface NotificationSettings {
  language: "en";
  sms: boolean;
  whatsapp: boolean;
  email: boolean;
  appointmentReminders: boolean;
  reportAlerts: boolean;
  billingAlerts: boolean;
  profileVisibility: "private" | "care-team-only";
}

export interface VisitHistoryItem {
  id: string;
  dateTime: string;
  doctorName: string;
  department: string;
  outcome: string;
  followUpDate?: string;
}

export interface CallbackRequestPayload {
  preferredSlot: string;
  reason: string;
  mobile: string;
}

export interface SupportTicket {
  category: "Access" | "Appointment" | "Billing" | "Medical Record" | "Other";
  subject: string;
  message: string;
}

