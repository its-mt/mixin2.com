<template>
  <div class="woodland-scene">
    <SubHeader />

    <div class="woodland-container">
      <header>
        <h1>WOODLAND SCENE</h1>
        <p class="tagline">Click to add trees, rabbits, and mushrooms</p>
      </header>

      <article>
        <div class="controls">
          <button
            @click="selectTool('tree')"
            :class="['tool-button', { active: selectedTool === 'tree' }]"
          >
            🌲 Tree
          </button>
          <button
            @click="selectTool('rabbit')"
            :class="['tool-button', { active: selectedTool === 'rabbit' }]"
          >
            🐰 Rabbit
          </button>
          <button
            @click="selectTool('mushroom')"
            :class="['tool-button', { active: selectedTool === 'mushroom' }]"
          >
            🍄 Mushroom
          </button>
          <button
            @click="selectTool('fox')"
            :class="['tool-button', { active: selectedTool === 'fox' }]"
          >
            🦊 Fox
          </button>
          <button
            @click="selectTool('owl')"
            :class="['tool-button', { active: selectedTool === 'owl' }]"
          >
            🦉 Owl
          </button>
          <button
            @click="selectTool('moon')"
            :class="['tool-button', { active: selectedTool === 'moon' }]"
          >
            🌙 Moon
          </button>
          <button
            @click="selectTool('cloud')"
            :class="['tool-button', { active: selectedTool === 'cloud' }]"
          >
            ☁️ Cloud
          </button>
          <button @click="clearScene" class="secondary">
            🗑️ Clear
          </button>
          <button @click="randomScene" class="contrast">
            🎲 Random Scene
          </button>
        </div>

        <div class="scene-container" @click="handleSceneClick" ref="sceneContainer">
          <!-- Background layer -->
          <pre class="background-layer">{{ backgroundText }}</pre>

          <!-- Interactive elements layer -->
          <div class="elements-layer">
            <div
              v-for="element in elements"
              :key="element.id"
              class="element"
              :style="{ transform: `translate(${element.x}px, ${element.y}px)` }"
              v-html="element.html"
            ></div>
          </div>

          <!-- Cursor preview -->
          <div
            v-if="selectedTool && previewPosition"
            class="preview"
            :style="{ transform: `translate(${previewPosition.x}px, ${previewPosition.y}px)` }"
            v-html="getToolHtml(selectedTool)"
          ></div>
        </div>

        <div class="scene-info">
          <p><small>{{ sceneStats }}</small></p>
        </div>
      </article>

      <footer>
        <p><small>Interactive woodland scene builder • Click to place elements</small></p>
      </footer>
    </div>
  </div>
</template>

<script>
import SubHeader from '../components/SubHeader.vue'

export default {
  name: 'WoodlandScene',
  components: {
    SubHeader
  },
  data() {
    return {
      backgroundText: '',
      elements: [],
      selectedTool: 'tree',
      previewPosition: null,
      nextId: 1,
      width: 80,
      height: 24
    }
  },
  computed: {
    sceneStats() {
      const trees = this.elements.filter(e => e.type === 'tree').length
      const rabbits = this.elements.filter(e => e.type === 'rabbit').length
      const mushrooms = this.elements.filter(e => e.type === 'mushroom').length
      const foxes = this.elements.filter(e => e.type === 'fox').length
      const owls = this.elements.filter(e => e.type === 'owl').length
      const moons = this.elements.filter(e => e.type === 'moon').length
      const clouds = this.elements.filter(e => e.type === 'cloud').length
      return `Scene: ${trees} trees, ${mushrooms} mushrooms, ${rabbits} rabbits, ${foxes} foxes, ${owls} owls, ${moons} moons, ${clouds} clouds`
    }
  },
  mounted() {
    this.generateBackground()

    // Add mouse move listener for preview
    this.$refs.sceneContainer.addEventListener('mousemove', this.handleMouseMove)
    this.$refs.sceneContainer.addEventListener('mouseleave', () => {
      this.previewPosition = null
    })
  },
  beforeUnmount() {
    if (this.$refs.sceneContainer) {
      this.$refs.sceneContainer.removeEventListener('mousemove', this.handleMouseMove)
    }
  },
  methods: {
    selectTool(tool) {
      this.selectedTool = this.selectedTool === tool ? null : tool
    },

    handleMouseMove(event) {
      if (!this.selectedTool) {
        this.previewPosition = null
        return
      }

      const container = this.$refs.sceneContainer
      const rect = container.getBoundingClientRect()

      // Calculate actual padding from computed styles
      const styles = window.getComputedStyle(container)
      const paddingLeft = parseFloat(styles.paddingLeft)
      const paddingTop = parseFloat(styles.paddingTop)

      const x = event.clientX - rect.left - paddingLeft
      const y = event.clientY - rect.top - paddingTop

      this.previewPosition = {
        x: x,
        y: y
      }
    },

    handleSceneClick(event) {
      if (!this.selectedTool) return

      const container = this.$refs.sceneContainer
      const rect = container.getBoundingClientRect()

      // Calculate actual padding from computed styles
      const styles = window.getComputedStyle(container)
      const paddingLeft = parseFloat(styles.paddingLeft)
      const paddingTop = parseFloat(styles.paddingTop)

      const x = event.clientX - rect.left - paddingLeft
      const y = event.clientY - rect.top - paddingTop

      this.addElement(this.selectedTool, x, y)
    },

    addElement(type, x, y) {
      this.elements.push({
        id: this.nextId++,
        type,
        x,
        y,
        html: this.getToolHtml(type)
      })
    },

    removeElement(id) {
      this.elements = this.elements.filter(e => e.id !== id)
    },

    getToolHtml(type) {
      switch (type) {
        case 'tree':
          return `<pre style="margin: 0; padding: 0; font-family: 'Courier New', monospace; font-size: 0.75rem; line-height: 1.2; letter-spacing: 0.1em; white-space: pre;"><span style="color: #27ae60;">    *
   ***
  *****
 *******
*********</span>
<span style="color: #8B4513;">   |||
   |||</span></pre>`

        case 'rabbit':
          return `<pre style="margin: 0; padding: 0; font-family: 'Courier New', monospace; font-size: 0.75rem; line-height: 1.2; letter-spacing: 0.1em; white-space: pre; color: #696969;">  (\\_/)
  (•_•)
  /> <\\</pre>`

        case 'mushroom':
          return `<pre style="margin: 0; padding: 0; font-family: 'Courier New', monospace; font-size: 0.75rem; line-height: 1.2; letter-spacing: 0.1em; white-space: pre;"><span style="color: #e74c3c;"> /_\\</span>
<span style="color: #ecf0f1;">  |</span></pre>`

        case 'fox':
          return `<pre style="margin: 0; padding: 0; font-family: 'Courier New', monospace; font-size: 0.75rem; line-height: 1.2; letter-spacing: 0.1em; white-space: pre; color: #ff6b35;">  /\\_/\\
 ( o.o )
  > ^ <</pre>`

        case 'owl':
          return `<pre style="margin: 0; padding: 0; font-family: 'Courier New', monospace; font-size: 0.75rem; line-height: 1.2; letter-spacing: 0.1em; white-space: pre; color: #8B7355;">  ,___,
  (O,O)
  (   )
  -"-"-</pre>`

        case 'moon':
          return `<pre style="margin: 0; padding: 0; font-family: 'Courier New', monospace; font-size: 0.75rem; line-height: 1.2; letter-spacing: 0.1em; white-space: pre; color: #FFD700;">  ___
 /   \\
(  )  )
 \\___/</pre>`

        case 'cloud':
          return `<pre style="margin: 0; padding: 0; font-family: 'Courier New', monospace; font-size: 0.75rem; line-height: 1.2; letter-spacing: 0.1em; white-space: pre; color: #E8E8E8;">  .-~~~-.
 /       \\
 \\_______/</pre>`

        default:
          return ''
      }
    },

    generateBackground() {
      const grid = this.createEmptyGrid()

      // Sky area with stars/dots
      const skyHeight = Math.floor(this.height * 0.6)
      for (let y = 0; y < skyHeight; y++) {
        for (let x = 0; x < this.width; x++) {
          if (Math.random() < 0.015) {
            grid[y][x] = Math.random() < 0.5 ? '.' : '·'
          }
        }
      }

      // Ground transition
      const groundStart = skyHeight
      for (let x = 0; x < this.width; x++) {
        if (Math.random() < 0.7) {
          grid[groundStart][x] = '_'
        }
      }

      // Ground texture
      const grassChars = [',', '.', "'", '`']
      for (let y = groundStart + 1; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          if (Math.random() < 0.2) {
            grid[y][x] = grassChars[Math.floor(Math.random() * grassChars.length)]
          }
        }
      }

      this.backgroundText = this.gridToText(grid)
    },

    createEmptyGrid() {
      return Array(this.height).fill(null).map(() =>
        Array(this.width).fill(' ')
      )
    },

    gridToText(grid) {
      return grid.map(row => row.join('')).join('\n')
    },

    clearScene() {
      this.elements = []
    },

    randomScene() {
      this.clearScene()

      if (!this.$refs.sceneContainer) return

      const rect = this.$refs.sceneContainer.getBoundingClientRect()
      const maxWidth = rect.width - 100
      const maxHeight = rect.height - 100

      // Add random trees (4-8)
      const numTrees = 4 + Math.floor(Math.random() * 5)
      for (let i = 0; i < numTrees; i++) {
        const x = Math.floor(Math.random() * maxWidth)
        const y = Math.floor(Math.random() * maxHeight)
        this.addElement('tree', x, y)
      }

      // Add random mushrooms (3-6)
      const numMushrooms = 3 + Math.floor(Math.random() * 4)
      for (let i = 0; i < numMushrooms; i++) {
        const x = Math.floor(Math.random() * maxWidth)
        const y = Math.floor(Math.random() * maxHeight)
        this.addElement('mushroom', x, y)
      }

      // Add random rabbits (2-4)
      const numRabbits = 2 + Math.floor(Math.random() * 3)
      for (let i = 0; i < numRabbits; i++) {
        const x = Math.floor(Math.random() * maxWidth)
        const y = Math.floor(Math.random() * maxHeight)
        this.addElement('rabbit', x, y)
      }

      // Add random foxes (1-3)
      const numFoxes = 1 + Math.floor(Math.random() * 3)
      for (let i = 0; i < numFoxes; i++) {
        const x = Math.floor(Math.random() * maxWidth)
        const y = Math.floor(Math.random() * maxHeight)
        this.addElement('fox', x, y)
      }

      // Add random owls (1-2)
      const numOwls = 1 + Math.floor(Math.random() * 2)
      for (let i = 0; i < numOwls; i++) {
        const x = Math.floor(Math.random() * maxWidth)
        const y = Math.floor(Math.random() * maxHeight)
        this.addElement('owl', x, y)
      }

      // Add random moons (0-1)
      const numMoons = Math.floor(Math.random() * 2)
      for (let i = 0; i < numMoons; i++) {
        const x = Math.floor(Math.random() * (maxWidth / 2))
        const y = Math.floor(Math.random() * (maxHeight / 3))
        this.addElement('moon', x, y)
      }

      // Add random clouds (2-4)
      const numClouds = 2 + Math.floor(Math.random() * 3)
      for (let i = 0; i < numClouds; i++) {
        const x = Math.floor(Math.random() * maxWidth)
        const y = Math.floor(Math.random() * (maxHeight / 2))
        this.addElement('cloud', x, y)
      }
    }
  }
}
</script>

<style scoped>
.woodland-container {
  max-width: 1200px;
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

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tool-button {
  min-width: 120px;
  transition: all 0.2s;
}

.tool-button.active {
  background: var(--primary);
  border-color: var(--primary);
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(46, 204, 113, 0.4);
}

.scene-container {
  background: var(--card-background-color);
  border: 2px solid var(--primary);
  border-radius: 8px;
  padding: 2rem;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
  cursor: crosshair;
  user-select: none;
}

.background-layer {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.75rem;
  line-height: 1.2;
  color: rgba(46, 204, 113, 0.3);
  white-space: pre;
  margin: 0;
  letter-spacing: 0.1em;
  pointer-events: none;
}

.elements-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.element {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
}

.element pre {
  border: none;
  background: none;
  padding: 0;
  margin: 0;
}

.preview {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 5;
  opacity: 0.6;
  filter: drop-shadow(0 0 4px rgba(46, 204, 113, 0.3));
  margin: 0;
  padding: 0;
}

.preview pre {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
}

.scene-info {
  text-align: center;
  opacity: 0.7;
}

footer {
  margin-top: 2rem;
  text-align: center;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .background-layer {
    font-size: 0.5rem;
  }

  .element pre,
  .preview pre {
    font-size: 0.5rem !important;
  }

  .scene-container {
    padding: 1rem;
  }

  .controls {
    gap: 0.5rem;
  }

  .tool-button {
    min-width: 90px;
    font-size: 0.9rem;
    padding: 0.5rem;
  }
}
</style>
