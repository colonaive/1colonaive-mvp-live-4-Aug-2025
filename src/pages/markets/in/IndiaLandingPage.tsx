import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Container } from '../../../components/ui/Container';
import { BookOpen, Users, HeartHandshake, ArrowRight } from 'lucide-react';

const IndiaLandingPage = () => {
    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>COLONAiVE India | Clinician-led Colorectal Cancer Screening Movement</title>
                <meta name="description" content="Join the COLONAiVE India movement for early detection of colorectal cancer. Clinician-led screening pathways, emphasizing colonoscopy as the gold standard." />
                <link rel="canonical" href="https://colonaive.ai/in" />
            </Helmet>

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#0B1E3B] to-[#004F8C] text-white py-20 lg:py-32">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-200">
                            COLONAiVE India
                        </h1>
                        <p className="text-xl lg:text-2xl text-teal-100 mb-8 font-light">
                            A clinician-led colorectal cancer screening movement
                        </p>
                        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">
                            Our mission is to improve early detection of colorectal cancer across India. We believe in providing clear, medical-led pathways for screening, always acknowledging that colonoscopy is the gold standard for diagnosis and early treatment.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link to="/in/join" className="bg-teal-500 hover:bg-teal-400 text-[#0B1E3B] font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-teal-500/50 flex items-center gap-2">
                                Register Interest <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Pathways Cards */}
            <section className="py-20 bg-slate-50">
                <Container>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                        <Link to="/in/education" className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-teal-500/30 flex flex-col">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Learn</h3>
                            <p className="text-gray-600 mb-6 flex-grow">Understand colorectal cancer, symptoms, and the critical importance of early screening and colonoscopy.</p>
                            <span className="text-blue-600 font-semibold flex items-center text-sm group-hover:translate-x-1 transition-transform">
                                Read more <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                        </Link>

                        <Link to="/in/partners" className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-teal-500/30 flex flex-col">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Partner with Us</h3>
                            <p className="text-gray-600 mb-6 flex-grow">For hospitals, labs, and clinicians wanting to join our network as Anchor Centres or Clinical Champions.</p>
                            <span className="text-blue-600 font-semibold flex items-center text-sm group-hover:translate-x-1 transition-transform">
                                Join network <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                        </Link>

                        <Link to="/in/csr" className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-slate-100 hover:border-teal-500/30 flex flex-col">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <HeartHandshake className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">CSR Sponsors</h3>
                            <p className="text-gray-600 mb-6 flex-grow">Enable education, broad access, and outreach for vulnerable communities through corporate giving.</p>
                            <span className="text-blue-600 font-semibold flex items-center text-sm group-hover:translate-x-1 transition-transform">
                                Sponsor us <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                        </Link>

                        <Link to="/in/join" className="group bg-teal-50 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-teal-100 hover:border-teal-500 flex flex-col relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-100 rounded-full opacity-50"></div>
                            <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:text-white transition-colors relative z-10">
                                <HeartHandshake className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Public Pledge</h3>
                            <p className="text-gray-700 mb-6 flex-grow relative z-10">Join the movement as a member of the public. Pledge to prioritize screening and stay informed with our updates.</p>
                            <span className="text-teal-700 font-bold flex items-center text-sm group-hover:translate-x-1 transition-transform relative z-10">
                                Take the pledge <ArrowRight className="w-4 h-4 ml-1" />
                            </span>
                        </Link>

                    </div>
                </Container>
            </section>

            {/* Neutral Statement Section */}
            <section className="py-20 bg-white">
                <Container>
                    <div className="max-w-3xl mx-auto text-center border-l-4 border-r-4 border-blue-600 px-8 py-10 bg-slate-50 rounded-lg">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">The Gold Standard</h2>
                        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                            <strong>Colonoscopy is the gold standard</strong> for the diagnosis and early treatment of colorectal cancer, including the crucial removal of precancerous polyps.
                        </p>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            While various screening options exist to help identify those at higher risk, these are triage tools. Any positive screening result <strong>must be followed by a timely colonoscopy</strong>.
                        </p>
                    </div>
                </Container>
            </section>

        </div>
    );
};

export default IndiaLandingPage;
