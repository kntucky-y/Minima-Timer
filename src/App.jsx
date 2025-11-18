import React, { useState, useEffect, useCallback, useRef } from "react";
import { createBellSound } from "./bellSound";
import "./App.css";

function TimeInput({ label, value, onChange, disabled, placeholder = "00" }) {
  return (
    <div className="time-input">
      <input
        type="number"
        min="0"
        max={label === "Hours" ? "23" : "59"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="time-field"
      />
      <label className="time-label">{label}</label>
    </div>
  );
}

function CircularTimer({ remainingSeconds, totalSeconds, isActive }) {
  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = (v) => String(v).padStart(2, "0");
    return { hours: pad(h), minutes: pad(m), seconds: pad(s) };
  };

  const time = formatTime(remainingSeconds);
  
  const getProgress = (current, max) => {
    if (!isActive || max === 0) return 0;
    return ((max - current) / max) * 100;
  };

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;
  
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const totalSecondsOnly = totalSeconds % 60;

  return (
    <div className={`circular-timer ${isActive ? 'active' : ''}`}>
      <div className="timer-circle">
        <CircularProgress 
          value={time.hours} 
          progress={getProgress(hours, totalHours)}
          label="HOURS" 
        />
      </div>
      <div className="timer-circle">
        <CircularProgress 
          value={time.minutes} 
          progress={getProgress(minutes, totalMinutes || 60)}
          label="MINUTES" 
        />
      </div>
      <div className="timer-circle">
        <CircularProgress 
          value={time.seconds} 
          progress={getProgress(seconds, 60)}
          label="SECONDS" 
        />
      </div>
    </div>
  );
}

function CircularProgress({ value, progress, label }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="circular-progress">
      <svg width="160" height="160" className="progress-ring">
        <circle
          className="progress-ring-background"
          cx="80"
          cy="80"
          r={radius}
          strokeWidth="3"
        />
        <circle
          className="progress-ring-progress"
          cx="80"
          cy="80"
          r={radius}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 80 80)"
        />
      </svg>
      <div className="progress-content">
        <span className="progress-value">{value}</span>
        <span className="progress-label">{label}</span>
      </div>
    </div>
  );
}

function ActionButton({ children, onClick, disabled, variant = "primary", loading = false }) {
  return (
    <button 
      className={`action-button ${variant} ${loading ? 'loading' : ''}`} 
      onClick={onClick} 
      disabled={disabled || loading}
    >
      <span className="button-content">
        {loading && <div className="button-spinner"></div>}
        {children}
      </span>
    </button>
  );
}

export default function App() {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");

  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [theme, setTheme] = useState('dark');
  
  // Bell sound reference
  const bellSoundRef = useRef(null);
  
  // Initialize bell sound on component mount
  useEffect(() => {
    try {
      bellSoundRef.current = createBellSound();
    } catch (error) {
      console.warn('Audio context not available:', error);
    }
  }, []);

  const hasTime = useCallback(() => {
    const h = parseInt(hours || "0", 10);
    const m = parseInt(minutes || "0", 10);
    const s = parseInt(seconds || "0", 10);
    return (h > 0 || m > 0 || s > 0) && !isNaN(h) && !isNaN(m) && !isNaN(s);
  }, [hours, minutes, seconds]);



  const handleStart = async () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      setIsRunning(false);
      return;
    }

    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      return;
    }

    setIsStarting(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));

    const h = Math.max(0, parseInt(hours || "0", 10));
    const m = Math.max(0, parseInt(minutes || "0", 10));
    const s = Math.max(0, parseInt(seconds || "0", 10));

    const total = h * 3600 + m * 60 + s;

    if (total <= 0 || isNaN(total)) {
      setIsStarting(false);
      return;
    }

    setTotalSeconds(total);
    setRemainingSeconds(total);
    setIsRunning(true);
    setIsPaused(false);
    setIsStarting(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
    setTotalSeconds(0);
  };

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const intervalId = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsPaused(false);
          
          // Play notification sound when timer completes
          if (bellSoundRef.current) {
            try {
              bellSoundRef.current.playBellSound();
            } catch (error) {
              console.warn('Could not play notification sound:', error);
            }
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, isPaused]);

  const getButtonText = () => {
    if (isStarting) return "Starting...";
    if (isRunning && !isPaused) return "Pause";
    if (isPaused) return "Resume";
    return "Start";
  };

  return (
    <div className={`app theme-${theme}`}>
      <div className="timer-container">
        <div className="theme-controls">
          <button 
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} 
            onClick={() => setTheme('dark')}
          >
            Dark
          </button>
          <button 
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`} 
            onClick={() => setTheme('light')}
          >
            Light
          </button>
        </div>

        <div className="time-inputs">
          <TimeInput
            label="HOURS"
            value={hours}
            onChange={setHours}
            disabled={isRunning}
            placeholder="00"
          />
          <TimeInput
            label="MINUTES"
            value={minutes}
            onChange={setMinutes}
            disabled={isRunning}
            placeholder="00"
          />
          <TimeInput
            label="SECONDS"
            value={seconds}
            onChange={setSeconds}
            disabled={isRunning}
            placeholder="00"
          />
        </div>

        <CircularTimer 
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds}
          isActive={isRunning || isPaused}
        />

        <div className="timer-controls">
          <ActionButton
            onClick={handleStart}
            disabled={!hasTime() && !isPaused}
            loading={isStarting}
            variant="primary"
          >
            {getButtonText()}
          </ActionButton>
          
          <ActionButton
            onClick={handleReset}
            disabled={!totalSeconds}
            variant="secondary"
          >
            Reset
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
