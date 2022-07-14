<template id="alert">
    <div>
        <v-alert
            type="error"
            v-model="alert"
        >
            <span v-for="(error, index) in errorMsg"
                :key=index
            >
                {{error}} <br>
            </span>
        </v-alert>
    </div>
</template>

<script>

export default {
    props: {

    },
    data: () => ({
        alert: false,
        errorMsg: [],
    }),
    computed: {

    },
    methods: {

    }
}
</script>

<style scoped>
    .v-alert {
        position: fixed;
        left: 50%;
        bottom: 50px;
        transform: translate(-50%, -50%);
        margin: 0 auto; 
        z-index: 9000 !important;
    }
</style>
