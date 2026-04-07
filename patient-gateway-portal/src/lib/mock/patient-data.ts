import type {
  Appointment,
  Invoice,
  NotificationSettings,
  Patient,
  Prescription,
  Report,
  TokenStatus,
  VisitHistoryItem,
} from "@/lib/types";

export const mockPatient: Patient = {
  id: "PAT-000981",
  uhid: "VH-UHID-2026-01981",
  firstName: "Karthik",
  lastName: "Raman",
  age: 38,
  sex: "Male",
  bloodGroup: "B+",
  mobile: "9876547606",
  email: "karthik.raman@example.com",
  address: "No. 14, Beach Road, Cuddalore, Tamil Nadu - 607001",
  emergencyContact: "Lakshmi Raman - 9876501122",
  primaryDoctor: "Dr. Senthil S",
  department: "Orthopaedics",
  nextFollowUp: "2026-04-18T10:30:00.000Z",
  avatarUrl:
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=320&q=80",
};

export const mockTokenStatus: TokenStatus = {
  tokenNumber: "OP-132",
  queuePosition: 4,
  patientsAhead: 3,
  consultationRoom: "Consult Room 2",
  status: "Waiting",
  estimatedWaitMinutes: 22,
  updatedAt: "2026-04-07T09:42:00.000Z",
  isNext: false,
  timeline: [
    { label: "Token Generated", stage: "Waiting", timestamp: "09:10", completed: true, current: false },
    { label: "Waiting Area", stage: "Waiting", timestamp: "09:14", completed: true, current: true },
    { label: "Called to Room", stage: "Called", completed: false, current: false },
    { label: "Consultation", stage: "In Consultation", completed: false, current: false },
    { label: "Completed", stage: "Completed", completed: false, current: false },
  ],
};

export const mockAppointments: Appointment[] = [
  {
    id: "APT-14483",
    dateTime: "2026-04-07T10:00:00.000Z",
    doctorName: "Dr. Senthil S",
    department: "Orthopaedics",
    type: "Follow-up",
    mode: "In Person",
    status: "Checked In",
    notes: "Post ORIF tibial plateau review",
  },
  {
    id: "APT-14379",
    dateTime: "2026-04-18T10:30:00.000Z",
    doctorName: "Dr. Anbarasan K",
    department: "Hand & Microvascular",
    type: "Review",
    mode: "In Person",
    status: "Booked",
    notes: "Suture and wound healing assessment",
  },
  {
    id: "APT-13810",
    dateTime: "2026-03-28T17:00:00.000Z",
    doctorName: "Dr. Jayakar",
    department: "Pain Medicine",
    type: "Follow-up",
    mode: "Video",
    status: "Completed",
    notes: "Pain medication taper guidance",
  },
];

export const mockPrescriptions: Prescription[] = [
  {
    id: "RX-56012",
    visitDate: "2026-04-07T10:05:00.000Z",
    doctorName: "Dr. Senthil S",
    department: "Orthopaedics",
    diagnosisSummary: "Tibial plateau fracture - post operative follow-up, stable union progress.",
    status: "Ready",
    pdfUrl: "/mock/prescriptions/rx-56012.pdf",
    medicines: [
      { medicine: "Aceclofenac + Paracetamol", dosage: "1 tablet", duration: "5 days", instructions: "After food, twice daily" },
      { medicine: "Calcium + Vitamin D3", dosage: "1 tablet", duration: "30 days", instructions: "After breakfast" },
      { medicine: "Pantoprazole", dosage: "1 tablet", duration: "5 days", instructions: "Before breakfast" },
    ],
  },
  {
    id: "RX-55840",
    visitDate: "2026-03-28T17:10:00.000Z",
    doctorName: "Dr. Jayakar",
    department: "Pain Medicine",
    diagnosisSummary: "Post-traumatic knee pain, mild inflammatory flare.",
    status: "Ready",
    pdfUrl: "/mock/prescriptions/rx-55840.pdf",
    medicines: [
      { medicine: "Etoricoxib 60mg", dosage: "1 tablet", duration: "7 days", instructions: "After dinner" },
      { medicine: "Topical Diclofenac Gel", dosage: "Apply locally", duration: "10 days", instructions: "Twice daily" },
    ],
  },
  {
    id: "RX-54901",
    visitDate: "2026-03-10T11:20:00.000Z",
    doctorName: "Dr. Senthil S",
    department: "Orthopaedics",
    diagnosisSummary: "Phase-2 rehabilitation and weight-bearing progression.",
    status: "Ready",
    pdfUrl: "/mock/prescriptions/rx-54901.pdf",
    medicines: [
      { medicine: "Multivitamin", dosage: "1 capsule", duration: "21 days", instructions: "After lunch" },
      { medicine: "Protein Supplement", dosage: "1 scoop", duration: "21 days", instructions: "Daily evening" },
    ],
  },
];

export const mockReports: Report[] = [
  {
    id: "REP-9012",
    testName: "CBC + ESR",
    type: "Lab",
    orderedDate: "2026-04-06T08:30:00.000Z",
    updatedDate: "2026-04-06T15:15:00.000Z",
    status: "Reviewed",
    previewSummary: "Counts within normal range. ESR mildly elevated and clinically expected post-op.",
    fileUrl: "/mock/reports/rep-9012.pdf",
  },
  {
    id: "REP-9038",
    testName: "Knee X-Ray AP/Lateral",
    type: "Imaging",
    orderedDate: "2026-04-07T09:00:00.000Z",
    updatedDate: "2026-04-07T09:28:00.000Z",
    status: "Ready",
    previewSummary: "Implant alignment maintained. No interval displacement noted.",
    fileUrl: "/mock/reports/rep-9038.pdf",
  },
  {
    id: "REP-8893",
    testName: "Fasting Blood Sugar",
    type: "Lab",
    orderedDate: "2026-03-28T07:40:00.000Z",
    updatedDate: "2026-03-28T13:10:00.000Z",
    status: "Reviewed",
    previewSummary: "Glycaemic status within target range.",
    fileUrl: "/mock/reports/rep-8893.pdf",
  },
  {
    id: "REP-9104",
    testName: "Vitamin D Panel",
    type: "Lab",
    orderedDate: "2026-04-07T10:35:00.000Z",
    updatedDate: "2026-04-07T10:35:00.000Z",
    status: "Processing",
    previewSummary: "Sample received. Processing underway.",
    fileUrl: "/mock/reports/rep-9104.pdf",
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "INV-24077",
    invoiceNumber: "VH/OP/2026/24077",
    date: "2026-04-07T10:15:00.000Z",
    category: "Consultation + Dressing",
    status: "Paid",
    amount: 1450,
    paymentMode: "UPI",
    receiptUrl: "/mock/billing/inv-24077.pdf",
  },
  {
    id: "INV-23919",
    invoiceNumber: "VH/LAB/2026/23919",
    date: "2026-04-06T16:00:00.000Z",
    category: "Lab Investigations",
    status: "Paid",
    amount: 980,
    paymentMode: "Card",
    receiptUrl: "/mock/billing/inv-23919.pdf",
  },
  {
    id: "INV-23672",
    invoiceNumber: "VH/PH/2026/23672",
    date: "2026-03-28T18:15:00.000Z",
    category: "Pharmacy",
    status: "Paid",
    amount: 760,
    paymentMode: "Cash",
    receiptUrl: "/mock/billing/inv-23672.pdf",
  },
  {
    id: "INV-24101",
    invoiceNumber: "VH/REHAB/2026/24101",
    date: "2026-04-09T11:00:00.000Z",
    category: "Physiotherapy Session",
    status: "Unpaid",
    amount: 1200,
    paymentMode: "Insurance",
    receiptUrl: "/mock/billing/inv-24101.pdf",
  },
];

export const mockNotificationSettings: NotificationSettings = {
  language: "en",
  sms: true,
  whatsapp: true,
  email: false,
  appointmentReminders: true,
  reportAlerts: true,
  billingAlerts: true,
  profileVisibility: "care-team-only",
};

export const mockVisitHistory: VisitHistoryItem[] = [
  {
    id: "VH-2026-0407",
    dateTime: "2026-04-07T10:05:00.000Z",
    doctorName: "Dr. Senthil S",
    department: "Orthopaedics",
    outcome: "Fracture healing satisfactory. Continue partial weight bearing.",
    followUpDate: "2026-04-18T10:30:00.000Z",
  },
  {
    id: "VH-2026-0328",
    dateTime: "2026-03-28T17:10:00.000Z",
    doctorName: "Dr. Jayakar",
    department: "Pain Medicine",
    outcome: "Pain reduction observed. Continue medication taper.",
    followUpDate: "2026-04-07T10:00:00.000Z",
  },
  {
    id: "VH-2026-0310",
    dateTime: "2026-03-10T11:20:00.000Z",
    doctorName: "Dr. Senthil S",
    department: "Orthopaedics",
    outcome: "Rehab phase 2 started with supervised physiotherapy.",
    followUpDate: "2026-03-28T17:00:00.000Z",
  },
];

export const mockAuthOtp = {
  mobile: mockPatient.mobile,
  otp: "123456",
  uhid: mockPatient.uhid,
};

