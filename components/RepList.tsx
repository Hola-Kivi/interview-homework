'use client';

import { motion } from 'framer-motion';

type List = {
  id: string;
  src: string;
  alt: string;
  name: string;
  rate: string;
};

export default function RepList({ rep, index }: { rep: List; index: number }) {
  return (
    <div className="flex items-center">
      <div className="h-10 w-10 mr-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.img
          initial={{ opacity: 0, x: 50 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: { delay: 0.03 * index },
          }}
          exit={{ opacity: 0, x: 20 }}
          src={rep.src}
          alt={rep.alt}
        />
      </div>
      <span className="text-gray-600">{rep.name}</span>
      <span className="ml-auto font-semibold">{rep.rate}</span>
    </div>
  );
}
