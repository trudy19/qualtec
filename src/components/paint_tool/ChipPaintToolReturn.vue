<template>
    <div>
        <v-btn
            depressed
            color="success"
            @click="handleContinue()"
        >
          {{$t('navigation.ReturntoInspectionLineEditor')}} <!--Return to Inspection Line Editor-->
        </v-btn>
        <v-btn
            depressed
            color="success"
            @click="handleReturnCuttingLineEditor()"
        >
          {{$t('navigation.ReturntoCuttingLineEditor')}} <!--Return to Inspection Line Editor-->
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
        this.$router.push('chip_cutting')
      }
        ,handleReturnCuttingLineEditor() {
        this.$router.push('cutting_line_editor')
        }
    }
}
</script>

<style scoped>



</style>