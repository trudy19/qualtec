<template>
    <PaintTool
        :canvasWidth="700"
        :canvasHeight="800"
        :background_image_view1="orderImageFront"
        :background_image_view2="orderImageBack"
        :background_image_view1_flipped="orderImageFrontFlipped"
        :background_image_view2_flipped="orderImageBackFlipped"
        v-bind:overlays="chipInstructionAdjustDropdownAdj"
        v-bind:background_image_size='chipFrontSize'
        :json1='jsonFront'
        :json2='jsonBack'
    />
</template>

<script>
    import PaintTool from './lineEditor';
    import i18n from '@/plugins/i18n';

    export default {
        mounted() {

        },
        components: {
            PaintTool
        },
        computed: {
            jsonFront() {
                return this.$store.state.jsonFront;
            },
            jsonBack() {
                return this.$store.state.jsonBack;
            },
            orderImageFront() {
                return this.$store.state.orderImageFront;
            },
            orderImageBack() {
                return this.$store.state.orderImageBack;
            },
          orderImageFrontFlipped() {
                return this.$store.state.orderImageFrontFlipped;
            },
          orderImageBackFlipped() {
                return this.$store.state.orderImageBackFipped;
            },
            chipInstructionAdjustDropdownAdj() {
                return this.$store.state.chipInstructionAdjustDropdownAdj;
            },
            chipFrontSize() {
                return this.$store.state.chipFrontSize;
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
