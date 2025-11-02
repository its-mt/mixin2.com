<template>
  <div class="home">
    <section>
      <h2>[ Projects ]</h2>

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

          <div class="project-tags">
            <span v-for="tag in project.tags" :key="tag" class="tag">#{{ tag }}</span>
          </div>

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
