export const getWhatsAppLink = (message?: string) => {
  const env = (import.meta as any)?.env || {};
  const phoneNumber = (env.PUBLIC_WHATSAPP_NUMBER as string | undefined) || '1234567890';
  const defaultMessage = (env.PUBLIC_WHATSAPP_MESSAGE as string | undefined) || 'Hello, I want to inquire about MBBS admissions';
  const finalMessage = message || defaultMessage;
  
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
};

export const openWhatsApp = (message?: string) => {
  if (typeof window !== 'undefined') {
    window.open(getWhatsAppLink(message), '_blank');
  }
};
