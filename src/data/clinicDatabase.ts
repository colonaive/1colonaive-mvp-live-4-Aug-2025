import { ClinicType } from '../types';

export const clinicDatabase: ClinicType[] = [
  {
    clinicId: "GP001",
    clinicName: "Bukit Timah Family Clinic",
    doctors: [
      {
        name: "Dr. Tan Wei Ming",
        credentials: "MBBS (Singapore), GDFM",
        languages: ["English", "Mandarin", "Hokkien"]
      }
    ],
    specialty: "General Practitioner (GP)",
    address: "123 Upper Bukit Timah Road, #03-01, Singapore 588176",
    district: "Bukit Timah",
    phone: "+65 6123 4567",
    email: "enquiry@btfamilyclinic.sg",
    website: "https://www.btfamilyclinic.sg",
    screeningServices: [
      "ColonAiQ® Blood Test",
      "FIT Test",
      "Pre-Colonoscopy Consultation"
    ],
    openingHours: {
      weekdays: "8:30 AM - 6:30 PM",
      saturday: "8:30 AM - 1:00 PM",
      sunday: "Closed",
      publicHoliday: "Closed"
    },
    panelListed: true,
    notes: "Open Mon–Sat. Offers ColonAiQ® blood-based CRC screening."
  },
  {
    clinicId: "SPEC001",
    clinicName: "Novena Colorectal Centre",
    doctors: [
      {
        name: "Dr. Eu Kong Weng",
        credentials: "MBBS (Singapore), FRCS (Edinburgh), FAMS",
        languages: ["English", "Mandarin"]
      }
    ],
    specialty: "Colorectal Surgeon",
    address: "Mount Elizabeth Novena Specialist Centre, #05-12, Singapore 307506",
    district: "Novena",
    phone: "+65 6235 8633",
    email: "contact@novenacolorectalcentre.sg",
    website: "https://www.novenacolorectalcentre.sg",
    screeningServices: [
      "Colonoscopy",
      "Flexible Sigmoidoscopy",
      "ColonAiQ® Blood Test",
      "FIT Test"
    ],
    openingHours: {
      weekdays: "9:00 AM - 5:00 PM",
      saturday: "9:00 AM - 1:00 PM",
      sunday: "Closed",
      publicHoliday: "Closed"
    },
    panelListed: true,
    notes: "Consultant colorectal surgeon. Colonoscopy & surgery services available."
  },
  {
    clinicId: "GP002",
    clinicName: "Tampines Family Medicine Clinic",
    doctors: [
      {
        name: "Dr. Sarah Lim",
        credentials: "MBBS (Singapore), MMed (Family Medicine)",
        languages: ["English", "Mandarin", "Malay"]
      }
    ],
    specialty: "General Practitioner (GP)",
    address: "Tampines Central 1, #01-23, Singapore 529541",
    district: "Tampines",
    phone: "+65 6789 0123",
    email: "info@tampinesfmc.sg",
    website: "https://www.tampinesfmc.sg",
    screeningServices: [
      "ColonAiQ® Blood Test",
      "FIT Test",
      "Health Screening Packages"
    ],
    openingHours: {
      weekdays: "8:00 AM - 9:00 PM",
      saturday: "8:00 AM - 5:00 PM",
      sunday: "9:00 AM - 1:00 PM",
      publicHoliday: "Closed"
    },
    panelListed: true,
    notes: "Extended evening hours on weekdays. Comprehensive health screening packages available."
  },
  {
    clinicId: "SPEC002",
    clinicName: "Singapore Colorectal Clinic",
    doctors: [
      {
        name: "Dr. Michael Chen",
        credentials: "MBBS (Singapore), FRCS (Glasgow), FAMS",
        languages: ["English", "Mandarin", "Cantonese"]
      }
    ],
    specialty: "Colorectal Surgeon",
    address: "Gleneagles Medical Centre, #08-15, Singapore 258499",
    district: "Orchard",
    phone: "+65 6472 9911",
    email: "enquiry@sgcolorectal.sg",
    website: "https://www.sgcolorectal.sg",
    screeningServices: [
      "Colonoscopy",
      "Advanced Endoscopy",
      "ColonAiQ® Blood Test",
      "FIT Test"
    ],
    openingHours: {
      weekdays: "9:00 AM - 6:00 PM",
      saturday: "9:00 AM - 1:00 PM",
      sunday: "Closed",
      publicHoliday: "Closed"
    },
    panelListed: true,
    notes: "Specializes in minimally invasive colorectal surgery and advanced endoscopy."
  },
  {
    clinicId: "GP003",
    clinicName: "Jurong West Family Clinic",
    doctors: [
      {
        name: "Dr. Ahmad bin Hassan",
        credentials: "MBBS (Singapore), GDFM",
        languages: ["English", "Malay"]
      }
    ],
    specialty: "General Practitioner (GP)",
    address: "Jurong West Street 41, #01-45, Singapore 649411",
    district: "Jurong West",
    phone: "+65 6567 8901",
    email: "contact@jwfamilyclinic.sg",
    website: "https://www.jwfamilyclinic.sg",
    screeningServices: [
      "ColonAiQ® Blood Test",
      "FIT Test",
      "Basic Health Screening"
    ],
    openingHours: {
      weekdays: "8:30 AM - 9:30 PM",
      saturday: "8:30 AM - 4:00 PM",
      sunday: "9:00 AM - 1:00 PM",
      publicHoliday: "Closed"
    },
    panelListed: true,
    notes: "Evening and weekend appointments available. Serves Jurong West community."
  }
];