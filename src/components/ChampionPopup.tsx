import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
// Removed useNavigate as it's better handled by the parent component
// import { useNavigate } from 'react-router-dom';

interface ChampionPopupProps {
  type: 'gp' | 'specialist';
  onClose: () => void;
  onChoice: (hasDoctor: boolean) => void;
}

const ChampionPopup: React.FC<ChampionPopupProps> = ({
  type,
  onClose,
  onChoice
}) => {
  // Ref for the dialog container to manage focus and overlay clicks
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = 'champion-popup-title';
  const descriptionId = 'champion-popup-description';

  // Removed navigate from handleClose
  // const navigate = useNavigate();
  const handleClose = useCallback(() => {
    onClose();
    // Navigation removed - parent component should decide navigation based on onClose or onChoice
    // navigate('/');
  }, [onClose]);

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the dialog container on mount for accessibility
    // More robust focus trapping would involve managing first/last focusable elements
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  // Handle clicks outside the dialog content
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };


  const title = "Champion, before we proceed —";
  const message = type === 'gp'
    ? "Do you already have a trusted family doctor (GP) who can guide you through your CRC screening journey?"
    : "Do you already have a trusted specialist who can guide you through your CRC screening journey?";

  return (
    // Added overlay click handler
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" // Increased bg-opacity for better contrast if needed
      onClick={handleOverlayClick}
    >
      {/* Added ARIA roles, labels, ref, and tabindex for initial focus */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1} // Allows the div to be focused programmatically
        className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg shadow-xl max-w-lg w-full relative outline-none" // Added outline-none to hide focus ring on container if desired
      >
        <button
          onClick={handleClose}
          aria-label="Close dialog" // Added aria-label
          // Increased contrast, adjusted position slightly if needed
          className="absolute top-3 right-3 p-1 text-gray-600 hover:text-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" // Improved contrast & added focus ring
        >
          <X className="h-5 w-5" />
        </button>

        {/* Adjusted padding for responsiveness */}
        <div className="p-6 sm:p-8">
          {/* Added ID for aria-labelledby */}
          <h2
            id={titleId}
            // Adjusted text size for responsiveness
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6" // Darker text for better contrast
          >
            {title}
          </h2>
          {/* Added ID for aria-describedby */}
          <p
            id={descriptionId}
             // Adjusted text size for responsiveness
            className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8"
          >
            {message}
          </p>

          <div className="space-y-4">
            <Button
              variant="primary"
              className="w-full text-left justify-start" // Keeping original style as requested
              onClick={() => onChoice(true)}
            >
              Yes, I Have My Own {type === 'gp' ? 'Doctor' : 'Specialist'}
            </Button>
            <Button
              variant="secondary"
              className="w-full text-left justify-start" // Keeping original style as requested
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

export default ChampionPopup;