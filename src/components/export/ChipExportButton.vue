<template>
	<div>
		<v-btn depressed color="success" @click="dialog = true">
			Export Chips
		</v-btn>
		<v-dialog
			v-model="dialog"
			width="50vh"
			height="120vh"
			@click:outside="handleExportDialogOff()"
		>
			<v-card>
				<v-card-title class="headline grey lighten-2">
					Chooser a template to export as:
				</v-card-title>
				<v-divider></v-divider>
				<v-container>
					<v-radio-group v-model="templateSelection" mandatory>
						<v-row>
							<v-radio value="A">
								<template v-slot:label>
									<v-img
										:src="
											require('../../assets/chip_template_a.png')
										"
										lazy-src=""
										max-width="15vh"
										max-height="10vh"
									>
									</v-img>
								</template>
							</v-radio>
						</v-row>
					</v-radio-group>
				</v-container>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" text @click="handleExport()">
						Export
					</v-btn>
					<v-btn
						color="primary"
						text
						@click="handleExportDialogOff()"
					>
						Cancel
					</v-btn>
				</v-card-actions>
				<v-row align="center" justify="center">
					<v-alert type="error" v-model="alert">
						<span v-for="(error, index) in errorMsg" :key="index">
							{{ error }} <br />
						</span>
					</v-alert>
				</v-row>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
//import Painterro from 'painterro';

export default {
	mounted() {},
	data: () => ({
		dialog: false,
		templateSelection: "",
		painterro: null,
		alert: false,
		errorMsg: [],
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
		template() {
			return this.$store.state.template;
		},
		chipFrontNewImageData() {
			return this.$store.state.chipFrontNewImageData;
		},
		chipBackNewImageData() {
			return this.$store.state.chipBackNewImageData;
		},
	},
	components: {},
	props: {},
	methods: {
		getImage() {
			var filename_front = this.chipFrontUrl.replace(/^.*[\\/]/, "");
			let chip_image_path =
				this.localHostName + "/chip_images/originals/" + filename_front;
			return chip_image_path;
		},
		handleExportDialogOff() {
			this.dialog = false;
		},
		async downloadImage(image_info, filename) {
			//await this.downloadImage(this.activeMarker.picture);
			console.log(image_info);
			console.log(filename);

			var fileURL = window.URL.createObjectURL(image_info);
			var fileLink = document.createElement("a");

			fileLink.href = fileURL;
			fileLink.setAttribute("download", filename);
			document.body.appendChild(fileLink);

			fileLink.click();
			this.$store.dispatch("changeLoading", false);
		},

		async uploadImageToFileSystem(image, filename) {
			let data = { image: image, filename: filename };
			let newFilename = "";
			console.log(data);
			await this.axios
				.post(this.databaseLocalHost + "/paintImageUpload", data)
				.then((response) => {
					console.log(response);
					newFilename = response["data"];
				})
				.catch((error) => {
					console.log(error);
				});

			return newFilename;
		},

		async handleExport() {
			this.$root.$refs.lineEditor.rasterize();
			this.$store.dispatch("changeTemplate", this.templateSelection);
			this.$store.dispatch("changeLoading", true);
			let chipFront = this.chipFrontUrl;
			console.log(
				"🚀 ~ file: ChipExportButton.vue ~ line 163 ~ handleExport ~ chipFrontUrl",
				this.chipFrontUrl
			);
			let chipBack = this.chipBackUrl;
			console.log(this.chipFrontNewImageData);
			console.log(this.chipBackNewImageData);
			if (this.chipFrontNewImageData !== "") {
				console.log("Front");
				chipFront = await this.uploadImageToFileSystem(
					this.chipFrontNewImageData,
					"chip_front.png"
				);
				console.log(
					"🚀 ~ file: ChipExportButton.vue ~ line 170 ~ handleExport ~ chipFront",
					chipFront
				);
				console.log(chipFront);
				this.$store.dispatch("changeChipFrontPaintImageUrl", chipFront);
			}
			if (this.chipBackNewImageData !== "") {
				console.log("Back");
				chipBack = await this.uploadImageToFileSystem(
					this.chipBackNewImageData,
					"chip_back.png"
				);
				console.log(
					"🚀 ~ file: ChipExportButton.vue ~ line 177 ~ handleExport ~ chipBack",
					chipBack
				);
				console.log(chipBack);
				this.$store.dispatch("changeChipBackPaintImageUrl", chipBack);
			}

			let payload = {
				template: this.templateSelection,
				front_url: chipFront,
				back_url: chipBack,
			};
			let filepath = "";
			let fileSize = [0, 0];
			console.log(
				"🚀 ~ file: ChipExportButton.vue ~ line 188 ~ handleExport ~ fileSize",
				payload
			);

			await this.axios
				.post(this.databaseLocalHost + "/createExport", payload)
				.then((response) => {
					console.log(response);
					filepath = response["data"]["filepath"];
					fileSize = response["data"]["filesize"];
				})
				.catch((error) => {
					console.log(error);
				});
			this.$store.dispatch("changeLoading", false);

			var filename = filepath.replace(/^.*[\\/]/, "");
			//let image_path =  this.localHostName + "/chip_images/exported/" + filename;
			let image_path =
				this.databaseLocalHost + "/static/export/" + filename;
			console.log(image_path);

			payload = {
				image: image_path,
				image_size: fileSize,
			};
			this.$store.dispatch("changeShowFinalEdit", true);
			this.$emit("show-painterro", payload);
			this.dialog = false;
		},
	},
};
</script>

<style scoped></style>
