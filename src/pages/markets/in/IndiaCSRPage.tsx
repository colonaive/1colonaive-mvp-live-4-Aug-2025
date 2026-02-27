import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../../../components/ui/Container';
import toast from 'react-hot-toast';
import { submitLeadHandling } from '../../../lib/api/submitLeadHandling';
import { HeartHandshake } from 'lucide-react';

const IndiaCSRPage = () => {
    const [formData, setFormData] = useState({
        company: '',
        name: '',
        email: '',
        whatsapp: '',
        csrFocus: '',
        employeeCount: '',
        preferredState: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        submitLeadHandling(e, formData, "csr", toast, () => {
            setFormData({
                company: '', name: '', email: '', whatsapp: '', csrFocus: '', employeeCount: '', preferredState: '', message: ''
            });
        });
    };

    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>CSR & Corporate Sponsorship | COLONAiVE India</title>
                <meta name="description" content="Support the COLONAiVE India movement through Corporate Social Responsibility (CSR). Enable education and access." />
                <link rel="canonical" href="https://colonaive.ai/in/csr" />
            </Helmet>

            {/* Header */}
            <div className="bg-[#0B1E3B] text-white py-16">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <HeartHandshake className="w-16 h-16 mx-auto mb-6 text-teal-400" />
                        <h1 className="text-4xl font-bold mb-4">CSR Sponsorship</h1>
                        <p className="text-xl text-teal-100">Empowering communities through education & access</p>
                    </div>
                </Container>
            </div>

            <Container className="py-16">
                <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">

                    {/* Info Side */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Make a Meaningful Impact</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            We rely on Corporate Social Responsibility (CSR) partners to scale our movement across India. Funding directly supports:
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="w-2 h-2 mt-2 mr-3 bg-teal-500 rounded-full flex-shrink-0"></span>
                                <p className="text-gray-700"><strong>Public Education Campaigns:</strong> Translating materials into vernacular languages and raising broad awareness about CRC symptoms and early detection.</p>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 mt-2 mr-3 bg-teal-500 rounded-full flex-shrink-0"></span>
                                <p className="text-gray-700"><strong>Access to Screening:</strong> Subsidising first-level triage tests for vulnerable and low-income demographics in targeted states.</p>
                            </li>
                            <li className="flex items-start">
                                <span className="w-2 h-2 mt-2 mr-3 bg-teal-500 rounded-full flex-shrink-0"></span>
                                <p className="text-gray-700"><strong>Care Navigation:</strong> Helping individuals with positive screening results overcome barriers to access the gold standard—a timely colonoscopy.</p>
                            </li>
                        </ul>
                        <p className="text-gray-600 italic">Note: Our movement is strictly non-commercial. We do not sell screening products directly to the public.</p>
                    </div>

                    {/* Form Side */}
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">CSR Interest Form</h3>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                                <input required type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                    <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
                                    <select name="employeeCount" value={formData.employeeCount} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                                        <option value="">Select...</option>
                                        <option value="1-50">1-50</option>
                                        <option value="51-200">51-200</option>
                                        <option value="201-1000">201-1000</option>
                                        <option value="1000+">1000+</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CSR Focus Area</label>
                                <input type="text" name="csrFocus" placeholder="e.g. Healthcare, Rural Education" value={formData.csrFocus} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred State(s) for Impact</label>
                                <input type="text" name="preferredState" placeholder="e.g. Maharashtra, All India" value={formData.preferredState} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"></textarea>
                            </div>

                            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                                Submit Inquiry
                            </button>
                        </form>
                    </div>

                </div>
            </Container>
        </div>
    );
};

export default IndiaCSRPage;
