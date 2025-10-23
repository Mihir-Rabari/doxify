import { Link, useLocation } from 'react-router-dom';
import { Home, ArrowLeft, Construction, Skull, Coffee, Rocket } from 'lucide-react';
import { Button } from '@/components/ui';
import { useState, useEffect } from 'react';

export default function NotFound() {
  const location = useLocation();
  const [isFeatureInDev, setIsFeatureInDev] = useState(false);

  useEffect(() => {
    // Check if coming from a feature link
    const fromFeature = location.state?.fromFeature || 
                       location.pathname.includes('/feature') ||
                       location.pathname.includes('/coming-soon');
    setIsFeatureInDev(fromFeature);
  }, [location]);

  // Random snarky messages for random access
  const randomMessages = [
    "What are you even doing here? 🤨",
    "Lost? Maybe try using the search bar next time 🔍",
    "This URL doesn't exist. Neither does my patience. 😤",
    "Error 404: Your sense of direction not found 🧭",
    "Congrats! You found the most useless page! 🎉",
    "Go back. Nothing to see here. Seriously. 👋"
  ];

  const getRandomMessage = () => randomMessages[Math.floor(Math.random() * randomMessages.length)];
  const [randomMsg] = useState(getRandomMessage());

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {isFeatureInDev ? (
          // Feature in Development
          <>
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-yellow-500/10 flex items-center justify-center animate-pulse">
              <Construction className="w-12 h-12 text-yellow-500" />
            </div>
            
            <h1 className="text-8xl font-black text-white mb-4 tracking-tight">🚧</h1>
            <h2 className="text-4xl font-bold text-white mb-3">Under Construction!</h2>
            <p className="text-xl text-neutral-300 mb-4">
              This feature is cooking in our lab 🧪
            </p>
            <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
              We're working hard to bring you something awesome! In the meantime, grab a coffee ☕ and check out our other features.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Link to="/dashboard">
                <Button variant="primary" icon={Rocket} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  Explore Other Features
                </Button>
              </Link>
              <Button
                variant="outline"
                icon={ArrowLeft}
                onClick={() => window.history.back()}
                className="border-neutral-700 text-neutral-300"
              >
                Go Back
              </Button>
            </div>

            <div className="mt-12 p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
              <p className="text-sm text-neutral-500">💡 <span className="text-neutral-400">Pro tip: Follow us for updates on new features!</span></p>
            </div>
          </>
        ) : (
          // Random Access - Snarky Mode
          <>
            <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <Skull className="w-12 h-12 text-red-500" />
            </div>
            
            <h1 className="text-9xl font-black text-white mb-4 tracking-tight">404</h1>
            <h2 className="text-4xl font-bold text-white mb-3">Well, well, well...</h2>
            <p className="text-2xl text-emerald-500 mb-4 font-semibold">
              {randomMsg}
            </p>
            <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
              This page doesn't exist. It never did. And honestly? It probably never will.
              <br />
              <span className="text-neutral-500 text-sm mt-2 block">So maybe just... go back? 🤷‍♂️</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <Link to="/dashboard">
                <Button variant="primary" icon={Home} className="bg-emerald-500 hover:bg-emerald-600">
                  Take Me Home
                </Button>
              </Link>
              <Button
                variant="outline"
                icon={Coffee}
                onClick={() => window.history.back()}
                className="border-neutral-700 text-neutral-300"
              >
                I'll Just Leave
              </Button>
            </div>

            <div className="mt-12 p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
              <p className="text-sm text-neutral-500">😅 <span className="text-neutral-400">No hard feelings though! We're just having fun here.</span></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
