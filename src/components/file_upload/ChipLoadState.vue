<template>
	<div>
		<v-btn depressed color="success" @click="handleLoad()">
			{{ $t("navigation.load") }}
		</v-btn>

		<v-file-input
			class="mx-10 d-none"
			label="load json file"
			outlined
			id="uploader"
			dense
			@change="fileToJSON"
		></v-file-input>
	</div>
</template>

<script>
export default {
	mounted() {},
	data: () => ({
		fileUpload: [],
		fileUrl: "",
		dialog: false,
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
		},
	},
	components: {},
	props: {
		fileInputPlaceholder: String,
		fileUploadType: String,
	},
	methods: {
		async getSaveState() {
			let returnJson = {};
			await this.axios
				.get(this.databaseLocalHost + "/loadState")
				.then((response) => {
					console.log(response);
					returnJson = response["data"];
				})
				.catch((error) => {
					console.log(error);
				});

			return returnJson;
		},
		async handleLoad() {
			document.getElementById("uploader").click();

			/*let newJson = await this.getSaveState();
        console.log(newJson);*/
			/*
        let newJson = await this.fileToJSON();
        console.log(newJson)

        this.$store.dispatch("changeChipFrontUrlAdj", newJson.chipFrontAdj);
        this.$store.dispatch("changeChipBackUrlAdj", newJson.chipBackUrlAdj);
        this.$store.dispatch("changeChipFrontSize", newJson.chipFrontSize);
        this.$store.dispatch("changeChipInstructionAdjustDropdownAdj", newJson.chipInstructionAdjustDropdownAdj);
        this.$store.dispatch("changeChipFrontUrl", newJson.chipFrontUrl);
        this.$store.dispatch("changeChipBackUrl", newJson.chipBackUrl);
        this.$store.dispatch("changeChipInstructionUrls", newJson.chipInstructionUrls);
        this.$store.dispatch("changeChipInstructionAdjustUrls", newJson.chipInstructionAdjustUrls);
        this.$store.dispatch("changeCutting1SwitchObj", newJson.cutting1SwitchObj);
        this.$store.dispatch("changeCutting2SwitchObj", newJson.cutting2SwitchObj);
        this.$store.dispatch("changeCuttingLineEditor1SwitchObj", newJson.cuttingLineEditor1SwitchObj);
        this.$store.dispatch("changeCuttingLineEditor2SwitchObj", newJson.cuttingLineEditor2SwitchObj);
        this.$store.dispatch("changeTemplate", "A");
        this.$router.push('cutting_line_editor');*/
		},

		async fileToJSON(file) {
			return new Promise((resolve, reject) => {
				let fileReader = new FileReader();
				fileReader.onload = (event) =>
					resolve(JSON.parse(event.target.result));
				fileReader.onerror = (error) => reject(error);
				fileReader.readAsText(file);
			}).then((newJson) => {
				//this.$store.dispatch("changeChipFrontUrlAdj", newJson.chipFrontAdj);
				//this.$store.dispatch("changeChipBackUrlAdj", newJson.chipBackUrlAdj);
				this.$store.dispatch(
					"changeChipFrontSize",
					newJson.chipFrontSize
				);
				this.$store.dispatch(
					"changeChipInstructionAdjustDropdownAdj",
					newJson.chipInstructionAdjustDropdownAdj
				);
				this.$store.dispatch(
					"changeChipFrontUrl",
					newJson.chipFrontUrl
				);
				this.$store.dispatch("changeChipBackUrl", newJson.chipBackUrl);
				this.$store.dispatch(
					"changeChipInstructionUrls",
					newJson.chipInstructionUrls
				);
				this.$store.dispatch(
					"changeChipInstructionAdjustUrls",
					newJson.chipInstructionAdjustUrls
				);
				this.$store.dispatch(
					"changeCutting1SwitchObj",
					newJson.cutting1SwitchObj
				);
				this.$store.dispatch(
					"changeCutting2SwitchObj",
					newJson.cutting2SwitchObj
				);
				this.$store.dispatch(
					"changeCuttingLineEditor1SwitchObj",
					newJson.cuttingLineEditor1SwitchObj
				);
				this.$store.dispatch(
					"changeCuttingLineEditor2SwitchObj",
					newJson.cuttingLineEditor2SwitchObj
				);
				this.$store.dispatch("changeUuid", newJson.uuid);

				this.$store.dispatch("changeTemplate", "A");
				this.$store.dispatch("changeLoadState",true)
				this.$router.push("cutting_line_editor");
			});
		},
	},
};
</script>

<style scoped></style>
