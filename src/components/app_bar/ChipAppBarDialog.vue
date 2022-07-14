<template>
    <div>
        <v-btn
            depressed
            color="success"
            @click="handleContinue()"
        >
            <template v-if="currentRoute === 'PaintTool'">
                Switch to Inspection Line Tool
            </template>
            <template v-else-if="currentRoute === 'CuttingLine'">
                Switch to Paint Tool
            </template>
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
            console.log(this.$router.currentRoute.name);
            //this.$router.push('chip_cutting');
            if(this.$router.currentRoute.name === 'PaintTool') {
                console.log(this.$root.$refs.PaintTool);
                this.$root.$refs.PaintTool1.switchCanvasMode();
            }
            if(this.$router.currentRoute.name === 'CuttingLine') {
                this.$root.$refs.ChipCuttingFront.switchCanvasMode();
            }
        },
    }
}
</script>

<style scoped>



</style>