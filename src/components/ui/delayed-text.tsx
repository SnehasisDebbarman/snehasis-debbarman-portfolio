// components/DelayedText.tsx

import { motion } from 'framer-motion';
import React from 'react';

interface DelayedTextProps {
    text: string;
    className?: string;
}

const DelayedText: React.FC<DelayedTextProps> = ({ text, className }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }} // 3-second delay before revealing
        >
            {text}
        </motion.div>
    );
};

export default DelayedText;
