<template>
    <PaintTool
        :canvasWidth="2200"
        :canvasHeight="800"
        :background_image_view1="templateImage"
        :background_image_view2="chipBackUrlAdj"
        v-bind:overlays="chipInstructionAdjustDropdownAdj"
        v-bind:overlays_back="chipInstructionAdjustDropdownAdjBack"
        v-bind:background_image_size="chipFrontSize"
    />
</template>

<script>
    import PaintTool from './PaintTool';
    import i18n from '@/plugins/i18n';

    export default {
        mounted() {

        },
        components: {
            PaintTool
        },
        computed: {
            chipFrontUrlAdj() {
                return this.$store.state.chipFrontUrlAdj;
            },
            chipBackUrlAdj() {
                return this.$store.state.chipBackUrlAdj;
            },
            chipInstructionSize() {
                return this.$store.state.chipInstructionSize;
            },
            chipInstructionAdjustDropdown() {
                return this.$store.state.chipInstructionAdjustDropdown;
            },
            chipInstructionAdjustDropdownAdj() {
                return this.$store.state.chipInstructionAdjustDropdownAdj;
            },
            chipInstructionAdjustDropdownAdjBack() {
                return this.$store.state.chipInstructionAdjustDropdownAdjBack;
            },
            chipFrontSize() {
                return this.$store.state.chipFrontSize;
            },
            toolSwitchFrontImg() {
                return this.$store.state.toolSwitchFrontImg;
            },
            toolSwitchBackImg() {
                return this.$store.state.toolSwitchBackImg;
            },
            templateImage() {
                return this.$store.state.templateImage;
            },
 
        },
        data: () => ({
            languages: [
                { flag: 'us', language: 'en', title: 'English' },
                { flag: 'jp', language: 'ja', title: 'Japanese' }
            ]
        }),
        methods: {
            changeLocale(locale) {
                i18n.locale = locale;
            }
        }
    }
</script>

<style scoped>

</style>
