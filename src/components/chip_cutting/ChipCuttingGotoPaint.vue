<template>
    <div>
        <v-btn
            depressed
            color="success"
            @click="handleContinue()"
        >
          {{$t('navigation.GotoPaintEditor')}} <!--Go to Paint Editor-->
        </v-btn>
    </div>
</template>

<script>

export default {
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
       // this.$router.push('paint_tool')
        this.$root.$refs.ChipCuttingFront.GoToPainttool();

      }
    }
}
</script>

<style scoped>



</style>