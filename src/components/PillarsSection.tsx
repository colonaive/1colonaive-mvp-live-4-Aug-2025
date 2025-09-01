import React from "react";
import PublicAwarenessImg from "../assets/images/pillars/public-awareness.webp";
import ClinicianEngagementImg from "../assets/images/pillars/clinician-engagement.webp";
import PolicyAlignmentImg from "../assets/images/pillars/policy-alignment.webp";
import CorporateCSRImg from "../assets/images/pillars/corporate-csr.webp";
import PatientEducationImg from "../assets/images/pillars/patient-education.webp";
import { Link } from "react-router-dom";

const pillars = [
  { title: "Public Awareness", label: "RID-CRC PUB™", image: PublicAwarenessImg, path: "/pillars/rid-crc-pub" },
  { title: "Clinician Engagement", label: "RID-CRC SGP™", image: ClinicianEngagementImg, path: "/pillars/rid-crc-sgp" },
  { title: "Policy Alignment", label: "RID-CRC GOV™", image: PolicyAlignmentImg, path: "/pillars/rid-crc-gov" },
  { title: "Corporate CSR", label: "RID-CRC CSR™", image: CorporateCSRImg, path: "/pillars/rid-crc-csr" },
  { title: "Patient Education", label: "RID-CRC EDU™", image: PatientEducationImg, path: "/pillars/rid-crc-edu" },
];

const PillarsSection = () => {
  return (
    <section className="bg-slate-50 dark:bg-slate-800/50 py-16 md:py-20 px-6" id="pillars">
      <h2 className="text-center text-3xl md:text-4xl font-extrabold text-blue-800 dark:text-blue-300 mb-4">
        RID-CRC™ — Our National Strategy to Outsmart Colorectal Cancer
      </h2>
      <p className="text-center text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
        Project COLONAiVE™ is powered by five strategic pillars under the unified RID-CRC™ mission: Ready, Identify, and Detect (RID) so that we can eradicate Colorectal Cancer (CRC) at every level of society.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 max-w-7xl mx-auto">
        {pillars.map((pillar, index) => (
          <Link to={pillar.path} key={index} className="group block">
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1 border border-gray-200/80 dark:border-slate-700">
              <div className="aspect-video overflow-hidden">
                 <img src={pillar.image} alt={pillar.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              </div>
              <div className="p-5 text-center">
                <p className="text-sm font-bold text-teal-600 dark:text-teal-400 uppercase">{pillar.label}</p>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-1">{pillar.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PillarsSection;
