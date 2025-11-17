import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { openWhatsApp } from '~/utils/whatsapp';

export default function FloatingWhatsApp() {
  return (
    <motion.button
      onClick={() => openWhatsApp()}
      className="fixed bottom-6 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-colors duration-200"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaWhatsapp className="text-3xl" />
      <motion.div
        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        1
      </motion.div>
    </motion.button>
  );
}
