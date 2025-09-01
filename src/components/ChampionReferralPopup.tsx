import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

interface ChampionReferralPopupProps {
  referralType: 'gp' | 'specialist' | 'general';
  onClose: () => void;
  onChoice: (hasDoctor: boolean) => void;
}

const ChampionReferralPopup: React.FC<ChampionReferralPopupProps> = ({
  referralType,
  onClose,
  onChoice
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  const title = "Champion, before we proceed —";
  const message = referralType === "gp"
    ? "Do you already have a trusted family doctor (GP) who can guide you through your CRC screening journey?"
    : referralType === "specialist"
    ? "Do you already have a trusted specialist who can guide you through your CRC screening journey?"
    : "Do you already have a trusted family doctor (GP) or specialist who can guide you through your CRC screening journey?";

  const buttonText = referralType === "gp"
    ? "Yes, I Have My Own Doctor"
    : referralType === "specialist"
    ? "Yes, I Have My Own Specialist"
    : "Yes, I Have My Own Doctor";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg shadow-xl max-w-lg w-full relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {title}
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            {message}
          </p>

          <div className="space-y-4">
            <Button
              variant="primary"
              className="w-full text-left justify-start"
              onClick={() => onChoice(true)}
            >
              {buttonText}
            </Button>
            <Button
              variant="secondary"
              className="w-full text-left justify-start"
              onClick={() => onChoice(false)}
            >
              No, Help Me Find One
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionReferralPopup;