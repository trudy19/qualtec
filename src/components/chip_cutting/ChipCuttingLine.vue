<template>
    <v-container primary fill-height fluid>
        <v-row>
            <v-col cols="12" align="center" justify="center">
                <v-card
                    width="100%"
                    height="100%"
                >
                    <v-card-title primary-title class="justify-center">
                      {{$t('titles.ChipCutting')}} <!--Chip Cutting-->
                    </v-card-title>
                    <ChipCuttingLineCanvas3
                        :canvasWidth="700"
                        :canvasHeight="800"
                        :background_image_view1="chipFrontUrlAdj"
                        :background_image_view2="chipBackUrlAdj"
                        v-bind:overlays="chipInstructionAdjustDropdownAdj"
                        v-bind:overlays_back="chipInstructionAdjustDropdownAdjBack"
                        v-bind:background_image_size="chipFrontSize"
                    />
                    <v-card-actions>
                        <v-spacer></v-spacer>
                            <div
                           style="margin-top: 33px;"
                            
                        >
                            
                        </div>
                        
                        </v-card-actions>
                   <!-- <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            class="mx-2"
                            outlined
                        >
                            {{$t('navigation.nextButton')}} Next
                        </v-btn>
                    </v-card-actions>-->
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ChipCuttingLineCanvas3 from './ChipCuttingLineCanvas3';
    //import ChipCuttingLineToolBar from './ChipCuttingLineToolBar';

    export default {
        mounted() {
            
        },
        components: {
            ChipCuttingLineCanvas3,
            //ChipCuttingLineToolBar,
        },
        computed: {
            chipFrontUrlAdj() {
                return this.$store.state.chipFrontUrlAdj;
            },
            chipBackUrlAdj() {
                return this.$store.state.chipBackUrlAdj;
            },
            chipFrontSize() {
                return this.$store.state.chipFrontSize;
            },
            chipInstructionAdjustDropdownAdj() {
                return this.$store.state.chipInstructionAdjustDropdownAdj;
            },
          chipInstructionAdjustDropdownAdjBack() {
            return this.$store.state.chipInstructionAdjustDropdownAdjBack;
          },
            databaseLocalHost() {
                return this.$store.state.databaseLocalHost;
            },
            toolSwitchFrontImg() {
                return this.$store.state.toolSwitchFrontImg;
            },
            toolSwitchBackImg() {
                return this.$store.state.toolSwitchBackImg;
            },
        },
        data: () => ({
            activeTool: 'select',
            lineWidth: 2,
            overview: '',
            overviewTransparency: 50,
            currentFace: "front",
        }),
        methods: {
            changeActiveTool(tool) {
                this.activeTool = tool
            },
            setLineWidth(value){
                this.lineWidth = parseInt(value)
            },
            setLineDirection(value){
                this.$refs.ChipCuttingLineCanvas.setLineDirection(value)
            },
            deleteShape() {
                this.$refs.ChipCuttingLineCanvas.deleteShape()
            },
            viewHandler(overview){
                this.overview = overview
            },
            setOverviewTransparency(overviewTransparency){
                this.overviewTransparency = parseInt(overviewTransparency)
            },
            toggleFace(face) {
                console.log(this.currentFace);
                this.currentFace = face;
            },
            changeLineSelected(type, direction) {
                this.$refs.ChipCuttingLineToolBar.changeLineSelected(type, direction);
            },
        }
    }
</script>

<style scoped></style>
