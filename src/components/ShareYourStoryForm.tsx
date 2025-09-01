// /home/project/src/components/ShareYourStoryForm.tsx

import { useState } from "react";
import toast from "react-hot-toast"; // Using the direct import we fixed
import { SendHorizonal } from "lucide-react"; // Import an icon for the button

// The component's logic (props, state, handleSubmit) remains UNCHANGED
export default function ShareYourStoryForm({ onSubmit }: { onSubmit: (data: any) => Promise<boolean> }) {
  const [formData, setFormData] = useState({
    storyType: "",
    experienceType: "",
    location: "",
    content: "",
    isPublic: true,
    anonymous: false,
    canContact: false,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        // The parent component now handles the success UI,
        // but we can keep a toast as a fallback if needed.
        // toast.success("✅ Thank you! Your story has been received for review.");
        setFormData({
          storyType: "",
          experienceType: "",
          location: "",
          content: "",
          isPublic: true,
          anonymous: false,
          canContact: false,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while submitting your story.");
    } finally {
      setSubmitting(false);
    }
  };

  // The return statement below contains all the design enhancements.
  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200">
      <form className="space-y-8" onSubmit={handleSubmit}>
        
        {/* Group related fields for better structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="storyType" className="block text-sm font-medium text-gray-700 mb-1">I’m sharing as a…</label>
            <select id="storyType" name="storyType" value={formData.storyType} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              <option value="">Select an option</option>
              <option>Patient / Survivor</option>
              <option>Caregiver</option>
              <option>Family Member</option>
              <option>Friend / Supporter</option>
              <option>Concerned Citizen</option>
            </select>
          </div>

          <div>
            <label htmlFor="experienceType" className="block text-sm font-medium text-gray-700 mb-1">My experience relates to…</label>
            <select id="experienceType" name="experienceType" value={formData.experienceType} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
              <option value="">Select an option</option>
              <option>Taking a blood-based test</option>
              <option>Undergoing a colonoscopy</option>
              <option>Losing someone to CRC</option>
              <option>Recovering after treatment</option>
              <option>Supporting someone through screening</option>
              <option>Learning about CRC prevention</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select id="location" name="location" value={formData.location} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition">
            <option value="">Select your location</option>
            <option>Singapore</option>
            <option>Malaysia</option>
            <option>Philippines</option>
            <option>Australia</option>
            <option>India</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Your Story</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={8}
            maxLength={2000}
            placeholder="What moved you, challenged you, or gave you hope?"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div className="space-y-4 text-gray-700">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input id="isPublic" type="checkbox" name="isPublic" checked={formData.isPublic} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isPublic" className="font-medium">I allow my story to be featured publicly on the COLONAiVE™ website.</label>
            </div>
          </div>
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input id="anonymous" type="checkbox" name="anonymous" checked={formData.anonymous} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="anonymous" className="font-medium">I want my story to be shared anonymously.</label>
            </div>
          </div>
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input id="canContact" type="checkbox" name="canContact" checked={formData.canContact} onChange={handleChange} className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="canContact" className="font-medium">You may contact me for further outreach opportunities.</label>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-500 text-center mb-4">
              By submitting, you confirm that your story is true and you consent to its use according to our platform's Terms and Privacy Policy.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-lg text-lg font-semibold transition-all duration-200 ease-in-out ${
                submitting 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <SendHorizonal className="h-5 w-5"/>
              {submitting ? "Submitting..." : "Submit My Story"}
            </button>
        </div>
      </form>
    </div>
  );
}