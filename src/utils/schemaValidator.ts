// Schema Validation Utility for COLONAiVE JSON-LD Markup
// Validates Schema.org structured data for search engine optimization

export interface SchemaValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  schemaType: string;
  recommendations: string[];
}

export class SchemaValidator {
  
  /**
   * Validate Medical Organization Schema
   */
  static validateMedicalOrganizationSchema(schema: any): SchemaValidationResult {
    const result: SchemaValidationResult = {
      isValid: true,
      warnings: [],
      errors: [],
      schemaType: 'MedicalOrganization',
      recommendations: []
    };

    // Required fields validation
    const requiredFields = ['@context', '@type', 'name', 'description', 'url'];
    for (const field of requiredFields) {
      if (!schema[field]) {
        result.errors.push(`Missing required field: ${field}`);
        result.isValid = false;
      }
    }

    // Recommended fields validation
    const recommendedFields = ['address', 'telephone', 'email', 'areaServed', 'medicalSpecialty'];
    for (const field of recommendedFields) {
      if (!schema[field]) {
        result.warnings.push(`Missing recommended field: ${field}`);
      }
    }

    // Validate @type
    if (schema['@type'] !== 'MedicalOrganization') {
      result.errors.push(`Expected @type to be 'MedicalOrganization', got '${schema['@type']}'`);
      result.isValid = false;
    }

    // Validate URL format
    if (schema.url && !this.isValidUrl(schema.url)) {
      result.errors.push(`Invalid URL format: ${schema.url}`);
      result.isValid = false;
    }

    // Recommendations
    if (!schema.logo) {
      result.recommendations.push('Consider adding a logo URL for better brand recognition');
    }
    
    if (!schema.aggregateRating) {
      result.recommendations.push('Consider adding aggregateRating to display star ratings in search results');
    }

    return result;
  }

  /**
   * Validate FAQ Page Schema
   */
  static validateFAQPageSchema(schema: any): SchemaValidationResult {
    const result: SchemaValidationResult = {
      isValid: true,
      warnings: [],
      errors: [],
      schemaType: 'FAQPage',
      recommendations: []
    };

    // Required fields
    if (!schema['@context'] || !schema['@type'] || !schema.mainEntity) {
      result.errors.push('Missing required fields: @context, @type, or mainEntity');
      result.isValid = false;
    }

    // Validate @type
    if (schema['@type'] !== 'FAQPage') {
      result.errors.push(`Expected @type to be 'FAQPage', got '${schema['@type']}'`);
      result.isValid = false;
    }

    // Validate mainEntity structure
    if (schema.mainEntity && Array.isArray(schema.mainEntity)) {
      if (schema.mainEntity.length < 2) {
        result.warnings.push('FAQ pages work best with at least 2 questions');
      }

      schema.mainEntity.forEach((item: any, index: number) => {
        if (!item['@type'] || item['@type'] !== 'Question') {
          result.errors.push(`Question ${index + 1}: Missing or invalid @type`);
          result.isValid = false;
        }
        
        if (!item.name) {
          result.errors.push(`Question ${index + 1}: Missing question text (name field)`);
          result.isValid = false;
        }
        
        if (!item.acceptedAnswer || !item.acceptedAnswer.text) {
          result.errors.push(`Question ${index + 1}: Missing answer text`);
          result.isValid = false;
        }

        // Check question length
        if (item.name && item.name.length < 10) {
          result.warnings.push(`Question ${index + 1}: Question text is very short`);
        }

        // Check answer length
        if (item.acceptedAnswer?.text && item.acceptedAnswer.text.length < 50) {
          result.warnings.push(`Question ${index + 1}: Answer text is quite short - consider more detailed responses`);
        }
      });
    }

    return result;
  }

  /**
   * Validate Local Business Schema
   */
  static validateLocalBusinessSchema(schema: any): SchemaValidationResult {
    const result: SchemaValidationResult = {
      isValid: true,
      warnings: [],
      errors: [],
      schemaType: 'LocalBusiness/MedicalBusiness',
      recommendations: []
    };

    // Required fields
    const requiredFields = ['@context', '@type', 'name', 'address'];
    for (const field of requiredFields) {
      if (!schema[field]) {
        result.errors.push(`Missing required field: ${field}`);
        result.isValid = false;
      }
    }

    // Validate address structure
    if (schema.address && typeof schema.address === 'object') {
      const addressFields = ['streetAddress', 'addressLocality', 'addressCountry'];
      for (const field of addressFields) {
        if (!schema.address[field]) {
          result.warnings.push(`Address missing recommended field: ${field}`);
        }
      }
    }

    // Contact information
    if (!schema.telephone && !schema.email) {
      result.warnings.push('Missing contact information (telephone or email)');
    }

    // Business hours
    if (!schema.openingHoursSpecification) {
      result.warnings.push('Missing opening hours - helps with local SEO');
    }

    // Reviews and ratings
    if (!schema.aggregateRating) {
      result.recommendations.push('Consider adding aggregate rating for better search visibility');
    }

    return result;
  }

  /**
   * Validate Medical Web Page Schema
   */
  static validateMedicalWebPageSchema(schema: any): SchemaValidationResult {
    const result: SchemaValidationResult = {
      isValid: true,
      warnings: [],
      errors: [],
      schemaType: 'MedicalWebPage',
      recommendations: []
    };

    // Required fields
    if (!schema.name || !schema.description || !schema.url) {
      result.errors.push('Missing required fields: name, description, or url');
      result.isValid = false;
    }

    // Medical content validation
    if (!schema.about || !schema.about.name) {
      result.warnings.push('Missing medical condition information (about field)');
    }

    // Audience specification
    if (!schema.audience) {
      result.warnings.push('Missing target audience specification');
    }

    // Publisher information
    if (!schema.publisher) {
      result.errors.push('Missing publisher information - required for medical content');
      result.isValid = false;
    }

    // Medical specialty
    if (schema.mainContentOfPage && !schema.mainContentOfPage.medicalSpecialty) {
      result.recommendations.push('Consider specifying medical specialty for better categorization');
    }

    return result;
  }

  /**
   * Comprehensive schema validation
   */
  static validateSchema(schema: any): SchemaValidationResult {
    if (!schema || !schema['@type']) {
      return {
        isValid: false,
        warnings: [],
        errors: ['Schema is missing or has no @type field'],
        schemaType: 'Unknown',
        recommendations: []
      };
    }

    switch (schema['@type']) {
      case 'MedicalOrganization':
        return this.validateMedicalOrganizationSchema(schema);
      case 'FAQPage':
        return this.validateFAQPageSchema(schema);
      case 'MedicalBusiness':
      case 'LocalBusiness':
        return this.validateLocalBusinessSchema(schema);
      case 'MedicalWebPage':
        return this.validateMedicalWebPageSchema(schema);
      default:
        return {
          isValid: true,
          warnings: [`Unknown schema type: ${schema['@type']} - validation skipped`],
          errors: [],
          schemaType: schema['@type'],
          recommendations: []
        };
    }
  }

  /**
   * Validate multiple schemas
   */
  static validateSchemas(schemas: any[]): { overall: boolean; results: SchemaValidationResult[] } {
    const results = schemas.map(schema => this.validateSchema(schema));
    const overall = results.every(result => result.isValid);
    
    return { overall, results };
  }

  /**
   * Generate validation report
   */
  static generateValidationReport(schemas: any[]): string {
    const { overall, results } = this.validateSchemas(schemas);
    
    let report = `Schema Validation Report\n`;
    report += `========================\n`;
    report += `Overall Status: ${overall ? '✅ PASS' : '❌ FAIL'}\n`;
    report += `Total Schemas: ${schemas.length}\n\n`;

    results.forEach((result, index) => {
      report += `Schema ${index + 1}: ${result.schemaType}\n`;
      report += `Status: ${result.isValid ? '✅ Valid' : '❌ Invalid'}\n`;
      
      if (result.errors.length > 0) {
        report += `Errors:\n`;
        result.errors.forEach(error => report += `  • ${error}\n`);
      }
      
      if (result.warnings.length > 0) {
        report += `Warnings:\n`;
        result.warnings.forEach(warning => report += `  • ${warning}\n`);
      }
      
      if (result.recommendations.length > 0) {
        report += `Recommendations:\n`;
        result.recommendations.forEach(rec => report += `  • ${rec}\n`);
      }
      
      report += `\n`;
    });

    return report;
  }

  /**
   * Helper: Validate URL format
   */
  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Test schema with Google's Rich Results Test (simulation)
   */
  static testGoogleRichResults(schema: any): { 
    eligible: boolean; 
    richResultTypes: string[]; 
    issues: string[] 
  } {
    const result = {
      eligible: false,
      richResultTypes: [] as string[],
      issues: [] as string[]
    };

    const schemaType = schema['@type'];

    switch (schemaType) {
      case 'MedicalOrganization':
        if (schema.name && schema.address) {
          result.eligible = true;
          result.richResultTypes.push('Knowledge Panel');
        }
        if (schema.aggregateRating) {
          result.richResultTypes.push('Star Ratings');
        }
        break;

      case 'FAQPage':
        if (schema.mainEntity && schema.mainEntity.length >= 2) {
          result.eligible = true;
          result.richResultTypes.push('FAQ Rich Results');
        } else {
          result.issues.push('Need at least 2 FAQ items for rich results');
        }
        break;

      case 'LocalBusiness':
      case 'MedicalBusiness':
        if (schema.name && schema.address) {
          result.eligible = true;
          result.richResultTypes.push('Local Business');
        }
        if (schema.openingHoursSpecification) {
          result.richResultTypes.push('Business Hours');
        }
        break;
    }

    return result;
  }
}

export default SchemaValidator;