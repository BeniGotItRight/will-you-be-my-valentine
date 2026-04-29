import { motion } from 'framer-motion';

const images = [
  { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=400', caption: 'A special moment' },
  { url: 'https://images.unsplash.com/photo-1516589174184-c685266d430c?auto=format&fit=crop&q=80&w=400', caption: 'Laughter shared' },
  { url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=400', caption: 'The little things' },
  { url: 'https://images.unsplash.com/photo-1494972308805-463bc619b34e?auto=format&fit=crop&q=80&w=400', caption: 'Endless love' },
  { url: 'https://images.unsplash.com/photo-1518895949257-7621c6c78290?auto=format&fit=crop&q=80&w=400', caption: 'Our journey' },
  { url: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=400', caption: 'Together forever' },
];

const Gallery = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 max-h-[60vh] overflow-y-auto rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-inner custom-scrollbar">
      {images.map((img, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="relative group cursor-pointer"
        >
          <img
            src={img.url}
            alt={img.caption}
            className="w-full h-40 object-cover rounded-xl shadow-md border-2 border-white"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center p-2">
            <p className="text-white text-xs text-center font-body">{img.caption}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Gallery;
