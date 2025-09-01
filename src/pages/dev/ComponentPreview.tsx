import React, { useState } from 'react';
import { Container } from '../../components/ui/Container';
import BookingPopup from '../../components/BookingPopup';
import { Button } from '../../components/ui/Button';

const ComponentPreview: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const handleClose = () => {
    setIsPopupOpen(false);
  };
  
  const handleChoice = (hasDoctor: boolean) => {
    setIsPopupOpen(false);
    alert(`You selected: ${hasDoctor ? 'I have a doctor' : 'I need help finding one'}`);
  };

  return (
    <div className="pt-32">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Component Preview: BookingPopup</h1>
          
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">BookingPopup Component</h2>
            <p className="mb-4">Click the button below to open the popup and test its functionality.</p>
            
            <Button onClick={() => setIsPopupOpen(true)}>
              Open Booking Popup
            </Button>
            
            {isPopupOpen && (
              <BookingPopup
                isOpen={isPopupOpen}
                title="Champion, before we proceed —"
                message="Do you already have a trusted family doctor (GP) who can guide you through your CRC screening journey?"
                onClose={handleClose}
                onChoice={handleChoice}
              />
            )}
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Component Information</h2>
            <p className="mb-2"><strong>Component Path:</strong> /src/components/BookingPopup.tsx</p>
            <p className="mb-2"><strong>Props:</strong></p>
            <ul className="list-disc pl-6 mb-4">
              <li><span className="font-mono bg-gray-100 px-1 rounded">isOpen: boolean</span> - Controls visibility of the popup</li>
              <li><span className="font-mono bg-gray-100 px-1 rounded">title: string</span> - Title text for the popup</li>
              <li><span className="font-mono bg-gray-100 px-1 rounded">message: string</span> - Main message text</li>
              <li><span className="font-mono bg-gray-100 px-1 rounded">onClose: () =&gt; void</span> - Function called when popup is closed</li>
              <li><span className="font-mono bg-gray-100 px-1 rounded">onChoice: (hasDoctor: boolean) =&gt; void</span> - Function called when user makes a choice</li>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ComponentPreview;