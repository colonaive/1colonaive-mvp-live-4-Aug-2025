import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { useNavigate } from 'react-router-dom';

interface ChampionChoiceModalProps {
  type: 'gp' | 'specialist' | 'screening';
  onClose: () => void;
  onChoice: (hasDoctor: boolean) => void;
}

export const ChampionChoiceModal: React.FC<ChampionChoiceModalProps> = ({
  type,
  onClose,
  onChoice,
}) => {
  const navigate = useNavigate();

  const getMessage = () => {
    switch (type) {
      case 'gp':
        return "Do you already have a trusted family doctor (GP) you usually consult?";
      case 'specialist':
        return "Do you already have a trusted Specialist who can guide you through your CRC screening journey?";
      case 'screening':
        return "Do you already have a trusted family doctor (GP) or specialist who can guide you through your CRC screening journey?";
      default:
        return "";
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'gp':
        return "Yes, I Have My Own Doctor";
      case 'specialist':
        return "Yes, I Have My Own Specialist";
      case 'screening':
        return "Yes, I Have My Own Doctor";
      default:
        return "Yes, I Have My Own Doctor";
    }
  };

  const handleClose = () => {
    onClose();
    navigate('/');
  };

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
            Champion, before we proceed —
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            {getMessage()}
          </p>

          <div className="space-y-4">
            <Button
              variant="primary"
              className="w-full text-left justify-start"
              onClick={() => onChoice(true)}
            >
              {getButtonText()}
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