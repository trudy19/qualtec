<template>
	<div id="app">
		<div v-if="overlays">
			<div v-for="(image, index) in overlays" v-bind:key="index">
				<img
					:src="image"
					alt=""
					:id="'id-overlay' + index"
					crossorigin="anonymous"
				/>
			</div>
		</div>
		<div>{{ message }}</div>

		<!-- select opposite view and transparency -->

		<div class="navbarStyle">
			<v-app-bar elevation="4" outlined rounded style="width: 1200px">
				<v-toolbar-title color="deep-purple accent-4 " class="navbar">
					{{ latestType }}
				</v-toolbar-title>

				<v-tooltip right>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							@click="resetZoom(canvas)"
							v-bind="attrs"
							v-on="on"
							v-bind:class="{ img2: !zoomMode }"
						>
							<v-icon dark> mdi-magnify-scan </v-icon>
							<!--{{ $t('functions.resetZoom') }}-->
							<!--Reset Zoom-->
							<!--長方形を追加-->
						</v-btn>
					</template>
					<span>{{ $t("functions.resetZoom") }}</span>
				</v-tooltip>

				<v-btn
					@click="changeColor(canvas)"
					v-bind:class="{ img2: !shapeDraw }"
				>
					<v-icon dark> mdi-format-color-fill </v-icon>
					<!--{{$t('tools.changeColor')}}-->
					<!--Change Color-->
					<v-tooltip right>
						<template v-slot:activator="{ on, attrs }">
							<input
								type="color"
								value=""
								id="text-color"
								size="50"
								v-bind="attrs"
								v-on="on"
							/><!-- 色を変える -->
						</template>
						<span>{{ $t("tools.changeColor") }}</span>
					</v-tooltip>
					<v-divider vertical></v-divider>
					<v-tooltip right>
						<template v-slot:activator="{ on, attrs }">
							<!--Background color--><input
								type="color"
								value=""
								id="textBackground-color"
								size="50"
								opacity="30"
								v-bind="attrs"
								v-on="on"
							/>
						</template>
						<span> Background color</span>
					</v-tooltip>
				</v-btn>
				<v-card
					class="d-flex justify-center navbar"
					flat
					v-if="currentSelected === 'line'"
					><!--mb-6-->
					<v-card
						class="pa-2"
						v-bind:class="{ img2: !lineDraw }"
						height="40px"
					>
						<div class="select">
							<select id="line-width" @change="lineWidth(canvas)">
								<option value="" disabled="disabled">
									line width
									<!--Choose Text Size-->
								</option>
								<option value="3">3</option>
								<option value="5" selected="selected">5</option>
								<option value="7">7</option>
								<option value="9">9</option>
							</select>
						</div>
					</v-card>

					<v-card
						class="pa-2"
						v-bind:class="{ img2: !lineDraw }"
						height="40px"
					>
						<div class="select">
							<select id="line-type" @change="lineType(canvas)">
								<option
									value=""
									selected="selected"
									disabled="disabled"
								>
									{{ $t("lineType.chooseLineType") }}
									<!--Choose Line Type-->
								</option>
								<option value="straightLine" id="straightLine">
									{{ $t("lineType.straightLine") }}
									<!--Straight Line-->
								</option>
								<option value="dashedLine" id="dashedLine">
									{{ $t("lineType.dashedLine")
									}}<!--Dashed Line-->
								</option>
								<option value="dottedLine" id="dottedLine">
									{{ $t("lineType.dottedLine") }}
									<!--Dotted Line-->
								</option>
								<!--index : yebda 0 -->
							</select>
						</div>
					</v-card>
				</v-card>

				<v-card class="d-flex justify-center navbar" flat height="40px">
					<select id="views-id" @change="viewHandler($event, canvas)">
						<option
							value=""
							selected="selected"
							disabled="disabled"
						>
							{{ $t("oppositeView.selectView") }}
							<!--Select View-->
						</option>
						<!-- オーバーレイを選択 -->
						<option value="none">
							{{ $t("addOverlays.none") }}
							<!--None-->
						</option>
						<!-- Overlays -->
						<option
							v-for="(index, i) in overlays.length"
							v-bind:key="index"
							:value="'id-overlay' + i"
						>
							{{ $t("addOverlays.overlay") + i }}
						</option>
						<option id="id_view1" value="views1-id">
							{{ $t("oppositeView.selectView") }} 1
						</option>
						<!-- Select view -->
						<option id="id_view2" value="views2-id">
							{{ $t("oppositeView.selectView") }} 2
						</option>
					</select>

					<v-card class="pa-2 navbar">
						<!-- outlined -->
						<div class="rangeSlider">
							<label for="rangeViewOpacity" class="form-label">
								{{ $t("oppositeView.setOverviewTransparency") }}
								<!--Set Overview Transparency--></label
							><br />
							<input
								type="range"
								class="form-range"
								id="rangeViewOpacity"
								min="0"
								max="100"
								value="50"
								oninput="this.nextElementSibling.value = this.value"
							/>
							<output
								for="rangeViewOpacity"
								id="slider-value-view"
							></output>
						</div>
					</v-card>
				</v-card>
			</v-app-bar>
		</div>

		<v-divider horizontal></v-divider>
		<v-row style="flex-wrap: nowrap">
			<v-col style="flex-grow: 0">
				<!--        <div>-->
				<v-btn-toggle tile color="deep-purple accent-3" group>
					<v-col>
						<!--        <v-btn-toggle tile color="deep-purple accent-3" group>-->
						<v-row class="spacingStyleSideBar">
							<!--style="margin-bottom: -30px"-->
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="SelectionMode(canvas)"
										v-bind="attrs"
										v-on="on"
									>
										<v-icon dark> mdi-select-drag </v-icon>
										<!--Selection Mode-->
										<!--Zoom IN/OUT-->
										<!--長方形を追加-->
									</v-btn>
								</template>
								<span>{{ $t("tools.selectionMode") }}</span>
							</v-tooltip>
						</v-row>

						<v-row class="spacingStyleSideBar">
							<!--class="spacingStyleSideBar" style="margin-bottom: -30px"-->
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="drawingMode(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:change="
											latestType = 'Drawing Mode'
										"
									>
										<v-icon dark> mdi-draw </v-icon>
										<!--Drawing Mode-->
										<!--{{$t('tools.dragShape')}}-->
										<!--Drag Shape-->
										<!-- ドラッグシェイプ -->
									</v-btn>
								</template>
								<span>{{ $t("tools.drawingMode") }}</span>
							</v-tooltip>
						</v-row>

						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="createLine(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:change="latestType = 'Line'"
									>
										<v-icon dark>
											mdi-slash-forward
										</v-icon>
										<!--{{$t('addshapes.addLines')}}-->
										<!--Add Lines-->
										<!--行を追加-->
									</v-btn>
								</template>
								<span>{{ $t("addshapes.addLines") }}</span>
							</v-tooltip>
						</v-row>

						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="createRectangle(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:change="
											latestType = $t(
												'addshapes.Rectangle'
											)
										"
									>
										<v-icon dark>
											mdi-rectangle-outline
										</v-icon>
									</v-btn>
								</template>
								<span>{{ $t("addshapes.addRectangle") }}</span>
							</v-tooltip>
						</v-row>

						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="zoom(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:change="latestType = 'Zoom'"
									>
										<!--v-tooltip="'Yes, this is a button'"-->
										<v-icon dark> mdi-contrast </v-icon>
										<!--{{ $t('functions.zoomInOut') }}-->
										<!--Zoom IN/OUT-->
										<!--長方形を追加-->
									</v-btn>
								</template>
								<span>{{ $t("functions.zoomInOut") }}</span>
							</v-tooltip>
						</v-row>

						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="deleteShape(canvas)"
										v-bind="attrs"
										v-on="on"
									>
										<v-icon dark>
											mdi-delete-empty-outline
										</v-icon>
										<!--{{$t('tools.deleteShape')}}-->
										<!--Delete shape-->
										<!--形状を削除-->
									</v-btn>
								</template>
								<span>{{ $t("tools.deleteShape") }}</span>
							</v-tooltip>
						</v-row>

						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="pasteObject(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:keydown.ctrl.86="
											pasteObject(canvas)
										"
									>
										<!-- mdi-content-paste -->
										<v-icon dark> mdi-content-copy </v-icon>
										<!-- {{$t('functions.paste')}} Paste-->
										<!--ペースト-->
									</v-btn>
								</template>
								<span>{{ $t("functions.paste") }}</span>
							</v-tooltip>
						</v-row>

						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="undoObject(canvas)"
										v-bind="attrs"
										v-on="on"
									>
										<v-icon dark>
											mdi-arrow-u-left-top
										</v-icon>
										<!--{{$t('functions.undo')}} Undo-->
										<!--元に戻す-->
									</v-btn>
								</template>
								<span>{{ $t("functions.undo") }}</span>
							</v-tooltip>
						</v-row>

						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="redoObject(canvas)"
										v-bind="attrs"
										v-on="on"
									>
										<v-icon dark>
											mdi-arrow-u-right-top
										</v-icon>
										<!--{{$t('functions.redo')}} redo-->
										<!--やり直し-->
									</v-btn>
								</template>
								<span>{{ $t("functions.redo") }}</span>
							</v-tooltip>
						</v-row>
						<!--        </v-btn-toggle>-->
					</v-col>
				</v-btn-toggle>
				<!--      </div>-->
			</v-col>

			<v-col style="flex-grow: 0">
				<v-card
					class="mx-auto"
					max-width="1400"
					v-on:keydown.ctrl.86="pasteObject(canvas)"
				>
					<v-col cols="2" class="py-2">
						<v-btn-toggle tile color="deep-purple accent-3" group>
							<v-btn @click="switchView1(canvas)">
								{{ $t("oppositeView.frontView") }}</v-btn
							>
							<!-- ビュー1 View 1-->
							<v-divider vertical></v-divider>
							<v-btn @click="switchView2(canvas)">
								{{ $t("oppositeView.backView") }}</v-btn
							>
							<!-- ビュー2 View 2 -->
						</v-btn-toggle>
						<v-divider></v-divider>
					</v-col>

					<!-- Paintable canvas -->
					<canvas
						ref="can"
						id="fabricCanvas"
						class="canvasLayout"
					></canvas>

					<!-- import image -->
					<img src="" id="imgConverted" />
					<div v-if="images">
						<div
							v-for="(image, index) in images"
							v-bind:key="index"
						>
							<img :src="image" alt="" id="image_id" />
							<button
								@click="removeImage(index)"
								class="btn btn-primary"
							>
								Remove image
							</button>
						</div>
					</div>
					<v-card-actions>
						<v-btn color="green" text @click="clearCanvas(canvas)">
							<v-icon dark> mdi-close </v-icon>
							{{ $t("functions.clear") }}
							<!--redo-->
							<!--やり直し-->
						</v-btn>
						<v-divider vertical></v-divider>
						<v-btn color="green" text @click="downloadImg(canvas)">
							<v-icon dark> mdi-close </v-icon>
							{{ $t("functions.export") }}
							<!--redo-->
							<!--やり直し-->
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
		<img
			:src="background_image_view1"
			alt="background_image"
			id="imgSize"
		/>
	</div>
</template>

<script>
//import libraries
import { fabric } from "fabric";
import html2canvas from "html2canvas";
import "fabric-history";
//import Hotkeys from 'vue-hotkeys-rt';
export default {
	name: "lineEditor",
	//components: {Hotkeys},
	props: {
		data() {},
		canvasWidth: null,
		canvasHeight: null,
		background_image_view1: String,
		background_image_view2: String,
		overlays: Array,
		background_image_size: Array,
		saveViews: {},
		json1: Object,
		json2: Object,

		//shortcuts: Array,
	},
	data: function () {
		return {
			images: [],
			vueCanvas: null,
			publicPath: process.env.BASE_URL,
			selectOverlay: { value: null, text: "None" },
			message: "",
			view: true,
			shapeDraw: false,
			lineDraw: false,
			zoomMode: false,
			latestType: "Select Tool",
			/*items: ['Foo', 'Bar', 'Fizz', 'Buzz'],*/
			items: ["none", "overlay0", "overlay1", "overlay2"],
			selected: "",
			lines: {},
			linesBackSide: {},
			lengthOfJsonBack: null,
			lengthOfJsonFront: null,
			imageSwitch1: new Image(),
			imageSwitch2: new Image(),
			scaleRatio: 0.0,
			newScaledHeight: 0.0,
			newScaledWidth: 0.0,
			currentSelected: "",
		};
	},
	created() {
		this.$root.$refs.ChipCuttingFront = this;
	},
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
		selectedLineCenter() {
			const target = this.selectedLine.target;
			const x1 = target.x1,
				x2 = target.x2,
				y1 = target.y1,
				y2 = target.y2;
			if (x1 === x2) {
				return [x1, (y1 + y2) / 2];
			} else {
				return [(x1 + x2) / 2, y1];
			}
		},
	},
	mounted() {
		console.log(this.json1);
		console.log(this.json2);

		let newJson1 = {};
		let newJson2 = {};

		for (let i in this.json1) {
			console.log(i);
			if (/^\d*$/.test(i)) {
				newJson1[i] = {
					"start line": this.json1[i]["start line"],
					"start opposite line": this.json1[i]["start opposite line"],
					"end line": this.json1[i]["end line"],
					"end opposite line": this.json1[i]["end opposite line"],
				};
			}
		}

		for (let i in this.json2) {
			console.log(i);
			if (/^\d*$/.test(i)) {
				newJson2[i] = {
					"start line": this.json2[i]["start line"],
					"start opposite line": this.json2[i]["start opposite line"],
					"end line": this.json2[i]["end line"],
					"end opposite line": this.json2[i]["end opposite line"],
				};
			}
		}

		console.log(newJson1);
		console.log(newJson2);

		this.image1 = new Image();
		this.image2 = new Image();
		let imageSize = new Image();
		imageSize.src = this.background_image_view1;
		console.log("STEP1: imageSize.src", imageSize.src);
		var scaleH;
		var scaleW;
		scaleH = this.$originalHeight / this.background_image_size[0];
		scaleW = this.$originalWidth / this.background_image_size[1];
		console.log("STEP3: scaleH, scaleW", scaleH, scaleW);

		let newScaledSizes = this.scaleCanvas(
			this.canvasWidth,
			this.canvasHeight,
			this.background_image_size[0],
			this.background_image_size[1]
		);

		var canvasW = newScaledSizes.width;
		var canvasH = newScaledSizes.height;
		this.scaleRatio = newScaledSizes.ratio;
		this.newScaledHeight = newScaledSizes.height;
		this.newScaledWidth = newScaledSizes.width;

		const ref = this.$refs.can;
		const canvas = new fabric.Canvas(ref, {
			width: canvasW,
			height: canvasH,
		});
		this.canvas = canvas;
		this.vueCanvas = canvas.getContext();
		//init switch views
		this.currentView = 1;
		this.view1Save = {};
		this.view2Save = {};
		//for clear
		this.view1Delete = {};
		this.view2Delete = {};
		this.view1 = document.querySelector(".one");
		this.view2 = document.querySelector(".two");
		fabric.Image.fromURL(
			this.background_image_view1,
			(img) => {
				img.set({
					left: 0,
					top: 0,
				});
				img.scaleToHeight(this.newScaledHeight);
				this.canvas.backgroundImage = img;
				this.canvas.renderAll();
			},
			{ crossOrigin: "anonymous" }
		);
		this.originalHeight = 0;
		this.originalWidth = 0;

		this.rangeView = document.getElementById("rangeViewOpacity");
		this.rangevalueView = this.rangeView.value / this.rangeView.max;
		this.lastelement = ""; //"none"
		this.index;
		this.tab = {};
		this.last = {};
		this.last["view2"] = "none";
		this.clipboard;
		this.view1SaveUndoRedo = [];
		this.isRedoing = false;
		this.view2SaveUndoRedo = [];
		this.json = {};
		canvas.isDrawingMode = false;
		this.escapeListener();
		canvas.selection = false;
		this.imageBeforeZoom =
			document.getElementsByClassName("lower-canvas")[0];
		this.imageView1 = new Image();
		this.imageView2 = new Image();
		this.lastPosX;
		this.lastPosY;
		this.nbr = 0;
		//this.canvas.historyInit();
		//////////////////
	},
	methods: {
		scaleCanvas(canvasW, canvasH, bgImageW, bgImageH) {
			let originalWidth = canvasW;
			let originalHeight = canvasH;
			let newWidth = bgImageW;
			let newHeight = bgImageH;

			let widthDiff = Math.abs(originalWidth - newWidth);
			let heightDiff = Math.abs(originalHeight - newHeight);
			let newScaledWidth = 0.0;
			let newScaledHeight = 0.0;
			let newRatio = 0.0;

			console.log(newWidth + " " + newHeight);
			console.log(widthDiff + " " + heightDiff);
			console.log(originalWidth + " " + originalHeight);

			if (heightDiff > widthDiff) {
				if (originalWidth > newWidth) {
					newRatio =
						Math.max(originalWidth, newWidth) /
						Math.min(originalWidth, newWidth);
				} else {
					newRatio =
						Math.min(originalWidth, newWidth) /
						Math.max(originalWidth, newWidth);
				}
			} else {
				if (originalHeight > newHeight) {
					newRatio =
						Math.max(originalHeight, newHeight) /
						Math.min(originalHeight, newHeight);
				} else {
					newRatio =
						Math.min(originalHeight, newHeight) /
						Math.max(originalHeight, newHeight);
				}
			}

			newScaledWidth = newRatio * newWidth;
			newScaledHeight = newRatio * newHeight;

			let newSizes = {
				width: newScaledWidth,
				height: newScaledHeight,
				ratio: newRatio,
			};

			return newSizes;
		},
		oneSideJsonCreation(list) {
			let newAdjustedList = [];
			let bl = {};
			let br = {};
			let tl = {};
			let tr = {};
			let coord1 = {};
			let coord2 = {};
			let coords = {};

			for (let i = 0; i < list.length; ++i) {
				// console.log(i, list[i]);
				if (list[i].type === "rect") {
					bl = { x: list[i].left, y: list[i].top + list[i].height };
					br = {
						x: list[i].left + list[i].width,
						y: list[i].top + list[i].height,
					};
					tl = { x: list[i].left, y: list[i].top };
					tr = { x: list[i].left + list[i].width, y: list[i].top };
					coords = [bl, br, tl, tr];
					console.log("rect", coords);
				} else {
					//it's a line
					coord1 = { x: list[i].left, y: list[i].top };
					coord2 = {
						x: list[i].left + list[i].width,
						y: list[i].top + list[i].height,
					};
					coords = [coord1, coord2];
					console.log("line", coords);
				}
				newAdjustedList.push(this.addToAdjustedList(list[i], coords));
			}

			console.log(newAdjustedList);

			let rectList = newAdjustedList.filter(function (el, index) {
				el.index = index;
				return el.type === "rect";
			});
			let lineList = newAdjustedList.filter(function (el, index) {
				el.index = index;
				return el.type === "line";
			});

			console.log(rectList, lineList);

			//validate rectangles or lines to make sure they aren't contained within each other
			// if(!this.validateOverlaps(rectList, lineList)) {
			//     console.log("ERROR");
			//     return;
			// }

			// //now convert the arrays into a Json
			let inputJson = this.createJson(rectList, lineList);

			return inputJson;
		},
		//takes the adjusted list and validates if all lines are contained within rectangles
		async createJsonFromPoints() {
			//split the rects and lines into their own seperate arrays

			let view1 = this.view1Save;
			let view2 = this.view2Save;

			if (this.currentView === 1) {
				view1 = await this.canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
				]);
				this.imageSwitch1.src = this.canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
			} else {
				view2 = await this.canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
				]);
				this.imageSwitch2.src = this.canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
			}

			console.log(view1, view2);

			let newJson1 = this.oneSideJsonCreation(view1.objects);
			let newJson2 = this.oneSideJsonCreation(view2.objects);

			console.log(newJson1, newJson2);

			// console.log(inputJson);

			//now pass it into the backend to save into the directory for cutting lien generation
			//await this.saveJsonToInput(newJson1);
			this.$store.dispatch("changeLoading", true);
			await this.saveJsonToBackend(newJson1);
			await this.saveCanvasToBackend(this.imageSwitch1.src);
			await this.callCuttingLineAPI();
			await this.copyJsonToFolder("json1.json");
			let outputJson1 = await this.saveJsonToStore("json1.json");
			let outputImage1 = await this.saveOrderImage("output1.png");
			this.$store.dispatch("changeOrderImageFront", outputImage1);
			this.$store.dispatch("changeJsonFront", outputJson1);
			console.log(outputJson1);

			// await this.saveJsonToInput(newJson2);

			await this.saveJsonToBackend(newJson2);
			await this.saveCanvasToBackend(this.imageSwitch2.src);
			await this.callCuttingLineAPI();
			await this.copyJsonToFolder("json2.json");
			let outputJson2 = await this.saveJsonToStore("json2.json");
			let outputImage2 = await this.saveOrderImage("output2.png");
			this.$store.dispatch("changeOrderImageBack", outputImage2);
			this.$store.dispatch("changeJsonBack", outputJson2);
			console.log(outputJson2);

			this.$router.push("cutting_line_editor");
			this.$store.dispatch("changeLoading", false);
		},
		async saveOrderImage(file) {
			let returnJson = {};
			await this.axios
				.post(this.databaseLocalHost + "/copyOrderImage", {
					filename: file,
				})
				.then((response) => {
					console.log(response);
					returnJson = response["data"];
				})
				.catch((error) => {
					console.log(error);
				});
			return returnJson;
		},
		async saveJsonToStore(file) {
			let returnJson = {};
			await this.axios
				.post(this.databaseLocalHost + "/createJsonVariable", {
					filename: file,
				})
				.then((response) => {
					console.log(response);
					returnJson = response["data"];
				})
				.catch((error) => {
					console.log(error);
				});
			return returnJson;
		},
		async callCuttingLineAPI() {
			await this.axios
				.post(this.databaseLocalHost + "/runCuttingLine")
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		async saveJsonToBackend(json) {
			console.log(json);
			await this.axios
				.post(this.databaseLocalHost + "/createJsonToInput", {
					json: json,
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		async copyJsonToFolder(file) {
			await this.axios
				.post(this.databaseLocalHost + "/copyJson", { filename: file })
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		async saveCanvasToBackend(image_data) {
			// const options = {};//{crossOrigin:"Anonymous"};
			// var image = document.getElementsByClassName("lower-canvas")[0];
			// const printCanvas = await html2canvas(image, options);
			// let image_data = printCanvas.toDataURL({format: "image/png", multiplier: (1/this.scaleRatio)});

			let data = { image: image_data };
			console.log("🚨 2", data);
			await this.axios
				.post(this.databaseLocalHost + "/saveCanvasToInput", data)
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		createJson(rectList, lineList) {
			let masterJson = {};
			let adjRectArr = [];
			let rectObj = {};
			console.log("before objectOverlaps");
			//create of rectangles that contain lines
			for (let i = 0; i < rectList.length; ++i) {
				rectObj = { rect: rectList[i], lines: [] };
				for (let j = 0; j < lineList.length; ++j) {
					if (
						this.objectOverlaps(
							lineList[j].coords,
							rectList[i].coords
						)
					) {
						rectObj.lines.push(lineList[j]);
					}
				}
				adjRectArr.push(rectObj);
			}
			console.log(adjRectArr);

			let lineArray = [];
			let lineType = [];
			let lineCoords = [];
			// let lineId, direction, directionNumber = -1;

			masterJson["millimeter_to_pixel"] = 3; //TODO
			masterJson["main_rect_length_y"] = this.background_image_size[1];
			masterJson["main_rect_length_x"] = this.background_image_size[0];
			masterJson["objects"] = [];
			//run through the list
			for (let i = 0; i < adjRectArr.length; ++i) {
				//create a line array to push into the masterJson
				lineArray = [];
				lineType = [];
				for (let j = 0; j < adjRectArr[i].lines.length; ++j) {
					lineCoords = adjRectArr[i].lines[j].coords;
					lineType.push(this.lineTypeChecker(lineCoords));
					// lineId = adjRectArr[i].lines[j].info.id.slice(10)
					// direction = this.lineDirection[lineId]
					// switch (direction) {
					//     case 'above':
					//         directionNumber = 0
					//         break
					//     case 'left':
					//         directionNumber = 1
					//         break
					//     case 'under':
					//         directionNumber = 2
					//         break
					//     case 'right':
					//         directionNumber = 3
					//         break
					//     default:
					//         directionNumber = -1
					// }
					// lineType.push(directionNumber)
					lineArray.push([
						// Math.round(lineCoords[0].x)
						// ,Math.round(lineCoords[0].y)
						// ,Math.round(lineCoords[1].x)
						// ,Math.round(lineCoords[1].y)
						Math.round(lineCoords[0].x),
						Math.round(
							this.background_image_size[1] - lineCoords[0].y
						),
						Math.round(lineCoords[1].x),
						Math.round(
							this.background_image_size[1] - lineCoords[1].y
						),
					]);
				}
				console.log(adjRectArr[i].rect.coords);
				console.log(
					adjRectArr[i].rect.coords[2].y -
						adjRectArr[i].rect.coords[0].y
				);
				//push all the information into the masterJson
				masterJson["objects"].push({
					rect_name: adjRectArr[i].rect.index.toString(),
					// rect_length_y: Math.abs(Math.round((adjRectArr[i].rect.coords[0].y - adjRectArr[i].rect.coords[2].y))),
					// rect_length_x: Math.abs(Math.round((adjRectArr[i].rect.coords[1].x - adjRectArr[i].rect.coords[0].x))),
					// rect_start_point_y: Math.round(adjRectArr[i].rect.coords[0].y),
					// rect_start_point_x: Math.round(adjRectArr[i].rect.coords[0].x),
					rect_length_y: Math.abs(
						Math.round(
							Math.round(
								this.background_image_size[1] -
									adjRectArr[i].rect.coords[0].y
							) -
								Math.round(
									this.background_image_size[1] -
										adjRectArr[i].rect.coords[2].y
								)
						)
					),
					rect_length_x: Math.abs(
						Math.round(
							adjRectArr[i].rect.coords[1].x -
								adjRectArr[i].rect.coords[0].x
						)
					),
					rect_start_point_y: Math.round(
						Math.round(
							this.background_image_size[1] -
								adjRectArr[i].rect.coords[0].y
						)
					),
					rect_start_point_x: Math.round(
						adjRectArr[i].rect.coords[0].x
					),
					g_line: lineArray,
					g_type: lineType,
				});
			}

			console.log(masterJson);
			// let finalInputJson = JSON.stringify(masterJson, null, 2);
			return masterJson;
		},

		//check if line is horizontal (0) or vertical (1) or if neither, -1
		lineTypeChecker(lineCoords) {
			if (lineCoords[1].x === lineCoords[0].x) {
				return 0;
			} else if (lineCoords[1].y === lineCoords[0].y) {
				return 1;
			} else {
				return -1;
			}
		},
		//validates to see if any lines or rets overlap each other
		validateOverlaps(rectList, lineList) {
			let overlapList = [];

			//check rectangles with rectangles
			console.log("checking rects with rects");
			for (let i = 0; i < rectList.length; ++i) {
				for (let j = i + 1; j < rectList.length; ++j) {
					if (
						this.objectOverlaps(
							rectList[i].coords,
							rectList[j].coords
						)
					) {
						console.log("hello: i: " + i + " j: " + j);
						overlapList.push(rectList[j]);
					}
				}
			}

			//check lines with lines
			console.log("checking lines with lines");
			for (let i = 0; i < lineList.length; ++i) {
				for (let j = i + 1; j < lineList.length; ++j) {
					if (
						this.doIntersect(lineList[i].coords, lineList[j].coords)
					) {
						console.log("hello: i: " + i + " j: " + j);
						overlapList.push(lineList[j]);
					}
				}
			}

			//check lines with rectangles
			console.log("checking lines with rectangles");
			for (let i = 0; i < lineList.length; ++i) {
				if (!this.lineIsContainedInRect(lineList[i], rectList)) {
					console.log("hello: i: " + i);
					overlapList.push(lineList[i]);
				}
			}
			console.log(overlapList);
			if (overlapList.length > 0) {
				this.highlightOverlaps(overlapList);
				console.log("I'm false");
				return false;
			} else {
				return true;
			}
		},
		highlightOverlaps(overlapList) {
			for (let i = 0; i < overlapList.length; ++i) {
				console.log(overlapList[i].info);
				console.log(this.canvas);
				console.log(this.canvas.getObjects());
				this.canvas.setActiveObject(
					this.canvas.getObjects()[overlapList[i].index]
				);
				this.canvas.getActiveObject().set({ stroke: "#B6B6B6" });
				console.log(overlapList[i].info.stroke);
			}
		},
		//check if rectangle contains this point
		rectangleContainsPoint(coord, rectCoords) {
			let rectBL = rectCoords[0];
			let rectTR = rectCoords[3];
			console.log(coord.x);

			if (
				coord.x > rectBL.x &&
				coord.x < rectTR.x &&
				coord.y < rectBL.y &&
				coord.y > rectTR.y
			) {
				console.log("I'm contained");
				return true;
			} else {
				return false;
			}
		},

		//check overlaps function
		objectOverlaps(objCoords, rectCoords) {
			for (let i = 0; i < objCoords.length; ++i) {
				if (!this.rectangleContainsPoint(objCoords[i], rectCoords)) {
					return false;
				}
			}
			return true;
		},
		lineIsContainedInRect(line, rectList) {
			for (let i = 0; i < rectList.length; ++i) {
				if (this.objectOverlaps(line.coords, rectList[i].coords)) {
					return true;
				}
			}
			return false;
		},
		// Given three collinear points p, q, r, the function checks if
		// point q lies on line segment 'pr'
		onSegment(p, q, r) {
			if (
				q.x <= Math.max(p.x, r.x) &&
				q.x >= Math.min(p.x, r.x) &&
				q.y <= Math.max(p.y, r.y) &&
				q.y >= Math.min(p.y, r.y)
			)
				return true;

			return false;
		},

		// To find orientation of ordered triplet (p, q, r).
		// The function returns following values
		// 0 --> p, q and r are collinear
		// 1 --> Clockwise
		// 2 --> Counterclockwise
		orientation(p, q, r) {
			// See https://www.geeksforgeeks.org/orientation-3-ordered-points/
			// for details of below formula.
			let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

			if (val == 0) return 0; // collinear

			return val > 0 ? 1 : 2; // clock or counterclock wise
		},

		// The main function that returns true if line segment 'p1q1'
		// and 'p2q2' intersect.
		doIntersect(line1, line2) {
			let p1 = line1[0];
			let q1 = line1[1];
			let p2 = line2[0];
			let q2 = line2[1];

			// Find the four orientations needed for general and
			// special cases
			let o1 = this.orientation(p1, q1, p2);
			let o2 = this.orientation(p1, q1, q2);
			let o3 = this.orientation(p2, q2, p1);
			let o4 = this.orientation(p2, q2, q1);

			// General case
			if (o1 != o2 && o3 != o4) return true;

			// Special Cases
			// p1, q1 and p2 are collinear and p2 lies on segment p1q1
			if (o1 == 0 && this.onSegment(p1, p2, q1)) return true;

			// p1, q1 and q2 are collinear and q2 lies on segment p1q1
			if (o2 == 0 && this.onSegment(p1, q2, q1)) return true;

			// p2, q2 and p1 are collinear and p1 lies on segment p2q2
			if (o3 == 0 && this.onSegment(p2, p1, q2)) return true;

			// p2, q2 and q1 are collinear and q1 lies on segment p2q2
			if (o4 == 0 && this.onSegment(p2, q1, q2)) return true;

			return false; // Doesn't fall in any of the above cases
		},
		//since saving the coordinates saves it as relative when zoomed, we want to save it in relation to the entire canvas
		convertCoordsToAbsolute(coords) {
			var p = { x: coords.x, y: coords.y };
			var invertedMatrix = fabric.util.invertTransform(
				this.canvas.viewportTransform
			);
			var transformedP = fabric.util.transformPoint(p, invertedMatrix);
			console.log(transformedP);
			//apply scale ratio

			transformedP.x /= this.scaleRatio;
			transformedP.y /= this.scaleRatio;
			// transformedP.y = Math.round(this.background_image_size[1] - transformedP.y) //this is the proper fix TODO

			console.log(transformedP);

			return transformedP;
		},
		//function for running through all the coords to adjust them
		createNewAdjObjectCoord(coordsArr) {
			let adjObjectCoord = [];
			let newCoords = {};
			console.log(coordsArr);
			for (let i = 0; i < coordsArr.length; ++i) {
				newCoords = this.convertCoordsToAbsolute(coordsArr[i]);
				//console.log(newCoords);
				adjObjectCoord.push(newCoords);
			}
			return adjObjectCoord;
		},
		//create a new object with new coords and add it to the list
		addToAdjustedList(object, coords) {
			console.log("coords Add to Adjusted", coords);
			console.log("type", object.type);
			let newObject = {
				info: object,
				coords: this.createNewAdjObjectCoord(coords),
				type: object.type,
			};
			console.log("inside object", newObject);
			return newObject;
		},
		vSelectMethod(event, selected) {
			console.log("v-selected", selected);
			//console.log("v-select:", event.target.value)
		},
		//method to download canvas as image (before/after painting)

		async downloadImg() {
			const options = {}; //{crossOrigin:"Anonymous"};
			var image = document.getElementsByClassName("lower-canvas")[0];
			const printCanvas = await html2canvas(image, options);
			const link = document.createElement("a");
			link.setAttribute("download", "Edited_Image.png");
			link.setAttribute(
				"href",
				printCanvas
					.toDataURL("image/png")
					.replace("image/png", "image/octet-stream")
			);
			//printCanvas.crossOrigin('anonymous')
			console.log(printCanvas);
			link.click();
		},
		//method to Switch from "view 1" to "view 2"
		switchView1(canvas) {
			this.view = true;
			const selectOppositeView = document.getElementById("views-id");
			const selectOppositeView1 = document.getElementById("id_view1");
			const selectOppositeView2 = document.getElementById("id_view2");
			console.log("selectOppositeView.value", selectOppositeView.value);
			canvas.getObjects().forEach((o) => {
				if (o.id === "View1_Overview") {
					console.log("o.id", o.id);
					canvas.remove(o);
					//selectOppositeView.value = 'none'
				} else if (o.id === "View2_Overview") {
					console.log("o.id", o.id);
					canvas.remove(o);
					//selectOppositeView.value = 'none'
				}
				selectOppositeView1.disabled = true;
				selectOppositeView2.disabled = false;
				selectOppositeView.value = "none";
			});
			/// this.deactivateLine(canvas);

			if (this.currentView === 2) {
				if (this.last["view1"] != undefined) {
					this.lastelement = this.last["view1"];
				}
				console.log(this.lastelement);
				this.view2Save = canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
				]);
				console.log("here", this.view2Save);
				//////////////////////////here////////////////////////////
				this.imageSwitch2.src = canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				this.image2.src = canvas.toDataURL("image/png");
				canvas.clear();
				canvas.loadFromJSON(
					this.view1Save,
					this.canvas.renderAll.bind(canvas)
				);
				this.currentView = 1;
			}
		},
		//method to switch from "view 2" to "view 1"
		switchView2(canvas) {
			this.view = false;
			const selectOppositeView = document.getElementById("views-id");
			const selectOppositeView1 = document.getElementById("id_view1");
			const selectOppositeView2 = document.getElementById("id_view2");
			console.log("selectOppositeView.value", selectOppositeView.value);
			canvas.getObjects().forEach((o) => {
				if (o.id === "View1_Overview") {
					console.log("o.id", o.id);
					canvas.remove(o);
				} else if (o.id === "View2_Overview") {
					console.log("o.id", o.id);
					canvas.remove(o);
				}
				selectOppositeView1.disabled = false;
				selectOppositeView2.disabled = true;
				selectOppositeView.value = "none";
			});
			// this.deactivateLine(canvas);

			console.log("this.last[view2]", this.last["view2"]);

			fabric.Image.fromURL(
				this.background_image_view2,
				(img) => {
					img.set({
						left: 0,
						top: 0,
					});
					img.scaleToHeight(this.newScaledHeight);
					this.canvas.backgroundImage = img;
					this.canvas.renderAll();
				},
				{ crossOrigin: "anonymous" }
			);
			if (this.currentView === 1) {
				if (this.last["view2"] != undefined) {
					this.lastelement = this.last["view2"];
				} else if (this.last["view2"] === undefined && this.nbr == 0) {
					this.last["view2"] = "none";
				}
				this.view1Save = canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
				]);
				this.imageSwitch1.src = canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				this.image1.src = canvas.toDataURL("image/png");
				canvas.clear();
				canvas.loadFromJSON(
					this.view2Save,
					canvas.renderAll.bind(canvas)
				);
				this.currentView = 2;
			}
			console.log(this.currentView);
			console.log("view 1 save : ", this.view2Save);
			this.nbr++;
			console.log("this.nbr", this.nbr);
		},
		viewHandler(event, canvas) {
			console.log("views", event.target.value);
			if (
				event.target.value == "none" ||
				event.target.value == "id-overlay0" ||
				event.target.value == "id-overlay1" ||
				event.target.value == "id-overlay2"
			) {
				canvas.getObjects().forEach((o) => {
					if (o.id === "View1_Overview") {
						console.log("o.id", o.id);
						canvas.remove(o);
					} else if (o.id === "View2_Overview") {
						console.log("o.id", o.id);
						canvas.remove(o);
					}
				});
				if (event.target.value == "none") {
					for (i = 0; i < canvas._objects.length; i++) {
						if (canvas._objects[i].cacheKey == this.lastelement) {
							canvas.remove(canvas._objects[index]);
						}
					}
				}
				for (var i = 0; i < canvas._objects.length; i++) {
					if (canvas._objects[i].cacheKey == this.lastelement) {
						var index = i;
					}
				}
				//console.log(event.target.value);
				if (this.lastelement != "") {
					this.tab[this.lastelement] = canvas._objects[index];
				}
				var overlayElement = document.getElementById(
					event.target.value
				);
				//var range = document.getElementById("range");
				if (this.tab[event.target.value] == undefined) {
					var overlayInstance = new fabric.Image(
						overlayElement,
						{
							cacheKey: event.target.value,
							index: 1,
							selectable: false,
							id: "overlaySelection",
						},
						{ crossOrigin: "anonymous" }
					);
					overlayInstance.scaleToHeight(this.newScaledHeight);
					//overlayInstance.scaleToWidth(this.background_image_size[1]);
				} else {
					overlayInstance = this.tab[event.target.value];
				}
				if (index != null) {
					canvas.remove(canvas._objects[index]);
				}
				canvas.add(overlayInstance);
				canvas.moveTo(overlayInstance, 0);
				this.index = canvas._objects.length - 1;
				this.lastelement = event.target.value;
				if (this.currentView === 1) {
					this.last["view1"] = event.target.value;
				} else {
					this.last["view2"] = event.target.value;
				}
				overlayInstance.set({ opacity: this.rangevalue });
				//overlayInstance.on("selected", () => {
				this.rangeView.addEventListener("change", () => {
					overlayInstance.set({
						opacity: this.rangeView.value / this.rangeView.max,
					});
					console.log(overlayInstance.opacity);
					canvas.renderAll();
				});
				//});
			} else if (
				event.target.value === "views1-id" ||
				event.target.value === "views2-id"
			) {
				//view
				for (i = 0; i < canvas._objects.length; i++) {
					if (canvas._objects[i].cacheKey == this.lastelement) {
						index = i;
						if (index != null) {
							canvas.remove(canvas._objects[index]);
						}
					}
				}

				if (this.currentView === 1) {
					if (event.target.value === "views2-id") {
						var viewInstance2 = new fabric.Image(this.image2, {
							selectable: false,
							opacity: 0.5,
							id: "View2_Overview",
						});
						canvas.add(viewInstance2);
						canvas.moveTo(viewInstance2, 0);
						viewInstance2.set({ opacity: this.rangeView });
						this.rangeView.addEventListener("change", () => {
							viewInstance2.set({
								opacity:
									this.rangeView.value / this.rangeView.max,
							});
							canvas.renderAll();
						});
					}
				} else if (this.currentView === 2) {
					if (event.target.value === "views1-id") {
						var viewInstance1 = new fabric.Image(this.image1, {
							selectable: false,
							opacity: 0.5,
							id: "View1_Overview",
						});
						canvas.add(viewInstance1);
						canvas.moveTo(viewInstance1, 0);
						viewInstance1.set({ opacity: this.rangeView });
						this.rangeView.addEventListener("change", () => {
							viewInstance1.set({
								opacity:
									this.rangeView.value / this.rangeView.max,
							});
							canvas.renderAll();
						});
					} else if (event.target.value === "none") {
						canvas.getObjects().forEach((o) => {
							if (o.id === "View1_Overview") {
								canvas.remove(o);
							}
						});
					}
				}
			}
			if (event.target.value === "none") {
				canvas.getObjects().forEach((o) => {
					if (o.id === "View1_Overview") {
						console.log("o.id", o.id);
						canvas.remove(o);
					} else if (o.id === "View2_Overview") {
						console.log("o.id", o.id);
						canvas.remove(o);
					}
				});
			}
			canvas.renderAll();
		},
		//display canvas background image
		imageBackground(canvas) {
			const imgElement = document.getElementById("image_id");
			if (this.currentView === 1 || this.currentView === 2) {
				const imgInstance = new fabric.Image(imgElement, {
					selectable: false,
					index: -1,
				});
				imgInstance.scaleToHeight(this.imageHeight);
				imgInstance.scaleToWidth(this.imageWidth);
				//canvas.add(imgInstance);
				//console.log(imgInstance.height, imgInstance.width)
				this.canvas.backgroundImage = imgInstance;
				this.canvas.renderAll();
				imgInstance.on("deselected", () => {
					canvas.requestRenderAll();
				});
			}
			this.images.pop();
		},
		//Import images to the paint tool
		onFileChange(e) {
			let files = e.target.files || e.dataTransfer.files;
			if (!files.length) return;
			this.createImage(files);
		},
		createImage(files) {
			let vm = this;
			for (let index = 0; index < files.length; index++) {
				let reader = new FileReader();
				reader.onload = function (event) {
					const imageUrl = event.target.result;
					vm.images.push(imageUrl);
				};
				reader.readAsDataURL(files[index]);
			}
		},
		removeImage(index) {
			this.images.splice(index, 1);
		},
		/* adding shapes to canvas */
		removeCanvasEvents(canvas) {
			canvas.off("mouse:down");
			canvas.off("mouse:move");
			canvas.off("mouse:up");
			canvas.off("object:moving");
		},
		//Drawing circle function

		createLine(canvas) {
			var isDrawing;
			var line;
			var points;
			let linePoints = [
				{ x: 0, y: 0 },
				{ x: 0, y: 0 },
			];
			//let ctx = canvas.getContext('2d');
			//this.removeCanvasEvents(canvas);
			this.drawingMode(canvas);
			//canvas.selection = false;
			canvas.on("mouse:down", (o) => {
				var evt = o.e;
				if (evt.ctrlKey === true) {
					//this.isDragging = true;
					line.set({
						selectable: false,
						strokeWidth: 5,
					});
					isDrawing = false;
				} else {
					isDrawing = true;
					var pointer = canvas.getPointer(o.e);
					console.log(pointer);
					points = [pointer.x, pointer.y, pointer.x, pointer.y];
					console.log(pointer.x, pointer.y);
					line = new fabric.Line(points, {
						id: `added-line${this.lineCount}`,
						strokeWidth: 5, //5,
						selectable: false, //true
						stroke: "#ff0000",
						type: "line",
						//selectable: false,
						hasRotatingPoint: true,
						//flipY: true
						//angle: 45,
					});
					//this.directionArrows.push(false)
					canvas.add(line);
					// this.lineIndex[this.lineCount] = this.objectCount
					// this.lineCount++
					// this.objectCount++
					canvas.setActiveObject(line);
					//line.set({strokeWidth: this.lineWidth});
					//line.set({stroke: 5});
					console.log(line);
					linePoints[0].x = pointer.x;
					linePoints[0].y = pointer.y;
				}
			});

			canvas.on("mouse:move", function (o) {
				//var evt = o.e;
				if (isDrawing) {
					var pointer = canvas.getPointer(o.e);
					//   console.log('pointer.x',pointer.x, 'pointer.y',pointer.y)
					line.set({ x2: pointer.x, y2: pointer.y });
					linePoints[1].x = pointer.x;
					linePoints[1].y = pointer.y;

					var startX = points[0];
					var startY = points[1];
					var x2 = pointer.x - startX;
					var y2 = pointer.y - startY;
					var r = Math.sqrt(x2 * x2 + y2 * y2);
					var angle = (Math.atan2(y2, x2) / Math.PI) * 180;

					angle = (angle % 360) + 180;
					if (angle <= 45 || angle >= 315) {
						angle = 0;
					} else if (angle <= 135) {
						angle = 90;
					} else if (angle <= 225) {
						angle = 180;
					} else if (angle <= 315) {
						angle = 270;
					}
					angle -= 180;

					var cosx = r * Math.cos((angle * Math.PI) / 180);
					var sinx = r * Math.sin((angle * Math.PI) / 180);

					line.set({
						x2: cosx + startX,
						y2: sinx + startY,
					});

					linePoints[1].x = cosx + startX;
					linePoints[1].y = sinx + startY;
					canvas.renderAll();
				}
			});
			canvas.on("mouse:up", function () {
				line.setCoords();
				// canvas.setActiveObject(line);
				isDrawing = false;
			});

			canvas.renderAll();
		},

		//Drawing rectangle function
		createRectangle(canvas) {
			var isDrawing;
			var rect;
			var x = 0;
			var y = 0;
			this.imageUpload = false;
			this.shapeDraw = true;
			this.zoomMode = false;
			this.lineDraw = true;
			this.textDraw = false;
			// var colorId = document.getElementById("text-color")
			// let lineId = document.getElementById("line-type")
			var origX, origY;
			//let pickerId = document.getElementById("pickerId")
			//canvas.isDrawingMode = false;
			this.drawingMode(canvas);
			//this.removeCanvasEvents(canvas);
			canvas.selection = false;
			canvas.on("mouse:down", (o) => {
				var evt = o.e;
				if (evt.ctrlKey === true) {
					//this.isDragging = true;
					rect.set({
						selectable: false,
						strokeWidth: 5,
					});
					isDrawing = false;
				} else {
					isDrawing = true;
					var pointer = canvas.getPointer(o.e);
					origX = pointer.x;
					origY = pointer.y;
					console.log(pointer);
					x = pointer.x;
					y = pointer.y;
					console.log("pointer.x", pointer.x, "pointer.y", pointer.y);
					rect = new fabric.Rect({
						id: "added-rect",
						width: 1,
						height: 1,
						fill: "transparent",
						strokeWidth: 5,
						type: "rect",
						stroke: "#ffff00",
						selectable: false, //true
						hasRotatingPoint: true,
						left: origX,
						top: origY,
					});
					//   rect = new fabric.Rect({
					//     id: "added-rect",
					//     width: 1,
					//     height: 1,
					//     fill: "transparent",
					//     strokeWidth: 5,
					//     stroke: colorId.value,
					//     selectable: false, //true
					//     hasRotatingPoint: true,
					//     left: origX,
					//     top: origY,
					//   });
					//console.log("pickerId", showColor())
					//   console.log("colorId.value", colorId.value)
					//   console.log("left x", rect.left, "top y", rect.top)
					canvas.add(rect);
					//canvas.setActiveObject(rect);
					//   if (lineId.value === "straightLine") {
					//     console.log(lineId.value)
					//     rect.set({stroke: colorId.value});
					//   } else if (lineId.value === "dashedLine") {
					//     rect.set({strokeDashArray: [20, 5]})
					//   } else if (lineId.value === "dottedLine") {
					//     console.log(lineId.value)
					//     rect.set({strokeDashArray: [5, 7]});
					//   }
					//   console.log(rect)
					//   this.lineType(canvas);
				}
			});

			canvas.on("mouse:move", function (o) {
				if (!isDrawing) {
					return false;
				} else if (isDrawing) {
					var pointer = canvas.getPointer(o.e);

					var w = Math.abs(x - pointer.x),
						h = Math.abs(y - pointer.y);

					if (!w || !h) {
						return false;
					}
					//var rect = canvas.getActiveObject();
					if (origX > pointer.x) {
						rect.set({ left: pointer.x, strokeWidth: 5 }); //rect.set
					}
					if (origY > pointer.y) {
						rect.set({ top: pointer.y, strokeWidth: 5 });
					}

					rect.set({ width: Math.abs(origX - pointer.x) });
					rect.set({ height: Math.abs(origY - pointer.y) });

					canvas.renderAll();
				}
			});
			canvas.on("mouse:up", function () {
				canvas.getObjects();
				isDrawing = false;
			});

			canvas.hoverCursor = "auto";
			canvas.renderAll();
		},

		//Drag mode function
		deactivateLine(canvas) {
			var colorId = document.getElementById("text-color");
			this.removeCanvasEvents(canvas);
			canvas.selection = true;
			canvas.getObjects().forEach((o) => {
				if (o.id === "added-line") {
					o.set({
						selectable: true,
					});
				} else if (o.id === "added-rect") {
					o.set({
						selectable: true,
					});
				} else if (o.id === "added-circle") {
					o.set({
						selectable: true,
					});
				} else if (o.id === "added-arrow" && o.id === "arrow-head") {
					o.set({
						selectable: true,
					});
				} else if (o.id === "lineArrow-added") {
					console.log(o);
					o.set({
						selectable: true,
						stroke: colorId.value,
						fill: colorId.value,
					});
				} else if (o.id === "added-XShape") {
					o.set({
						selectable: true,
					});
				} else if (o.id === "overlaySelection") {
					o.set({
						selectable: false,
					});
				}
			});
			console.log("after selection");
		},
		drawingMode(canvas) {
			this.removeCanvasEvents(canvas);
			canvas.selection = false;
			canvas.getObjects().forEach((o) => {
				o.set({
					selectable: false,
				});
			});
			console.log("after selection");
		},
		SelectionMode(canvas) {
			this.shapeDraw = true;
			this.zoomMode = true;
			this.lineDraw = false;
			console.log(canvas._objects);
			this.removeCanvasEvents(canvas);
			canvas.selection = true;
			canvas.getObjects().forEach((o) => {
				//if (o.id === "added-line") {
				o.set({
					selectable: true,
				});
				// }
			});
			console.log("hi");
			function handleSelect(e) {
				console.log("hello", e);
				if (e.type === "line") {
					this.currentSelected = "line";
				}
			}
			canvas.on("selection:created", handleSelect);
			/*for(let i=this.view?this.lengthOfJsonFront:this.lengthOfJsonBack;i<canvas.getObjects().length;i++){
      canvas.getObjects()[i].set({
            selectable: true,
          })

      }*/
			console.log("after selection");
		},
		setLineDirection(direction) {
			const idNum = parseInt(this.selectedLine.target.id.slice(10)),
				center = this.selectedLineCenter;
			if (this.lineDirection[idNum] === direction) {
				return;
			}
			const selectedLineIndex = this.lineIndex[idNum];
			if (this.directionArrows[selectedLineIndex]) {
				const erasedArrows = this.directionArrows[selectedLineIndex];
				for (let i = 0; i < 2; i++) {
					this.canvas.remove(this.canvas.item(erasedArrows[0]));
				}
				delete this.directionArrows[selectedLineIndex];
				this.decreaseIndex(erasedArrows);
			}
			let centerX = center[0],
				centerY = center[1],
				angle,
				leftAdjust = 0,
				topAdjust = 0,
				lineCoords;
			switch (direction) {
				case "under":
					centerY += this.lineWidth;
					angle = 0;
					leftAdjust = -15;
					lineCoords = [
						centerX - 7.5,
						centerY + 10,
						centerX - 7.5,
						centerY + 30,
					];
					break;
				case "left":
					angle = 90;
					topAdjust = -15;
					lineCoords = [
						centerX - 30,
						centerY - 7.5,
						centerX - 10,
						centerY - 7.5,
					];
					break;
				case "above":
					angle = 180;
					leftAdjust = 15;
					lineCoords = [
						centerX - 7.5,
						centerY - 30,
						centerX - 7.5,
						centerY - 10,
					];
					break;
				case "right":
					centerX += this.lineWidth;
					angle = 270;
					topAdjust = 15;
					lineCoords = [
						centerX + 10,
						centerY - 7.5,
						centerX + 30,
						centerY - 7.5,
					];
					break;
			}
			const head = new fabric.Triangle({
				id: "arrow-triangle",
				width: 30,
				height: 10,
				left: centerX + leftAdjust,
				top: centerY + topAdjust,
				fill: "#ff0000",
				angle: angle,
				selectable: false,
			});
			const line = new fabric.Line(lineCoords, {
				id: "arrow-line",
				strokeWidth: 15,
				stroke: "#ff0000",
				selectable: false,
			});
			const newSelectedLineIndex = this.lineIndex[idNum];
			this.lineDirection[idNum] = direction;
			this.directionArrows[newSelectedLineIndex] = [
				this.objectCount,
				this.objectCount + 1,
			];
			this.objectCount += 2;
			this.canvas.add(head);
			this.canvas.add(line);
			this.canvas.renderAll();
			//add direction information to this.adjustedObjectList
			console.log("lineIndex:", this.lineIndex);
			console.log("rectIndex:", this.rectIndex);
			console.log("directionArrows:", this.directionArrows);
			console.log("lineDirection:", this.lineDirection);
		},
		lineType(canvas) {
			let lineId = document.getElementById("line-type");
			lineId.addEventListener("change", () => {
				canvas.getActiveObjects().forEach((o) => {
					if (o.id === "added-line") {
						if (lineId.value === "straightLine") {
							o.set({ strokeDashArray: [20, 0] });
						} else if (lineId.value === "dashedLine") {
							o.set({ strokeDashArray: [20, 5] });
						} else if (lineId.value === "dottedLine") {
							console.log(lineId.value);
							o.set({ strokeDashArray: [5, 7] });
						}
						this.lineType(canvas);
						canvas.renderAll();
					}
				});
			});
		},
		lineWidth(canvas) {
			var lineWidth = document.getElementById("line-width");
			lineWidth.addEventListener("change", () => {
				canvas.getActiveObjects().forEach((o) => {
					if (o.id === "added-line") {
						o.set({ stroke: lineWidth.value });
						canvas.renderAll();
					}
				});
			});
		},

		changeColor(canvas) {
			var colorId = document.getElementById("text-color");
			var colorIdBackground = document.getElementById(
				"textBackground-color"
			);
			colorId.addEventListener("change", () => {
				canvas.getActiveObjects().forEach((o) => {
					switch (o.id) {
						case "added-line":
							o.set({ stroke: colorId.value });
							break;
						case "added-rect":
							o.set({ stroke: colorId.value });
							break;
						case "added-circle":
							o.set({ stroke: colorId.value });
							break;
						case "added-XShape":
							o.set({ fill: colorId.value });
							break;
						case "added-text":
							o.set({ fill: colorId.value });
							canvas.renderAll();
							break;
						case "added-object-cloned":
							o.set({ stroke: colorId.value });
							break;
						/*case 'lineArrow-added':
                o.set({fill: colorId.value, stroke: colorId.value});
                break;*/
						case "added-arrow":
							o.set({ stroke: colorId.value });
							break;
						case "arrow-head":
							o.set({
								stroke: colorId.value,
								fill: colorId.value,
							});
							break;
						default:
							o.set({ stroke: colorId.value });
							break;
					}
					canvas.renderAll();
				});
			});
			colorIdBackground.addEventListener("change", () => {
				console.log(colorIdBackground.value);
				canvas.getActiveObjects().forEach((o) => {
					if (o.id === "added-text") {
						o.set({ backgroundColor: colorIdBackground.value });

						canvas.renderAll();
					}
				});
			});
		},
		// window event listener
		escapeListener() {
			var ref = this;
			var canvas = ref.canvas;
			window.onload = function () {
				var ctrlDown = false,
					ctrlKey = 17,
					cmdKey = 91,
					delKey = 8,
					supprimKey = 46,
					vKey = 86,
					//xKey = 88,
					cKey = 67,
					yKey = 89,
					zKey = 90;
				//var clipboard
				document.addEventListener(
					"keydown",
					function (event) {
						console.log(event.keyCode);
						if (
							event.keyCode === ctrlKey ||
							event.keyCode === cmdKey
						) {
							ctrlDown = true;
						}
						if (ctrlDown && event.keyCode === cKey) {
							//this.copyObject(canvas);
							console.log("copy");
							//ref.copyObject(canvas)
						}
						if (ctrlDown && event.keyCode === vKey) {
							console.log("paste");
							if (canvas.getActiveObject()) {
								ref.pasteObject(canvas);
							}
						}
						if (
							event.keyCode === delKey ||
							event.keyCode === supprimKey
						) {
							console.log("deleted object");
							ref.deleteShape(canvas);
						}
						if (ctrlDown && event.keyCode === zKey) {
							console.log("undo");
							ref.undoObject(canvas);
						}
						if (ctrlDown && event.keyCode === yKey) {
							console.log("redo");
							ref.redoObject(canvas);
						}
					},
					false
				);
			};
		},
		pasteObject(canvas) {
			var clipboard;
			canvas.getActiveObject().clone(function (clonedObj) {
				clipboard = clonedObj;
				canvas.discardActiveObject();
				clonedObj.set({
					left: clonedObj.left + 10,
					top: clonedObj.top + 10,
					id: "added-object-cloned",
					evented: true,
				});
				if (clonedObj.type === "activeSelection") {
					// active selection needs a reference to the canvas.
					clonedObj.canvas = canvas;
					clonedObj.forEachObject(function (obj) {
						canvas.add(obj);
					});
					// this should solve the unselectability
					clonedObj.setCoords();
				} else {
					canvas.add(clonedObj);
				}
				clipboard.top += 10;
				clipboard.left += 10;
				canvas.setActiveObject(clonedObj);
				canvas.requestRenderAll();
				console.log("this.clipboard PASTE", clipboard);
			});
		},
		//Delete selected shape
		deleteShape(canvas) {
			var doomedObj = canvas.getActiveObject();
			if (doomedObj.type === "activeSelection") {
				doomedObj.canvas = canvas;
				doomedObj.forEachObject(function (obj) {
					canvas.remove(obj);
				});
			} else {
				if (doomedObj !== null) {
					canvas.remove(doomedObj);
				}
				console.log("doomedobj", doomedObj);
			}
		},

		///////to data url function (two images)
		rasterize() {
			if (this.currentView === 1) {
				this.$store.dispatch(
					"changeChipFrontNewImageData",
					this.canvas.toDataURL("image/png")
				);
				this.$store.dispatch(
					"changeChipBackNewImageData",
					this.image2.src
				);
			} else if (this.currentView === 2) {
				this.$store.dispatch(
					"changeChipFrontNewImageData",
					this.canvas.toDataURL("image/png")
				);
				this.$store.dispatch(
					"changeChipBackNewImageData",
					this.image1.src
				);
			}
		},

		resetZoom(canvas) {
			var zoom = canvas.getZoom();
			console.log("zoom", zoom);
			canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
			canvas.renderAll();
		},
		zoom(canvas) {
			this.shapeDraw = false;
			this.zoomMode = true;
			this.lineDraw = false;
			console.log("canvas.getHeight()", canvas.getHeight());
			console.log("canvas.getWidth()", canvas.getWidth());
			var canvasH = canvas.getHeight();
			var canvasW = canvas.getWidth();
			console.log("canvasH", canvasH);
			console.log("canvasW", canvasW);
			this.removeCanvasEvents(canvas); //to disable drawing shapes when zooming
			canvas.on("mouse:wheel", function (opt) {
				var delta = opt.e.deltaY;
				var zoom = canvas.getZoom();
				zoom *= 0.999 ** delta;
				if (zoom > 20) zoom = 20;
				if (zoom < 1) zoom = 1;
				canvas.zoomToPoint(
					{ x: opt.e.offsetX, y: opt.e.offsetY },
					zoom
				);
				opt.e.preventDefault();
				opt.e.stopPropagation();
				var vpt = this.viewportTransform;
				if (zoom < 400 / canvasW) {
					//718.232
					vpt[4] = 200 - (canvasW * zoom) / 2;
					vpt[5] = 200 - (canvasH * zoom) / 2; //500
				} else {
					if (vpt[4] >= 0) {
						vpt[4] = 0;
					} else if (vpt[4] < canvas.getWidth() - canvasW * zoom) {
						vpt[4] = canvas.getWidth() - canvasW * zoom;
					}
					if (vpt[5] >= 0) {
						vpt[5] = 0;
					} else if (vpt[5] < canvas.getHeight() - canvasH * zoom) {
						vpt[5] = canvas.getHeight() - canvasH * zoom;
					}
				}
			});
			canvas.on("mouse:down", function (opt) {
				var evt = opt.e;
				if (evt.altKey === true) {
					this.isDragging = true;
					this.selection = false;
					this.lastPosX = evt.clientX;
					this.lastPosY = evt.clientY;
				}
			});
			canvas.on("mouse:move", function (opt) {
				if (this.isDragging) {
					var e = opt.e;
					var vpt = this.viewportTransform;
					vpt[4] += e.clientX - this.lastPosX;
					vpt[5] += e.clientY - this.lastPosY;
					this.requestRenderAll();
					this.lastPosX = e.clientX;
					this.lastPosY = e.clientY;
				}
			});
			canvas.on("mouse:up", function () {
				// on mouse up we want to recalculate new interaction
				// for all objects, so we call setViewportTransform
				this.setViewportTransform(this.viewportTransform);
				console.log(this.viewportTransform);
				this.isDragging = false;
				this.selection = true;
			});
		},

		undoObject(canvas) {
			//view1SaveUndoRedo = this.view1Save
			if (this.currentView === 1) {
				console.log(
					"🚀 ~ file: PaintTool.vue ~ line 1641 ~ undoObject ~ 1",
					canvas._objects
				);
				console.log(
					"🚀 ~ file: PaintTool.vue ~ line 1641 ~ undoObject ~ 1",
					canvas._objects.length
				);

				if (
					canvas._objects.length > 0 &&
					canvas._objects[canvas._objects.length - 1].id !==
						"fixed-line"
				) {
					this.view1SaveUndoRedo.push(canvas._objects.pop());
					canvas.renderAll();
				}
			} else if (this.currentView === 2) {
				if (canvas._objects.length > 0) {
					this.view2SaveUndoRedo.push(canvas._objects.pop());
					canvas.renderAll();
				}
			}
		},
		redoObject(canvas) {
			if (this.currentView === 1) {
				if (this.view1SaveUndoRedo.length > 0) {
					this.isRedoing = true;
					canvas.add(this.view1SaveUndoRedo.pop());
				}
			} else if (this.currentView === 2) {
				if (this.view2SaveUndoRedo.length > 0) {
					this.isRedoing = true;
					canvas.add(this.view2SaveUndoRedo.pop());
				}
			}
		},
		clearCanvas(canvas) {
			//var objRemove = {}
			this.shapeDraw = false;
			this.zoomMode = false;
			this.lineDraw = false;
			this.view1Delete = canvas.toJSON(this.background_image_view1);
			console.log("this.view1Delete", this.view1Delete);
			if (canvas._objects.length > 0) {
				canvas.clear();
			}
			if (this.currentView === 1) {
				fabric.Image.fromURL(
					this.background_image_view1,
					(img) => {
						img.set({
							left: 0,
							top: 0,
						});
						//img.set({height: this.background_image_size[0], width:this.background_image_size[1] }); //background_image_height = 500
						img.scaleToHeight(this.newScaledHeight);
						//img.scaleToHeight(this.background_image_size[0]); //background_image_height = 500
						//img.scaleToWidth(this.background_image_size[1]); //background_image_width = 500
						this.canvas.backgroundImage = img;
						this.canvas.renderAll();
					},
					{ crossOrigin: "anonymous" }
				);
			} else if (this.currentView === 2) {
				fabric.Image.fromURL(
					this.background_image_view2,
					(img) => {
						img.set({
							left: 0,
							top: 0,
						});
						//img.set({height: this.background_image_size[0], width:this.background_image_size[1] }); //background_image_height = 500
						img.scaleToHeight(this.newScaledHeight);
						//img.scaleToHeight(this.background_image_size[0]); //background_image_height = 500
						//img.scaleToWidth(this.background_image_size[1]); //background_image_width = 500
						this.canvas.backgroundImage = img;
						this.canvas.renderAll();
					},
					{ crossOrigin: "anonymous" }
				);
			}
		},
	},
};
</script>

<style scoped>
#app {
	margin-left: 150px;
}
.navbarStyle {
	margin-left: 90px;
}
.navbar {
	margin: 0px 10px;
	justify-content: space-between;
}
.spacingStyleSideBar {
	margin-bottom: -10px;
}
img {
	width: 100%;
	margin: auto;
	/*display: block;*/
	/*margin-bottom: 10px;*/
	display: none;
}
.v-bottom-navigation.v-bottom-navigation v-btn {
	font-size: 0.75rem;
}
.img1,
.img2 {
	opacity: 0.5;
	display: none;
}
h1 {
	margin-left: 200px;
}

select {
	-webkit-appearance: none;
	-moz-appearance: none;
	-ms-appearance: none;
	appearance: none;
	outline: 0;
	/*background-image: none;*/
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0 0 0 0.5em;
	cursor: pointer;
	border-bottom: 2px #bdbdbd solid;
	/*background: whitesmoke;*/
}
.select {
	position: relative;
	display: block;
	width: 10em; /*20em*/
	height: 1.5em;
	line-height: 1.5;
	overflow: hidden;
	border-radius: 0.25em;
}
select::-ms-expand {
	display: none;
}
.select::after {
	content: "\25BC"; /*fleche*/
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	padding: 0 1em;
	background: white; /*whitesmoke*/
	pointer-events: none;
	-webkit-transition: 0.25s all ease;
	-o-transition: 0.25s all ease;
	transition: 0.25s all ease;
}
.select:hover::after {
	color: #f39c12;
}
.rangeSlider {
	position: relative;
	display: block;
	width: 10em;
	height: 1.5em; /*3em*/
	line-height: 1.8; /*2*/
	overflow: hidden;
	border-radius: 0.25em;
}
input[type="range"] {
	height: 22px; /*22px;*/
	-webkit-appearance: none;
	margin: 2px 0;
	width: 80%;
}
input[type="range"]:focus {
	outline: none;
}
input[type="range"]::-webkit-slider-runnable-track {
	width: 100%;
	height: 4px;
	cursor: pointer;
	animate: 0.2s;
	box-shadow: 1px 1px 1px #e3e3e3;
	background: #e3e3e3;
	border-radius: 4px;
	border: 1px solid #e3e3e3;
}
input[type="range"]::-webkit-slider-thumb {
	box-shadow: 0px 0px 0px #e0e0e0;
	border: 0px solid #2a99d1;
	height: 16px;
	width: 16px;
	border-radius: 15px;
	background: #2a99d1;
	cursor: pointer;
	-webkit-appearance: none;
	margin-top: -6.5px;
}
input[type="range"]:focus::-webkit-slider-runnable-track {
	background: #e3e3e3;
}
input[type="range"]::-moz-range-track {
	width: 100%;
	height: 4px;
	cursor: pointer;
	animate: 0.2s;
	box-shadow: 1px 1px 1px #e3e3e3;
	background: #e3e3e3;
	border-radius: 4px;
	border: 1px solid #e3e3e3;
}
input[type="range"]::-moz-range-thumb {
	box-shadow: 0px 0px 0px #e0e0e0;
	border: 0px solid #2a99d1;
	height: 16px;
	width: 16px;
	border-radius: 15px;
	background: #2a99d1;
	cursor: pointer;
}
input[type="range"]::-ms-track {
	width: 100%;
	height: 4px;
	cursor: pointer;
	animate: 0.2s;
	background: transparent;
	border-color: transparent;
	color: transparent;
}
input[type="range"]::-ms-fill-lower {
	background: #e3e3e3;
	border: 1px solid #e3e3e3;
	border-radius: 8px;
	box-shadow: 1px 1px 1px #e3e3e3;
}
input[type="range"]::-ms-fill-upper {
	background: #e3e3e3;
	border: 1px solid #e3e3e3;
	border-radius: 8px;
	box-shadow: 1px 1px 1px #e3e3e3;
}
input[type="range"]::-ms-thumb {
	margin-top: 1px;
	box-shadow: 0px 0px 0px #e0e0e0;
	border: 0px solid #2a99d1;
	height: 16px;
	width: 16px;
	border-radius: 15px;
	background: #2a99d1;
	cursor: pointer;
}
input[type="range"]:focus::-ms-fill-lower {
	background: #e3e3e3;
}
input[type="range"]:focus::-ms-fill-upper {
	background: #e3e3e3;
}
:root {
	--font-primary: "Open Sans", sans-serif;
	--color-gray: #dadce0;
}
/* Global*/
*,
::after,
::before {
	box-sizing: border-box;
}
body {
	font-size: 1rem;
	-webkit-text-size-adjust: 100%;
	font-family: var(--font-primary);
	overflow: hidden;
}
hr {
	border: 0;
	height: 0;
	margin: 1.5rem 0;
	border-top: 1px solid var(--color-gray);
}
</style>
