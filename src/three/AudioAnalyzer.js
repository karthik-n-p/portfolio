/**
 * AudioAnalyzer — Web Audio API integration for music-reactive 3D
 *
 * Captures microphone input (which picks up speaker audio in the room)
 * and provides real-time frequency analysis split into bass, mid, treble bands.
 *
 * Usage:
 *   const analyzer = new AudioAnalyzer()
 *   await analyzer.start()        // prompts mic permission
 *   const data = analyzer.getData()   // { bass, mid, treble, overall }
 *   analyzer.stop()
 */

export class AudioAnalyzer {
  constructor() {
    this.audioCtx = null
    this.analyser = null
    this.dataArray = null
    this.stream = null
    this.active = false
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      this.analyser = this.audioCtx.createAnalyser()
      this.analyser.fftSize = 256
      this.analyser.smoothingTimeConstant = 0.8

      const source = this.audioCtx.createMediaStreamSource(this.stream)
      source.connect(this.analyser)

      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
      this.active = true
      return true
    } catch (err) {
      console.warn('AudioAnalyzer: microphone access denied or unavailable', err)
      this.active = false
      return false
    }
  }

  getData() {
    if (!this.active || !this.analyser) {
      return { bass: 0, mid: 0, treble: 0, overall: 0 }
    }

    this.analyser.getByteFrequencyData(this.dataArray)
    const len = this.dataArray.length

    // Split frequency bins into 3 bands
    const bassEnd   = Math.floor(len * 0.15)   // ~0-150Hz
    const midEnd    = Math.floor(len * 0.5)     // ~150-500Hz
    // treble = rest                             // ~500Hz+

    let bassSum = 0, midSum = 0, trebleSum = 0
    for (let i = 0; i < bassEnd; i++) bassSum += this.dataArray[i]
    for (let i = bassEnd; i < midEnd; i++) midSum += this.dataArray[i]
    for (let i = midEnd; i < len; i++) trebleSum += this.dataArray[i]

    const bass   = bassSum / (bassEnd * 255)
    const mid    = midSum / ((midEnd - bassEnd) * 255)
    const treble = trebleSum / ((len - midEnd) * 255)
    const overall = (bass + mid + treble) / 3

    return { bass, mid, treble, overall }
  }

  stop() {
    this.active = false
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop())
      this.stream = null
    }
    if (this.audioCtx) {
      this.audioCtx.close()
      this.audioCtx = null
    }
    this.analyser = null
    this.dataArray = null
  }
}
