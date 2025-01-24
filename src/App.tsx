import React, { useState, useEffect } from 'react';
import { CircleDashed, Hammer, FileText, Scissors, Sparkles, Copy, Check, Coffee, Bell } from 'lucide-react';
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
const FaucetGame = () => {
 const [address, setAddress] = useState('');
 const [gameResult, setGameResult] = useState(null);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState('');
 const [copiedAddress, setCopiedAddress] = useState('');
 const [recentTransactions, setRecentTransactions] = useState([]);
 const [notifications, setNotifications] = useState([]);

 const API_URL = 'https://api.fauceteagame.xyz/api';

 const choices = [
   { name: 'Rock', icon: Hammer, color: 'from-pink-500 to-rose-500' },
   { name: 'Paper', icon: FileText, color: 'from-blue-500 to-cyan-500' },
   { name: 'Scissors', icon: Scissors, color: 'from-purple-500 to-violet-500' }
 ];

useEffect(() => {
  fetchRecentTransactions();
  const interval = setInterval(fetchRecentTransactions, 10000);
  return () => clearInterval(interval);
}, []);

const handleCopy = (addr) => {
  try {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(addr);
    setTimeout(() => setCopiedAddress(""), 2000);
  } catch (error) {
    console.error("error :", error);
  }
};


 const shortenAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

 const fetchRecentTransactions = async () => {
   const response = await fetch(`${API_URL}/recent-transactions`);
   console.log(response);
   const data = await response.json();
   setRecentTransactions(data);
 };

 const addTokenToMetaMask = async () => {
  try {
      await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
              type: 'ERC20',
              options: {
                  address: '0xC9C14dF451f31FF882Af20ab1C0fC48Bb853e3Cc',
                  symbol: 'FGT',
                  decimals: 18,
                  image: ''
              },
          },
      });
  } catch (error) {
      console.error('Error adding token:', error);
  }
};

 const playGame = async (choice) => {
   if (!address.startsWith('0x') || address.length !== 42) {
     setError('Please enter a valid ETH address');
     return;
   }

   setLoading(true);
   setError('');

   try {
     const response = await fetch(`${API_URL}/play`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ address })
     });

     const data = await response.json();
     if (data.error) {
       throw new Error(data.error);
     }

     setGameResult(data);
   } catch (err) {
     setError(err.message);
   } finally {
     setLoading(false);
   }
 };

 const coffeeIcons = Array.from({ length: 15 }, (_, i) => {
   const randomRotation = Math.random() * 360;
   const randomDelay = Math.random() * 5;
   const randomDuration = 15 + Math.random() * 10;
   const randomSize = 60 + Math.random() * 60;
   const randomLeft = Math.random() * 100;
   const randomTop = Math.random() * 100;

   return (
     <div
       key={i}
       className="absolute opacity-40"
       style={{
         left: `${randomLeft}%`,
         top: `${randomTop}%`,
         transform: `rotate(${randomRotation}deg)`,
         animation: `float ${randomDuration}s ease-in-out infinite`,
         animationDelay: `${randomDelay}s`
       }}
     >
       <Coffee size={randomSize} className="text-violet-200" />
     </div>
   );
 });

 return (
   <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-900 to-black text-white p-6 relative overflow-hidden">
     <style>
       {`
         @keyframes float {
           0%, 100% {
             transform: translate(0, 0) rotate(var(--rotation));
           }
           50% {
             transform: translate(20px, -20px) rotate(calc(var(--rotation) + 10deg));
           }
         }
         @keyframes slideInRight {
           from {
             transform: translateX(100%);
             opacity: 0;
           }
           to {
             transform: translateX(0);
             opacity: 1;
           }
         }
         .animate-slide-in-right {
           animation: slideInRight 0.3s ease-out;
         }
       `}
     </style>
     
     <div className="absolute inset-0 overflow-hidden">
       {coffeeIcons}
     </div>

     <div className="absolute inset-0  opacity-10 bg-cover bg-center" />
     <div className="absolute inset-0 bg-gradient-to-br from-violet-950/90 via-purple-900/90 to-black/90" />
     
     <div className="relative max-w-3xl mx-auto">
     <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
        <div className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-300 text-transparent bg-clip-text flex items-center">
          <span>Fauce</span>
          <span className="text-green-600 animate-pulse">Tea</span>
          <span>Game</span>
        </div>
        <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
      </div>

      <button
        onClick={addTokenToMetaMask}
        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <img src="/metamask.png" alt="MetaMask" className="w-12 md:w-15 h-6 md:h-8" />
        Add FGT Token
      </button>
      </div>

       <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-8 mb-4 md:mb-8 border border-white/10 shadow-xl">

         <input
           type="text"
           placeholder="Your ETH Address (0x...)"
           value={address}
           onChange={(e) => setAddress(e.target.value)}
           className="w-full bg-white/10 text-white placeholder-white/50 px-3 md:px-6 py-3 md:py-4 rounded-xl
           focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all duration-300
           border border-white/10 text-sm md:text-base"
         />
       </div>

       <div className="grid grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-8 relative min-h-[8rem] md:min-h-[10rem]">
         {loading ? (
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center">
               <CircleDashed className="w-20 h-20 text-violet-400 animate-spin mx-auto mb-4" />
               <p className="text-xl font-semibold text-violet-300">Playing game...</p>
             </div>
           </div>
         ) : (
           choices.map(({ name, icon: Icon, color }) => (
             <button
               key={name}
               onClick={() => playGame(name)}
               disabled={loading}
               className={`
                group h-28 md:h-40 flex flex-col items-center justify-center gap-2 md:gap-4
                bg-gradient-to-br ${color} bg-opacity-20
                rounded-xl md:rounded-2xl backdrop-blur-sm
                transition-all duration-300 border border-white/10
                hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20
              `}
             >
               <div className="relative">
                 <Icon className="h-10 w-10 md:h-16 md:w-16 transition-transform duration-300 group-hover:scale-110 stroke-[1.5]" />
                 <div className="absolute inset-0 animate-ping opacity-30">
                   <Icon className="text-sm md:text-lg font-semibold" />
                 </div>
               </div>
               <span className="text-lg font-semibold">{name}</span>
             </button>
           ))
         )}
       </div>
       {error && (
         <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-6 rounded-xl mb-6 backdrop-blur-sm">
           <p className="font-semibold">{error}</p>
         </div>
       )}


       {gameResult && (
         <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/10 shadow-xl">
           <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-purple-300 text-transparent bg-clip-text">
             Game Result
           </h2>
           <div className="space-y-4">
           <p className="text-xl">
              Result: <span className={`font-bold ${gameResult.result === 'win' ? 'text-green-300' : 'text-red-400'}`}>
                {gameResult.result}
              </span>
            </p>
             <p className="text-xl">Reward: <span className="font-bold text-violet-400">{gameResult.reward} FGT</span></p>
             <div className="mt-8">
               <h3 className="text-2xl font-semibold mb-4">To continue playing:</h3>
               <p className="text-green-300 mb-4">
                 Send {gameResult.result === 'win' ? '1000 FGT to address' : '500 FGT to address'}:
               </p>
               {gameResult.targetAddresses.map((addr, i) => (
                  <div key={i} className="relative group">
                    <code className="block bg-black/40 p-4 rounded-xl mb-3 font-mono text-violet-300 border border-violet-500/20 pr-12">
                      {addr}
                    </code>
                    <button
                      onClick={() => handleCopy(addr)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copiedAddress === addr ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-violet-400" />
                      )}
                    </button>
                  </div>
                ))}

             </div>
           </div>
         </div>
       )}

       <div className="bg-white/5 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 mb-4 md:mb-8 border border-white/10">
         <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
           <Bell className="w-4 h-4 md:w-5 md:h-5" />
           Recent Transactions
         </h3>
         <div className="space-y-2 md:space-y-3">
           {recentTransactions.map((tx, i) => (
             <div key={i} className="flex items-center justify-between p-2 md:p-3 bg-white/5 rounded-lg text-xs md:text-sm">
               <div className="flex items-center gap-2">
                 <div className="text-sm">
                   <span className="text-violet-300">{shortenAddress(tx.from)}</span>
                   <span className="mx-2">→</span>
                   <span className="text-violet-300">{shortenAddress(tx.to)}</span>
                 </div>
               </div>
               <span className="text-green-400 font-medium">{tx.amount} FGT</span>
             </div>
           ))}
         </div>
       </div>
     </div>
   </div>
 );
};

export default FaucetGame;