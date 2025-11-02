<template>
  <div class="loop-piano">
    <SubHeader />

    <div class="loop-piano-container">
      <header>
        <h1>LOOP PIANO</h1>
        <p class="tagline">Layer your melodies, one loop at a time</p>
      </header>

      <article>
        <!-- Controls -->
        <div class="controls-section">
          <div class="tempo-control">
            <label>
              Tempo: {{ bpm }} BPM
              <input
                type="range"
                v-model.number="bpm"
                min="60"
                max="320"
                step="5"
              />
            </label>
          </div>

          <div class="playback-controls">
            <button @click="togglePlay" class="contrast">
              {{ isPlaying ? '■ Stop' : '▶ Play' }}
            </button>
            <button @click="clearAll" class="secondary">
              Clear All
            </button>
          </div>
        </div>

        <!-- Step Sequencer Grid -->
        <div class="sequencer-section">
          <h3>[ Step Sequencer - Use arrow keys to navigate, piano keys to set notes, Delete to clear ]</h3>

          <div class="sequencer-grid">
            <!-- Header row with beat numbers -->
            <div class="grid-header">
              <div class="track-label-header">Track</div>
              <div
                v-for="beatIndex in TOTAL_BEATS"
                :key="'header-' + beatIndex"
                class="beat-header"
                :class="{
                  'bar-start': (beatIndex - 1) % 4 === 0,
                  playing: isPlaying && currentBeat === beatIndex - 1
                }"
              >
                <span v-if="(beatIndex - 1) % 4 === 0" class="bar-number">
                  {{ Math.floor((beatIndex - 1) / 4) + 1 }}
                </span>
                <span v-else class="beat-number">{{ ((beatIndex - 1) % 4) + 1 }}</span>
              </div>
            </div>

            <!-- Track rows -->
            <div
              v-for="trackIndex in NUM_TRACKS"
              :key="trackIndex"
              class="grid-row"
            >
              <div class="track-label-cell">{{ trackIndex }}</div>
              <div
                v-for="beatIndex in TOTAL_BEATS"
                :key="beatIndex"
                class="grid-cell"
                :class="{
                  selected: selectedRow === trackIndex - 1 && selectedCol === beatIndex - 1,
                  filled: grid[trackIndex - 1][beatIndex - 1].note,
                  playing: isPlaying && currentBeat === beatIndex - 1,
                  'bar-start': (beatIndex - 1) % 4 === 0
                }"
                :style="getCellStyle(trackIndex - 1, beatIndex - 1)"
                @click="selectCell(trackIndex - 1, beatIndex - 1)"
              >
                <span v-if="grid[trackIndex - 1][beatIndex - 1].note" class="note-display">
                  {{ grid[trackIndex - 1][beatIndex - 1].note }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Piano Keyboard -->
        <div class="piano-section">
          <h3>[ Piano Keys ]</h3>
          <div class="piano-keyboard">
            <div
              v-for="(key, index) in keys"
              :key="index"
              class="piano-key"
              :class="{ black: key.isBlack }"
              @click="setNoteAtSelection(key)"
            >
              <span class="key-label">
                {{ key.label }}
                <span class="keyboard-hint">{{ key.keyboardKey }}</span>
              </span>
            </div>
          </div>
        </div>

        <footer>
          <p><small>20-key piano with 8-track step sequencer • G key = Middle C • Arrow keys to navigate, Space to play/pause, Piano keys to place notes, Delete to clear</small></p>
        </footer>
      </article>
    </div>
  </div>
</template>

<script>
import SubHeader from '../components/SubHeader.vue'

export default {
  name: 'LoopPiano',
  components: {
    SubHeader
  },
  data() {
    // Piano layout with G = Middle C (C4)
    // Home row: A S D F G H J K L ; ' \ (white keys)
    // Top row: W E T Y U O P [ (black keys)
    const pianoLayout = [
      { note: 'F', octave: 3, keyboard: 'A', isBlack: false },
      { note: 'F#', octave: 3, keyboard: 'W', isBlack: true },
      { note: 'G', octave: 3, keyboard: 'S', isBlack: false },
      { note: 'G#', octave: 3, keyboard: 'E', isBlack: true },
      { note: 'A', octave: 3, keyboard: 'D', isBlack: false },
      { note: 'A#', octave: 3, keyboard: 'T', isBlack: true },
      { note: 'B', octave: 3, keyboard: 'F', isBlack: false },
      { note: 'C', octave: 4, keyboard: 'G', isBlack: false }, // Middle C on G key
      { note: 'C#', octave: 4, keyboard: 'Y', isBlack: true },
      { note: 'D', octave: 4, keyboard: 'H', isBlack: false },
      { note: 'D#', octave: 4, keyboard: 'U', isBlack: true },
      { note: 'E', octave: 4, keyboard: 'J', isBlack: false },
      { note: 'F', octave: 4, keyboard: 'K', isBlack: false },
      { note: 'F#', octave: 4, keyboard: 'O', isBlack: true },
      { note: 'G', octave: 4, keyboard: 'L', isBlack: false },
      { note: 'G#', octave: 4, keyboard: 'P', isBlack: true },
      { note: 'A', octave: 4, keyboard: ';', isBlack: false },
      { note: 'A#', octave: 4, keyboard: '[', isBlack: true },
      { note: 'B', octave: 4, keyboard: "'", isBlack: false },
      { note: 'C', octave: 5, keyboard: '\\', isBlack: false }
    ]

    // Create color gradient from red to green
    const keys = pianoLayout.map((key, index) => {
      const noteIndex = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(key.note)
      const semitonesFromA4 = (key.octave - 4) * 12 + noteIndex - 9
      const freq = 440 * Math.pow(2, semitonesFromA4 / 12)

      // Color gradient: red (low) to green (high)
      const hue = (index / (pianoLayout.length - 1)) * 120 // 0 = red, 120 = green
      const color = `hsl(${hue}, 70%, 50%)`

      return {
        note: `${key.note}${key.octave}`,
        label: key.note,
        keyboardKey: key.keyboard,
        freq: freq,
        isBlack: key.isBlack,
        color: color
      }
    })

    const TOTAL_BEATS = 32 // 8 bars × 4 beats
    const NUM_TRACKS = 8

    // Create 8x32 grid
    const grid = Array(NUM_TRACKS).fill(null).map(() =>
      Array(TOTAL_BEATS).fill(null).map(() => ({ note: null, freq: null, color: null }))
    )

    return {
      audioContext: null,
      keys: keys,
      TOTAL_BEATS,
      NUM_TRACKS,
      grid: grid,
      selectedRow: 0,
      selectedCol: 0,
      bpm: 120,
      isPlaying: false,
      currentBeat: 0,
      intervalId: null
    }
  },
  computed: {
    hasAnyNotes() {
      return this.grid.some(row => row.some(cell => cell.note))
    }
  },
  mounted() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    window.addEventListener('keydown', this.handleKeyDown)
  },
  beforeUnmount() {
    if (this.isPlaying) {
      this.togglePlay()
    }
    if (this.audioContext) {
      this.audioContext.close()
    }
    window.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    selectCell(row, col) {
      this.selectedRow = row
      this.selectedCol = col
    },

    getCellStyle(row, col) {
      const cell = this.grid[row][col]
      if (cell.note && cell.color) {
        return { backgroundColor: cell.color, opacity: 0.8 }
      }
      return {}
    },

    setNoteAtSelection(key) {
      const cell = this.grid[this.selectedRow][this.selectedCol]
      cell.note = key.label
      cell.freq = key.freq
      cell.color = key.color
      this.playNoteSound(key.freq)
    },

    togglePlay() {
      if (this.isPlaying) {
        this.stopPlayback()
      } else {
        this.startPlayback()
      }
    },

    startPlayback() {
      this.isPlaying = true
      this.currentBeat = 0

      const beatDuration = (60 / this.bpm) * 1000

      const playBeat = () => {
        // Play all notes at current beat across all tracks
        this.grid.forEach(row => {
          const cell = row[this.currentBeat]
          if (cell.note && cell.freq) {
            this.playNoteSound(cell.freq)
          }
        })

        if (this.isPlaying) {
          this.intervalId = setTimeout(() => {
            this.currentBeat = (this.currentBeat + 1) % this.TOTAL_BEATS
            playBeat()
          }, beatDuration)
        }
      }

      playBeat()
    },

    stopPlayback() {
      this.isPlaying = false
      if (this.intervalId) {
        clearTimeout(this.intervalId)
        this.intervalId = null
      }
      this.currentBeat = 0
    },

    playNoteSound(freq) {
      const now = this.audioContext.currentTime
      const oscillators = []
      const gainNode = this.audioContext.createGain()

      // Add harmonics for piano sound
      const harmonics = [
        { mult: 1, gain: 0.3 },
        { mult: 2, gain: 0.15 },
        { mult: 3, gain: 0.08 },
        { mult: 4, gain: 0.04 },
        { mult: 5, gain: 0.02 }
      ]

      harmonics.forEach(h => {
        const osc = this.audioContext.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq * h.mult, now)

        const harmGain = this.audioContext.createGain()
        harmGain.gain.setValueAtTime(h.gain, now)

        osc.connect(harmGain)
        harmGain.connect(gainNode)
        osc.start()
        oscillators.push(osc)
      })

      // Piano envelope
      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(1, now + 0.003)
      gainNode.gain.exponentialRampToValueAtTime(0.7, now + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8)

      gainNode.connect(this.audioContext.destination)

      oscillators.forEach(osc => {
        osc.stop(now + 0.8)
      })
    },

    clearAll() {
      this.stopPlayback()
      this.grid.forEach(row => {
        row.forEach(cell => {
          cell.note = null
          cell.freq = null
          cell.color = null
        })
      })
    },

    handleKeyDown(e) {
      if (e.repeat) return

      // Spacebar for play/pause
      if (e.key === ' ') {
        e.preventDefault()
        this.togglePlay()
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        this.selectedRow = Math.max(0, this.selectedRow - 1)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        this.selectedRow = Math.min(this.NUM_TRACKS - 1, this.selectedRow + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        this.selectedCol = Math.max(0, this.selectedCol - 1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        this.selectedCol = Math.min(this.TOTAL_BEATS - 1, this.selectedCol + 1)
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        // Clear selected cell
        e.preventDefault()
        const cell = this.grid[this.selectedRow][this.selectedCol]
        cell.note = null
        cell.freq = null
        cell.color = null
      } else {
        // Check if it's a piano key
        const keyChar = e.key.toUpperCase()
        const key = this.keys.find(k => k.keyboardKey.toUpperCase() === keyChar)

        if (key) {
          e.preventDefault()
          this.setNoteAtSelection(key)
        }
      }
    }
  }
}
</script>

<style scoped>
.loop-piano-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.tagline {
  opacity: 0.8;
  font-size: 1.1rem;
}

/* Controls */
.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.tempo-control {
  flex: 1;
  min-width: 200px;
}

.tempo-control label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.playback-controls {
  display: flex;
  gap: 0.5rem;
}

.playback-controls button {
  min-width: 100px;
}

/* Sequencer Grid */
.sequencer-section {
  margin-bottom: 3rem;
}

.sequencer-section h3 {
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

.sequencer-grid {
  border: 2px solid var(--contrast);
  border-radius: 4px;
  overflow-x: auto;
}

.grid-header {
  display: grid;
  grid-template-columns: 60px repeat(32, minmax(28px, 1fr));
  border-bottom: 2px solid var(--contrast);
  background: var(--card-background-color);
}

.track-label-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
  border-right: 2px solid var(--contrast);
  padding: 0.5rem;
}

.beat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.5rem 0.25rem;
  border-right: 1px solid var(--muted-border-color);
  position: relative;
}

.beat-header.bar-start {
  border-left: 2px solid var(--contrast);
}

.beat-header.playing {
  background: rgba(46, 204, 113, 0.3);
}

.bar-number {
  font-size: 0.75rem;
}

.beat-number {
  font-size: 0.65rem;
  opacity: 0.6;
}

.grid-row {
  display: grid;
  grid-template-columns: 60px repeat(32, minmax(28px, 1fr));
  border-bottom: 1px solid var(--muted-border-color);
}

.grid-row:last-child {
  border-bottom: none;
}

.track-label-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  border-right: 2px solid var(--contrast);
  background: var(--card-background-color);
  padding: 0.5rem;
}

.grid-cell {
  min-height: 40px;
  border-right: 1px solid var(--muted-border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s;
  position: relative;
  font-size: 0.7rem;
  font-weight: bold;
}

.grid-cell.bar-start {
  border-left: 2px solid var(--contrast);
}

.grid-cell.selected {
  box-shadow: inset 0 0 0 4px #ffcc00;
  background: rgba(255, 204, 0, 0.2);
  z-index: 1;
}

.grid-cell.filled {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.grid-cell.playing {
  outline: 3px solid #2ecc71;
  outline-offset: -3px;
  z-index: 2;
}

.grid-cell:hover {
  background: rgba(255, 255, 255, 0.05);
}

.note-display {
  font-size: 0.7rem;
}

/* Piano Keyboard */
.piano-section {
  margin-bottom: 2rem;
}

.piano-section h3 {
  margin-bottom: 1rem;
  text-align: center;
  font-size: 1rem;
}

.piano-keyboard {
  display: flex;
  justify-content: center;
  gap: 2px;
  padding: 2rem 1rem;
  background: var(--card-background-color);
  border-radius: 8px;
  overflow-x: auto;
  min-height: 180px;
}

.piano-key {
  width: 45px;
  height: 180px;
  background: white;
  border: 2px solid #333;
  border-radius: 0 0 8px 8px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 1rem;
  transition: all 0.1s;
  position: relative;
}

.piano-key.black {
  width: 32px;
  height: 120px;
  background: #333;
  margin: 0 -17px;
  z-index: 2;
  border: 2px solid #000;
}

.piano-key:hover {
  transform: translateY(2px);
  filter: brightness(0.9);
}

.piano-key:active {
  transform: translateY(4px);
  filter: brightness(0.8);
}

.key-label {
  font-size: 0.75rem;
  font-weight: bold;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.piano-key.black .key-label {
  color: white;
}

.keyboard-hint {
  font-size: 0.7rem;
  opacity: 0.6;
  font-weight: normal;
}

footer {
  margin-top: 2rem;
  text-align: center;
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 768px) {
  .sequencer-grid {
    font-size: 0.8rem;
  }

  .grid-header {
    grid-template-columns: 50px repeat(32, minmax(24px, 1fr));
  }

  .grid-row {
    grid-template-columns: 50px repeat(32, minmax(24px, 1fr));
  }

  .grid-cell {
    min-height: 35px;
  }
}
</style>
