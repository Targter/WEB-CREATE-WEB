import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const Home: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const navigate = useNavigate();
  const handlePromptSubmit = (e: React.FormEvent) => {
    
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  const quickActions = [
    { label: 'Import from Figma', icon: '🎨' },
    { label: 'Build a mobile app with Expo', icon: '📱' },
    { label: 'Start a blog with Astro', icon: '✍️' },
    { label: 'Create a docs site with VitePress', icon: '📜' },
    { label: 'Scaffold UI with shadcn', icon: '🖼️' },
    { label: 'Draft a presentation with Slidev', icon: '📊' },
  ];

 
 


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-black text-white" style={{
      backgroundColor: "#003153",
      backgroundImage: "linear-gradient(315deg, #003153 0%, #1B1B1B 74%)"
    }}>
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <Wand2 className="w-6 h-6 " />
          <span className="text-xl font-bold">AB-WEB-APP</span>
        </div>
        <div className="flex items-center space-x-4">
           <div className="flex space-x-2">
            {/* 
             */}
             <button className="p-2 hover:bg-gray-800 rounded-full">
      <a
        href="https://www.linkedin.com/in/bansalabhay/"
        target="_blank"
        rel="noopener noreferrer"
        className=" transition"
      >

        <Linkedin size={24} />
      </a>
</button>

<button>



      <a
        href="https://x.com/AbCheckk"
        target="_blank"
        rel="noopener noreferrer"
        className=" transition"
      >
        <Twitter size={24} />
      </a>
</button>
<button>


      <a
        href="mailto:bansalabhay00@gmail.com"
        className=" hover:text-red-500 transition"
      >
        <Mail size={24} />
      </a>
</button>
  
           
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          What do you want to build?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-400 mb-8"
        >
          Prompt, run, edit, and deploy full-stack web and mobile apps.
        </motion.p>

        {/* Prompt Input */}
        <form onSubmit={handlePromptSubmit} className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-md rounded-lg p-4 border border-gray-700"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="How can Bolt help you today?"
              className="w-full h-24 p-4 bg-transparent text-gray-200 placeholder-gray-500 border-none focus:outline-none resize-none"
            />
          </motion.div>
          <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="self-end px-4 py-2bg-transparent text-white  transition-colors w-full h-9 mt-4"
              style={{
                backgroundColor: "#003366",
                backgroundImage: "linear-gradient(315deg, #003366 0%, #242124 74%)"
              }}
            >
              Send
            </motion.button>
        </form>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mt-6"
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/70 backdrop-blur-md rounded-full text-sm text-gray-300 hover:bg-gray-700/70 transition-colors"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Start Blank App Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <p className="text-gray-400 mb-4">or start a blank app with your favorite stack</p>
          <div className="flex flex-wrap justify-center gap-4">
  {[
    {
      name: 'next',
      svg: (
        <svg viewBox="0 0 100 100" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" fill="currentColor">
          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="45" fontFamily="Arial" fill="white">N</text>
        </svg>
      ),
    },
    {
      name: 'vite',
      svg: (
        <svg viewBox="0 0 256 256" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg">
          <path fill="#FFB300" d="M128 0L256 256H0z" />
          <path fill="#7B61FF" d="M128 60L188 256H68z" />
        </svg>
      ),
    },
    {
      name: 'react',
      svg: (
        <svg viewBox="0 0 256 256" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg">
          <circle cx="128" cy="128" r="20" fill="#61DAFB" />
          <g stroke="#61DAFB" strokeWidth="10" fill="none">
            <ellipse rx="100" ry="40" cx="128" cy="128" transform="rotate(0 128 128)" />
            <ellipse rx="100" ry="40" cx="128" cy="128" transform="rotate(60 128 128)" />
            <ellipse rx="100" ry="40" cx="128" cy="128" transform="rotate(120 128 128)" />
          </g>
        </svg>
      ),
    },
    {
      name: 'typescript',
      svg: (
        <svg viewBox="0 0 256 256" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg">
          <rect width="256" height="256" rx="16" fill="#3178C6" />
          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="100" fill="white" fontWeight="bold" fontFamily="Arial">TS</text>
        </svg>
      ),
    },
    {
      name: 'node',
      svg: (
        <svg viewBox="0 0 256 256" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity" xmlns="http://www.w3.org/2000/svg">
          <path fill="#8CC84B" d="M128 0l128 74v108l-128 74-128-74V74z" />
          <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontSize="60" fill="white" fontWeight="bold" fontFamily="Arial">N</text>
        </svg>
      ),
    },
  ].map((stack, index) => (
    <motion.div
      key={index}
      whileHover={{ scale: 1.1 }}
      className="p-2 bg-gray-800/50 rounded-full"
    >
      {stack.svg}
    </motion.div>
  ))}
</div>

        </motion.div>
      </main>

 
    </div>
  );
};

