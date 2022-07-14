<template>
	<v-container primary fill-height fluid>
		<v-row>
			<v-col cols="12" align="center" justify="center">
				<v-card max-width="100vh" class="main-card">
					<v-card-title primary-title class="justify-center">
						{{ $t("titles.ChipFileUpload") }}
						<!--Chip File Upload-->
					</v-card-title>
					<v-container>
						<ChipFileUpload
							:fileInputPlaceholder="$t('navigation.chipFront')"
							fileUploadType="single"
							@update-file-variable="
								updateFileVariable($event, 'front')
							"
						/>
						<ChipFileUpload
							:fileInputPlaceholder="$t('navigation.chipBack')"
							fileUploadType="single"
							@update-file-variable="
								updateFileVariable($event, 'back')
							"
						/>
						<ChipFileUpload
							:fileInputPlaceholder="
								$t('navigation.chipInstructions')
							"
							fileUploadType="multiple"
							@update-file-variable="
								updateFileVariable($event, 'instructions')
							"
						/>
						<ChipFileUpload
							fileInputPlaceholder="upload json "
							fileUploadType="multiple"
							@update-file-variable="
								updateFileVariable($event, 'jsonFile')
							"
						/>
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
						<v-row align="center" justify="center">
							<v-btn class="primary mx-2" @click="handleProceed">
								{{ $t("navigation.proceed") }}
								<!--Proceed-->
							</v-btn>
							<!--<v-btn class="primary mx-2" @click="handleTest">
								{{ $t("navigation.useExistingImages") }}
								Use Existing Images
							</v-btn> -->
							<ChipLoadState />
						</v-row>
						<v-row>
							<v-img
								:src="newTest"
								lazy-src=""
								max-width="30vh"
								max-height="30vh"
							>
							</v-img>
						</v-row>
					</v-container>
				</v-card>
				<v-dialog v-model="verificationFlag" width="500">
					<v-card>
						<v-card-title class="text-h5 grey lighten-2">
							{{ $t("popup.titleWarnings") }}
						</v-card-title>

						<v-card-text>
							{{ $t("popup.warningUpload") }}
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
								color="primary"
								text
								@click="
									(proceedFlag = false),
										(verificationFlag = false)
								"
							>
								{{ $t("popup.no") }}
							</v-btn>
							<v-btn
								color="primary"
								text
								@click="
									(proceedFlag = true),
										(verificationFlag = false),
										handleProceed()
								"
							>
								{{ $t("popup.yes") }}
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import ChipFileUpload from "./ChipFileUpload";
import ChipLoadState from "./ChipLoadState";
import { uuid } from "vue-uuid";

export default {
	mount() {
		let frontUrl = "testing/chip_compare1.png";
		this.newTest = frontUrl;
	},
	components: {
		ChipFileUpload,
		ChipLoadState,
	},
	data: () => ({
		chipFrontFile: [],
		chipBackFile: [],
		chipInstructionFiles: [],
		jsonFile: [],
		project_name: "chip_project",
		newTest: "",
		errorMsg: [],
		alert: false,
		uuid: uuid.v1(),
		flagFrontside: false,
		flagBackside: false,
		verificationFlag: false,
		proceedFlag: false,
		widthFront: "",
		heightFront: "",
	}),
	computed: {
		databaseLocalHost() {
			return this.$store.state.databaseLocalHost;
		},
		localHostName() {
			return this.$store.state.localHostName;
		},
		chipFrontSize() {
			return this.$store.state.chipFrontSize;
		},
	},
	methods: {
		async fileToJSON(file) {
			console.log(
				"🚀 ~ file: ChipFileUploadScreen.vue ~ line 155 ~ fileToJSON ~ file",
				file[0]
			);
			console.log("dff");
			return new Promise((resolve, reject) => {
				let fileReader = new FileReader();
				fileReader.onload = (event) => resolve(event.target.result);
				fileReader.onerror = (error) => reject(error);
				fileReader.readAsText(file[0]);
			}).then((newJson) => {
				newJson = JSON.parse(newJson);
				console.log(
					"🚀 ~ file: ChipFileUploadScreen.vue ~ line 163 ~ returnnewPromise ~ newJson",
					newJson
				);

				this.$store.dispatch(
					"changeChipFrontSize",
					newJson.chipFrontSize
				);
				console.log(newJson.cutting1SwitchObj);
				if (newJson.cutting1SwitchObj)
					this.$store.dispatch(
						"changeCutting1SwitchObj",
						newJson.cutting1SwitchObj
					);
				if (newJson.cutting2SwitchObj)
					this.$store.dispatch(
						"changeCutting2SwitchObj",
						newJson.cutting2SwitchObj
					);
			});
		},
		updateFileVariable(file, type) {
			console.log(file);
			if (file !== "") {
				switch (type) {
					case "instructions":
						this.chipInstructionFiles = file;
						break;

					case "front": {
						this.chipFrontFile = file;
						if (file !== null) {
							let img = new Image();

							img.src = window.URL.createObjectURL(
								this.chipFrontFile
							);
							img.onload = async () => {
								this.widthFront = img.width;
								this.heightFront = img.height;
							};
						}
						break;
					}

					case "back":
						this.chipBackFile = file;
						break;
					case "jsonFile": {
						this.jsonFile = file;
						file.length !== 0 && this.fileToJSON(file);
						break;
					}

					default:
						break;
				}
			} else if (file === null) {
				switch (type) {
					case "instructions":
						this.chipInstructionFiles = [];
						break;

					case "front":
						this.chipFrontFile = [];
						break;

					case "back":
						this.chipBackFile = [];
						break;

					case "jsonFile":
						this.jsonFile = [];
						this.$store.dispatch("changeCutting1SwitchObj", null);
						this.$store.dispatch("changeCutting2SwitchObj", null);
						break;
					default:
						break;
				}
			}
			console.log(this.chipInstructionFiles);
		},
		//error checking for empty fields
		async checkEmptyFields() {
			//const errorMsg1 = 'オモテ面のファイルがありません\n'+'ウラ面のファイルがありません\n'+ '作業指示書のファイルがありません'
			const frontorbackAtLeast =
				"続行するには、少なくともフロントまたはバックチップファイルを選択する必要があります。";
			const chipInstructionEmpty = "チップ命令は空です。";
			const FileNameEmpty = "ファイル名が空です";
			const FileJson = "file json not correspond to those images ";

			if (
				this.chipFrontFile !== null &&
				this.chipFrontFile?.length !== 0 &&
				this.chipBackFile !== null &&
				this.chipBackFile?.length !== 0 &&
				this.chipInstructionFiles?.length !== 0
			) {
				this.proceedFlag = true;
			}
			if (
				this.chipFrontFile === null ||
				this.chipFrontFile?.length === 0
				//&&(this.chipBackFile === null || this.chipBackFile?.length === 0)
			) {
				this.errorMsg.push(frontorbackAtLeast);
				//this.errorMsg.push("you should choose at least front or back chip file to proceed.");
			}
			/* if( this.chipBackFile === null || this.chipBackFile.length === 0) {
                this.errorMsg.push("Chip back file is empty.");
            }*/
			if (
				this.chipInstructionFiles === null ||
				this.chipInstructionFiles.length === 0
			) {
				//this.errorMsg.push("Chip instructions is empty.");
				this.errorMsg.push(chipInstructionEmpty);
			}
			if (this.project_name.length === 0) {
				this.errorMsg.push(FileNameEmpty);
			}

			let response = await this.checkSizeFile();

			if (response && this.jsonFile.length !== 0)
				this.errorMsg.push(FileJson);

			if (this.errorMsg.length > 0) {
				return true;
			} else {
				return false;
			}
		},
		//main error checking function for this component
		async checkSizeFile() {
			if (
				!(
					this.widthFront <=
						this.chipFrontSize[0] * 0.1 + this.chipFrontSize[0] &&
					this.widthFront >=
						this.chipFrontSize[0] - this.chipFrontSize[0] * 0.1
				)
			) {
				return true;
			} else if (
				!(
					this.heightFront >=
						this.chipFrontSize[1] - this.chipFrontSize[1] * 0.1 &&
					this.heightFront <=
						this.chipFrontSize[1] * 0.1 + this.chipFrontSize[1]
				)
			) {
				{
					return true;
				}
			} else return false;
		},
		async checkError() {
			this.$store.dispatch("changeErrorMsg", []);
			this.errorMsg = [];
			this.alert = false;
			// this.$store.dispatch('changeShowError', false);
			if (await this.checkEmptyFields()) {
				this.$store.dispatch("changeErrorMsg", this.errorMsg);
				// this.$store.dispatch('changeShowError', true);
				this.alert = true;
				console.log(this.errorMsg);
				return true;
			}
			return false;
		},
		//get the list of all premade image paths for testing
		async getTestFilePaths() {
			let payload = {};
			await this.axios
				.get(this.databaseLocalHost + "/returnTestFilePath")
				.then((response) => {
					console.log(response);
					payload = response["data"];
				})
				.catch((error) => {
					console.log(error);
				});
			return payload;
		},
		//this function is for testing purposes only and will skip all prior steps to reach the paint tool faster with
		//   preloaded images.
		async handleTest2() {
			this.$store.dispatch("changeLoading", true);

			let filepaths = await this.getTestFilePaths();

			this.newTest = filepaths["chip_front"];
			console.log(this.newTest);

			this.$store.dispatch("changeLoading", false);
		},
		async handleTest() {
			this.$store.dispatch("changeLoading", true);

			let filepaths = await this.getTestFilePaths();
			console.log(filepaths);
			let newChipInstructionUrls = [
				filepaths["chip_instruction1"],
				filepaths["chip_instruction2"],
				filepaths["chip_instruction3"],
			];

			let chipInstructionSizes = [
				[1300, 905],
				[1300, 905],
				[1300, 905],
			];

			let newDropdown = [
				{
					text: "chip_compare1_overlay.png",
					value: `${process.env.VUE_APP_BACKEND_URL}/static/testing/chip_compare1_overlay.png`,
				},
				{
					text: "chip_compare1_overlay2.png",
					value: `${process.env.VUE_APP_BACKEND_URL}/static/testing/chip_compare1_overlay2.png`,
				},
				{
					text: "chip_compare1_overlay3.png",
					value: `${process.env.VUE_APP_BACKEND_URL}/static/testing/chip_compare1_overlay3.png`,
				},
			];

			let adjDropdown = [
				`${process.env.VUE_APP_BACKEND_URL}/static/testing/chip_compare1_overlay.png`,
				`${process.env.VUE_APP_BACKEND_URL}/static/testing/chip_compare1_overlay2.png`,
				`${process.env.VUE_APP_BACKEND_URL}/static/testing/chip_compare1_overlay3.png`,
			];

			let frontUrl = `${process.env.VUE_APP_BACKEND_URL}/static/testing/chip_compare1.png`;
			let frontSize = [1300, 905];
			let backUrl = `${process.env.VUE_APP_BACKEND_URL}/static/testing/chip_compare2.png`;
			let backSize = [1300, 905];

			this.$store.dispatch("changeChipFrontUrl", filepaths["chip_front"]);
			this.$store.dispatch("changeChipBackUrl", filepaths["chip_back"]);
			this.$store.dispatch("changeChipFrontUrlAdj", frontUrl);
			this.$store.dispatch("changeChipBackUrlAdj", backUrl);
			this.$store.dispatch("changeChipFrontSize", frontSize);
			this.$store.dispatch("changeChipBackSize", backSize);
			this.$store.dispatch("changeToolSwitchFrontImg", frontUrl);
			this.$store.dispatch("changeToolSwitchBackImg", backUrl);
			this.$store.dispatch(
				"changeChipInstructionUrls",
				newChipInstructionUrls
			);
			this.$store.dispatch(
				"changeChipInstructionSizes",
				chipInstructionSizes
			);
			this.$store.dispatch(
				"changeChipInstructionAdjustDropdown",
				newDropdown
			);
			this.$store.dispatch(
				"changeChipInstructionAdjustDropdownAdj",
				adjDropdown
			);
			console.log(newDropdown);
			this.$store.dispatch(
				"changeChipInstructionAdjustUrls",
				newChipInstructionUrls
			);
			this.$store.dispatch("changeLoading", false);
			this.$store.dispatch("changeShowPaintTool", true);
			this.$store.dispatch("changeTemplate", "A");
			this.$store.dispatch("changeUuid", this.uuid);

			this.$router.push("chip_cutting");
		},

		async convertPDFToImageFileSystem(filepath, folder) {
			let payload = {};
			await this.axios
				.post(this.databaseLocalHost + "/PDFToImage", {
					filepath: filepath,
					folder: folder,
				})
				.then((response) => {
					console.log(response);
					payload = response["data"];
				})
				.catch((error) => {
					console.log(error);
				});
			return payload;
		},

		//uploads to the file system and then creates a localhost link to the files
		async uploadAccordinly(file, folder, isSingle) {
			let fileObject = { filepaths: [], filesizes: [] };
			let newFilePath = "";
			let newObject = {};
			let fileInfo = [];
			let fileArray = [];
			let chipSizes = [];
			let chipPaths = [];

			//check to see if file is pdf and if so handle it differently
			let split_string = "";

			if (isSingle) {
				fileArray.push(file);
			} else {
				fileArray = file;
			}

			// handle the loading for the chip instructions
			for (let i = 0; i < fileArray.length; ++i) {
				split_string = fileArray[i].type.split("/");
				console.log(split_string);
				if (split_string[1] === "pdf") {
					console.log("pdf");
					newFilePath = await this.uploadImageToFileSystem(
						fileArray[i],
						folder
					);
					console.log(newFilePath);
					newObject = await this.convertPDFToImageFileSystem(
						newFilePath,
						folder
					);
					console.log(newObject);

					for (let j = 0; j < newObject.length; ++j) {
						newFilePath = newObject[j]["filepath"];
						fileInfo = [
							newObject[j]["width"],
							newObject[j]["height"],
						];

						console.log(fileInfo);
						console.log(newFilePath);

						chipSizes.push(fileInfo);
						chipPaths.push(newFilePath);
					}
				} else {
					console.log("normal");
					newFilePath = await this.uploadImageToFileSystem(
						fileArray[i],
						folder
					);
					fileInfo = await this.getImageData(fileArray[i]);
					fileInfo = fileInfo.fileSize;
					console.log("hello");
					console.log(fileInfo);
					console.log(newFilePath);
					chipSizes.push(fileInfo);
					chipPaths.push(newFilePath);
				}
			}

			fileObject["filepaths"] = chipPaths;
			fileObject["filesizes"] = chipSizes;

			return fileObject;
		},

		//create new localhost link and return that
		createNewFileLink(filepath, folder) {
			let payload = { filename: "", filepath: "" };
			payload["filename"] = filepath.split("/").pop();
			payload["filepath"] =
				this.databaseLocalHost +
				"/static/" +
				folder +
				"/" +
				payload["filename"];
			return payload;
		},

		//returns the new path or dropdown for the links. takes it filepath array
		createLinkToStore(filepaths, folder, single) {
			let returnLoad = {};
			if (!single) {
				let newDropdown = [];
				for (let i = 0; i < filepaths.length; ++i) {
					returnLoad = this.createNewFileLink(filepaths[i], folder);
					newDropdown.push({
						text: returnLoad["filename"],
						value: returnLoad["filepath"],
					});
				}
				return newDropdown;
			} else {
				returnLoad = this.createNewFileLink(filepaths[0], folder);
				return returnLoad["filepath"];
			}
		},

		//the handle proceedure for after clicking proceed
		async handleProceed() {
			console.log("proceed");
			console.log(
				"🚀eedFlag",
				this.verificationFlag,
				this.flagFrontside,
				this.flagBackside,
				this.proceedFlag
			);

			let instructionDropdown = [];

			//if there are errors then don't proceed
			if (await this.checkError()) {
				console.log("I'm in here");
				return;
			} else {
				console.log(
					"🚀 ~ file: ChipFileUploadScreen.vue ~ line 593 ~ handleProceed ~ this.verificationFlag ",
					this.verificationFlag
				);
				console.log(
					"🚀 ~ file: ChipFileUploadScreen.vue ~ line 592 ~ handleProceed ~ this.proceedFlag",
					this.proceedFlag
				);
				if (this.proceedFlag === false) {
					this.verificationFlag = true;
					return;
				}
				this.$store.dispatch("changeLoading", true);

				//handle for chipInstruction
				let tempChipInstructions = await this.uploadAccordinly(
					this.chipInstructionFiles,
					"instructions",
					false
				);

				console.log(tempChipInstructions);

				this.$store.dispatch(
					"changeChipInstructionUrls",
					tempChipInstructions["filepaths"]
				);
				this.$store.dispatch(
					"changeChipInstructionSizes",
					tempChipInstructions["filesizes"]
				);

				//create a dropdown list for the next portions of the app
				console.log(tempChipInstructions["filepaths"]);
				instructionDropdown = this.createLinkToStore(
					tempChipInstructions["filepaths"],
					"instructions",
					false
				);
				console.log("done");
				this.$store.dispatch(
					"changeChipInstructionDropdown",
					instructionDropdown
				);
				console.log(instructionDropdown);

				//handle front Url
				if (
					this.chipFrontFile?.length !== 0 &&
					this.chipFrontFile !== null
				) {
					console.log("front side  image uploaded");
					console.log(this.chipFrontFile);
					var tempChipFront = await this.uploadAccordinly(
						this.chipFrontFile,
						"originals",
						true
					);
                    console.log("🚀 ~ file: ChipFileUploadScreen.vue ~ line 643 ~ handleProceed ~ tempChipFront", tempChipFront)

					this.$store.dispatch(
						"changeChipFrontUrl",
						tempChipFront["filepaths"][0]
					);
					this.$store.dispatch(
						"changeChipFrontSize",
						tempChipFront["filesizes"][0]
					);

					var chip_image_path = this.createLinkToStore(
						tempChipFront["filepaths"],
						"originals",
						true
					);
					this.$store.dispatch(
						"changeChipFrontUrlAdj",
						chip_image_path
					);
					this.$store.dispatch(
						"changeToolSwitchFrontImg",
						chip_image_path
					);
					this.$store.dispatch(
						"changeMapBounds",
						tempChipFront["filesizes"][0]
					);
					this.flagFrontside = true;
				} else {
					console.log("front  image is not  uploaded ");
					this.$store.dispatch(
						"changeChipFrontUrl",
						"EMPTY_IMAGE.jpg"
					);
					// this.$store.dispatch('changeChipFrontUrl', "C:/Users/USER1/Desktop/qualtec_project/qualtec_gui/back_end/static/originals/1.jpg");

					this.$store.dispatch("changeChipFrontSize", [1200, 1120]);
					chip_image_path = `${process.env.VUE_APP_BACKEND_URL}/static/originals/EMPTY_IMAGE.jpg`;

					this.$store.dispatch(
						"changeChipFrontUrlAdj",
						chip_image_path
					);
					this.$store.dispatch(
						"changeToolSwitchFrontImg",
						chip_image_path
					);
					this.flagFrontside = false;
				}
				//handle back Url

				if (
					this.chipBackFile?.length !== 0 &&
					this.chipBackFile !== null
				) {
					console.log("back side  image uploaded");

					console.log(
						"🚀 ~ file: ChipFileUploadScreen.vue ~ line 416 ~ handleProceed ~ this.chipBackFile",
						this.chipBackFile
					);
					var tempChipBack = await this.uploadAccordinly(
						this.chipBackFile,
						"originals",
						true
					);
					console.log(tempChipBack);
					this.$store.dispatch(
						"changeChipBackUrl",
						tempChipBack["filepaths"][0]
					);
					this.$store.dispatch(
						"changeChipBackSize",
						tempChipBack["filesizes"][0]
					);
					chip_image_path = this.createLinkToStore(
						tempChipBack["filepaths"],
						"originals",
						true
					);
					this.$store.dispatch(
						"changeChipBackUrlAdj",
						chip_image_path
					);
					this.$store.dispatch(
						"changeToolSwitchBackImg",
						chip_image_path
					);
					this.$store.dispatch(
						"changeMapBounds",
						tempChipBack["filesizes"][0]
					);
					this.flagBackside = true;
				} else {
					console.log("back side  is not  uploaded");

					this.$store.dispatch(
						"changeChipBackUrl",
						"EMPTY_IMAGE.jpg"
					);
					this.$store.dispatch("changeChipBackSize", [1200, 1120]);

					chip_image_path = `${process.env.VUE_APP_BACKEND_URL}/static/originals/EMPTY_IMAGE.jpg`;
					this.$store.dispatch(
						"changeChipBackUrlAdj",
						chip_image_path
					);
					this.$store.dispatch(
						"changeToolSwitchBackImg",
						chip_image_path
					);
					this.flagBackside = false;
				}
				this.$store.dispatch("changeLoading", false);
				this.$store.dispatch("changeUuid", this.uuid);
				// this.$root.$refs.ChipCroppingScreen.init();
				//commented by abd
				// this.$store.dispatch('changeDialogFileUpload', false);
				// this.$store.dispatch('changeDialogCropping', true);
				console.log("hello");
				// just make some update to flags upload variables
				this.$store.dispatch("changeFlagUploadSide", {
					front: this.flagFrontside,
					back: this.flagBackside,
				});
				this.$router.push("crop");
			}
		},
		//uploads the images into the backend directory
		async uploadImageToFileSystem(file, folder) {
			let newFilename = "";
			let link = this.databaseLocalHost + "/uploadImage";
			var data = new FormData();
			let headers = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};
			data.append("file", file);
			data.append("name", folder);
			console.log(data);

			await this.axios
				.post(link, data, headers)
				.then((response) => {
					console.log(response);
					newFilename = response["data"];
				})
				.catch((error) => {
					console.log(error);
				});

			return newFilename;
		},
		async getImageData(file) {
			let fileUrl = URL.createObjectURL(file);

			const img = new Image();
			img.src = fileUrl;
			await img.decode();

			console.log(img.width + " " + img.height);
			let fileSize = [img.width, img.height];

			let payload = {
				fileUrl: fileUrl,
				fileSize: fileSize,
			};

			return payload;
		},
	},
};
</script>

<style scoped>
.main-card {
	/* align-items: "center"; */
	padding-bottom: 30px;
}
</style>
