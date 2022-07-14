<template>
	<v-container primary fill-height fluid>
		<v-row>
			<v-col cols="12" align="center" justify="center">
				<v-card width="100%" height="100%">
					<v-card-title class="headline grey lighten-2">
						{{ $t("titles.choosePointsForEachTemplate") }}
						<!--Choose points for each template-->
					</v-card-title>
					<v-divider></v-divider>
					<v-row>
						<v-col sm="6" id="imgId">
							<ChipPointSelectionMap
								class="ma-3"
								:markers="markers[currentIndex]"
								:url="mapImage"
								:angleImage="angleImage"
								:bounds="mapBoundsList[currentIndex][face]"
								@update-marker="
									updateMarker($event, 'original')
								"
								:zoomRange="zoomRangeLeft"
							/>
						</v-col>
						<v-col sm="6">
							<ChipPointSelectionMap
								class="ma-3"
								:markers="instructionMarkers[currentIndex]"
								:url="overlayMapImage"
								:bounds="instructionMapBounds"
								@update-marker="
									updateMarker($event, 'instruction')
								"
								:zoomRange="zoomRangeRight"
							/>
						</v-col>
					</v-row>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							class="mx-2"
							color="primary"
							text
							@click="handleRotation"
						>
							{{ $t("navigation.rotateButton") }}
						</v-btn>
						<v-btn
							class="mx-2"
							color="primary"
							text
							@click="handlePrevious"
						>
							{{ $t("navigation.previousButton") }}
							<!--Previous-->
						</v-btn>
						<v-select
							class="mx-2"
							:items="mapSelectionDropdown"
							item-text="text"
							item-value="value"
							v-model="mapSelectionDefault"
							:label="$t('navigation.faceToSelect')"
							outlined
							@change="handleChangeMapDropdown"
						></v-select>
						<v-btn
							v-if="
								currentIndex !== 0 &&
								newChipInstructionDropdown.length > 0
							"
							class="mx-2"
							outlined
							@click="handleBack"
						>
							<v-icon>mdi-arrow-left-bold</v-icon>
						</v-btn>
						<v-select
							class="mx-2"
							:items="newChipInstructionDropdown"
							item-text="text"
							item-value="value"
							v-model="dropdownDefault"
							:label="$t('navigation.InstructionToSelect')"
							outlined
							@change="handleChangeDropdown"
						></v-select>
						<v-btn
							v-if="
								currentIndex <
								newChipInstructionDropdown.length - 1
							"
							class="mx-2"
							outlined
							@click="handleNext"
						>
							<v-icon>mdi-arrow-right-bold</v-icon>
						</v-btn>
						<v-btn
							class="mx-2"
							color="primary"
							text
							@click="handleContinue"
						>
							{{ $t("navigation.finishButton") }}
							<!--Finish-->
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
import ChipPointSelectionMap from "./ChipPointSelectionMap";

export default {
	async created() {
		this.$root.$refs.PointSelection = this;
		console.log("hello there");
		/*  if(this.flagSideUpload.back===true && this.flagSideUpload.front===true){
        console.log(this.flagSideUpload.back===true && this.flagSideUpload.front===true)
        this.dict={ front: 0, back: 1 }
      }
      else if (this.flagSideUpload.back===true && this.flagSideUpload.front===false){
        return { back: 0 }
      }
      else if (this.flagSideUpload.back===false && this.flagSideUpload.front===true){
        return { front: 0 }
      }*/
		this.zoomRangeLeft = this.verifySize(
			this.chipFrontSize[0],
			this.chipFrontSize[1]
		);
		console.log(
			"🚀 ~ file: ChipPointSelectionScreen.vue ~ line 144 ~ created ~ this.zoomRangeLeft",
			this.zoomRangeLeft
		);
		this.zoomRangeRight = this.verifySize(
			this.newChipInstructionSizes[0][0],
			this.newChipInstructionSizes[0][1]
		);
		console.log(
			"🚀 ~ file: ChipPointSele333cti45onScreen.vue ~ line 145 ~ created ~ this.zoomRangeRight",
			this.zoomRangeRight
		);

		console.log(this.flagSideUpload);
		this.init();
	},
	mounted() {
		if (this.flagSideUpload.front) {
			this.dict = { front: 0, back: 1 };
		} else if (this.flagSideUpload.back) {
			this.dict = { back: 0 };
		} else if (this.flagSideUpload.front) {
			this.dict = { front: 0 };
		}
	},
	data: () => ({
		markers: [[]],
		frontMarkers: [[]],
		backMarkers: [[]],
		instructionMarkers: [[]],
		indexBackFront: [],
		adjCropImageFront: [],
		adjCropImageBack: [],
		prevMarkerCoord: [],
		testImage: "",
		labels: 1,
		chip_instruction_url: "",
		chip_instruction_index: 0,
		currentPoint: [],
		overlayMapImage: "",
		instructionMapBounds: [0, 0],
		currentIndex: 0,
		dropdownDefault: 0,
		alert: false,
		errorMsg: [],
		mapSelectionDefault: "",
		mapSelectionDropdown: [],
		mapImage: "",
		angleImage: 0,
		face: "front",
		faceMapping: {},
		rotationValue: 0,
		RotationList: [],
		dict: { front: 0, back: 1 },
		mapBoundsList: [],
		zoomRangeLeft: 0,
		zoomRangeRight: 0,
	}),
	watch: {
		currentIndex: function () {
			console.log("I've changed.");
			this.overlayMapImage =
				this.newChipInstructionDropdown[this.currentIndex].value;
		},
	},
	computed: {
		databaseLocalHost() {
			return this.$store.state.databaseLocalHost;
		},
		dialogPointSelection() {
			return this.$store.state.dialogPointSelection;
		},
		chipFrontUrl() {
			return this.$store.state.chipFrontUrl;
		},
		chipFrontSize() {
			return this.$store.state.chipFrontSize;
		},
		chipBackSize() {
			return this.$store.state.chipBackSize;
		},
		chipBackUrl() {
			return this.$store.state.chipBackUrl;
		},
		mapBounds() {
			return this.$store.state.mapBounds;
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
		newChipInstructionUrls() {
			return this.$store.state.newChipInstructionUrls;
		},
		newChipInstructionSizes() {
			return this.$store.state.newChipInstructionSizes;
		},
		newChipInstructionDropdown() {
			return this.$store.state.newChipInstructionDropdown;
		},
		flagSideUpload() {
			return this.$store.state.flagSideUpload;
		},
	},
	components: {
		ChipPointSelectionMap,
	},
	props: {},
	methods: {
		async init() {
			this.$store.dispatch("changeLoading", true);

			let mapDropdown = [];

			this.dropdownDefault = this.newChipInstructionDropdown[0].value;
			this.instructionMapBounds = [
				this.newChipInstructionSizes[0][1],
				this.newChipInstructionSizes[0][0],
			];
			this.overlayMapImage = this.newChipInstructionDropdown[0].value;
			this.markers = [];
			this.backMarkers = [];
			this.frontMarkers = [];
			this.instructionMarkers = [];

			if (
				this.flagSideUpload.front === true &&
				this.chipFrontUrl !== ""
			) {
				console.log("hello");
				var filename_front = this.chipFrontUrl.replace(/^.*[\\/]/, "");
				var chip_image_path_front =
					this.databaseLocalHost +
					"/static/originals/" +
					filename_front;
				mapDropdown.push({
					text: "Front",
					value: chip_image_path_front,
				});
				/// this.mapSelectionDefault = chip_image_path_front;
				this.faceMapping[chip_image_path_front] = "front";
				this.face = "front";
			} /*else {
        mapDropdown.push({ text: "Front", value: "" });
        this.face = "front";
        this.mapSelectionDefault = "";
      }*/
			///this.mapImage = this.mapSelectionDefault;

			if (this.flagSideUpload.back === true && this.chipBackUrl !== "") {
				var filename_back = this.chipBackUrl.replace(/^.*[\\/]/, "");
				var chip_image_path_back =
					this.databaseLocalHost +
					"/static/originals/" +
					filename_back;
				mapDropdown.push({ text: "Back", value: chip_image_path_back });
				this.faceMapping[chip_image_path_back] = "back";
				// this.face = "back";
			} /*else {
       // mapDropdown.push({ text: "Back", value: "" });
        //this.face = "back";
      }*/

			if (
				this.flagSideUpload.back === true &&
				this.flagSideUpload.front === true
			) {
				console.log("level1");
				this.mapSelectionDefault = chip_image_path_front;

				this.face = "front";
				// this.mapSelectionDefault = "front";
			} else if (
				this.flagSideUpload.back === true &&
				this.flagSideUpload.front === false
			) {
				console.log("level2");

				this.face = "back";
				this.mapSelectionDefault = chip_image_path_back;

				/// this.mapSelectionDefault = "back";
			} else if (
				this.flagSideUpload.back === false &&
				this.flagSideUpload.front === true
			) {
				console.log("level3");
				this.face = "front";
				this.mapSelectionDefault = chip_image_path_front;

				// this.mapSelectionDefault = "front";
			}
			this.mapImage = this.mapSelectionDefault;

			this.mapSelectionDropdown = mapDropdown;
			for (let i = 0; i < this.newChipInstructionDropdown.length; ++i) {
				this.markers.push([]);
				this.backMarkers.push([]);
				this.frontMarkers.push([]);
				this.indexBackFront.push("empty");
				this.RotationList.push({
					dropdown: JSON.parse(JSON.stringify(mapDropdown)),
					angleBack: 0,
					angleFront: 0,
				});
				this.mapBoundsList.push({
					front: this.mapBounds,
					back: this.mapBounds,
				});
				this.instructionMarkers.push([
					{ label: 1, lat: 0, lng: 0 },
					{
						label: 2,
						lat: 0,
						lng: this.newChipInstructionSizes[i][0],
					},
					{
						label: 3,
						lat: this.newChipInstructionSizes[i][1],
						lng: this.newChipInstructionSizes[i][0],
					},
					{
						label: 4,
						lat: this.newChipInstructionSizes[i][1],
						lng: 0,
					},
				]);
			}

			this.mapSelectionDropdown =
				this.RotationList[this.currentIndex].dropdown;
			this.$store.dispatch("changeLoading", false);
		},
		//make copy of array of object without reference
		verifySize(width, height) {
			if (width > 4000 || height > 4000) {
				return -4;
			}

			if (
				(width > 2000 && width < 5000) ||
				(height > 2300 && height < 5000)
			) {
				return -3;
			}
			if (
				(width > 1000 && width < 2000) ||
				(height > 2300 && height < 3000)
			) {
				return -2;
			} else if (height > 1000 && height < 2000) {
				return -2;
			} else return -1;
		},
		handleNext() {
			this.currentIndex = this.currentIndex + 1;
			this.dropdownDefault =
				this.newChipInstructionDropdown[this.currentIndex];
			this.chip_instruction_index = this.currentIndex;
			this.chip_instruction_url =
				this.newChipInstructionDropdown[this.currentIndex];
			this.instructionMapBounds = [
				this.newChipInstructionSizes[this.currentIndex][1],
				this.newChipInstructionSizes[this.currentIndex][0],
			];
			this.overlayMapImage =
				this.newChipInstructionDropdown[this.currentIndex].text;
			this.mapSelectionDropdown =
				this.RotationList[this.currentIndex].dropdown;

			if (this.indexBackFront[this.currentIndex] !== "empty") {
				// this.mapSelectionDefault=this.getKeyByValue(this.faceMapping,this.indexBackFront[this.currentIndex])
				this.mapImage =
					this.mapSelectionDropdown[
						this.dict[this.indexBackFront[this.currentIndex]]
					].value;
				this.mapSelectionDefault =
					this.RotationList[this.currentIndex].dropdown[
						this.dict[this.indexBackFront[this.currentIndex]]
					]?.value;
			} else {
				this.mapImage =
					this.mapSelectionDropdown[this.dict[this.face]].value;
				//	this.markers[this.currentIndex]=this.markers[this.currentIndex-1]
			}
		},
		handleBack() {
			this.currentIndex = this.currentIndex - 1;
			console.log(this.indexBackFront[this.currentIndex]);

			this.dropdownDefault =
				this.newChipInstructionDropdown[this.currentIndex];
			this.chip_instruction_index = this.currentIndex;
			this.chip_instruction_url =
				this.newChipInstructionDropdown[this.currentIndex];
			this.instructionMapBounds = [
				this.newChipInstructionSizes[this.currentIndex][1],
				this.newChipInstructionSizes[this.currentIndex][0],
			];
			this.overlayMapImage =
				this.newChipInstructionDropdown[this.currentIndex].text;
			this.mapSelectionDropdown =
				this.RotationList[this.currentIndex].dropdown;

			if (this.indexBackFront[this.currentIndex] !== "empty") {
				this.mapImage =
					this.mapSelectionDropdown[
						this.dict[this.indexBackFront[this.currentIndex]]
					].value;
				this.mapSelectionDefault =
					this.RotationList[this.currentIndex].dropdown[
						this.dict[this.indexBackFront[this.currentIndex]]
					]?.value;
			} else
				this.mapImage =
					this.mapSelectionDropdown[this.dict[this.face]].value;
		},

		async handleRotation() {
			let oldvalue = this.mapImage;
			let url;
			console.log(this.face);
			if (this.face === "front") {
				this.RotationList[this.currentIndex].angleFront <= -360
					? (this.RotationList[this.currentIndex].angleFront += 270)
					: (this.RotationList[this.currentIndex].angleFront -= 90);
				url =
					`${process.env.VUE_APP_BACKEND_URL}/static/rotation/rotatedFront_` +
					this.RotationList[this.currentIndex].angleFront +
					".jpg";
				//let face=this.face ;
			} else {
				this.RotationList[this.currentIndex].angleBack <= -360
					? (this.RotationList[this.currentIndex].angleBack += 270)
					: (this.RotationList[this.currentIndex].angleBack -= 90);
				url =
					`${process.env.VUE_APP_BACKEND_URL}/static/rotation/rotatedBack` +
					this.RotationList[this.currentIndex].angleBack +
					".jpg";
			}
			this.mapImage = url;
			let width;
			let height;
			let arrTmp;
			width = this.mapBoundsList[this.currentIndex][this.face][0];
			height = this.mapBoundsList[this.currentIndex][this.face][1];
			arrTmp = [height, width];

			console.log(
				"🚀 ~ file: ChipPoinftSelectionScreen.vue ~ line 483 ~ handleRotation ~ this.mapBoundsList",
				this.mapBoundsList
			);
			this.faceMapping[url] = this.faceMapping[oldvalue];
			this.RotationList[this.currentIndex].dropdown[
				this.dict[this.face]
			].value = url;

			console.log(this.RotationList[this.currentIndex]);
			this.mapBoundsList[this.currentIndex][this.face] = arrTmp;
			console.log(
				"🚀 ~ file: ChipPointSelectionScreen.vue ~ line 498 ~ handleRotation ~ this.mapBoundsList[this.currentIndex][this.face]",
				this.mapBoundsList[this.currentIndex][this.face]
			);
			//this.mapSelectionDropdown =
			//this.RotationList[this.currentIndex].dropdown;
			console.log(
				"🚀 ~ file: ChipPointSelectionScreen.vue ~ line 470 ~ handleRotation ~ this.mapSelectionDropdown",
				this.mapSelectionDropdown
			);
			console.log(
				"🚀 ~ file: ChipPointSelectionScreen.vue ~ line 528 ~ handleRotation ~ this.markers[this.currentIndex]",
				this.markers[this.currentIndex]
			);

			this.markers[this.currentIndex].splice(0, 4);
			console.log(
				"🚀 ~ file: ChipPfointSelectionScreen.vue ~ line 528 ~ handleRotation ~ this.markers[this.currentIndex]",
				this.markers[this.currentIndex].length
			);
		},
		handlePrevious() {
			this.$router.push("crop");
		},
		updateMarker(markerArr, type) {
			console.log(markerArr);
			if (type === "instruction") {
				this.instructionMarkers[this.currentIndex] = markerArr;
			} else if (type === "original") {
				this.markers[this.currentIndex] = markerArr;
				if (
					this.face === "back" &&
					this.indexBackFront[this.currentIndex] === "empty"
				) {
					{
						this.indexBackFront[this.currentIndex] = "back";
					}
				} else if (
					this.face === "front" &&
					this.indexBackFront[this.currentIndex] === "empty"
				) {
					this.indexBackFront[this.currentIndex] = "front";
				}
				/* if( this.face === "back"){
          this.backMarkers[this.currentIndex] = markerArr;

          }
           if(this.face === "front"){this.frontMarkers[this.currentIndex] = markerArr;}*/

				// this.markers[this.currentIndex] = markerArr;
			}
		},
		handlePointDialogOff() {
			this.$store.dispatch("changeDialogPointSelection", false);
		},
		getMapImage() {
			if (this.chipFrontUrl !== "") {
				console.log(this.chipFrontUrl);
				var filename_front = this.chipFrontUrl.replace(/^.*[\\/]/, "");
				let chip_image_path =
					this.databaseLocalHost +
					"/static/originals/" +
					filename_front;

				return chip_image_path;

				//.style.transform = "rotate(45deg)";
			}
			return "";
		},
		lengthCheck() {
			const missingPins = "ピンが不足しています.";
			for (let i = 0; i < this.markers.length; ++i) {
				if (
					this.markers[i].length < 4 ||
					this.instructionMarkers[i].length < 4
				) {
					this.errorMsg.push(
						this.newChipInstructionDropdown[i].text + missingPins
					);
				}
			}

			if (this.errorMsg.length > 0) {
				return false;
			} else {
				return true;
			}
		},
		checkError() {
			this.alert = false;
			this.errorMsg = [];
			if (!this.lengthCheck()) {
				console.log("Hello");
				this.alert = true;
				return true;
			}
			return false;
		},
		getOverlayMapImage() {
			if (this.overlayMapImage !== "") {
				return this.overlayMapImage;
			}
			return "";
		},
		handleChangeMapDropdown(event) {
			console.log(event);
			this.mapImage = event;
			this.face = this.faceMapping[event];
			this.mapSelectionDropdown =
				this.RotationList[this.currentIndex].dropdown;

			if (this.face === "front") {
				// this.backMarkers = this.markers;
				this.indexBackFront[this.currentIndex] = "front";
			} else if (this.face === "back") {
				this.indexBackFront[this.currentIndex] = "back";
				//  this.frontMarkers = this.markers;
			}
		},
		handleChangeDropdown(event) {
			let instructionIndex = 0;
			for (let i = 0; i < this.newChipInstructionDropdown.length; ++i) {
				if (event === this.newChipInstructionDropdown[i].value) {
					instructionIndex = i;
				}
			}
			this.chip_instruction_index = instructionIndex;
			this.chip_instruction_url = event;
			this.currentIndex = instructionIndex;

			this.instructionMapBounds = [
				this.newChipInstructionSizes[instructionIndex][1],
				this.newChipInstructionSizes[instructionIndex][0],
			];
			this.overlayMapImage =
				this.newChipInstructionDropdown[instructionIndex].text;
			this.dropdownDefault = event;

			this.mapSelectionDropdown =
				this.RotationList[this.currentIndex].dropdown;

			if (this.indexBackFront[this.currentIndex] !== "empty") {
				this.mapImage =
					this.mapSelectionDropdown[
						this.dict[this.indexBackFront[this.currentIndex]]
					].value;
				this.mapSelectionDefault =
					this.RotationList[this.currentIndex].dropdown[
						this.dict[this.indexBackFront[this.currentIndex]]
					].value;
			} else
				this.mapImage =
					this.mapSelectionDropdown[this.dict[this.face]].value;
		},
		getKeyByValue(object, value) {
			return Object.keys(object).find((key) => object[key] === value);
		},

		//after hitting the continue button it will call this function. It will take the points from the markers and pass them into the
		//python script in the backend to create the overlay images
		handleContinue() {
			if (this.checkError()) {
				console.log(this.errorMsg);
				return;
			}

			let pointJson = {
				original: {
					image: this.flagSideUpload.front
						? this.chipFrontUrl
						: this.chipBackUrl,
					image_size: this.flagSideUpload.front
						? this.chipFrontSize
						: this.chipBackSize,
					orig_instruct_points: [],
				},
				instructions: [],
			};
			let tempPoint = [];
			console.log(this.newChipInstructionSizes);
			for (let i = 0; i < this.newChipInstructionDropdown.length; ++i) {
				pointJson["original"]["orig_instruct_points"].push([]);
				pointJson["instructions"].push({
					image: this.newChipInstructionUrls[i],
					image_size: this.newChipInstructionSizes[i],
					points: [],
				});

				for (let j = 0; j < this.markers[i].length; ++j) {
					tempPoint = [
						this.markers[i][j]["lng"],
						this.markers[i][j]["lat"],
					];
					pointJson["original"]["orig_instruct_points"][i].push(
						tempPoint
					);
				}

				for (let j = 0; j < this.instructionMarkers[i].length; ++j) {
					tempPoint = [
						this.instructionMarkers[i][j]["lng"],
						this.instructionMarkers[i][j]["lat"],
					];
					pointJson["instructions"][i]["points"].push(tempPoint);
				}
			}

			this.uploadPoints(pointJson);
		},
		async uploadPoints(pointJson) {
			console.log(
				"🚀 ~ file: ChipPointSelectionScreen.vue ~ line 692 ~ uploadPoints ~ pointJson",
				pointJson
			);
			console.log(this.chipFrontSize);
			this.$store.dispatch("changeLoading", true);

			let passJson = {
				original: {
					image: pointJson["original"]["image"],
					image_size: this.chipFrontSize,
					points: [],
				},
				instruction: {
					image: "",
					image_size: [],
					points: [],
				},
			};
			let newDropdown = [];
			let adjDropdown = [];
			let tempUrlArr = [];
			let tempFile = "";
			let tempPath = "";
			console.log(passJson["original"]["image"]);
			for (let i = 0; i < this.newChipInstructionDropdown.length; ++i) {
				//passJson["original"]["image"] =  this.RotationList[i].dropdown[this.dict[this.indexBackFront[i]]]?.value;
				passJson["original"]["image_size"] =
					this.mapBoundsList[i][this.indexBackFront[i]];
				passJson["original"]["points"] =
					pointJson["original"]["orig_instruct_points"][i];
				passJson["instruction"]["image"] =
					pointJson["instructions"][i]["image"];
				passJson["instruction"]["image_size"] =
					pointJson["instructions"][i]["image_size"];
				passJson["instruction"]["points"] =
					pointJson["instructions"][i]["points"];
				await this.axios
					.post(this.databaseLocalHost + "/imageAdjust", passJson)
					.then((response) => {
						let newFileImage = response["data"];

						tempUrlArr.push(newFileImage);
						tempFile = newFileImage.split("/").pop();
						tempPath =
							this.databaseLocalHost +
							"/static/adjustingImages/" +
							tempFile;
						newDropdown.push({ text: tempFile, value: tempPath });
						adjDropdown.push(tempPath);
						if (this.indexBackFront[i] === "back")
							this.adjCropImageBack.push(tempPath);
						else if (this.indexBackFront[i] === "front")
							this.adjCropImageFront.push(tempPath);
					})
					.catch((error) => {
						console.log(error);
						return;
					});
			}

			this.$store.dispatch(
				"changeChipInstructionAdjustDropdown",
				newDropdown
			);
			this.$store.dispatch(
				"changeChipInstructionAdjustDropdownAdj",
				this.adjCropImageFront
			);
			this.$store.dispatch(
				"changeChipInstructionAdjustDropdownAdjBack",
				this.adjCropImageBack
			);

			this.$store.dispatch("changeChipInstructionAdjustUrls", tempUrlArr);
			this.$store.dispatch("changeShowPaintTool", true);

			await this.rotatedAllAdjustedImages(
				newDropdown,
				this.RotationList,
				this.indexBackFront
			);
			this.$store.dispatch("changeLoading", false);
			await this.axios.post(this.databaseLocalHost + "/deleteFiles");
			this.$router.push("template_selection");
		},
		async rotatedAllAdjustedImages(
			newDropdown,
			RotationList,
			indexBackFront
		) {
			for (let i = 0; i < newDropdown.length; i++) {
				newDropdown[i]["size"] =
					this.mapBoundsList[i][this.indexBackFront[i]];
				if (indexBackFront[i] === "back") {
					newDropdown[i]["angle"] = RotationList[i].angleBack;
				} else newDropdown[i]["angle"] = RotationList[i].angleFront;
			}
			await this.axios.post(
				this.databaseLocalHost + "/RotateImageGroup",
				newDropdown
			);
		},
	},
};
</script>

<style scoped>
.leaflet-popup-content {
	width: auto !important;
}
</style>
