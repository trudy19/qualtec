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
				<!--          color="deep-purple accent-4"
          dense
          dark-->

				<!--        <v-app-bar-nav-icon></v-app-bar-nav-icon>-->

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
				<v-card class="d-flex justify-center navbar" flat
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
						<option id="id_view1" value="views1-id">
							{{ $t("oppositeView.selectView") }} 1
						</option>
						<!-- Select view -->
						<option id="id_view2" value="views2-id">
							{{ $t("oppositeView.selectView") }} 2
						</option>
						<!--index : yebda 0 -->
						<!--            <option id="id_view1" value="views1-id"> {{$t('oppositeView.selectView')}} 1</option> &lt;!&ndash; Select view &ndash;&gt;
            <option id="id_view2" value="views2-id"> {{$t('oppositeView.selectView')}} 2</option> &lt;!&ndash; Select view &ndash;&gt;-->
						<!--            <option v-for="(index, i) in overlays.length" v-bind:key="index" :value="'id-overlay'+i">{{"overlay"+i}}</option>-->
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
		};
	},
	created() {
		this.$root.$refs.lineEditor = this;
	},
	computed: {
		databaseLocalHost() {
			return this.$store.state.databaseLocalHost;
		},
		localHostName() {
			return this.$store.state.localHostName;
		},
		template() {
			return this.$store.state.template;
		},
		templateImage() {
			return this.$store.state.templateImage;
		},
		templateImageSize() {
			return this.$store.state.templateImageSize;
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

		let originalHeight = this.canvasHeight;
		let originalWidth = this.canvasWidth;
		let newHeight = this.background_image_size[1];
		let newWidth = this.background_image_size[0];

		let widthDiff = Math.abs(originalWidth - newWidth);
		let heightDiff = Math.abs(originalHeight - newHeight);
		let newScaledWidth = 0.0;
		let newScaledHeight = 0.0;
		let newRatio = 0.0;
		console.log(newWidth + " " + newHeight);
		console.log(widthDiff + " " + heightDiff);
		console.log(originalWidth + " " + originalHeight);
		if (heightDiff > widthDiff) {
			this.scaleBySide = "height";
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
			this.scaleBySide = "width";
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
		this.newScaledWidth = newScaledWidth;
		this.newScaledHeight = newScaledHeight;

		var canvasH = newScaledHeight;
		var canvasW = newScaledWidth;

		const ref = this.$refs.can;
		const canvas = new fabric.Canvas(ref, {
			width: canvasW, //this.backgroue_size[0], //this.background_image_size[0], //800
			height: canvasH, //this.backgrouge_size[1], //this.background_image_size[1], //350 500 this.background_image_size[1]
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
				//img.set({height: this.background_image_size[0], width:this.background_image_size[1] }); //background_image_height = 500
				img.scaleToHeight(this.newScaledHeight);
				//img.scaleToHeight(this.background_image_size[0]); //background_image_height = 500
				//img.scaleToWidth(this.background_image_size[1]); //background_image_width = 500
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

		////back side draw
		this.view2Save = canvas.toObject(["cacheKey", "selectable", "opacity"]);

		this.linesBackSide = newJson2;

		for (let i in this.linesBackSide) {
			this.lengthOfJsonBack += 4;
			var start_opposite_line_back = new fabric.Line(
				this.linesBackSide[i]["start opposite line"].map(
					(item) => item * newRatio
				),
				{
					id: "fixed-line",
					stroke: "green",
					strokeWidth: Number(5),
					hasRotatingPoint: false,
					selectable: false,
				}
			);
			this.canvas.add(start_opposite_line_back);
			console.log(this.linesBackSide[i]);
			var end_opposite_line_back = new fabric.Line(
				this.linesBackSide[i]["end opposite line"].map(
					(item) => item * newRatio
				),
				{
					id: "fixed-line",
					stroke: "orange",
					strokeWidth: Number(5),
					hasRotatingPoint: false,
					selectable: false,
				}
			);
			this.canvas.add(end_opposite_line_back);

			var start_line_back = new fabric.Line(
				this.linesBackSide[i]["start line"].map(
					(item) => item * newRatio
				),
				{
					id: "fixed-line",
					stroke: "red",
					strokeWidth: Number(5),
					hasRotatingPoint: false,
					selectable: false,
				}
			);
			this.canvas.add(start_line_back);

			var end_line_back = new fabric.Line(
				this.linesBackSide[i]["end line"].map(
					(item) => item * newRatio
				),
				{
					id: "fixed-line",
					stroke: "blue",
					strokeWidth: Number(5),
					hasRotatingPoint: false,
					selectable: false,
				}
			);
			this.canvas.add(end_line_back);

			canvas
				.toObject(["cacheKey", "selectable", "opacity"])
				.objects.map((item) => this.view2Save.objects.push(item));

			this.canvas.remove(end_line_back);
			this.canvas.remove(start_line_back);
			this.canvas.remove(start_opposite_line_back);
			this.canvas.remove(end_opposite_line_back);
		}

		////front side draw
		this.lines = newJson1;

		for (let i in this.lines) {
			this.lengthOfJsonFront += 4;

			var start_opposite_line = new fabric.Line(
				this.lines[i]["start opposite line"].map(
					(item) => item * newRatio
				),
				{
					id: "fixed-line",
					stroke: "green",
					strokeWidth: Number(5),
					hasRotatingPoint: false,
					selectable: false,
				}
			);
			this.canvas.add(start_opposite_line);

			var end_opposite_line = new fabric.Line(
				this.lines[i]["end opposite line"].map(
					(item) => item * newRatio
				),
				{
					id: "fixed-line",
					stroke: "orange",
					strokeWidth: Number(5),
					hasRotatingPoint: false,
					selectable: false,
				}
			);
			this.canvas.add(end_opposite_line);

			var start_line = new fabric.Line(
				this.lines[i]["start line"].map((item) => item * newRatio),
				{
					id: "fixed-line",
					stroke: "red",
					strokeWidth: Number(5),
					hasRotatingPoint: false,
					selectable: false,
				}
			);
			this.canvas.add(start_line);

			var end_line = new fabric.Line(
				this.lines[i]["end line"].map((item) => item * newRatio),
				{
					id: "fixed-line",
					stroke: "blue",
					strokeWidth: Number(5),
					hasRotatingPoint: false,
					selectable: false,
				}
			);
			this.canvas.add(end_line);
			this.view1Save = canvas.toObject([
				"cacheKey",
				"selectable",
				"opacity",
			]);
		}

		this.view1Save = canvas.toObject(["cacheKey", "selectable", "opacity"]);
		/*  points = [pointer.x, pointer.y, pointer.x, pointer.y];*/
	},
	methods: {
		vSelectMethod(event, selected) {
			console.log("v-selected", selected);
			//console.log("v-select:", event.target.value)
		},

		async switchToPaintTool() {
			let view1 = this.view1Save;
			let view2 = this.view2Save;

			console.log(view1, view2);

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

			await this.saveCanvasToBackend(this.imageSwitch1.src, "front.png");
			await this.saveCanvasToBackend(this.imageSwitch2.src, "back.png");

			let front_url = this.databaseLocalHost + "/static/front.png";
			let back_url = this.databaseLocalHost + "/static/back.png";

			let templateObj = await this.createTemplateImage(
				front_url,
				back_url,
				this.template
			);
			console.log(templateObj);

			let template_image_url =
				this.databaseLocalHost + "/static/export/exported_image.png";
			let template_size = templateObj.size;
			this.$store.dispatch("changeTemplateImage", template_image_url);
			this.$store.dispatch("changeTemplateImageSize", template_size);

			console.log("switch to paint tool");
			this.$router.push("paint_tool");
		},

		async createTemplateImage(front, back, template) {
			let payload = {
				template: template,
				front_url: front,
				back_url: back,
			};
			let filepath = "";
			let filesize = [0, 0];

			await this.axios
				.post(this.databaseLocalHost + "/createExport", payload)
				.then((response) => {
					console.log(response);
					filepath = response["data"]["filepath"];
					filesize = response["data"]["filesize"];
				})
				.catch((error) => {
					console.log(error);
				});

			return { filepath: filepath, filesize: filesize };
		},

		async saveCanvasToBackend(image_data, filename) {
			// const options = {};//{crossOrigin:"Anonymous"};
			// var image = document.getElementsByClassName("lower-canvas")[0];
			// const printCanvas = await html2canvas(image, options);
			// let image_data = printCanvas.toDataURL({format: "image/png", multiplier: (1/this.scaleRatio)});

			let data = { image: image_data, filename: filename };
			console.log("🚨 Line editor", data);
			await this.axios
				.post(this.databaseLocalHost + "/saveCanvasToInput", data)
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
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
				this.imageSwitch2.src = canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				console.log("here", this.view2Save);
				//////////////////////////here////////////////////////////
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
					//img.set({height: this.background_image_size[0], width:this.background_image_size[1] }); //background_image_height = 500
					img.scaleToHeight(this.newScaledHeight);
					//img.scaleToHeight(this.background_image_size[0]); //background_image_height = 500
					//img.scaleToWidth(this.background_image_size[1]); //background_image_width = 500
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
							opacity: this.rangeView.value / this.rangeView.max,
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
							opacity: this.rangeView.value / this.rangeView.max,
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
			var colorId = document.getElementById("text-color");
			var lineWidth = document.getElementById("line-width");
			let lineId = document.getElementById("line-type");

			this.shapeDraw = true;
			this.zoomMode = false;
			this.lineDraw = true;
			var points;
			this.drawingMode(canvas);
			canvas.selection = false;
			canvas.on("mouse:down", (o) => {
				var mode = canvas.getActiveObject();
				if (mode === undefined || mode === null) {
					isDrawing = true;
				} else {
					isDrawing = false;
				}
				if (isDrawing) {
					isDrawing = true;
					var pointer = canvas.getPointer(o.e);
					points = [pointer.x, pointer.y, pointer.x, pointer.y];
					line = new fabric.Line(points, {
						id: "added-line",
						stroke: colorId.value,
						strokeWidth: Number(lineWidth.value),
						hasRotatingPoint: false,
					});
					canvas.add(line);

					line.setControlsVisibility({ mtr: false });

					canvas.setActiveObject(line);

					if (lineId.value === "straightLine") {
						console.log(lineId.value);
						line.set({ stroke: 5 });
					} else if (lineId.value === "dashedLine") {
						line.set({ strokeDashArray: [20, 5] });
					} else if (lineId.value === "dottedLine") {
						console.log(lineId.value);
						line.set({ strokeDashArray: [5, 7] });
					}
					this.lineType(canvas);
				}
			});
			canvas.on("mouse:move", function (o) {
				if (isDrawing) {
					var pointer = canvas.getPointer(o.e);
					console.log("pointer.x", pointer.x, "pointer.y", pointer.y);
					line.set({ x2: pointer.x, y2: pointer.y });
					var startX = points[0];
					var startY = points[1];
					var x2 = pointer.x - startX;
					var y2 = pointer.y - startY;
					var angle = (Math.atan2(y2, x2) / Math.PI) * 180;
					angle = (angle % 360) + 180;
					console.log(
						"🚀 ~ file: PaintTool.vue ~ line 2185 ~ angle",
						angle
					);

					if (
						(angle < 225 && angle >= 135) ||
						angle >= 315 ||
						angle <= 45
					) {
						line.set({ x2: pointer.x, y2: startY });
					} else if (
						(angle > 225 && angle < 315) ||
						(angle > 45 && angle < 135)
					)
						line.set({ x2: startX, y2: pointer.y });
					canvas.renderAll();
				}
			});

			canvas.on("mouse:up", function () {
				line.setCoords();
				canvas.setActiveObject(line);
				isDrawing = false;
			});

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
			/*for(let i=this.view?this.lengthOfJsonFront:this.lengthOfJsonBack;i<canvas.getObjects().length;i++){
      canvas.getObjects()[i].set({
            selectable: true,
          })

      }*/
			console.log("after selection");
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
