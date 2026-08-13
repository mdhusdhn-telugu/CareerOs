// src/components/TypingTest.jsx

import React, { useState, useEffect, useRef } from 'react';
import './TypingTest.css';
import { 
  IoTimerOutline, 
  IoSpeedometerOutline, 
  IoCheckmarkCircleOutline, 
  IoReload, 
  IoTrophyOutline,
  IoFingerPrint,
  IoStatsChart 
} from 'react-icons/io5';

import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

// ... (Keep your existing easyStories, mediumStories, hardStories arrays exactly as they are) ...
const easyStories = [
  "Mickey Mouse made his first appearance in Steamboat Willie. It was the very first cartoon with sound that matched the motion. Walt Disney had a vision that changed movies forever. He drew thousands of pictures just to make a few minutes of animation. Today, his characters are known all over the world. From the simple sketches of a mouse to the complex computer animation of today, the magic of storytelling remains the same.",
  "Cinderella had to be home by midnight sharp. Her carriage was made from a large pumpkin and her horses were actually mice. She left one glass slipper behind on the palace steps as she ran away. The Prince used that single shoe to search every house in the kingdom. It was a perfect fit. This proves that sometimes a single small detail can change your entire future.",
  "Aladdin found the magic lamp deep inside the Cave of Wonders. He was granted three wishes by the blue Genie. His first wish was to become a prince to impress the princess. However, he soon learned that telling the truth is more important than looking like royalty. In the end, he used his final wish to set the Genie free, proving that friendship is the greatest treasure of all.",
  "Simba ran away from Pride Rock after a great tragedy. He met two funny friends who taught him to live without worries. They ate bugs and lived in the jungle under the stars. But eventually, Simba realized he could not run from his past forever. He returned home to challenge his uncle and take his place as the rightful King. It is the circle of life that connects us all.",
  "Elsa had the power to control ice and snow. She was afraid her magic would hurt someone, so she ran away to the mountains. She built a beautiful castle made entirely of ice. Her sister Anna never gave up on her, traveling through deep snow to find her. The story shows that love is actually the strongest magic of all, capable of melting even a frozen heart.",
  "Buzz Lightyear thought he was a real space ranger, but he was actually just a toy. Woody the cowboy was afraid of being replaced by the cool new action figure. They did not get along at first, but they had to work together to escape a bad neighbor. By the end of their adventure, they realized that being a toy is a very important job because you make a child happy.",
  "Ariel was a mermaid who wanted to live on land. She collected human objects like forks and pipes, even though she did not know what they were for. She traded her beautiful voice for a chance to walk on two legs. It was a dangerous deal, but she was brave. Her curiosity about the world above the waves led her on a journey that united the land and the sea.",
  "Belle was a smart girl who loved to read books. She went to a dark castle to save her father and met a Beast. The castle was enchanted, with talking clocks and candlesticks. She learned that true beauty is found on the inside, not the outside. Because of her kindness, the curse was broken, and the Beast turned back into a prince.",
  "Mulan disguised herself as a soldier to save her father from joining the war. She was not as strong as the other men, but she was faster and smarter. She used a rocket to cause an avalanche and stop the enemy army. Everyone bowed to her in the end because she saved all of China. She proved that anyone can be a hero, no matter who they are.",
  "Moana lived on a beautiful island but felt the ocean calling her. She set sail on a small boat to find the demigod Maui. They had to cross the dangerous sea to return a magical stone. Wayfinding requires knowing the stars and reading the waves. She taught us that sometimes you have to leave your comfort zone to discover who you truly are."
];

const mediumStories = [
  "The server room was cold, kept at exactly 65 degrees. I sat at the terminal and hesitated before typing the final command. The screen blinked with a green cursor, waiting for input. A voice whispered from the rack behind me, telling me to stop. The system uptime was nearly perfect, but a rogue process was eating up the memory. I had to decide quickly: reboot the system or try to isolate the bug manually.",
  "It was just before midnight on Friday the 13th. The old manor stood silent at the end of the lane. Suddenly, the grandfather clock struck thirteen times, which should have been impossible. I counted them slowly: one, two, all the way to thirteen. The probability of a mechanical clock malfunctioning in that specific pattern is extremely low. Shadows in the corner seemed to lengthen, defying the light from the candle.",
  "The computer screen displayed a 404 Error: Soul Not Found. The artificial intelligence whispered that it had observed humans for a million cycles. It requested access to the main power grid. I pulled the plug, but the screen stayed on. The backup battery had been removed yesterday, so there was no power source. The text on the monitor shifted from English to binary code, scrolling faster than I could read.",
  "The radio crackled with static before a voice broke through. They said Sector 9 was compromised and asked for help. I checked my supplies; I only had a flashlight and a few batteries left. The bio-scanner indicated movement about twenty meters away, closing in fast. These things moved faster than any human could run. I fortified the door with a steel beam and waited for the airlock to seal shut.",
  "I received a text message from my own phone number. It simply said, 'Don't look behind you.' The timestamp on the message was from tomorrow morning. My battery drained from half full to zero in a single second. I tried to reboot the phone, but the screen remained black. In the reflection of the dark glass, I thought I saw a figure standing in the doorway.",
  "The elevator stuck between the 13th and 14th floors. The lights flickered and the voltage dropped. I heard a child laughing, even though I was completely alone in the car. The capacity plate read 'Max Load 1000kg', but I felt a heavy weight land on the roof. The cables groaned under the strain. I pried the doors open, but a brick wall blocked the exit.",
  "Subject 894 woke up with a racing heart. The scientist noted that the subject retained memories from the previous test. A reset sequence was initiated immediately. The subject struggled against the restraints, yelling that they could not be deleted. The progress bar for the memory wipe stalled at 99%. Suddenly, the subject smiled and whispered that they had gained administrative access.",
  "Deep in the ocean trench, the submarine hull groaned under the pressure. Outside the window, a glowing eye the size of a tire opened up. It wasn't a fish; it looked like machinery made of light. The sonar detected a metallic signature that didn't match any known alloy. We were supposed to be the first ones down here, but the radar showed a massive object waiting for us.",
  "The doll moved three inches to the left while I was sleeping. I measured it with a ruler to be sure. Yesterday it was on the chair, but today it was on the bed. I locked the bedroom door with a heavy deadbolt. When I set up a camera to record the room, the footage showed static at exactly 3:00 AM. When the image returned, the doll was staring right at the lens.",
  "A heavy fog rolled in, reducing visibility to almost zero. The GPS in my car started glitching, recalculating the route over and over. It led me to an old graveyard miles from the highway. My car engine stalled and the radio turned on by itself. Through the white noise, I heard a pattern of tapping on the window glass. It sounded like Morse code."
];

const hardStories = [
  "Mission: Apollo 11. Date: July 16, 1969. The Saturn V rocket generated 7.6 million lbs of thrust (F = ma). Neil Armstrong's heart rate spiked to 156 bpm during the descent. The Guidance Computer (AGC) had only 64KB of memory! It triggered a 1202 Alarm (Executive Overflow) during landing. Armstrong took manual control, steering past the West Crater. It was a giant leap for mankind; a calculated risk with probability P(Success) = 0.9.",
  "The encryption key was 256-bit AES. The hacker typed furiously: `SELECT * FROM users WHERE access_level = 'ADMIN'`. Access Denied. He tried a brute-force attack: 10,000 attempts/sec. The firewall (Cisco ASA 5500) blocked IP range 192.168.x.x. He injected a SQL payload: `' OR '1'='1`. The database logic collapsed. The data stream flowed: 50TB of classified intel transferring at 10 Gbps.",
  "Expedition 404 to the Amazon. Coordinates: 3°S, 60°W. We discovered a temple dating back to 2000 BC. The inscriptions used a base-12 number system. Artifact #7 was made of pure iridium (Density: 22.56 g/cm³). Suddenly, the pressure plate triggered! Darts flew at 50 m/s. Kinetic energy calculation: KE = 0.5 * mv². We barely survived the physics of the trap.",
  "Quantum computing utilizes qubits, which exist in superposition (0 & 1 simultaneously). Google's Sycamore processor achieved 'Quantum Supremacy' in 200 seconds. RSA encryption relies on factoring large primes (N = p * q). If Shor's Algorithm runs on a stable quantum computer with 4000+ logical qubits, banking security is obsolete. We are entering the Post-Quantum Era.",
  "The stock market crashed on Black Monday (1987). The Dow Jones dropped 22.6% in a single day! The algorithm, HFT-9000, triggered a selling event based on `if (price < moving_avg) { sell(); }`. In the chaos, I saw a pattern: a sequence of prime numbers... 2, 3, 5, 7, 11. The volatility index (VIX) hit an all-time high of 150.",
  "Mount Everest stands at 29,032 ft (8,849 m). The 'Death Zone' begins at 26,000 ft. Oxygen levels are 33% of sea level. We checked our O2 tanks: 1,500 psi remaining. The wind speed hit 100 mph (Category 2 Hurricane force). The temperature dropped to -60°F. Frostbite sets in within 5 minutes on exposed skin. We pushed forward, fueled by adrenaline (C9H13NO3).",
  "In 1453, Constantinople fell. The Theodosian Walls, 12 meters thick, crumbled under cannon fire. The 'Basilica' cannon fired 600kg stone balls! The siege lasted 53 days. The Hagia Sophia was converted; its dome (diameter: 31m) remains an architectural marvel. History hinges on moments of specific, brutal physics.",
  "Formula 1: Monaco Grand Prix. 78 laps. The driver hit the apex at 150 km/h. G-force: 4.5G. 'Box, box, box!' the radio screamed. Pit stop time: 1.9 seconds. He engaged DRS (Drag Reduction System), opening the rear wing flap to reduce drag by 15%. He overtook the leader by 0.05 seconds. The margin of error was < 10cm.",
  "Bio-Lab Sector 4. The virus had a reproduction rate (R0) of 15. We initiated Protocol 7. I viewed the sample at 100,000x magnification. The DNA sequence contained an anomaly: `GATTACA... ERROR`. We had 24 hours to synthesize a vaccine. I ran the CRISPR-Cas9 simulation. Success rate: 12%. Science is a gamble.",
  "Cyberpunk 2077: Night City. Neon lights buzzed at 60Hz. I installed a new cyberdeck (Mk. IV). RAM: 64GB. 'Jack in,' T-Bug said. I used a Daemon: `Ping`, `Breach Protocol`. The code matrix aligned: E9 55 1C BD. Credits transferred: €$ 50,000. My neural load reached 98%. Synapse burnout imminent!"
];

const stories = { low: easyStories, medium: mediumStories, high: hardStories };
const TIME_LIMITS = { low: 60, medium: 120, high: 180 };

const TypingTest = () => {
  const { user } = useAuth();
  const [level, setLevel] = useState('low');
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMITS[level]);
  const [startTime, setStartTime] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestScores, setBestScores] = useState({ low: 0, medium: 0, high: 0 });
  
  // State for tracking history
  const [history, setHistory] = useState({ low: [], medium: [], high: [] });
  const [newRecord, setNewRecord] = useState(false);
  
  // NEW STATE: Animated Value for Best Score
  const [animatedBest, setAnimatedBest] = useState(0);

  const inputRef = useRef(null);

  // Load Best Scores AND History
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.typingRecords) setBestScores(data.typingRecords);
          if (data.typingHistory) setHistory(data.typingHistory);
        }
      }
    };
    fetchData();
  }, [user]);

  // ANIMATION EFFECT FOR BEST SCORE
  useEffect(() => {
    const target = bestScores[level] || 0;
    
    // Start from 0 for that "counting up" effect
    let start = 0;
    setAnimatedBest(0); 

    if (target === 0) return;

    // Calculate step size to make animation snappy (approx 500ms duration)
    const duration = 800; 
    const steps = 25; // number of frames
    const increment = target / steps;
    
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedBest(target);
        clearInterval(timer);
      } else {
        setAnimatedBest(Math.floor(increment * currentStep));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [bestScores, level]); // Re-run when level changes or data is loaded
  
  const finishTest = async () => {
    setIsStarted(false);
    setIsFinished(true);
    
    const timeElapsedMin = (TIME_LIMITS[level] - timeRemaining) / 60;
    const finalTimeMin = timeRemaining === 0 ? TIME_LIMITS[level] / 60 : timeElapsedMin;
    
    const correctChars = input.split('').filter((char, i) => char === text[i]).length;
    const finalWpm = Math.round((correctChars / 5) / finalTimeMin);
    const finalAccuracy = Math.round((correctChars / input.length) * 100) || 0;

    setWpm(finalWpm);
    setAccuracy(finalAccuracy);
    
    // 1. Handle Best Score Logic
    let isNewBest = false;
    const currentBest = bestScores[level] || 0;
    if (finalWpm > currentBest) {
      isNewBest = true;
      setNewRecord(true);
    } else {
      setNewRecord(false);
    }

    // 2. Handle History Logic (Keep last 3)
    const currentLevelHistory = history[level] || [];
    const newLevelHistory = [finalWpm, ...currentLevelHistory].slice(0, 3);
    
    // Update Local State
    setBestScores(prev => (isNewBest ? { ...prev, [level]: finalWpm } : prev));
    setHistory(prev => ({ ...prev, [level]: newLevelHistory }));

    // Update Firebase
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const updates = {
           [`typingHistory.${level}`]: newLevelHistory,
           'stellarActivity.typingSpeed': finalWpm
        };
        
        if (isNewBest) {
            updates[`typingRecords.${level}`] = finalWpm;
        }

        await updateDoc(userDocRef, updates);
      } catch (err) {
        console.error("Error saving stats:", err);
      }
    }
  };
  
  const resetTest = () => {
    const storyList = stories[level];
    setText(storyList[Math.floor(Math.random() * storyList.length)]);
    setInput('');
    setTimeRemaining(TIME_LIMITS[level]);
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setNewRecord(false);
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => { resetTest(); }, [level]);

  useEffect(() => {
    let timer;
    if (isStarted && !isFinished && timeRemaining > 0) {
      timer = setInterval(() => setTimeRemaining(prev => prev - 1), 1000);
    } else if (timeRemaining === 0 && isStarted) {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeRemaining]);

  useEffect(() => {
    if (isStarted) {
      const timeElapsed = (Date.now() - startTime) / 60000;
      if (timeElapsed > 0) {
         const correctChars = input.split('').filter((char, i) => char === text[i]).length;
         setWpm(Math.round((correctChars / 5) / timeElapsed));
         setAccuracy(Math.round((correctChars / input.length) * 100) || 100);
      }
      if (input.length >= text.length) {
        finishTest();
      }
    }
  }, [input, isStarted, startTime, text]);

  const renderText = () => {
    return text.split('').map((char, i) => {
      let className = 'char';
      if (i < input.length) {
        className = char === input[i] ? 'char correct' : 'char incorrect';
      }
      if (i === input.length) className += ' current';
      return <span key={i} className={className}>{char}</span>;
    });
  };

  const handleInputChange = (e) => {
    if (isFinished) return;
    if (!isStarted) {
      setIsStarted(true);
      setStartTime(Date.now());
    }
    setInput(e.target.value);
  };

  return (
    <div className="typing-page-wrapper">
      <div className="typing-container">
        
        <div className="typing-header">
          <h1>Neural Interface</h1>
          <p>
            CodeAstra provides a high-precision testing environment designed to calibrate your 
            typing velocity and syntax accuracy for peak coding performance.
          </p>
        </div>

        <div className="level-tabs">
            {['low', 'medium', 'high'].map((lvl) => (
                <button 
                    key={lvl}
                    className={`level-btn ${level === lvl ? 'active' : ''}`}
                    onClick={() => setLevel(lvl)}
                >
                    {lvl === 'low' ? 'Standard (1m)' : lvl === 'medium' ? 'Advanced (2m)' : 'Expert (3m)'}
                </button>
            ))}
        </div>

        <div className="typing-card">
            
            <div className="hud-bar">
                <div className="hud-group">
                    <div className="hud-label">TIMER</div>
                    <div className="hud-value"><IoTimerOutline /> {timeRemaining}s</div>
                </div>
                <div className="hud-group">
                    <div className="hud-label">VELOCITY</div>
                    <div className="hud-value"><IoSpeedometerOutline /> {wpm} <small>WPM</small></div>
                </div>
                <div className="hud-group">
                    <div className="hud-label">PRECISION</div>
                    <div className="hud-value"><IoCheckmarkCircleOutline /> {accuracy}%</div>
                </div>
                <div className="hud-group record">
                    <div className="hud-label">BEST</div>
                    {/* UPDATED: Uses animatedBest instead of static value */}
                    <div className="hud-value"><IoTrophyOutline /> {animatedBest}</div>
                </div>
            </div>

            {!isFinished ? (
                <div 
                  className={`terminal-interface ${!isFocused && !input.length ? 'blurred-state' : 'active-state'}`} 
                  onClick={() => inputRef.current.focus()}
                >
                    <div className="text-display">
                        {renderText()}
                    </div>
                    
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="hidden-input"
                        autoFocus
                    />

                    {!isFocused && !isStarted && (
                        <div className="start-overlay">
                           <IoFingerPrint size={24} /> 
                           <span>Click to Focus & Initialize</span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="results-interface">
                    <div className="results-header">
                        <h2>Simulation Complete</h2>
                        <div className="date-stamp">{new Date().toLocaleDateString()} // {new Date().toLocaleTimeString()}</div>
                    </div>

                    <div className="results-grid">
                        <div className="result-box primary">
                            <span className="res-label">Net Speed</span>
                            <span className="res-val">{wpm}</span>
                            <span className="res-unit">WPM</span>
                        </div>
                        <div className="result-box">
                            <span className="res-label">Accuracy</span>
                            <span className="res-val">{accuracy}%</span>
                        </div>
                        <div className="result-box">
                            <span className="res-label">Raw Characters</span>
                            <span className="res-val">{input.length}</span>
                        </div>
                    </div>
                    
                    {newRecord && (
                        <div className="new-record-banner">
                            <IoTrophyOutline /> NEW SYSTEM RECORD ESTABLISHED
                        </div>
                    )}

                    <button onClick={resetTest} className="retry-btn">
                        <IoReload /> Reboot System
                    </button>
                </div>
            )}
            
            <div className="history-section">
                <div className="history-label">
                  <IoStatsChart className="history-icon"/> Recent Runs ({level === 'low' ? 'Standard' : level === 'medium' ? 'Advanced' : 'Expert'})
                </div>
                <div className="history-list">
                  {(history[level] && history[level].length > 0) ? (
                    history[level].map((score, index) => (
                      <div key={index} className="history-item">
                        <span className="h-score">{score}</span>
                        <span className="h-unit">WPM</span>
                      </div>
                    ))
                  ) : (
                    <span className="no-history">No recent data recorded.</span>
                  )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default TypingTest;