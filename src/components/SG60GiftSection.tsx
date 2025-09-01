// src/components/SG60GiftSection.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from './ui/Container';
import { Button } from './ui/Button';
import { Gift } from 'lucide-react';

const SG60GiftSection = () => {
  const navigate = useNavigate();

  return (
    // Use a clean white background to match other well-styled sections
    <section className="py-16 md:py-20 px-6 bg-white dark:bg-slate-900">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon styling */}
          <Gift className="h-16 w-16 text-yellow-500 mx-auto mb-5" />

          {/* Heading Styling - Using a darker teal/blue for better contrast on white */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-teal-700 dark:text-teal-300 mb-5 tracking-tight">
            Our SG60 Gift: A Healthier Nation, Together.
          </h2>

          {/* Pledge Text Styling - Clearer contrast */}
          <p className="text-xl md:text-2xl text-slate-800 dark:text-slate-200 max-w-3xl mx-auto mb-6 leading-relaxed">
            By <strong className="font-bold text-teal-600 dark:text-teal-400">2030</strong>, we pledge to reach <strong className="font-bold text-teal-600 dark:text-teal-400">80% screening</strong> uptake — and reduce colorectal cancer deaths by <strong className="font-bold text-teal-600 dark:text-teal-400">80%</strong> by <strong className="font-bold text-teal-600 dark:text-teal-400">2035</strong>.
          </p>

          {/* Italic Text Styling - Clearer contrast */}
          <p className="text-base md:text-lg italic text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10">
            This is our national contribution — powered by doctors, supported by sponsors, embraced by citizens. 🇸🇬
          </p>

          {/* Button Styling - Using standard primary variant for consistency */}
          <Button
             size="lg"
             variant="primary" // Use the standard blue primary button
             className="shadow-lg px-8 py-3 text-lg font-semibold rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
             onClick={() => navigate('/join-the-movement')}
          >
            Be Part of This Gift
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default SG60GiftSection;