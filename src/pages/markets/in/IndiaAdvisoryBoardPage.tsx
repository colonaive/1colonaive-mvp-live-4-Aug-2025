import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../../../components/ui/Container';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

const IndiaAdvisoryBoardPage = () => {
    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>India Chapter Advisory Board | COLONAiVE India</title>
                <meta name="description" content="Meet the clinicians guiding the COLONAiVE India movement. Nominate or express interest in joining the board." />
                <link rel="canonical" href="https://colonaive.ai/in/advisory-board" />
            </Helmet>

            {/* Header */}
            <div className="bg-[#0B1E3B] text-white py-16">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-4">India Chapter</h1>
                        <p className="text-xl text-teal-100">Advisory Board</p>
                    </div>
                </Container>
            </div>

            <Container className="py-16">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 text-blue-600 rounded-full mb-8">
                        <Star className="w-10 h-10" />
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Clinician Governance (To Be Announced)</h2>

                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        Our India movement is strictly clinician-led. We are currently forming our official India Advisory Board, comprising leading colorectal surgeons, gastroenterologists, and public health experts dedicated to fighting colorectal cancer.
                    </p>

                    <p className="text-lg text-gray-700 mb-12 leading-relaxed">
                        This board will govern the movement's focus, ensuring all educational materials, triaging pathways, and screening recommendations firmly position colonoscopy as the gold standard for diagnosis and treatment.
                    </p>

                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Express Interest</h3>
                        <p className="text-gray-600 mb-6">Are you a clinical leader passionate about early detection and appropriate screening pathways in India? We welcome expressions of interest.</p>
                        <Link to="/in/partners" state={{ role: "Advisory Board interest" }} className="inline-flex items-center gap-2 bg-[#006BA6] hover:bg-[#005C8D] text-white font-bold py-3 px-8 rounded-full transition-all">
                            Nominate / Express Interest <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default IndiaAdvisoryBoardPage;
