import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const [isNewPlayer, setIsNewPlayer] = useState(true);
  const [username, setUsername] = useState('');
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  // Icons
  const DotIcon = getIcon('CircleDot');
  const UsersIcon = getIcon('Users');
  const TrophyIcon = getIcon('Trophy');
  const BrainIcon = getIcon('Brain');

  useEffect(() => {
    // Check if username exists in localStorage
    const savedUsername = localStorage.getItem('dotnexus_username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsNewPlayer(false);
      setUsernameSubmitted(true);
    }
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    
    if (username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    
    // Save username to localStorage
    localStorage.setItem('dotnexus_username', username);
    setUsernameSubmitted(true);
    setIsNewPlayer(false);
    toast.success(`Welcome, ${username}!`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
              <DotIcon className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            DotNexus
          </h1>
          <p className="text-surface-600 dark:text-surface-300 text-lg md:text-xl max-w-2xl mx-auto">
            Connect the dots, claim the boxes, master the grid
          </p>
        </motion.header>

        {!usernameSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-md mx-auto bg-white dark:bg-surface-800 rounded-2xl shadow-card p-6 mb-12"
          >
            <h2 className="text-xl font-semibold mb-4">Welcome to DotNexus!</h2>
            <p className="text-surface-600 dark:text-surface-300 mb-6">
              Choose a username to start playing:
            </p>
            <form onSubmit={handleUsernameSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  required
                  minLength={3}
                  maxLength={15}
                />
              </div>
              <button 
                type="submit" 
                className="w-full btn bg-gradient-to-r from-primary to-primary-dark text-white font-medium py-3 rounded-lg hover:opacity-90 transition-all"
              >
                Start Playing
              </button>
            </form>
          </motion.div>
        ) : (
          <MainFeature username={username} />
        )}

        {!usernameSubmitted && (
          <motion.section 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16"
          >
            <motion.div 
              variants={itemVariants}
              className="card bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-900 border border-surface-200 dark:border-surface-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mr-3">
                  <UsersIcon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Multiplayer Matches</h3>
              </div>
              <p className="text-surface-600 dark:text-surface-300">
                Challenge friends or random opponents to thrilling connect-the-dots battles.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="card bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-900 border border-surface-200 dark:border-surface-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center mr-3">
                  <TrophyIcon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg">Competitive Play</h3>
              </div>
              <p className="text-surface-600 dark:text-surface-300">
                Earn points, climb the leaderboard, and become the ultimate dots master.
              </p>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="card bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-900 border border-surface-200 dark:border-surface-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center mr-3">
                  <BrainIcon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold text-lg">Strategic Depth</h3>
              </div>
              <p className="text-surface-600 dark:text-surface-300">
                Master the art of strategic thinking and box-claiming tactics.
              </p>
            </motion.div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default Home;