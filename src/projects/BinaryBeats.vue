<template>
  <div class="binary-beats">
    <SubHeader />

    <div class="binary-beats-container">
      <header>
        <h1>BINARY BEATS</h1>
        <p class="tagline">Create music in 1s and 0s</p>
      </header>

      <article>
        <div class="controls">
          <button @click="togglePlay">{{ isPlaying ? '■ Stop' : '▶ Play' }}</button>

          <div class="tempo-control">
            <label>
              BPM: {{ bpm }}
              <input
                type="range"
                v-model.number="bpm"
                min="60"
                max="180"
                @input="updateTempo"
              />
            </label>
          </div>

          <button @click="clearAll" class="secondary">Clear All</button>
          <button @click="randomize" class="secondary">Randomize</button>
        </div>

        <div class="sequencer">
          <div v-for="(track, trackIndex) in tracks" :key="trackIndex" class="track">
            <div class="track-label">{{ track.name }}</div>
            <div class="steps">
              <div
                v-for="(step, stepIndex) in STEPS"
                :key="stepIndex"
                class="step"
                :class="{
                  active: pattern[trackIndex][stepIndex],
                  playing: isPlaying && currentStep === stepIndex
                }"
                @click="toggleStep(trackIndex, stepIndex)"
              >
                {{ pattern[trackIndex][stepIndex] ? '1' : '0' }}
                <div class="binary-display">{{ stepIndex.toString(2).padStart(4, '0') }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="presets">
          <h3>[ Preset Patterns ]</h3>
          <div class="preset-buttons">
            <button
              v-for="(presetData, presetName) in presets"
              :key="presetName"
              @click="loadPreset(presetName)"
              class="secondary"
              role="button"
            >
              {{ presetName }}
            </button>
          </div>
        </div>

        <footer>
          <p><small>Click cells to toggle between 1 (on) and 0 (off) • Each row is a different sound • Mix your beats in binary!</small></p>
          <p><small style="opacity: 0.6;">Built with Web Audio API • All sounds generated in real-time</small></p>
        </footer>
      </article>
    </div>
  </div>
</template>

<script>
import SubHeader from '../components/SubHeader.vue'

export default {
  name: 'BinaryBeats',
  components: {
    SubHeader
  },
  data() {
    const STEPS = 16
    const tracks = [
      { name: 'Kick', freq: 60, type: 'sine' },
      { name: 'Snare', freq: 200, type: 'noise' },
      { name: 'Hi-Hat', freq: 8000, type: 'noise' },
      { name: 'Bass', freq: 80, type: 'sawtooth' },
      { name: 'Lead', freq: 440, type: 'square' }
    ]

    return {
      audioContext: null,
      tracks,
      STEPS,
      isPlaying: false,
      currentStep: 0,
      intervalId: null,
      bpm: 120,
      pattern: tracks.map(() => Array(STEPS).fill(false)),
      presets: {
        'Basic Beat': [
          [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
          [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
          [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        'House': [
          [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
          [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
          [1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0],
          [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]
        ],
        'Techno': [
          [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
          [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
          [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
          [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1]
        ],
        'Breakbeat': [
          [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
          [0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],
          [0,0,1,1,0,0,1,0,0,0,1,1,0,0,1,0],
          [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ],
        'Minimal': [
          [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
          [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
          [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0]
        ]
      }
    }
  },
  mounted() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
  },
  beforeUnmount() {
    if (this.isPlaying) {
      this.stop()
    }
    if (this.audioContext) {
      this.audioContext.close()
    }
  },
  methods: {
    toggleStep(trackIndex, stepIndex) {
      this.pattern[trackIndex][stepIndex] = !this.pattern[trackIndex][stepIndex]
    },
    togglePlay() {
      if (!this.isPlaying) {
        this.play()
      } else {
        this.stop()
      }
    },
    play() {
      this.isPlaying = true
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume()
      }
      const interval = (60 / this.bpm) * 1000 / 4
      this.intervalId = setInterval(() => this.playStep(), interval)
    },
    stop() {
      this.isPlaying = false
      clearInterval(this.intervalId)
      this.currentStep = 0
    },
    playStep() {
      this.tracks.forEach((track, trackIndex) => {
        if (this.pattern[trackIndex][this.currentStep]) {
          this.playSound(track)
        }
      })
      this.currentStep = (this.currentStep + 1) % this.STEPS
    },
    playSound(track) {
      const now = this.audioContext.currentTime

      if (track.type === 'noise') {
        const bufferSize = this.audioContext.sampleRate * 0.1
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
        const output = buffer.getChannelData(0)

        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1
        }

        const noise = this.audioContext.createBufferSource()
        noise.buffer = buffer

        const bandpass = this.audioContext.createBiquadFilter()
        bandpass.type = 'bandpass'
        bandpass.frequency.value = track.freq
        bandpass.Q.value = 1

        const gainNode = this.audioContext.createGain()
        gainNode.gain.setValueAtTime(0.3, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

        noise.connect(bandpass)
        bandpass.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        noise.start(now)
        noise.stop(now + 0.1)
      } else {
        const osc = this.audioContext.createOscillator()
        osc.type = track.type
        osc.frequency.setValueAtTime(track.freq, now)

        if (track.name === 'Kick') {
          osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5)
        }

        const gainNode = this.audioContext.createGain()
        gainNode.gain.setValueAtTime(track.name === 'Kick' ? 0.5 : 0.2, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + (track.name === 'Kick' ? 0.5 : 0.2))

        osc.connect(gainNode)
        gainNode.connect(this.audioContext.destination)

        osc.start(now)
        osc.stop(now + (track.name === 'Kick' ? 0.5 : 0.2))
      }
    },
    updateTempo() {
      if (this.isPlaying) {
        this.stop()
        this.play()
      }
    },
    clearAll() {
      this.pattern.forEach(track => track.fill(false))
    },
    randomize() {
      this.tracks.forEach((track, trackIndex) => {
        for (let i = 0; i < this.STEPS; i++) {
          const probability = trackIndex === 0 ? 0.3 :
                            trackIndex === 1 ? 0.2 :
                            trackIndex === 2 ? 0.4 : 0.25
          this.pattern[trackIndex][i] = Math.random() < probability
        }
      })
    },
    loadPreset(presetName) {
      const preset = this.presets[presetName]
      preset.forEach((trackPattern, trackIndex) => {
        trackPattern.forEach((value, stepIndex) => {
          this.pattern[trackIndex][stepIndex] = value === 1
        })
      })
    }
  }
}
</script>
