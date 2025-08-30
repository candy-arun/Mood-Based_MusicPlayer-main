import React, { useEffect, useRef, useState } from 'react'

/**
 * Simple playlist per mood.
 * Fallback uses external sample mp3s — replace with your own files in /public/music for best results.
 */
const PLAYLISTS = {
  happy: [
    { title: 'Aaluma Doluma', src: '/music/Aaluma-Doluma.mp3' }
  ],
  sad: [
    { title: 'Oorai Therinjikiten', src: '/music/Oorai Therinjukitten.mp3' }
  ],
  angry: [
    { title: 'Fire Up', src: '/music/Neruppu-Da.mp3' }
  ],
  relaxed: [
    { title: 'Kutty Story', src: '/music/Kutti-Story-MassTamilan.io.mp3' }
  ]
}

function formatTime(sec) {
  if (!sec && sec !== 0) return '--:--'
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function Player({ mood = 'relaxed', active = true }) {
  const audioRef = useRef(null)
  const [playlist, setPlaylist] = useState(PLAYLISTS[mood] || [])
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)

  // when mood changes, update playlist and start from first track
  useEffect(() => {
    const pl = PLAYLISTS[mood] || []
    setPlaylist(pl)
    setIndex(0)
    setProgress(0)
    setDuration(0)
    setTimeout(() => {
      if (audioRef.current && isPlaying) {
        audioRef.current.play().catch(() => {})
      }
    }, 0)
  }, [mood])

  // attach audio events
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    function onTime() { setProgress(a.currentTime) }
    function onLoaded() { setDuration(a.duration || 0) }
    function onEnd() { handleNext() }

    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onLoaded)
    a.addEventListener('ended', onEnd)
    return () => {
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onLoaded)
      a.removeEventListener('ended', onEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef, index, playlist])

  // auto-play when track changes (if previously playing)
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = volume
    if (isPlaying && active) {
      a.play().catch(() => setIsPlaying(false))
    } else {
      a.pause()
    }
  }, [index, isPlaying, active, volume])

  function handlePlayPause() {
    if (!playlist.length) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch((_) => {
        // autoplay policies may block play without user gesture
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  function handleNext() {
    setIndex(i => (i + 1) % playlist.length)
    setIsPlaying(true)
  }
  function handlePrev() {
    setIndex(i => (i - 1 + playlist.length) % playlist.length)
    setIsPlaying(true)
  }

  function handleSeek(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const pct = clickX / rect.width
    const t = pct * duration
    audioRef.current.currentTime = t
    setProgress(t)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white/5 p-4 rounded">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-75">Mood</div>
            <div className="text-lg font-semibold capitalize">{mood}</div>
          </div>
          <div className="text-sm opacity-70">{playlist.length ? playlist[index].title : 'No tracks'}</div>
        </div>

        <div className="mt-4">
          <div
            className="w-full h-2 bg-white/10 rounded-md cursor-pointer"
            onClick={handleSeek}
            role="presentation"
          >
            <div className="h-2 bg-indigo-500 rounded-md" style={{ width: `${(progress / (duration || 1)) * 100}%` }} />
          </div>
          <div className="flex items-center justify-between text-xs mt-2 opacity-80">
            <div>{formatTime(progress)}</div>
            <div>{formatTime(duration)}</div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button onClick={handlePrev} className="px-3 py-2 bg-white/6 rounded">Prev</button>
          <button onClick={handlePlayPause} className="px-4 py-2 bg-indigo-600 rounded">
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleNext} className="px-3 py-2 bg-white/6 rounded">Next</button>

          <div className="ml-auto flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Hidden audio element */}
        {playlist.length > 0 && (
          <audio
            ref={audioRef}
            src={playlist[index].src}
            preload="metadata"
          />
        )}
      </div>

      <div className="text-xs opacity-60">
        Tip: Replace sample mp3s in PLAYLISTS with your own files in /public/music for better UX.
      </div>
    </div>
  )
}
