import React from 'react'

const MOOD_EMOJI = {
  happy: '😄',
  sad: '😢',
  angry: '😡',
  relaxed: '😌'
}

export default function MoodCard({ mood = 'relaxed', confidence = 0 }) {
  return (
    <div className="flex items-center gap-4 bg-white/3 p-3 rounded-md">
      <div className="text-4xl">{MOOD_EMOJI[mood] || '🙂'}</div>
      <div>
        <div className="text-lg font-semibold capitalize">{mood}</div>
        <div className="text-xs opacity-70">confidence: {(confidence * 100).toFixed(0)}%</div>
      </div>
    </div>
  )
}
