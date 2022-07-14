<template>
    <div>
      <v-btn depressed
             color="success"
             v-for="entry in languages" :key="entry.title" @click="changeLocale(entry.language)">
        <!--<flag :iso="entry.flag" v-bind:squared=false />--> {{entry.title}}
      </v-btn>
    </div>
</template>

<script>
import i18n from '@/plugins/i18n';
export default {

  mounted() {

  },
  data: () => ({
    dialog: false,
    languages: [
      {flag: 'jp', language: 'ja', title: 'Japanese'},
      {flag: 'us', language: 'en', title: 'English'}
    ]
  }),
  components: {},
  props: {},
  methods: {
    changeLocale(locale) {
      i18n.locale = locale;
    }
  }
}
</script>

<style scoped>



</style>