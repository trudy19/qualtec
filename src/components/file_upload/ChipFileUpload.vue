<template>
    <v-row align="center" justify="center">
        <v-file-input
            v-if="fileUploadType === 'multiple'"
            class="mx-10"
            :label="fileInputPlaceholder"
            outlined
            multiple
            chips
            dense
            v-model="fileUpload"
            @change="handleFileChange"
        ></v-file-input>
        <v-file-input
            v-else
            class="mx-10"
            :label="fileInputPlaceholder"
            outlined
            dense
            v-model="fileUpload"
            @change="handleFileChange"
        ></v-file-input>
        <v-img
            v-if="fileUrl && fileUploadType !== 'multiple'"
            class="ma-5"
            :src="fileUrl"
            lazy-src=""
            max-width="20vh"
            max-height="20vh"
        >
            <template v-slot:placeholder>
                <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                >
                <v-progress-circular
                    :size="70"
                    :width="7"
                    color="purple"
                    indeterminate
                >
                </v-progress-circular>
                </v-row>
            </template>
        </v-img>
    </v-row>
</template>

<script>
  export default {

    data: () => ({
        fileUpload: []
        ,fileUrl: ""
    }),
    props: {
        fileInputPlaceholder: String
        ,fileUploadType: String
    },
    methods: {
        async handleFileChange(file) {
            console.log(file);

            if(file !== null && file !== "") {
                if(this.fileUploadType !== "multiple") {
                    this.fileUrl = URL.createObjectURL(file);
                }
                this.$emit("update-file-variable", file);

            }
            else {
                this.$emit("update-file-variable", null);
                this.fileUrl = "";
            }
        },
    }
  }
</script>

<style scoped>

</style>
