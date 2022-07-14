<template>
    <div>
        <v-btn
            depressed
            color="success"
            @click="dialog = true"
        >
            {{$t('navigation.GotoCuttingLineEditor')}} <!--Go to Cutting Line Editor-->
        </v-btn>
        <v-dialog
            v-model="dialog"
            width="50vh"
            height="100vh"
            @click:outside="handleDialogOff()"
        >
            <v-card>
                <v-card-title class="headline grey lighten-2">
                  {{$t('popup.Generatecuttinglines')}}? <!--Generate cutting lines-->
                </v-card-title>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        text
                        @click="handleGenerateLines()"
                    >
                      {{$t('popup.yes')}} <!--Yes-->
                    </v-btn>
                    <v-btn
                        color="primary"
                        text
                        @click="handleDialogOff()"
                    >
                      {{$t('popup.no')}} <!--No-->
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
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
        handleDialogOff() {
            this.dialog = false;
        },

        handleGenerateLines() {
            this.dialog = false;
            this.$root.$refs.ChipCuttingFront.createJsonFromPoints();
        },
    }
}
</script>

<style scoped>



</style>