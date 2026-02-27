
import { Helmet } from 'react-helmet-async';
import { Container } from '../../../components/ui/Container';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, AlertCircle, FileSearch } from 'lucide-react';

const IndiaEducationPage = () => {
    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>Learn About Colorectal Cancer | COLONAiVE India</title>
                <meta name="description" content="Educational resources regarding colorectal cancer, symptoms, screening options, and the clinical pathway emphasizing colonoscopy. Not medical advice." />
                <link rel="canonical" href="https://colonaive.ai/in/education" />
            </Helmet>

            {/* Header */}
            <div className="bg-[#0B1E3B] text-white py-16">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-4">Understanding Colorectal Cancer</h1>
                        <p className="text-xl text-teal-100">Awareness, screening, and action can save lives.</p>
                    </div>
                </Container>
            </div>

            {/* Important Disclaimer */}
            <div className="bg-yellow-50 border-b border-yellow-200 py-4">
                <Container>
                    <div className="flex items-center gap-3 text-yellow-800 text-sm max-w-4xl mx-auto">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p><strong>Not Medical Advice:</strong> The information provided here is for educational purposes only. Always consult a qualified healthcare professional or doctor for personalized medical advice or diagnosis.</p>
                    </div>
                </Container>
            </div>

            <Container className="py-16">
                <div className="max-w-4xl mx-auto space-y-16">

                    {/* Why CRC Matters */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <Activity className="text-blue-600" />
                            Why Colorectal Cancer Matters
                        </h2>
                        <div className="prose prose-lg text-gray-700 max-w-none">
                            <p>
                                Colorectal cancer (CRC) is commonly known as colon cancer or bowel cancer. It typically develops slowly from abnormal growths called polyps in the inner lining of the colon or rectum.
                            </p>
                            <p>
                                Because symptoms often do not appear until the cancer is advanced, early detection is critical. Finding and removing polyps before they turn into cancer is the most effective way to prevent the disease.
                            </p>
                        </div>
                    </section>

                    {/* Symptoms vs Screening */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <AlertCircle className="text-blue-600" />
                            Symptoms vs. Screening
                        </h2>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">If you have symptoms</h3>
                                    <p className="text-gray-700 mb-4">Do not wait for screening. See a doctor immediately if you experience:</p>
                                    <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                        <li>Blood in your stool</li>
                                        <li>Unexplained changes in bowel habits</li>
                                        <li>Persistent abdominal pain</li>
                                        <li>Unexplained weight loss</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">If you have NO symptoms</h3>
                                    <p className="text-gray-700">This is what <strong>screening</strong> is for. Screening looks for cancer or precancerous conditions in people who feel perfectly healthy. It is generally recommended for individuals over a certain age or with specific risk factors.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Screening Journey */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <FileSearch className="text-blue-600" />
                            The Screening Journey
                        </h2>

                        <div className="relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-blue-200 hidden md:block"></div>

                            <div className="space-y-8">
                                <div className="relative flex gap-6 mt-4">
                                    <div className="hidden md:flex flex-shrink-0 w-14 h-14 rounded-full bg-blue-100 items-center justify-center text-blue-600 font-bold text-xl border-4 border-white z-10 shadow-sm">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Understand Your Risk</h3>
                                        <p className="text-gray-700">Age, family history of cancer, and lifestyle factors can influence your risk. Discuss these with your doctor to determine the right time to start screening.</p>
                                    </div>
                                </div>

                                <div className="relative flex gap-6 mt-4">
                                    <div className="hidden md:flex flex-shrink-0 w-14 h-14 rounded-full bg-blue-100 items-center justify-center text-blue-600 font-bold text-xl border-4 border-white z-10 shadow-sm">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Choose a Screening Option</h3>
                                        <p className="text-gray-700 mb-3">Various non-invasive tests exist (like FIT stool tests or blood-based options) to help identify individuals who might be at higher risk and need further investigation.</p>
                                    </div>
                                </div>

                                <div className="relative flex gap-6 mt-4">
                                    <div className="hidden md:flex flex-shrink-0 w-14 h-14 rounded-full bg-blue-600 items-center justify-center text-white font-bold text-xl border-4 border-white z-10 shadow-md">
                                        3
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Colonoscopy: The Gold Standard</h3>
                                        <p className="text-gray-700 font-medium">If any initial screening test is flagged or "positive", a follow-up colonoscopy is essential.</p>
                                        <p className="text-gray-700 mt-2">A colonoscopy allows a specialist to see inside the colon and, crucially, remove any precancerous polyps during the procedure itself. It is the definitive diagnostic and preventative tool.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="bg-[#0B1E3B] rounded-2xl p-8 md:p-12 text-center text-white">
                        <h2 className="text-3xl font-bold mb-4">Ready to take the next step?</h2>
                        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">Connect with our network of clinical champions and anchor centres to discuss your screening and colonoscopy options safely.</p>
                        <Link to="/in/partners" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-[#0B1E3B] font-bold py-3 px-8 rounded-full transition-all">
                            Find a Clinic / Doctor <ArrowRight className="w-5 h-5" />
                        </Link>
                    </section>

                </div>
            </Container>
        </div>
    );
};

export default IndiaEducationPage;
