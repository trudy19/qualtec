<template>
	<v-container primary fill-height fluid>
		<v-row>
			<v-col cols="12" align="center" justify="center">
				<v-card width="100%" height="100%" dark>
					<v-card-title primary-title class="justify-center">
						{{ $t("titles.chipCropping")
						}}<!--Chip Cropping-->
					</v-card-title>
					<cropper
						ref="cropper"
						class="cropper my-6"
						:src="chipInstructionDropdown[currentIndex].value"
						:defaultSize="newImages[currentIndex].cropArea"
						:defaultPosition="newImages[currentIndex].cropArea"
						@change="handleChangeCrop"
						:resizeImage="{ wheel: { ratio: 0.03 } }"
						:autoZoom="true"
					/>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn class="mx-2 primary" @click="handlePrevious">
							{{ $t("navigation.backButton")
							}}<!--Back-->
						</v-btn>
						<v-btn
							v-if="
								currentIndex !== 0 &&
								chipInstructionDropdown.length > 0
							"
							class="mx-2"
							outlined
							@click="handleBack"
						>
							<v-icon>mdi-arrow-left-bold</v-icon>
						</v-btn>
						<v-select
							class="mx-2"
							:items="chipInstructionDropdown"
							item-text="text"
							item-value="text"
							v-model="dropdownDefault"
							:label="$t('navigation.InstructionToSelect')"
							outlined
							@change="handleChangeDropdown"
						></v-select>
						<v-btn
							v-if="
								currentIndex <
								chipInstructionDropdown.length - 1
							"
							class="mx-2"
							outlined
							@click="handleNext"
						>
							<v-icon>mdi-arrow-right-bold</v-icon>
						</v-btn>
						<v-checkbox
							class="mx-2"
							v-model="newImages[currentIndex]['skip']"
							:label="$t('navigation.cropCheckBox')"
							:value="newImages[currentIndex]['skip']"
						></v-checkbox>
						<v-btn class="mx-2 primary" @click="DuplicateImage">
							{{ $t("navigation.duplicateButton") }}
							<!--Duplicate-->
						</v-btn>
						<v-btn class="mx-2 primary" @click="handleContinue">
							{{ $t("navigation.nextButton")
							}}<!--Next-->
						</v-btn>

						<v-row align="center" justify="center">
							<v-alert type="error" v-model="alert">
								<span
									v-for="(error, index) in errorMsg"
									:key="index"
								>
									{{ error }} <br />
								</span>
							</v-alert>
						</v-row>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";

export default {
	created() {
		this.$root.$refs.ChipCroppingScreen = this;
		this.init();
	},
	components: {
		Cropper,
	},
	data: () => ({
		chipInstructionFiles: [],
		newImages: [
			{
				image: "",
				cropArea: { width: 0, height: 0, left: 0, top: 0 },
				same: true,
				skip: false,
			},
		],
		currentIndex: 0,
		errorMsg: [],
		dropdownDefault: "",
		alert: false,
		rotatedDone: false,
	}),
	computed: {
		databaseLocalHost() {
			return this.$store.state.databaseLocalHost;
		},
		chipInstructionDropdown() {
			return this.$store.state.chipInstructionDropdown;
		},
		chipInstructionSizes() {
			return this.$store.state.chipInstructionSizes;
		},
		chipInstructionUrls() {
			return this.$store.state.chipInstructionUrls;
		},
		chipCropArray() {
			return this.$store.state.chipCropArray;
		},
		uuid() {
			return this.$store.state.uuid;
		},
		chipBackUrl() {
			return this.$store.state.chipBackUrl;
		},
		chipFrontUrl() {
			return this.$store.state.chipFrontUrl;
		},
		loading() {
			return this.$store.state.loading;
		},
		flagSideUpload() {
			return this.$store.state.flagSideUpload;
		},
	},
	async mounted() {
		console.log(this.chipInstructionDropdown);
		console.log("urls", this.chipInstructionUrls);
		console.log("chipCropArray", this.chipCropArray);
		//function to rotate the images that will be used in the selection
		//make it here to save time
		this.rotatedBackgroundImage();
		console.log(this.flagSideUpload);
	},
	methods: {
		init() {
			console.log(this.chipInstructionSizes);
			console.log(this.chipInstructionDropdown);
			console.log(this.chipInstructionUrls);
			let tempArr = [];
			let tempCropArea = {};
			if (this.chipCropArray.length > 0) {
				this.newImages = this.chipCropArray;
			} else {
				for (let i = 0; i < this.chipInstructionSizes.length; ++i) {
					tempCropArea = {
						width: this.chipInstructionSizes[i][0],
						height: this.chipInstructionSizes[i][1],
						left: 0,
						top: 0,
					};

					tempArr.push({
						image: this.chipInstructionUrls[i],
						cropArea: tempCropArea,
						same: true,
						skip: false,
					});
					this.chipInstructionDropdown[i].copyIndex = 1;
				}
				this.newImages = tempArr;
			}
			this.dropdownDefault = this.chipInstructionDropdown[0].text;
			console.log(this.newImages[this.currentIndex]["cropArea"]);
			console.log(this.dropdownDefault);
			console.log(this.newImages);
			console.log(this.chipInstructionDropdown);
		},
		handleChangeCrop({ coordinates, canvas }) {
			console.log(coordinates);
			this.newImages[this.currentIndex].image = canvas.toDataURL();
			this.newImages[this.currentIndex].same = false;
			this.newImages[this.currentIndex].cropArea = coordinates;
		},
		handleMouseWheel(e) {
			e.preventDefault();
			this.$refs.cropper.zoom(0.01 * e.deltaY);
		},
		async rotatedBackgroundImage() {
			if (this.chipBackUrl !== "") {
				var filename_back = this.chipBackUrl.replace(/^.*[\\/]/, "");
				var chip_image_path_back =
					this.databaseLocalHost +
					"/static/originals/" +
					filename_back;
			}

			if (this.chipFrontUrl !== "") {
				var filename_front = this.chipFrontUrl.replace(/^.*[\\/]/, "");
				var chip_image_path_front =
					this.databaseLocalHost +
					"/static/originals/" +
					filename_front;
			}
			for (let i = 0; i < 5; i++) {
				let passJson = {
					urlImage: chip_image_path_front,
					rotationDegree: -90 * i,
					face: "front",
				};
				await this.axios.post(
					this.databaseLocalHost + "/RotateImage",
					passJson
				);
			}

			for (let i = 0; i < 5; i++) {
				let passJson = {
					urlImage: chip_image_path_back,
					rotationDegree: -90 * i,
					face: "back",
				};
				await this.axios.post(
					this.databaseLocalHost + "/RotateImage",
					passJson
				);
			}
			this.rotatedDone = true;
			if (this.loading === true) {
				this.$store.dispatch("changeLoading", false);
				this.$router.push("point_selection").catch(() => {});
			}
		},
		async uploadImageToFileSystem(image, same, filename) {
			let data = { image: image, same: same, filename: filename };
			let newFilename = "";
			console.log(data);
			await this.axios
				.post(this.databaseLocalHost + "/croppedImageUpload", data)
				.then((response) => {
					console.log(response);
					newFilename = response["data"];
				})
				.catch((error) => {
					console.log(error);
				});

			return newFilename;
		},
		addImageProcess(src) {
			return new Promise((resolve, reject) => {
				let img = new Image();
				img.onload = () => resolve(img);
				img.onerror = reject;
				img.src = src;
			});
		},
		handlePrevious() {
			/*
            this.$store.dispatch();
*/
			this.$router.push("file_upload");
		},
		async handleContinue() {
			let newFilename = "";
			let textFilename = "";
			let newDropdown = [];
			let newSizeList = [];
			let newInstructionUrls = [];
			let newUrlsList = [];
			console.log(this.newImages);
			this.$store.dispatch("changeLoading", true);
			for (let i = 0; i < this.newImages.length; ++i) {
				if (this.newImages[i]["skip"]) {
					console.log(this.newImages[i]);
					console.log(this.chipInstructionDropdown);
					console.log(this.chipInstructionDropdown[i]);
					console.log(i);
					newFilename = await this.uploadImageToFileSystem(
						this.newImages[i].image,
						this.newImages[i].same,
						this.uuid + this.chipInstructionDropdown[i].text
					);
					console.log(newFilename);
					textFilename = newFilename.split("/").pop();
					console.log(textFilename);
					newDropdown.push({
						value:
							this.databaseLocalHost +
							"/static/image_cropped/" +
							textFilename,
						text: textFilename,
					});
					newInstructionUrls.push(newFilename);
					newUrlsList.push(newFilename);
					if (!this.newImages[i].same) {
						await this.addImageProcess(
							this.newImages[i].image
						).then((result) => {
							//console.log(result);
							newSizeList.push([result.width, result.height]);
						});
					} else {
						newSizeList.push(this.chipInstructionSizes[i]);
					}
				}
			}
			console.log(newDropdown);
			console.log(newSizeList);
			this.$store.dispatch("changeNewChipInstructionUrls", newUrlsList);
			this.$store.dispatch("changeNewChipInstructionSizes", newSizeList);
			console.log(this.chipInstructionSizes);
			this.$store.dispatch(
				"changeNewChipInstructionDropdown",
				newDropdown
			);
			this.$store.dispatch("changeChipCropArray", this.newImages);
			if (this.rotatedDone === true) {
				this.$store.dispatch("changeLoading", false);
				this.$router.push("point_selection").catch(() => {});
			}
		},
		handleChangeDropdown(event) {
			console.log(event);
			this.dropdownDefault = event;
			for (let i = 0; i < this.chipInstructionDropdown.length; ++i) {
				if (this.chipInstructionDropdown[i].text === event) {
					this.currentIndex = i;
				}
			}
			this.$refs.cropper.setCoordinates(
				this.newImages[this.currentIndex]["cropArea"]
			);
		},
		//clicking the next arrow
		handleNext() {
			this.currentIndex = this.currentIndex + 1;
			this.dropdownDefault =
				this.chipInstructionDropdown[this.currentIndex];
			this.$refs.cropper.setCoordinates(
				this.newImages[this.currentIndex]["cropArea"]
			);
		},
		handleBack() {
			this.currentIndex = this.currentIndex - 1;
			this.dropdownDefault =
				this.chipInstructionDropdown[this.currentIndex];
			this.$refs.cropper.setCoordinates(
				this.newImages[this.currentIndex]["cropArea"]
			);
		},
		DuplicateImage() {
			this.chipInstructionDropdown[this.currentIndex].copyIndex++;
			var tmp = {};
			Object.assign(tmp, this.chipInstructionDropdown[this.currentIndex]);

			tmp.text = "copy_" + tmp.copyIndex + tmp.text;
			let tmp1 = {};
			Object.assign(tmp1, this.newImages[this.currentIndex]);

			this.newImages.splice(this.currentIndex + 1, 0, tmp1);
			this.chipInstructionDropdown.splice(this.currentIndex + 1, 0, tmp);
			//  console.log("🚀 ~ file: ChipCropScreen.vue ~ line 269 ~ DuplicateImage ~  this.chipInstructionDropdown",  this.chipInstructionDropdown)
			this.chipInstructionUrls.splice(
				this.currentIndex + 1,
				0,
				this.chipInstructionUrls[this.currentIndex]
			);
			this.chipInstructionSizes.splice(
				this.currentIndex + 1,
				0,
				this.chipInstructionSizes[this.currentIndex]
			);
		},
	},
};
</script>

<style scoped>
.main-card {
	align-items: "center";
	padding-bottom: 30px;
}
.cropper {
	max-width: 100vh;
	max-height: 100vh;
}
</style>
