import React, { useState } from 'react'
import CameraMoodDetector from './components/CameraMoodDetector'
import Player from './components/Player'
import MoodCard from './components/MoodCard'

export default function App() {
  const [mood, setMood] = useState('relaxed')        // current mood label
  const [confidence, setConfidence] = useState(0)    // expression confidence
  const [listening, setListening] = useState(true)   // camera on/off

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-800 text-white p-6">
      <header className="max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">MoodMusic — Play by Face</h1>
        <div className="text-sm opacity-80">Real-time mood detection + music</div>
      </header>

      <main className="max-w-5xl mx-auto mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white/5 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Camera & Mood</h2>
          <CameraMoodDetector
            onMood={(m, c) => { setMood(m); setConfidence(c) }}
            listening={listening}
            setListening={setListening}
          />
          <div className="mt-4">
            <MoodCard mood={mood} confidence={confidence} />
          </div>
        </section>

        <section className="bg-white/5 rounded-xl p-4">
          <h2 className="text-lg font-semibold mb-3">Player</h2>
          <Player mood={mood} active={listening} />
        </section>
      </main>

      <footer className="max-w-5xl mx-auto mt-8 text-xs opacity-70">
        Tip: Ensure good lighting and an unobstructed face for best detection.
      </footer>
    </div>
  )
}
