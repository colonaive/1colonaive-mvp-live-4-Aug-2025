import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../../../components/ui/Container';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { submitLeadHandling } from '../../../lib/api/submitLeadHandling';

const IndiaPartnersPage = () => {
    const location = useLocation();
    const preFilledRole = location.state?.role || '';

    const [formData, setFormData] = useState({
        name: '',
        organisation: '',
        role: preFilledRole,
        city: '',
        state: '',
        email: '',
        whatsapp: '',
        message: ''
    });

    useEffect(() => {
        if (preFilledRole) {
            setFormData(prev => ({ ...prev, role: preFilledRole }));
        }
    }, [preFilledRole]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        submitLeadHandling(e, formData, "partner", toast, () => {
            setFormData({
                name: '', organisation: '', role: '', city: '', state: '', email: '', whatsapp: '', message: ''
            });
        });
    };

    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>Clinical Partners & Anchor Centres | COLONAiVE India</title>
                <meta name="description" content="Partner with COLONAiVE India as an Anchor Centre, Lab Partner, or Clinical Champion to standardize screening and follow-up paths." />
                <link rel="canonical" href="https://colonaive.ai/in/partners" />
            </Helmet>

            {/* Header */}
            <div className="bg-[#0B1E3B] text-white py-16">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-4">Partner with the Movement</h1>
                        <p className="text-xl text-teal-100">For Hospitals, Clinics, Labs, and Doctors</p>
                    </div>
                </Container>
            </div>

            <Container className="py-16">
                <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">

                    {/* Info Side */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Uniting the Pathway</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                We are building a coalition of responsible healthcare providers in India to ensure every individual who needs screening gets it, and every positive screen results in a timely colonoscopy.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Anchor Centre Program</h3>
                                <p className="text-gray-700">For hospitals and major clinics equipped to handle definitive diagnosis and treatment (colonoscopy and surgery). Become a referral destination for positive screening results.</p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Lab Partner Program</h3>
                                <p className="text-gray-700">For pathology labs looking to standardise screening options and integrate directly with our clinical triage network.</p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Clinical Champions</h3>
                                <p className="text-gray-700">For individual GPs, Gastroenterologists, and Colorectal Surgeons advocating for early detection and acting as the primary point of care.</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div>
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Partner Interest Form</h3>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                        <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
                                        <input type="text" name="organisation" value={formData.organisation} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role Type *</label>
                                    <select required name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Select a role...</option>
                                        <option value="Hospital / Clinic">Hospital / Clinic</option>
                                        <option value="Colorectal surgeon / Gastroenterologist / GP">Colorectal surgeon / Gastroenterologist / GP</option>
                                        <option value="Lab / Pathology">Lab / Pathology</option>
                                        <option value="Public health / NGO">Public health / NGO</option>
                                        <option value="Advisory Board interest">Advisory Board interest</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                        <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                    <textarea name="message" rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                                </div>

                                <button type="submit" className="w-full bg-[#0B1E3B] hover:bg-[#004F8C] text-white font-bold py-3 px-8 rounded-lg transition-colors">
                                    Submit Interest
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    );
};

export default IndiaPartnersPage;
