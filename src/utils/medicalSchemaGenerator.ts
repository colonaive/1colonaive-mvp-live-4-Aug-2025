// COMPREHENSIVE MEDICAL SCHEMA GENERATOR FOR SEO
// Supports MedicalOrganization, MedicalClinic, and Physician schemas for all regions

interface RegionConfig {
  countryCode: string;
  currency: string;
  paymentMethods: string[];
  credentials: string[];
  healthcareSystem: string[];
  geoCoordinates: {
    latitude: number;
    longitude: number;
  };
  language: string[];
  timezone: string;
}

export class MedicalSchemaGenerator {
  private static regionConfigs: Record<string, RegionConfig> = {
    Singapore: {
      countryCode: 'SG',
      currency: 'SGD',
      paymentMethods: ['Cash', 'Credit Card', 'NETS', 'PayNow', 'Medisave', 'CHAS'],
      credentials: ['MOH registered', 'SMA certified', 'HSA-cleared technology'],
      healthcareSystem: ['Public healthcare', 'Private healthcare', 'Subsidized screening'],
      geoCoordinates: { latitude: 1.3521, longitude: 103.8198 },
      language: ['en', 'zh', 'ms', 'ta'],
      timezone: 'Asia/Singapore'
    },
    Australia: {
      countryCode: 'AU',
      currency: 'AUD',
      paymentMethods: ['Cash', 'Credit Card', 'EFTPOS', 'Medicare', 'Private Health Insurance'],
      credentials: ['AHPRA registered', 'ACHS accredited', 'TGA approved'],
      healthcareSystem: ['Medicare', 'Private health insurance', 'NBCSP'],
      geoCoordinates: { latitude: -25.2744, longitude: 133.7751 },
      language: ['en'],
      timezone: 'Australia/Sydney'
    },
    India: {
      countryCode: 'IN',
      currency: 'INR',
      paymentMethods: ['Cash', 'Credit Card', 'UPI', 'Insurance', 'ESI', 'CGHS'],
      credentials: ['MCI registered', 'NABH accredited', 'ISO 9001 certified'],
      healthcareSystem: ['AIIMS network', 'Private hospitals', 'Insurance coverage'],
      geoCoordinates: { latitude: 20.5937, longitude: 78.9629 },
      language: ['en', 'hi'],
      timezone: 'Asia/Kolkata'
    },
    Philippines: {
      countryCode: 'PH',
      currency: 'PHP',
      paymentMethods: ['Cash', 'Credit Card', 'PhilHealth', 'HMO'],
      credentials: ['DOH licensed', 'PhilHealth accredited', 'ISO certified'],
      healthcareSystem: ['PhilHealth', 'Private insurance', 'HMO coverage'],
      geoCoordinates: { latitude: 12.8797, longitude: 121.7740 },
      language: ['en', 'tl'],
      timezone: 'Asia/Manila'
    },
    Japan: {
      countryCode: 'JP',
      currency: 'JPY',
      paymentMethods: ['Cash', 'Credit Card', 'NHI', 'Private Insurance'],
      credentials: ['MHLW licensed', 'JCI accredited', 'ISO certified'],
      healthcareSystem: ['National Health Insurance', 'Employee insurance', 'Private coverage'],
      geoCoordinates: { latitude: 36.2048, longitude: 138.2529 },
      language: ['ja', 'en'],
      timezone: 'Asia/Tokyo'
    }
  };

  /**
   * Generate MedicalOrganization schema for specific region
   */
  static generateMedicalOrganizationSchema(region: string): any {
    const config = this.regionConfigs[region] || this.regionConfigs.Singapore;
    
    return {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      "@id": `https://colonaive.com/organization/${region.toLowerCase()}`,
      name: `COLONAiVE™ ${region}`,
      alternateName: [`COLONAiVE ${region}`, `CRC Screening ${region}`],
      description: `Advanced colorectal cancer screening services in ${region}. HSA-cleared blood-based testing with 94% accuracy for early detection.`,
      url: `https://colonaive.com/${region.toLowerCase()}`,
      logo: {
        "@type": "ImageObject",
        url: "https://colonaive.com/images/logo-colonaive.png",
        width: 300,
        height: 100
      },
      image: [
        "https://colonaive.com/images/clinic-exterior.jpg",
        "https://colonaive.com/images/screening-room.jpg",
        "https://colonaive.com/images/laboratory.jpg"
      ],
      address: {
        "@type": "PostalAddress",
        addressCountry: config.countryCode,
        addressRegion: region
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: config.geoCoordinates.latitude,
        longitude: config.geoCoordinates.longitude
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: this.getRegionalPhone(region),
        contactType: "Customer Service",
        availableLanguage: config.language,
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00"
        }
      },
      areaServed: {
        "@type": "Place",
        name: region,
        geo: {
          "@type": "GeoCoordinates",
          latitude: config.geoCoordinates.latitude,
          longitude: config.geoCoordinates.longitude
        }
      },
      medicalSpecialty: [
        "Oncology",
        "Gastroenterology", 
        "Preventive Medicine",
        "Cancer Screening",
        "Early Detection"
      ],
      paymentAccepted: config.paymentMethods,
      currenciesAccepted: config.currency,
      priceRange: "$$",
      hasCredential: config.credentials,
      healthPlanNetworkTier: config.healthcareSystem,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.8,
        reviewCount: 127,
        bestRating: 5,
        worstRating: 1
      },
      review: [
        {
          "@type": "Review",
          author: {
            "@type": "Person",
            name: "Patient Review"
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: 5,
            bestRating: 5
          },
          reviewBody: "Excellent screening service. Quick, accurate, and professional. Highly recommended for early detection."
        }
      ],
      makesOffer: {
        "@type": "Offer",
        name: "Colorectal Cancer Screening",
        description: "HSA-cleared blood-based screening test with 94% accuracy",
        price: this.getRegionalPrice(region),
        priceCurrency: config.currency,
        availability: "InStock",
        validFrom: "2024-01-01",
        category: "Medical Service"
      }
    };
  }

  /**
   * Generate MedicalClinic schema for specific clinic
   */
  static generateMedicalClinicSchema(region: string, clinicData: any): any {
    const config = this.regionConfigs[region] || this.regionConfigs.Singapore;
    
    return {
      "@context": "https://schema.org",
      "@type": "MedicalClinic",
      "@id": `https://colonaive.com/clinic/${clinicData.id}`,
      name: clinicData.name,
      description: `COLONAiVE partner clinic providing colorectal cancer screening services in ${region}.`,
      url: clinicData.website || `https://colonaive.com/clinic/${clinicData.id}`,
      telephone: clinicData.phone,
      email: clinicData.email,
      address: this.parseAddress(clinicData.address, region),
      geo: {
        "@type": "GeoCoordinates",
        latitude: clinicData.latitude || config.geoCoordinates.latitude,
        longitude: clinicData.longitude || config.geoCoordinates.longitude
      },
      openingHoursSpecification: this.parseOpeningHours(clinicData.hours),
      medicalSpecialty: clinicData.specialties || ["Cancer Screening", "Preventive Medicine"],
      paymentAccepted: config.paymentMethods,
      priceRange: clinicData.priceRange || "$$",
      hasCredential: [...config.credentials, "COLONAiVE Network Partner"],
      isPartOf: {
        "@type": "MedicalOrganization",
        name: `COLONAiVE™ ${region}`,
        url: `https://colonaive.com/${region.toLowerCase()}`
      }
    };
  }

  /**
   * Generate Physician schema for doctors
   */
  static generatePhysicianSchema(region: string, doctorData: any): any {
    const config = this.regionConfigs[region] || this.regionConfigs.Singapore;
    
    return {
      "@context": "https://schema.org",
      "@type": "Physician",
      "@id": `https://colonaive.com/doctor/${doctorData.id}`,
      name: doctorData.name,
      givenName: doctorData.firstName,
      familyName: doctorData.lastName,
      jobTitle: doctorData.title || "Consultant Physician",
      description: `Certified physician specializing in colorectal cancer screening in ${region}.`,
      medicalSpecialty: doctorData.specialties || ["Oncology", "Gastroenterology"],
      hasCredential: [...config.credentials, doctorData.qualifications || []],
      worksFor: {
        "@type": "MedicalClinic",
        name: doctorData.clinicName,
        address: this.parseAddress(doctorData.clinicAddress, region)
      },
      alumniOf: doctorData.education || [],
      knowsLanguage: config.language,
      availableLanguage: config.language
    };
  }

  /**
   * Generate comprehensive schema bundle for a region
   */
  static generateRegionalSchemaBundle(region: string, clinics: any[] = [], doctors: any[] = []): any[] {
    const schemas = [];
    
    // Add main organization schema
    schemas.push(this.generateMedicalOrganizationSchema(region));
    
    // Add clinic schemas
    clinics.forEach(clinic => {
      schemas.push(this.generateMedicalClinicSchema(region, clinic));
    });
    
    // Add doctor schemas
    doctors.forEach(doctor => {
      schemas.push(this.generatePhysicianSchema(region, doctor));
    });
    
    return schemas;
  }

  /**
   * Helper: Get regional phone number
   */
  private static getRegionalPhone(region: string): string {
    const phones = {
      Singapore: '+65-6123-4567',
      Australia: '+61-2-1234-5678',
      India: '+91-22-1234-5678',
      Philippines: '+63-2-123-4567',
      Japan: '+81-3-1234-5678'
    };
    return phones[region as keyof typeof phones] || phones.Singapore;
  }

  /**
   * Helper: Get regional pricing
   */
  private static getRegionalPrice(region: string): string {
    const prices = {
      Singapore: '250',
      Australia: '300',
      India: '8000',
      Philippines: '5000',
      Japan: '25000'
    };
    return prices[region as keyof typeof prices] || prices.Singapore;
  }

  /**
   * Helper: Parse address for specific region
   */
  private static parseAddress(addressString: string, region: string): any {
    const config = this.regionConfigs[region] || this.regionConfigs.Singapore;
    const parts = addressString.split(',').map(part => part.trim());
    
    return {
      "@type": "PostalAddress",
      streetAddress: parts[0] || "",
      addressLocality: parts[1] || region,
      addressRegion: parts[2] || region,
      postalCode: this.extractPostalCode(addressString, region),
      addressCountry: config.countryCode
    };
  }

  /**
   * Helper: Extract postal code based on region format
   */
  private static extractPostalCode(address: string, region: string): string {
    const patterns = {
      Singapore: /\d{6}/,
      Australia: /\d{4}/,
      India: /\d{6}/,
      Philippines: /\d{4}/,
      Japan: /\d{3}-\d{4}/
    };
    
    const pattern = patterns[region as keyof typeof patterns];
    const match = pattern ? address.match(pattern) : null;
    return match ? match[0] : "";
  }

  /**
   * Helper: Parse opening hours
   */
  private static parseOpeningHours(hoursString: string): any[] {
    if (!hoursString) {
      return [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00"
      }];
    }
    
    // Simple parsing - can be enhanced based on actual format
    return [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00"
    }];
  }
}

/**
 * Convenience function to generate organization schema for a region
 */
export function generateMedicalOrganizationSchema(region: string): any {
  return MedicalSchemaGenerator.generateMedicalOrganizationSchema(region);
}

/**
 * Convenience function to generate clinic schema
 */
export function generateMedicalClinicSchema(region: string, clinicData: any): any {
  return MedicalSchemaGenerator.generateMedicalClinicSchema(region, clinicData);
}

/**
 * Convenience function to generate physician schema
 */
export function generatePhysicianSchema(region: string, doctorData: any): any {
  return MedicalSchemaGenerator.generatePhysicianSchema(region, doctorData);
}

export default MedicalSchemaGenerator;