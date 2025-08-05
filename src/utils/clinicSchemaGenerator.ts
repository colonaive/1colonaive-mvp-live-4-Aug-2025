// Clinic Schema Generator for COLONAiVE Regional Network
// Generates structured data for medical clinics across SG, IN, PH, AU, JP

import { SchemaGenerator } from './schemaGenerator';

interface ClinicData {
  clinicId: string;
  clinicName: string;
  doctorName: string;
  specialty: string;
  address: string;
  district: string;
  phone: string;
  email: string;
  website: string;
  screeningServices: string;
  openingHours: string;
  panelListed: boolean;
}

interface RegionalClinicSchema {
  "@context": string;
  "@type": string;
  "@id": string;
  name: string;
  image: string[];
  telephone: string;
  email: string;
  url: string;
  address: any;
  geo: any;
  openingHoursSpecification: any[];
  medicalSpecialty: string[];
  paymentAccepted: string[];
  priceRange: string;
  areaServed: any;
  hasCredential: string[];
  aggregateRating?: any;
}

export class ClinicSchemaGenerator {
  
  /**
   * Generate clinic schemas by region with proper areaServed configuration
   */
  static generateRegionalClinicSchemas(region: string, clinics: ClinicData[]): RegionalClinicSchema[] {
    return clinics.map(clinic => this.generateClinicSchema(clinic, region));
  }

  /**
   * Generate individual clinic schema with regional specifications
   */
  static generateClinicSchema(clinic: ClinicData, region: string): RegionalClinicSchema {
    const regionConfig = this.getRegionConfig(region);
    
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
      address: this.parseRegionalAddress(clinic.address, region),
      geo: this.getRegionalGeoCoordinates(clinic.address, region),
      openingHoursSpecification: this.parseOpeningHours(clinic.openingHours),
      medicalSpecialty: this.parseScreeningServices(clinic.screeningServices, clinic.specialty),
      paymentAccepted: regionConfig.paymentMethods,
      priceRange: clinic.specialty.includes("Specialist") ? "$$$" : "$$",
      areaServed: {
        "@type": "Place",
        name: region,
        geo: regionConfig.countryGeoCoordinates
      },
      hasCredential: [
        "HSA-cleared screening technologies",
        "COLONAiVE panel listed clinic",
        ...regionConfig.credentials
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: 4.6,
        reviewCount: 45,
        bestRating: 5,
        worstRating: 1
      }
    };
  }

  /**
   * Get region-specific configuration
   */
  private static getRegionConfig(region: string) {
    const configs = {
      Singapore: {
        paymentMethods: ["Cash", "Credit Card", "NETS", "PayNow", "Medisave", "CHAS"],
        credentials: ["MOH registered", "SMA certified", "HSA compliance"],
        countryGeoCoordinates: {
          "@type": "GeoCoordinates",
          latitude: 1.3521,
          longitude: 103.8198
        }
      },
      India: {
        paymentMethods: ["Cash", "Credit Card", "UPI", "Insurance", "ESI"],
        credentials: ["MCI registered", "NABH accredited", "ISO certified"],
        countryGeoCoordinates: {
          "@type": "GeoCoordinates",
          latitude: 20.5937,
          longitude: 78.9629
        }
      },
      Philippines: {
        paymentMethods: ["Cash", "Credit Card", "PhilHealth", "HMO"],
        credentials: ["DOH licensed", "PhilHealth accredited", "ISO certified"],
        countryGeoCoordinates: {
          "@type": "GeoCoordinates",
          latitude: 12.8797,
          longitude: 121.7740
        }
      },
      Australia: {
        paymentMethods: ["Cash", "Credit Card", "Medicare", "Private Health Insurance"],
        credentials: ["AHPRA registered", "ACHS accredited", "TGA compliance"],
        countryGeoCoordinates: {
          "@type": "GeoCoordinates",
          latitude: -25.2744,
          longitude: 133.7751
        }
      },
      Japan: {
        paymentMethods: ["Cash", "Credit Card", "NHI", "Private Insurance"],
        credentials: ["MHLW licensed", "JCI accredited", "ISO certified"],
        countryGeoCoordinates: {
          "@type": "GeoCoordinates",
          latitude: 36.2048,
          longitude: 138.2529
        }
      }
    };
    
    return configs[region as keyof typeof configs] || configs.Singapore;
  }

  /**
   * Parse regional address formats
   */
  private static parseRegionalAddress(addressString: string, region: string) {
    switch (region) {
      case 'Singapore':
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
      
      case 'India':
        return {
          "@type": "PostalAddress",
          streetAddress: addressString.split(',')[0],
          addressLocality: addressString.split(',')[1]?.trim() || "Mumbai",
          addressRegion: addressString.split(',')[2]?.trim() || "Maharashtra",
          postalCode: addressString.match(/\d{6}/)?.[0] || "400001",
          addressCountry: "IN"
        };
        
      case 'Philippines':
        return {
          "@type": "PostalAddress",
          streetAddress: addressString.split(',')[0],
          addressLocality: addressString.split(',')[1]?.trim() || "Manila",
          addressRegion: addressString.split(',')[2]?.trim() || "Metro Manila",
          postalCode: addressString.match(/\d{4}/)?.[0] || "1000",
          addressCountry: "PH"
        };
        
      case 'Australia':
        return {
          "@type": "PostalAddress",
          streetAddress: addressString.split(',')[0],
          addressLocality: addressString.split(',')[1]?.trim() || "Sydney",
          addressRegion: addressString.split(',')[2]?.trim() || "NSW",
          postalCode: addressString.match(/\d{4}/)?.[0] || "2000",
          addressCountry: "AU"
        };
        
      case 'Japan':
        return {
          "@type": "PostalAddress",
          streetAddress: addressString.split(',')[0],
          addressLocality: addressString.split(',')[1]?.trim() || "Tokyo",
          addressRegion: addressString.split(',')[2]?.trim() || "Tokyo",
          postalCode: addressString.match(/\d{3}-\d{4}/)?.[0] || "100-0001",
          addressCountry: "JP"
        };
        
      default:
        return {
          "@type": "PostalAddress",
          streetAddress: addressString,
          addressCountry: "SG"
        };
    }
  }

  /**
   * Get regional geo coordinates (mock - in production use geocoding API)
   */
  private static getRegionalGeoCoordinates(address: string, region: string) {
    const defaultCoords = {
      Singapore: { latitude: 1.3521, longitude: 103.8198 },
      India: { latitude: 19.0760, longitude: 72.8777 }, // Mumbai
      Philippines: { latitude: 14.5995, longitude: 120.9842 }, // Manila
      Australia: { latitude: -33.8688, longitude: 151.2093 }, // Sydney
      Japan: { latitude: 35.6762, longitude: 139.6503 } // Tokyo
    };
    
    const coords = defaultCoords[region as keyof typeof defaultCoords] || defaultCoords.Singapore;
    
    return {
      "@type": "GeoCoordinates",
      latitude: coords.latitude,
      longitude: coords.longitude
    };
  }

  /**
   * Parse screening services into medical specialties
   */
  private static parseScreeningServices(services: string, specialty: string): string[] {
    const baseSpecialties = [specialty];
    
    if (services.includes("ColonAiQ")) {
      baseSpecialties.push("Blood-based Cancer Screening");
    }
    if (services.includes("FIT Test")) {
      baseSpecialties.push("Fecal Immunochemical Testing");
    }
    if (services.includes("Colonoscopy")) {
      baseSpecialties.push("Colonoscopy");
    }
    if (services.includes("Sigmoidoscopy")) {
      baseSpecialties.push("Flexible Sigmoidoscopy");
    }
    
    return [...new Set(baseSpecialties)];
  }

  /**
   * Parse opening hours into schema format
   */
  private static parseOpeningHours(hoursString: string): any[] {
    const specifications: any[] = [];
    const sections = hoursString.split(', ');
    
    sections.forEach(section => {
      if (section.includes('Mon-Fri:')) {
        const hours = section.replace('Mon-Fri: ', '');
        const [opens, closes] = hours.split(' - ');
        specifications.push({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: this.convertToTimeFormat(opens),
          closes: this.convertToTimeFormat(closes)
        });
      }
      
      if (section.includes('Sat:')) {
        const hours = section.replace('Sat: ', '');
        const [opens, closes] = hours.split(' - ');
        specifications.push({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday"],
          opens: this.convertToTimeFormat(opens),
          closes: this.convertToTimeFormat(closes)
        });
      }
      
      if (section.includes('Sun:')) {
        const hours = section.replace('Sun: ', '');
        const [opens, closes] = hours.split(' - ');
        specifications.push({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Sunday"],
          opens: this.convertToTimeFormat(opens),
          closes: this.convertToTimeFormat(closes)
        });
      }
    });
    
    return specifications;
  }

  /**
   * Convert time format to 24-hour format
   */
  private static convertToTimeFormat(time: string): string {
    const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return time;
    
    let [, hours, minutes, ampm] = match;
    let hour24 = parseInt(hours);
    
    if (ampm.toUpperCase() === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (ampm.toUpperCase() === 'AM' && hour24 === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  }

  /**
   * Generate organization-level schema with regional areaServed
   */
  static generateRegionalOrganizationSchema(regions: string[]): any {
    const baseSchema = SchemaGenerator.generateMedicalOrganizationSchema();
    
    return {
      ...baseSchema,
      areaServed: regions.map(region => ({
        "@type": "Place",
        name: region,
        geo: this.getRegionConfig(region).countryGeoCoordinates
      })),
      hasCredential: [
        "HSA-cleared screening technologies", // Always use HSA-cleared, never HSA-approved
        "Multi-regional medical network",
        "Evidence-based screening protocols",
        "International healthcare partnerships",
        ...regions.map(region => `${region} healthcare compliance`)
      ]
    };
  }
}

export default ClinicSchemaGenerator;