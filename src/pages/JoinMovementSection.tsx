import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

const JoinMovementSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-14 relative overflow-hidden">
      <Container className='bg-[#004f8c] py-5 rounded-xl shadow-lg'>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 bg-[#25D0B1]/10 rounded-full mb-6">
            <span className="h-2 w-2 rounded-full bg-[#25D0B1] mr-2"></span>
            <span className="text-[#25D0B1] text-sm font-medium">PARTICIPATE</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            JOIN THE MOVEMENT TO <span className="text-[#25D0B1]">OUTSMART COLORECTAL CANCER</span>
          </h2>

          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12">
            Be part of the national effort to outsmart colorectal cancer.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-5xl mx-auto mb-12 lg:grid-cols-3">
            {/* Button 1: For GPs and Clinics */}
            <Link
              to="/register/clinic" 
              className="flex p-4 items-center justify-center text-sm font-medium text-center bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-all duration-300 min-h-[100px] md:min-h-[120px]"
            >
              For GPs and Clinics: Partner with us to offer screening services.
            </Link>

            {/* Button 2: For Sponsors/CSR Partners */}
            <Link
              to="/register/corporate" 
              className="flex p-4 items-center justify-center text-sm font-medium text-center bg-[#0d9488] text-white rounded-lg hover:bg-[#0f766e] transition-all duration-300 min-h-[100px] md:min-h-[120px]"
            >
              For Sponsors/CSR Partners: Support public health.
            </Link>

            {/* Button 3: For the Public */}
            <Link
              to="/signup/champion" 
              className="flex p-4 items-center justify-center text-sm font-medium text-center bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] transition-all duration-300 min-h-[100px] md:min-h-[120px]"
            >
              For the Public: Get screened and protect your health.
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default JoinMovementSection;