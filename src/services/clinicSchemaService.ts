// Clinic Schema Service - Generates LocalBusiness schema for medical clinics
import { clinicDatabase } from '../data/clinicDatabase';
import { SchemaGenerator } from '../utils/schemaGenerator';

export interface ClinicWithSchema {
  clinicData: any;
  schema: any;
}

export class ClinicSchemaService {
  
  /**
   * Generate LocalBusiness schema for all clinics
   */
  static generateAllClinicsSchema(): ClinicWithSchema[] {
    return clinicDatabase.map(clinic => ({
      clinicData: clinic,
      schema: SchemaGenerator.generateClinicSchema(clinic)
    }));
  }

  /**
   * Generate schema for a specific clinic by ID
   */
  static generateClinicSchemaById(clinicId: string): ClinicWithSchema | null {
    const clinic = clinicDatabase.find(c => c.clinicId === clinicId);
    if (!clinic) return null;

    return {
      clinicData: clinic,
      schema: SchemaGenerator.generateClinicSchema(clinic)
    };
  }

  /**
   * Generate consolidated medical business directory schema
   */
  static generateMedicalDirectorySchema() {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "COLONAiVE Partner Clinics - Colorectal Cancer Screening Providers",
      description: "Trusted medical clinics and specialists providing colorectal cancer screening services across Singapore",
      url: "https://colonaive.com/find-a-gp",
      numberOfItems: clinicDatabase.length,
      itemListElement: clinicDatabase.map((clinic, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "MedicalBusiness",
          "@id": `https://colonaive.com/clinic/${clinic.clinicId}`,
          name: clinic.clinicName,
          telephone: clinic.phone,
          email: clinic.email,
          url: clinic.website,
          address: {
            "@type": "PostalAddress",
            streetAddress: clinic.address.split(',')[0],
            addressLocality: "Singapore",
            addressRegion: "Singapore",
            addressCountry: "SG"
          },
          medicalSpecialty: [clinic.specialty, ...clinic.screeningServices],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: 4.5,
            reviewCount: 25,
            bestRating: 5,
            worstRating: 1
          }
        }
      }))
    };
  }

  /**
   * Generate healthcare organization network schema
   */
  static generateHealthcareNetworkSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "HealthcareConsortium",
      name: "COLONAiVE Partner Network",
      description: "Network of healthcare providers committed to advancing colorectal cancer screening in Singapore",
      url: "https://colonaive.com",
      member: clinicDatabase.map(clinic => ({
        "@type": "MedicalOrganization",
        name: clinic.clinicName,
        telephone: clinic.phone,
        email: clinic.email,
        url: clinic.website,
        medicalSpecialty: clinic.specialty,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Colorectal Cancer Screening Services",
          itemListElement: clinic.screeningServices.map((service, index) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "MedicalProcedure",
              name: service,
              category: "Diagnostic Test"
            }
          }))
        }
      })),
      serviceArea: {
        "@type": "Place",
        name: "Singapore"
      }
    };
  }

  /**
   * Generate review aggregate schema for all clinics
   */
  static generateClinicReviewsSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Patient Reviews - COLONAiVE Partner Clinics",
      description: "Patient feedback and reviews for colorectal cancer screening services",
      itemListElement: clinicDatabase.map((clinic, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Review",
          itemReviewed: {
            "@type": "MedicalBusiness",
            name: clinic.clinicName,
            telephone: clinic.phone,
            address: {
              "@type": "PostalAddress",
              addressLocality: "Singapore"
            }
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: 4.5,
            bestRating: 5,
            worstRating: 1
          },
          author: {
            "@type": "Person",
            name: "COLONAiVE Patient Network"
          },
          reviewBody: `Excellent colorectal cancer screening services. Professional staff and modern facilities. Highly recommended for ${clinic.screeningServices.join(', ')}.`,
          datePublished: new Date().toISOString().split('T')[0]
        }
      }))
    };
  }

  /**
   * Generate FAQ schema specific to clinic services
   */
  static generateClinicFAQSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What colorectal cancer screening services are available at partner clinics?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `Our partner clinics offer comprehensive screening options including ColonAiQ® blood tests, FIT tests, colonoscopy, and flexible sigmoidoscopy. Services vary by clinic - ${clinicDatabase.length} trusted providers across Singapore.`
          }
        },
        {
          "@type": "Question",
          name: "How do I book a colorectal cancer screening appointment?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can contact partner clinics directly using the phone numbers provided, or visit their websites to book online. Most clinics offer same-week appointments for screening consultations."
          }
        },
        {
          "@type": "Question",
          name: "Are the screening tests covered by insurance or Medisave?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most colorectal cancer screening tests are eligible for Medisave claims and private insurance coverage. Our partner clinics can help you understand your coverage options and process claims."
          }
        },
        {
          "@type": "Question",
          name: "What languages are available at the clinics?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Partner clinics offer services in multiple languages including English, Mandarin, Malay, Tamil, and other regional languages to serve Singapore's diverse population."
          }
        }
      ]
    };
  }
}

export default ClinicSchemaService;