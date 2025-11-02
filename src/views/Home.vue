<template>
  <div class="home">
    <section>
      <div class="projects-grid">
        <article
          v-for="project in projects"
          :key="project.id"
          class="project-card"
        >
          <div class="project-thumbnail">{{ project.thumbnail }}</div>
          <h3>{{ project.title }}</h3>
          <p><small>{{ formatDate(project.date) }}</small></p>
          <p>{{ project.description }}</p>

          <router-link :to="project.route" role="button">Launch →</router-link>
        </article>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      projects: [
        {
          id: 'binary-beats',
          title: 'Binary Beats',
          description: 'Create music using binary patterns. Toggle 1s and 0s to build beats across multiple tracks with real-time synthesis.',
          date: '2025-11-02',
          tags: ['music', 'interactive', 'audio', 'web-audio'],
          thumbnail: '🎵',
          route: '/projects/binary-beats'
        },
        {
          id: 'loop-piano',
          title: 'Loop Piano',
          description: 'Play a 16-key piano mapped to your keyboard with white and black keys. Layer loops across 4 tracks to build complex melodies.',
          date: '2025-11-02',
          tags: ['music', 'looper', 'piano', 'web-audio'],
          thumbnail: '🎹',
          route: '/projects/loop-piano'
        }
      ]
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return date.toLocaleDateString('en-US', options)
    }
  }
}
</script>
