export const getWhatsAppLink = (message?: string) => {
  const phoneNumber = process.env.WHATSAPP_NUMBER || '1234567890';
  const defaultMessage = process.env.WHATSAPP_MESSAGE || 'Hello, I want to inquire about MBBS admissions';
  const finalMessage = message || defaultMessage;
  
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
};

export const openWhatsApp = (message?: string) => {
  if (typeof window !== 'undefined') {
    window.open(getWhatsAppLink(message), '_blank');
  }
};
