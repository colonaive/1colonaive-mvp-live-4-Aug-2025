// /src/components/CtaSection.tsx
import React from "react";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";

export const CtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Movement to Outsmart Colorectal Cancer
          </h2>
          <p className="text-xl mb-8">
            Whether you're a patient, healthcare professional, organization, or concerned citizen,
            there's a place for you in our movement. Together, we can eliminate colorectal cancer
            as a major health threat in Singapore by 2035.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/choose-screening">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Learn About Screening
              </Button>
            </Link>

            {/* Use a supported variant and style it to look neutral */}
            <Link to="/find-a-specialist">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 border-gray-300"
              >
                Find a Clinic
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
