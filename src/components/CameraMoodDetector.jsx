import React, { useEffect, useRef, useState } from 'react'
import * as faceapi from 'face-api.js'

/**
 * Props:
 *  - onMood(mood: string, confidence: number)
 *  - listening (bool)
 *  - setListening(fn)
 */
export default function CameraMoodDetector({ onMood, listening, setListening }) {
  const videoRef = useRef(null)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const detectorInterval = useRef(null)

  useEffect(() => {
    let mounted = true

    async function loadModels() {
      try {
        // loadFromUri('/models') expects your model files to be in public/models/
        await faceapi.nets.tinyFaceDetector.loadFromUri(import.meta.env.BASE_URL + 'models')
        await faceapi.nets.faceExpressionNet.loadFromUri(import.meta.env.BASE_URL + 'models')

        if (!mounted) return
        setModelsLoaded(true)
      } catch (err) {
        console.error('Failed to load models:', err)
      }
    }

    loadModels()

    return () => {
      mounted = false
      stopVideo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (modelsLoaded && listening) startVideo()
    if (!listening) stopVideo()
    return () => { stopVideo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelsLoaded, listening])

  function startVideo() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Webcam not supported in this browser.')
      return
    }
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (!videoRef.current) return
      videoRef.current.srcObject = stream
      videoRef.current.play()

      // Start detection loop
      detectorInterval.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 })
        const detection = await faceapi.detectSingleFace(videoRef.current, options).withFaceExpressions()
        if (detection && detection.expressions) {
          const entries = Object.entries(detection.expressions)
          entries.sort((a, b) => b[1] - a[1]) // highest first
          const [bestExpr, confidence] = entries[0]

          // Map fine-grained expressions to broader moods
          const map = {
            happy: 'happy',
            sad: 'sad',
            angry: 'angry',
            neutral: 'relaxed',
            surprised: 'happy',
            fearful: 'sad',
            disgusted: 'angry'
          }
          const mood = map[bestExpr] || 'relaxed'

          onMood && onMood(mood, Number(confidence.toFixed(2)))
        } else {
          // no face found -> fallback
          onMood && onMood('relaxed', 0)
        }
      }, 900) // check roughly every 900ms (tweak for perf)
    }).catch(err => {
      console.error('Camera error:', err)
      alert('Please allow camera access or check browser settings.')
    })
  }

  function stopVideo() {
    clearInterval(detectorInterval.current)
    detectorInterval.current = null
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(t => t.stop())
      videoRef.current.srcObject = null
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
        {!modelsLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-sm bg-black/60">
            Loading face models...
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setListening(s => !s)}
          className="px-3 py-2 bg-indigo-600 rounded-md hover:bg-indigo-500"
        >
          {listening ? 'Stop Camera' : 'Start Camera'}
        </button>
        <div className="text-sm opacity-80">Models: {modelsLoaded ? 'ready' : 'loading'}</div>
      </div>
    </div>
  )
}
