import React, { useState } from 'react';
import { Button } from './ui/Button';
import BookingPopup from './BookingPopup';
import { useNavigate } from 'react-router-dom';

interface BookingButtonProps {
  mode: 'gp' | 'specialist';
  children: React.ReactNode;
  className?: string;
}

const BookingButton: React.FC<BookingButtonProps> = ({
  mode,
  children,
  className = ''
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const navigate = useNavigate();

  const getPopupContent = () => {
    if (mode === 'gp') {
      return {
        title: "Champion, before we proceed —",
        message: "Do you already have a trusted family doctor (GP) who can guide you through your CRC screening journey?"
      };
    }
    return {
      title: "Champion, before we proceed —",
      message: "Do you already have a trusted specialist who can guide you through your CRC screening journey?"
    };
  };

  const handleChoice = (hasDoctor: boolean) => {
    setIsPopupOpen(false);
    if (hasDoctor) {
      navigate('/');
    } else {
      navigate('/clinics');
    }
  };

  const { title, message } = getPopupContent();

  return (
    <>
      <Button
        onClick={() => setIsPopupOpen(true)}
        className={className}
      >
        {children}
      </Button>

      <BookingPopup
        isOpen={isPopupOpen}
        title={title}
        message={message}
        onClose={() => setIsPopupOpen(false)}
        onChoice={handleChoice}
      />
    </>
  );
};

export default BookingButton;