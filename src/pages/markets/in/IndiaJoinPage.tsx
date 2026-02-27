import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../../../components/ui/Container';
import toast from 'react-hot-toast';
import { submitLeadHandling } from '../../../lib/api/submitLeadHandling';
import { ShieldCheck } from 'lucide-react';

const IndiaJoinPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [agreed, setAgreed] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!agreed) {
            toast.error("Please agree to the pledge before joining.");
            return;
        }
        submitLeadHandling(e, formData, "join", toast, () => {
            setFormData({ name: '', email: '' });
            setAgreed(false);
        });
    };

    return (
        <div className="bg-white min-h-screen">
            <Helmet>
                <title>Join the Movement | COLONAiVE India</title>
                <meta name="description" content="Take the pledge to support early detection of colorectal cancer in India and stay updated with COLONAiVE." />
                <link rel="canonical" href="https://colonaive.ai/in/join" />
            </Helmet>

            {/* Header */}
            <div className="bg-[#0B1E3B] text-white py-16">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-teal-400" />
                        <h1 className="text-4xl font-bold mb-4">Join the Movement</h1>
                        <p className="text-xl text-teal-100">Take the public pledge for early detection</p>
                    </div>
                </Container>
            </div>

            <Container className="py-16">
                <div className="max-w-md mx-auto">

                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Pledge</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="How should we address you?" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="For important movement updates" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500" />
                            </div>

                            <div className="flex items-start gap-3 mt-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="flex items-center h-5">
                                    <input
                                        id="pledge"
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="w-4 h-4 text-teal-600 bg-white border-gray-300 rounded focus:ring-teal-500"
                                    />
                                </div>
                                <label htmlFor="pledge" className="text-sm text-gray-700">
                                    <strong>I pledge to prioritize my health</strong> and acknowledge that early screening and follow-up colonoscopies are essential tools in preventing colorectal cancer. Please send me updates.
                                </label>
                            </div>

                            <button type="submit" disabled={!agreed} className={`w-full font-bold py-3 px-8 rounded-lg transition-colors ${agreed ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                                Take the Pledge
                            </button>

                            <p className="text-xs text-center text-gray-500 mt-4">We respect your privacy. No spam. Unsubscribe anytime.</p>
                        </form>
                    </div>

                </div>
            </Container>
        </div>
    );
};

export default IndiaJoinPage;
