<template>
  <div>
    <v-btn
        depressed
        color="success"
        @click="handleContinue()"
    >
      {{$t('navigation.ReturntoChipCutting')}} <!--Return to Chip Cutting-->
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "ChipCuttingReturn",
  mounted() {

  },
  data: () => ({
    dialog: false
  }),
  computed: {
    databaseLocalHost() {
      return this.$store.state.databaseLocalHost;
    },
    localHostName() {
      return this.$store.state.localHostName;
    },
    currentRoute() {
      return this.$route.name;
    }
  },
  components: {

  },
  props: {

  },
  methods: {
    handleContinue() {
    this.$store.dispatch("changeCutting1SwitchObj", {});
		this.$store.dispatch("changeCutting2SwitchObj", {});
    

      this.$router.push('chip_cutting')
    }
  }
}
</script>

<style scoped>

</style>