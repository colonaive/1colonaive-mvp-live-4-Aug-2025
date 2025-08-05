import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SchemaMarkupProps {
  schemas: Array<Record<string, any>>;
}

/**
 * SchemaMarkup component injects JSON-LD structured data into page head
 * Supports multiple schema types: MedicalOrganization, FAQPage, LocalBusiness, etc.
 */
const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ schemas }) => {
  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script 
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0) // Minified JSON for production
          }}
        />
      ))}
    </Helmet>
  );
};

export default SchemaMarkup;