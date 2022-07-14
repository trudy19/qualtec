<template>
    <div>
        <v-btn
            depressed
            color="success"
            @click="handleGoToEditor()"
        >
            Go To Cutting Editor
        </v-btn>
    </div>
</template>

<script>
//import Painterro from 'painterro';

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
        chipFrontUrl() {
            return this.$store.state.chipFrontUrl;
        },
        chipBackUrl() {
            return this.$store.state.chipBackUrl;
        },
    },
    components: {
        
    },
    props: {
        
    },
    methods: {
        handleGoToEditor() {
          this.$router.push('cutting_line_editor');
        }
    }
}
</script>

<style scoped>



</style>