import React, { useState } from 'react';

// Self-contained component for social sharing.
const ShareTheMovement: React.FC = () => {
  const [copiedPlatform, setCopiedPlatform] = useState('');
  const shareUrl = "https://www.colonaive.ai";
  
  const shareContent = {
    facebook: `I'm supporting Project COLONAiVE™, Singapore's national movement to outsmart colorectal cancer. Early detection is key, and it can save the lives of people we love. #ColorectalCancer #COLONAiVE #GetScreenedSG #HealthierSG`,
    twitter: `Just referred friends to get screened for colorectal cancer with Project COLONAiVE™.\n\nCRC is the #1 cancer in SG — but early detection saves lives.\n\n👉 ${shareUrl}\n\n#COLONAiVE #ColorectalCancer #OutsmartCRC #GetScreenedSG`,
    whatsApp: `Hey! I just referred my friends to get screened for colorectal cancer through Project COLONAiVE™ — a national movement to outsmart CRC.\n\nIt's easy, fast, and could save a life.\n\n👉 ${shareUrl}`,
    instagram: `Just referred friends to get screened for colorectal cancer — because early detection mean early treatment.… it's lifesaving.\n\nColorectal cancer is the #1 cancer in Singapore, but it's also one of the most preventable.\n\nJoin the movement. Refer someone you care about.\n\n👉 www.colonaive.ai\n\n#COLONAiVE #ColorectalCancer #ScopedInTimeSavedInTime #GetScreenedSG #OutsmartCRC #SingaporeHealth #CancerAwareness #HealthierSG`,
    linkedInTitle: `Project COLONAiVE™ – Outsmart Colorectal Cancer`,
    linkedInSummary: `I'm supporting Project COLONAiVE, a national movement to outsmart colorectal cancer in Singapore. Join me to spread awareness and save lives! Early detection is key.`,
  };

  const copyToClipboard = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(''), 2000);
  };

  const socialIcons = {
    facebook: <svg className="w-6 h-6" fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>,
    twitter: <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    whatsApp: <svg className="w-6 h-6" fill="#25D366" viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.996 0-3.937-.53-5.703-1.511l-6.273 1.658zm6.767-6.772c.509.162 1.028.245 1.552.246 4.87 0 8.825-3.953 8.825-8.825 0-4.872-3.954-8.825-8.825-8.825-4.87 0-8.824 3.953-8.824 8.825.001 1.625.438 3.201 1.253 4.596l-.689 2.538 2.574-.68z"/></svg>,
    linkedIn: <svg className="w-6 h-6" fill="#0A66C2" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-4.481 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>,
    instagram: <svg className="w-6 h-6" fill="url(#insta-gradient)" viewBox="0 0 24 24" aria-hidden="true"><defs><linearGradient id="insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#feda75"/><stop offset="25%" stopColor="#fa7e1e"/><stop offset="50%" stopColor="#d62976"/><stop offset="75%" stopColor="#962fbf"/><stop offset="100%" stopColor="#4f5bd5"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.585.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>,
    copyLink: <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.536a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>,
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-800">Share the Movement</h3>
      <p className="text-gray-600 mt-2 mb-4">Your voice is powerful. A single share can reach hundreds.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareContent.twitter)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">{socialIcons.twitter} Share on Twitter/X</a>
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg font-medium">{socialIcons.facebook}<a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="flex-grow">Post on Facebook</a> <button onClick={() => copyToClipboard(shareContent.facebook, 'fb')} className="text-xs font-semibold text-blue-600 hover:underline">{copiedPlatform === 'fb' ? 'Copied!' : 'Copy Caption'}</button></div>
        <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareContent.whatsApp)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">{socialIcons.whatsApp}Share on WhatsApp</a>
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg font-medium">{socialIcons.linkedIn}<a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareContent.linkedInTitle)}&summary=${encodeURIComponent(shareContent.linkedInSummary)}`} target="_blank" rel="noopener noreferrer" className="flex-grow">Share on LinkedIn</a><button onClick={() => copyToClipboard(shareContent.linkedInSummary, 'linkedin')} className="text-xs font-semibold text-blue-600 hover:underline">{copiedPlatform === 'linkedin' ? 'Copied!' : 'Copy Caption'}</button></div>
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg font-medium">{socialIcons.instagram}<a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="flex-grow">Post on Instagram</a> <button onClick={() => copyToClipboard(shareContent.instagram, 'insta')} className="text-xs font-semibold text-blue-600 hover:underline">{copiedPlatform === 'insta' ? 'Copied!' : 'Copy Caption'}</button></div>
        <div className="flex flex-col items-start p-3 bg-gray-100 rounded-lg"><button onClick={() => copyToClipboard(shareUrl, 'link')} className="flex items-center gap-3 font-medium w-full">{socialIcons.copyLink} {copiedPlatform === 'link' ? 'Link Copied!' : 'Copy Sharable Link'}</button><p className="text-xs text-gray-500 pl-9 -mt-1">Paste this link anywhere.</p></div>
      </div>
    </div>
  );
};

export default ShareTheMovement;