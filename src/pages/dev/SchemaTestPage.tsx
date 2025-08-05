import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { SchemaGenerator } from '@/utils/schemaGenerator';
import SchemaValidator from '@/utils/schemaValidator';
import ClinicSchemaService from '@/services/clinicSchemaService';

const SchemaTestPage: React.FC = () => {
  const [selectedSchema, setSelectedSchema] = useState<string>('medicalOrganization');
  const [validationReport, setValidationReport] = useState<string>('');
  const [currentSchema, setCurrentSchema] = useState<any>(null);

  const schemaTypes = {
    medicalOrganization: 'Medical Organization',
    faqPage: 'FAQ Page',
    clinicDirectory: 'Clinic Directory',
    medicalWebPage: 'Medical Web Page'
  };

  const generateSchema = (type: string) => {
    let schema;
    
    switch (type) {
      case 'medicalOrganization':
        schema = SchemaGenerator.generateMedicalOrganizationSchema();
        break;
      case 'faqPage':
        schema = SchemaGenerator.generateFAQSchema([
          {
            question: "What is colorectal cancer screening?",
            answer: "Colorectal cancer screening involves testing to look for cancer or pre-cancer in people who have no symptoms. It can help find cancer early when treatment works best."
          },
          {
            question: "When should I start screening?",
            answer: "Most people should start regular colorectal cancer screening at age 45, or earlier if they have risk factors like family history or inflammatory bowel disease."
          }
        ]);
        break;
      case 'clinicDirectory':
        schema = ClinicSchemaService.generateMedicalDirectorySchema();
        break;
      case 'medicalWebPage':
        schema = SchemaGenerator.generateMedicalWebPageSchema({
          title: "Test Medical Page",
          description: "Test description for medical web page schema",
          url: "https://colonaive.com/test",
          keyword: "colorectal cancer screening",
          region: "Singapore",
          intent: "diagnosis"
        });
        break;
      default:
        schema = {};
    }
    
    setCurrentSchema(schema);
    
    // Validate the schema
    const validation = SchemaValidator.validateSchema(schema);
    const report = SchemaValidator.generateValidationReport([schema]);
    setValidationReport(report);
  };

  const testGoogleRichResults = () => {
    if (!currentSchema) return;
    
    const richResults = SchemaValidator.testGoogleRichResults(currentSchema);
    const report = `Google Rich Results Test
============================
Eligible: ${richResults.eligible ? '✅ Yes' : '❌ No'}
Rich Result Types: ${richResults.richResultTypes.join(', ') || 'None'}
Issues: ${richResults.issues.join(', ') || 'None'}
`;
    
    setValidationReport(prev => prev + '\n\n' + report);
  };

  return (
    <div className="pt-20 pb-16">
      <Container>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Schema Markup Testing</h1>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Schema Generator */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Generate Schema</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Schema Type</label>
                    <select
                      value={selectedSchema}
                      onChange={(e) => setSelectedSchema(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    >
                      {Object.entries(schemaTypes).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => generateSchema(selectedSchema)}
                      className="flex-1"
                    >
                      Generate Schema
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={testGoogleRichResults}
                      disabled={!currentSchema}
                    >
                      Test Rich Results
                    </Button>
                  </div>
                </div>

                {/* Schema Display */}
                {currentSchema && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Generated Schema:</h3>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto max-h-60">
                      {JSON.stringify(currentSchema, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Validation Results */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Validation Results</h2>
                
                {validationReport ? (
                  <div>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                      {validationReport}
                    </pre>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded">
                      <h4 className="font-medium text-blue-900 mb-2">Testing Instructions:</h4>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Copy the generated schema JSON</li>
                        <li>2. Test at: <a href="https://search.google.com/test/rich-results" className="underline" target="_blank" rel="noopener noreferrer">Google Rich Results Test</a></li>
                        <li>3. Validate at: <a href="https://validator.schema.org/" className="underline" target="_blank" rel="noopener noreferrer">Schema.org Validator</a></li>
                        <li>4. Check implementation in browser DevTools</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Generate a schema to see validation results</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Schema Testing Tools</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <a 
                  href="https://search.google.com/test/rich-results" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 border border-gray-200 rounded hover:bg-gray-50 text-center"
                >
                  <div className="font-medium">Google Rich Results Test</div>
                  <div className="text-sm text-gray-600">Test how Google sees your markup</div>
                </a>
                
                <a 
                  href="https://validator.schema.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 border border-gray-200 rounded hover:bg-gray-50 text-center"
                >
                  <div className="font-medium">Schema.org Validator</div>
                  <div className="text-sm text-gray-600">Validate schema structure</div>
                </a>
                
                <a 
                  href="https://developers.google.com/search/docs/appearance/structured-data" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 border border-gray-200 rounded hover:bg-gray-50 text-center"
                >
                  <div className="font-medium">Google Structured Data</div>
                  <div className="text-sm text-gray-600">Official documentation</div>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Examples */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Current Implementation</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">SEO Landing Pages</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• MedicalOrganization schema</li>
                    <li>• MedicalWebPage schema</li>
                    <li>• FAQPage schema</li>
                    <li>• Breadcrumb navigation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Find GP Page</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Medical directory schema</li>
                    <li>• Healthcare network schema</li>
                    <li>• LocalBusiness schemas</li>
                    <li>• Clinic FAQ schema</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default SchemaTestPage;