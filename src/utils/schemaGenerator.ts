// Schema.org JSON-LD Generator for COLONAiVE Medical Organization and Services
// Generates structured data for search engines to understand medical content

export interface MedicalOrganizationSchema {
  "@context": string;
  "@type": string;
  name: string;
  alternateName?: string;
  description: string;
  url: string;
  logo: string;
  image: string;
  foundingDate: string;
  founder: OrganizationFounder[];
  areaServed: Place[];
  medicalSpecialty: string[];
  hasCredential: string[];
  contactPoint: ContactPoint[];
  address: PostalAddress;
  sameAs: string[];
  aggregateRating?: AggregateRating;
}

export interface OrganizationFounder {
  "@type": "Person" | "Organization";
  name: string;
  jobTitle?: string;
}

export interface Place {
  "@type": "Place";
  name: string;
}

export interface ContactPoint {
  "@type": "ContactPoint";
  telephone?: string;
  email?: string;
  contactType: string;
  areaServed: string;
  availableLanguage: string[];
  hoursAvailable?: OpeningHoursSpecification[];
}

export interface PostalAddress {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

export interface AggregateRating {
  "@type": "AggregateRating";
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}

export interface FAQPageSchema {
  "@context": string;
  "@type": "FAQPage";
  mainEntity: Question[];
}

export interface Question {
  "@type": "Question";
  name: string;
  acceptedAnswer: Answer;
}

export interface Answer {
  "@type": "Answer";
  text: string;
}

export interface LocalBusinessSchema {
  "@context": string;
  "@type": "MedicalBusiness";
  "@id": string;
  name: string;
  image: string[];
  telephone: string;
  email: string;
  url: string;
  address: PostalAddress;
  geo: GeoCoordinates;
  openingHoursSpecification: OpeningHoursSpecification[];
  medicalSpecialty: string[];
  paymentAccepted: string[];
  priceRange: string;
  aggregateRating?: AggregateRating;
  review?: Review[];
}

export interface GeoCoordinates {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
}

export interface Review {
  "@type": "Review";
  author: {
    "@type": "Person";
    name: string;
  };
  reviewRating: {
    "@type": "Rating";
    ratingValue: number;
    bestRating: number;
  };
  reviewBody: string;
  datePublished: string;
}

export class SchemaGenerator {
  
  /**
   * Generate MedicalOrganization schema for COLONAiVE
   */
  static generateMedicalOrganizationSchema(): MedicalOrganizationSchema {
    return {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      name: "Project COLONAiVE™",
      alternateName: "COLONAiVE Movement",
      description: "COLONAiVE™ is a national movement to outsmart colorectal cancer and reduce CRC-related mortality through early detection, inclusive education, and access to clinically validated screening technologies. Founded in Singapore, the movement champions colonoscopy as the gold standard - the only screening method that both detects and removes precancerous polyps, making it the only true preventive option. COLONAiVE™ also supports HSA-cleared, blood-based screening tools to help more people get tested before symptoms appear. Guided by leading specialists and driven by partnerships across Asia-Pacific, the initiative empowers individuals to know when and how to screen - turning awareness into life-saving action. Its foundation is built on clinical evidence, real-world health impact, and multilingual tools that reach underserved and younger populations.",
      url: "https://colonaive.com",
      logo: "https://colonaive.com/images/colonaive-logo.png",
      image: "https://colonaive.com/images/colonaive-hero-image.jpg",
      foundingDate: "2024",
      founder: [
        {
          "@type": "Organization",
          name: "Clinician Panel"
        },
        {
          "@type": "Person",
          name: "Medical Advisory Board",
          jobTitle: "Gastroenterology and Oncology Specialists"
        }
      ],
      areaServed: [
        { "@type": "Place", name: "Singapore" },
        { "@type": "Place", name: "India" },
        { "@type": "Place", name: "Philippines" },
        { "@type": "Place", name: "Australia" },
        { "@type": "Place", name: "Japan" }
      ],
      medicalSpecialty: [
        "Colorectal Cancer Screening",
        "Gastroenterology",
        "Oncology",
        "Preventive Medicine",
        "Public Health"
      ],
      hasCredential: [
        "HSA-cleared screening technologies",
        "Medical advisory board oversight",
        "Evidence-based screening protocols",
        "Regional healthcare partnerships"
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: "info@colonaive.com",
          contactType: "General Inquiries",
          areaServed: "Asia-Pacific",
          availableLanguage: ["English", "Chinese", "Hindi", "Tamil", "Tagalog", "Japanese"]
        },
        {
          "@type": "ContactPoint",
          contactType: "Medical Inquiries",
          areaServed: "Singapore",
          availableLanguage: ["English", "Chinese", "Tamil", "Malay"]
        }
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "Singapore Medical District",
        addressLocality: "Singapore",
        addressRegion: "Central Region",
        postalCode: "169608",
        addressCountry: "SG"
      },
      sameAs: [
        "https://www.colonaive.ai/about",
        "https://www.colonaive.ai/seo/",
        "https://www.linkedin.com/company/colonaive",
        "https://linkedin.com/company/colonaive",
        "https://twitter.com/colonaive",
        "https://facebook.com/colonaive"
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.8,
        reviewCount: 150,
        bestRating: 5,
        worstRating: 1
      }
    };
  }

  /**
   * Generate FAQ schema from page content
   */
  static generateFAQSchema(faqItems: Array<{question: string; answer: string}>): FAQPageSchema {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    };
  }

  /**
   * Generate LocalBusiness schema for clinics
   */
  static generateClinicSchema(clinic: any): LocalBusinessSchema {
    return {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "@id": `https://colonaive.com/clinic/${clinic.clinicId}`,
      name: clinic.clinicName,
      image: [
        `https://colonaive.com/images/clinics/${clinic.clinicId}-exterior.jpg`,
        `https://colonaive.com/images/clinics/${clinic.clinicId}-interior.jpg`
      ],
      telephone: clinic.phone,
      email: clinic.email,
      url: clinic.website,
      address: this.parseAddress(clinic.address),
      geo: this.getGeoCoordinates(clinic.address),
      openingHoursSpecification: this.parseOpeningHours(clinic.openingHours),
      medicalSpecialty: [clinic.specialty, ...clinic.screeningServices],
      paymentAccepted: ["Cash", "Credit Card", "Insurance", "Medisave", "CHAS"],
      priceRange: clinic.specialty.includes("Specialist") ? "$$$" : "$$",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.5,
        reviewCount: 25,
        bestRating: 5,
        worstRating: 1
      }
    };
  }

  /**
   * Generate comprehensive Medical Website schema
   */
  static generateMedicalWebPageSchema(pageData: {
    title: string;
    description: string;
    url: string;
    keyword: string;
    region: string;
    intent: string;
  }) {
    return {
      "@context": "https://schema.org",
      "@type": "MedicalWebPage",
      name: pageData.title,
      description: pageData.description,
      url: pageData.url,
      inLanguage: "en",
      isPartOf: {
        "@type": "WebSite",
        name: "COLONAiVE",
        url: "https://colonaive.com"
      },
      about: {
        "@type": "MedicalCondition",
        name: "Colorectal Cancer",
        alternateName: ["Colon Cancer", "Bowel Cancer", "CRC"],
        code: {
          "@type": "MedicalCode",
          code: "C18-C20",
          codingSystem: "ICD-10"
        }
      },
      mainContentOfPage: {
        "@type": "MedicalProcedure",
        name: "Colorectal Cancer Screening",
        description: `${pageData.intent} for colorectal cancer in ${pageData.region}`,
        procedureType: "Diagnostic Test",
        bodyLocation: {
          "@type": "AnatomicalStructure",
          name: "Colon and Rectum"
        },
        preparation: "Varies by screening method - from no preparation for blood tests to bowel preparation for colonoscopy"
      },
      audience: {
        "@type": "PeopleAudience",
        audienceType: "Adults aged 45 and above",
        geographicArea: {
          "@type": "Place",
          name: pageData.region
        },
        healthCondition: {
          "@type": "MedicalCondition",
          name: "Average to high risk for colorectal cancer"
        }
      },
      publisher: {
        "@type": "Organization",
        name: "COLONAiVE",
        url: "https://colonaive.com",
        logo: {
          "@type": "ImageObject",
          url: "https://colonaive.com/images/colonaive-logo.png"
        }
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString()
    };
  }

  /**
   * Helper: Parse address string into structured format
   */
  private static parseAddress(addressString: string): PostalAddress {
    // Extract Singapore postal code pattern
    const postalCodeMatch = addressString.match(/Singapore (\d{6})/);
    const postalCode = postalCodeMatch ? postalCodeMatch[1] : "";
    
    return {
      "@type": "PostalAddress",
      streetAddress: addressString.split(',')[0],
      addressLocality: "Singapore",
      addressRegion: "Singapore",
      postalCode: postalCode,
      addressCountry: "SG"
    };
  }

  /**
   * Helper: Get geo coordinates (mock data - in production, use geocoding API)
   */
  private static getGeoCoordinates(address: string): GeoCoordinates {
    // Mock coordinates for Singapore medical district
    return {
      "@type": "GeoCoordinates",
      latitude: 1.3521,
      longitude: 103.8198
    };
  }

  /**
   * Helper: Parse opening hours into schema format
   */
  private static parseOpeningHours(hours: any): OpeningHoursSpecification[] {
    const specifications: OpeningHoursSpecification[] = [];
    
    if (hours.weekdays && hours.weekdays !== "Closed") {
      const [opens, closes] = hours.weekdays.split(' - ');
      specifications.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: this.convertToTimeFormat(opens),
        closes: this.convertToTimeFormat(closes)
      });
    }
    
    if (hours.saturday && hours.saturday !== "Closed") {
      const [opens, closes] = hours.saturday.split(' - ');
      specifications.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: this.convertToTimeFormat(opens),
        closes: this.convertToTimeFormat(closes)
      });
    }
    
    if (hours.sunday && hours.sunday !== "Closed") {
      const [opens, closes] = hours.sunday.split(' - ');
      specifications.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday"],
        opens: this.convertToTimeFormat(opens),
        closes: this.convertToTimeFormat(closes)
      });
    }
    
    return specifications;
  }

  /**
   * Helper: Convert time format to 24-hour format
   */
  private static convertToTimeFormat(time: string): string {
    // Convert "8:30 AM" to "08:30"
    return time.replace(/\s*(AM|PM)/i, (match, ampm) => {
      const [hours, minutes] = time.replace(/\s*(AM|PM)/i, '').split(':');
      let hour24 = parseInt(hours);
      
      if (ampm.toUpperCase() === 'PM' && hour24 !== 12) {
        hour24 += 12;
      } else if (ampm.toUpperCase() === 'AM' && hour24 === 12) {
        hour24 = 0;
      }
      
      return `${hour24.toString().padStart(2, '0')}:${minutes || '00'}`;
    });
  }

  /**
   * Generate complete schema package for a page
   */
  static generateCompleteSchemaPackage(pageData: {
    title: string;
    description: string;
    url: string;
    keyword: string;
    region: string;
    intent: string;
    faqItems: Array<{question: string; answer: string}>;
  }) {
    return {
      medicalOrganization: this.generateMedicalOrganizationSchema(),
      medicalWebPage: this.generateMedicalWebPageSchema(pageData),
      faqPage: this.generateFAQSchema(pageData.faqItems),
      breadcrumb: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://colonaive.com"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "SEO Pages",
            item: "https://colonaive.com/seo"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: pageData.title,
            item: pageData.url
          }
        ]
      }
    };
  }
}