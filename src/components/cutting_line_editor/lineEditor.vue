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

				<v-toolbar-title
					v-if="latestType === ''"
					color="deep-purple accent-4 "
					class="navbar"
				>
					{{ (latestType = $t("tools.selectTool")) }}
				</v-toolbar-title>
				<v-toolbar-title
					v-else
					color="deep-purple accent-4 "
					class="navbar"
				>
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
				<!-- <template v-if='showShapeSelection===true' v-bind:class="{ img2: !lineDraw }">
					<v-card
						height="40px"
						class="justify-center align-items"
						flat
						style="
							width: 20%;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						"
					>-->
				<!-- class="select"-->
				<!--            <div class="select">-->
				<!-- <v-combobox
							:items="
								currentView === 1 ? objectsList : objectsList2
							"
							item-text="value"
							item-value="id"
							label="Shape Select"
							multiple
							clearable
							v-model="objectListChecked"
							hide-details="true"
							cols="12"
							sm="6"
							@change="handleObjectsList"
							return-object
						></v-combobox>-->
				<!--            </div>-->
				<!--	</v-card>
				</template>-->

				<template v-bind:class="{ img2: !lineDraw }">
					<v-card
						height="40px"
						class="justify-center align-items"
						flat
						style="
							width: 20%;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						"
					>
						<v-combobox
							v-if="currentView === 1"
							:items="layerList1"
							item-text="text"
							item-value="id"
							label="Shape Select"
							multiple
							clearable
							v-model="layerChecked1.id"
							hide-details="true"
							cols="12"
							sm="6"
							@change="handleLayer1"
						></v-combobox>
						<v-combobox
							v-else
							:items="layerList2"
							item-text="text"
							item-value="id"
							label="Shape Select"
							multiple
							clearable
							v-model="layerChecked2.id"
							hide-details="true"
							cols="12"
							sm="6"
							@change="handleLayer2"
						></v-combobox>
					</v-card>
				</template>

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

				<!--        <v-card class="d-flex justify-center navbar" flat height="40px">
          <select id="views-id" @change="viewHandler($event, canvas)">
            <option value="" selected="selected" disabled="disabled">
              {{ $t("oppositeView.selectView") }}
              &lt;!&ndash;Select View&ndash;&gt;
            </option>
            &lt;!&ndash; オーバーレイを選択 &ndash;&gt;
            <option value="none">
              {{ $t("addOverlays.none") }}
              &lt;!&ndash;None&ndash;&gt;
            </option>
            <option id="id_view1" value="views1-id">
              {{ $t("oppositeView.selectView") }} 1
            </option>
            &lt;!&ndash; Select view &ndash;&gt;
            <option id="id_view2" value="views2-id">
              {{ $t("oppositeView.selectView") }} 2
            </option>
            <option id="id_view3" value="views3-id">
              {{ $t("oppositeView.selectView") }} 3
            </option>
            <option id="id_view4" value="views4-id">
              {{ $t("oppositeView.selectView") }} 4
            </option>
            &lt;!&ndash;index : yebda 0 &ndash;&gt;
            &lt;!&ndash;            <option id="id_view1" value="views1-id"> {{$t('oppositeView.selectView')}} 1</option> &lt;!&ndash; Select view &ndash;&gt;
            <option id="id_view2" value="views2-id"> {{$t('oppositeView.selectView')}} 2</option> &lt;!&ndash; Select view &ndash;&gt;&ndash;&gt;
            &lt;!&ndash;            <option v-for="(index, i) in overlays.length" v-bind:key="index" :value="'id-overlay'+i">{{"overlay"+i}}</option>&ndash;&gt;
          </select>

          <v-card class="pa-2 navbar">
            &lt;!&ndash; outlined &ndash;&gt;
            <div class="rangeSlider">
              <label for="rangeViewOpacity" class="form-label">
                {{ $t("oppositeView.setOverviewTransparency") }}
                &lt;!&ndash;Set Overview Transparency&ndash;&gt;</label
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
              <output for="rangeViewOpacity" id="slider-value-view"></output>
            </div>
          </v-card>
        </v-card>-->
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
										v-on:change="
											latestType = $t(
												'tools.selectionMode'
											)
										"
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
						<img
							src="/arrow.png"
							id="my-image"
							width="500px"
							height="500px"
						/>
						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="createLine(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:change="
											latestType = $t('addshapes.lines')
										"
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
										v-on:change="
											latestType = $t(
												'functions.zoomInOut'
											)
										"
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
							<v-btn
								v-if="flagSideUpload.front === true"
								class="mx-2"
								color="primary"
								text
								@click="switchView1(canvas)"
							>
								{{ $t("oppositeView.frontView") }}</v-btn
							>
							<!-- ビュー1 View 1-->
							<v-divider vertical></v-divider>
							<v-btn
								class="mx-2"
								color="primary"
								text
								v-if="flagSideUpload.back === true"
								@click="switchView2(canvas)"
							>
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
						<v-btn
							class="mx-2"
							color="primary"
							text
							@click="clearCanvas(canvas)"
						>
							<v-icon dark> mdi-close </v-icon>
							{{ $t("functions.clear") }}
							<!--redo-->
							<!--やり直し-->
						</v-btn>
						<v-divider vertical></v-divider>
						<v-btn
							class="mx-2"
							color="primary"
							text
							@click="downloadImg(canvas)"
						>
							<!--                          <font-awesome-icon icon="fa-thin fa-download" />-->
							<v-icon dark> mdi-download-outline </v-icon>
							{{ $t("functions.exportFunc") }}
							<!--redo-->
							<!--やり直し-->
						</v-btn>
					</v-card-actions>
				</v-card>
				<v-dialog v-model="switchViewDone" width="500">
					<v-card>
						<v-card-title class="text-h5 grey lighten-2">
							Warning !
						</v-card-title>

						<v-card-text>
							You must verify the second view
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn
								color="primary"
								text
								@click="
									switchView2(canvas),
										(switchViewDone = false)
								"
							>
								OK
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</v-col>
		</v-row>
		<img
			:src="background_image_view1"
			alt="background_image"
			id="imgSize"
		/>
		<!--
    <v-btn x-large @click="rotateImage90()"> Angle 90 </v-btn> &lt;!&ndash; ビュー2 View 2 {{$t('oppositeView.backView')}} &ndash;&gt;
    <v-btn x-large @click="rotateImage0()"> Angle 0 </v-btn> &lt;!&ndash; ビュー2 View 2 {{$t('oppositeView.backView')}} &ndash;&gt;
-->
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
		background_image_view1_flipped: String,
		background_image_view2_flipped: String,
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
			latestType: "",
			//latestType: "道具を選択する", //select tool
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
			indexstack: 0,
			indexstack2: 0,
			indexId: 0,
			switchViewDone: false,
			listBoxesBack: [],
			objectsList: [],
			objectsList2: [],
			objectListChecked: [],
			objectListChecked1: [],
			objectListChecked2: [],
			layerChecked: [],
			layerChecked1: [],
			currentView: 1,
			layerChecked2: [],

			showShapeSelection: false,
			layerList1: [
				{ id: 1, text: this.$t("functions.layer1") },
				{ id: 2, text: this.$t("functions.layer2") },
				{ id: 3, text: this.$t("functions.layer3") },
			],
			layerList2: [
				{ id: 1, text: this.$t("functions.layer1") },
				{ id: 2, text: this.$t("functions.layer2") },
				{ id: 3, text: this.$t("functions.layer3") },
			],
			excelFileName:{}
		};
	},
	async created() {
		this.$root.$refs.lineEditor = this;
		this.excelFileName=await this.fetchFileName();
        console.log("🚀 ~ file: lineEditor.vue ~ line 647 ~ created ~ this.excelFileName", this.excelFileName)
		//this.currentView=1 ;
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
		cuttingLineEditor1SwitchObj() {
			return this.$store.state.cuttingLineEditor1SwitchObj;
		},
		cuttingLineEditor2SwitchObj() {
			return this.$store.state.cuttingLineEditor2SwitchObj;
		},
		saveJson() {
			return this.$store.state.saveJson;
		},
		flagSideUpload() {
			return this.$store.state.flagSideUpload;
		},
		doneTransitionList() {
			return this.$store.state.doneTransitionList;
		},
		arrowCoordinates() {
			return this.$store.state.arrowCoordinates;
		},
		arrowCoordinates2() {
			return this.$store.state.arrowCoordinates2;
		},
		layersUrlBack() {
			return this.$store.state.layersUrlBack;
		},
		layersUrlFront() {
			return this.$store.state.layersUrlFront;
		},
		loadstate() {
			return this.$store.state.loadstate;
		},
		uuid() {
			return this.$store.state.uuid;
		},
	},
	async mounted() {
		console.log(this.json1);
		console.log(this.json2);
		
		console.log(this.arrowCoordinates);
		let newJson1 = {};
		let newJson2 = {};
		let listTemp = {};
		listTemp = this.doneTransitionList;
		listTemp["switchview"] = false;
		this.$store.dispatch("changeDoneTransitionList", listTemp);
		//await setTimeout(()=>console.log("loadding "),5000)
		console.log("after timeout");
		for (let i in this.json1) {
			console.log(i);
			if (/^\d*$/.test(i) || /^\d_c*$/.test(i)) {
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
			if (/^\d*$/.test(i) || /^\d_c*$/.test(i)) {
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
		this.tempSelectedObjects = [];

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
		this.scaleRatio = newRatio;

		var canvasH = newScaledHeight;
		console.log(
			"🚀 ~ file: lineEditor.vue ~ line 718 ~ mounted ~ canvasH",
			canvasH
		);
		var canvasW = newScaledWidth;
		console.log(
			"🚀 ~ file: lineEditor.vue ~ line 720 ~ mounted ~ canvasW",
			canvasW
		);

		const ref = this.$refs.can;
		const canvas = new fabric.Canvas(ref, {
			width: canvasW, //this.backgroue_size[0], //this.background_image_size[0], //800
			height: canvasH, //this.backgrouge_size[1], //this.background_image_size[1], //350 500 this.background_image_size[1]
		});
		this.canvas = canvas;
		this.vueCanvas = canvas.getContext();
		//init switch views
		this.view1Save = {};
		this.view2Save = {};
		//for clear
		this.view1Delete = {};
		this.view2Delete = {};
		this.view1 = document.querySelector(".one");
		this.view2 = document.querySelector(".two");
		if (this.flagSideUpload.front === true) {
			this.currentView = 1;
			this.$store.dispatch("changeLoading", true);
			setTimeout(() => {
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
				this.$store.dispatch("changeLoading", false);
			}, 2000);
		} else if (
			this.flagSideUpload.back === true &&
			this.flagSideUpload.front === false
		) {
			this.currentView = 2;
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
			this.switchView2(this.canvas);
		}
		this.originalHeight = 0;
		this.originalWidth = 0;

		/*this.rangeView = document.getElementById("rangeViewOpacity");
    this.rangevalueView = this.rangeView.value / this.rangeView.max;*/

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
		this.view2Save = canvas.toObject([
			"cacheKey",
			"selectable",
			"opacity",
			"id1",
		]);

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
					id1: "green",
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
					id1: "orange",
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
					id1: "red",
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
					id1: "blue",
				}
			);
			this.canvas.add(end_line_back);

			canvas
				.toObject(["cacheKey", "selectable", "opacity", "id1"])
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
					id1: "green1",
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
					id1: "orange1",
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
					id1: "red1",
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
					id1: "blue1",
				}
			);
			this.canvas.add(end_line);
			this.view1Save = canvas.toObject([
				"cacheKey",
				"selectable",
				"opacity",
				"id1",
			]);
		}

		this.view1Save = canvas.toObject([
			"cacheKey",
			"selectable",
			"opacity",
			"id1",
		]);
		/*  points = [pointer.x, pointer.y, pointer.x, pointer.y];*/
		this.loadstate && this.checkIfloaded(canvas);
		console.log("flipped1", this.background_image_view1_flipped);
		console.log("flipped2", this.background_image_view2_flipped);

		///this.showAllArrows()
		this.zoom(canvas)
	},
	methods: {
		/*    chooseOrientation(){
      var image = document.getElementsByClassName("lower-canvas")[0];

      var curAngle = image
      console.log(curAngle.angle)
      curAngle.style.transform = "rotate(90deg)";
    },

    rotateImage90(){
      var image = document.getElementsByClassName("lower-canvas")[0];

      var curAngle = image
      console.log(curAngle.style.transform)
      //curAngle.style.transform = "scaleX(-1);";
      curAngle.style.transform = "rotateY(180deg)";
      /!*if(curAngle.style.transform === "rotate(90deg)") {
        curAngle.style.transform = "rotate(0deg)"
      }*!/
      /!*} else if (curAngle.style.transform === "rotate(0deg)") {
        curAngle.style.transform = "rotate(90deg)";
      }*!/
      console.log(curAngle.style.transform)
    },
    rotateImage0(){
      var image = document.getElementsByClassName("lower-canvas")[0];
      var curAngle = image
      curAngle.style.transform = "rotate(0deg)"
      console.log(curAngle.style.transform)
    },*/
		async showAllArrows() {
			if (this.currentView === 1) {
				for (let i = 0; i < this.arrowCoordinates.length; ++i) {
					await this.showArrows(this.arrowCoordinates[i]);
					console.log(
						"🚀 ~ file: lineEditor.vue ~ line 991 ~ showAllArrows ~ this.arrowCoordinates[i]",
						this.arrowCoordinates[i]
					);
				}
			} else {
				for (let i = 0; i < this.arrowCoordinates2.length; ++i) {
					await this.showArrows(this.arrowCoordinates2[i]);
				}
			}
		},
		deleteArrows() {
			//  console.log(this.canvas.getObjects());
			let toRemoveObjs = [];
			this.objectListChecked1 = [];
			this.objectsList = [];
			this.objectsList2 = [];
			this.objectListChecked2 = [];
			for (let i = 0; i < this.canvas.getObjects().length; ++i) {
				if (this.canvas.getObjects()[i].id1 === "arrow") {
					toRemoveObjs.push(this.canvas.getObjects()[i]);
				}
			}
			for (let i = 0; i < toRemoveObjs.length; ++i) {
				this.canvas.remove(toRemoveObjs[i]);
			}
			//console.log(this.canvas.getObjects());
			//this.$store.dispatch("changeArrowCoordinates", toRemoveObjs);
		},
		async showArrows(obj) {
			console.log(
				"🚀 ~ file: lineEditor.vue ~ line 995 ~ showArrows ~ obj",
				obj.top,
				obj.left
			);

			var imgElement = document.getElementById("my-image");

			var head = new fabric.Image(imgElement, {
				id: "arrow",
				width: 30,
				height: 30,
				left: obj.left * this.layersUrlFront["ratio"],
				top:
					(this.background_image_size[1] - obj.top) *
					this.layersUrlFront["ratio"],
				fill: "#ff0000",
				angle: obj.angle,
				selectable: false,
				id1: "arrow",
			});
			this.canvas.add(head);

			this.canvas.renderAll();
		},
		async checkIfloaded(canvas) {
			console.log(
				"🚀 ~ file: lineEditor.vue ~ line 1094 ~ checkIfloaded ~ canvas",
				canvas
			);
			console.log("I am in check loaded");
			console.log(this.cuttingLineEditor1SwitchObj);
			console.log(this.cuttingLineEditor2SwitchObj);

			if (Object.keys(this.cuttingLineEditor1SwitchObj).length > 0) {
				this.view1Save = this.cuttingLineEditor1SwitchObj;
				console.log(
					"🚀 ~ file: lineEditor.vue ~ line 1101 ~ checkIfloaded ~ this.view1Save",
					this.view1Save
				);
				await canvas.loadFromJSON(
					this.view1Save,
					this.canvas.renderAll.bind(canvas)
				);
				console.log("hello");
			}
			if (Object.keys(this.cuttingLineEditor2SwitchObj).length > 0) {
				this.view2Save = this.cuttingLineEditor2SwitchObj;
				console.log("hello");
			}
			console.log(canvas);
		},
		async saveState(index) {
			let view1;
			let view2;
			let newSave;
			//index = 1;
			switch (index) {
				/*	case 0:
					console.log("I am in export json", index);
					this.$store.dispatch("changeLoading", true);
					view1 = this.view1Save;
					view2 = this.view2Save;
					if (this.currentView === 1) {
						view1 = await this.canvas.toObject([
							"width",
							"height",
							"top",
							"left",
							"lineCoords",
							"lineDirection",
							"lineType",
							"selectable",
							"opacity",
							"id1",
						]);
					} else {
						view2 = await this.canvas.toObject([
							"width",
							"height",
							"top",
							"left",
							"lineCoords",
							"lineDirection",
							"lineType",
							"selectable",
							"opacity",
							"id1",
						]);
					}
					this.$store.dispatch(
						"changeCuttingLineEditor1SwitchObj",
						view1
					);
					this.$store.dispatch(
						"changeCuttingLineEditor2SwitchObj",
						view2
					);
					newSave = this.saveJson;
					newSave["cuttingLineEditor1SwitchObj"] = view1;
					newSave["cuttingLineEditor2SwitchObj"] = view2;
					newSave["jsonFront"] = this.json1;
					newSave["jsonBack"] = this.json2;
					this.$store.dispatch("changeSaveJson", newSave);
					console.log(newSave);
					this.saveTemplateWithoutDownload(newSave);
					this.downloadJsonFile(newSave);
					this.$store.dispatch("changeLoading", false);
					break;*/
				case 1:
					console.log("I am in export json", index);
					this.$store.dispatch("changeLoading", true);
					view1 = this.view1Save;
					view2 = this.view2Save;
					if (this.currentView === 1) {
						view1 = await this.canvas.toObject([
							"width",
							"height",
							"top",
							"left",
							"lineCoords",
							"lineDirection",
							"lineType",
							"selectable",
							"opacity",
							"id1",
						]);
					} else {
						view2 = await this.canvas.toObject([
							"width",
							"height",
							"top",
							"left",
							"lineCoords",
							"lineDirection",
							"lineType",
							"selectable",
							"opacity",
							"id1",
						]);
					}
					this.$store.dispatch(
						"changeCuttingLineEditor1SwitchObj",
						view1
					);
					this.$store.dispatch(
						"changeCuttingLineEditor2SwitchObj",
						view2
					);
					newSave = this.saveJson;
					newSave["cuttingLineEditor1SwitchObj"] = view1;
					newSave["cuttingLineEditor2SwitchObj"] = view2;
					newSave["jsonFront"] = this.json1;
					newSave["jsonBack"] = this.json2;
					this.$store.dispatch("changeSaveJson", newSave);
					console.log(newSave);
					this.saveTemplate(newSave, "s6", ".zip");
					//	this.downloadJsonFile(newSave);
					this.$store.dispatch("changeLoading", false);
					break;
				/*	case 2:
					console.log("I am in export json", index);
					this.$store.dispatch("changeLoading", true);
					view1 = this.view1Save;
					view2 = this.view2Save;
					if (this.currentView === 1) {
						view1 = await this.canvas.toObject([
							"width",
							"height",
							"top",
							"left",
							"lineCoords",
							"lineDirection",
							"lineType",
							"selectable",
							"opacity",
							"id1",
						]);
					} else {
						view2 = await this.canvas.toObject([
							"width",
							"height",
							"top",
							"left",
							"lineCoords",
							"lineDirection",
							"lineType",
							"selectable",
							"opacity",
							"id1",
						]);
					}
					this.$store.dispatch(
						"changeCuttingLineEditor1SwitchObj",
						view1
					);
					this.$store.dispatch(
						"changeCuttingLineEditor2SwitchObj",
						view2
					);
					newSave = this.saveJson;
					newSave["cuttingLineEditor1SwitchObj"] = view1;
					newSave["cuttingLineEditor2SwitchObj"] = view2;
					newSave["jsonFront"] = this.json1;
					newSave["jsonBack"] = this.json2;
					this.$store.dispatch("changeSaveJson", newSave);
					console.log(newSave);
					this.saveTemplate(newSave, "FRONT_END", "json");
					//	this.downloadJsonFile(newSave);
					this.$store.dispatch("changeLoading", false);
					break;*/
				case 3:
					// Export spreed sheet from the back side
					this.saveTemplate(
						newSave,
						this.excelFileName[0],
						"excel",
						
					);
					this.$store.dispatch("changeLoading", false);
					break;
				case 4:
					// Export spreed sheet from the back side
					this.saveTemplate(
						newSave,
						this.excelFileName[1],

						"excel",
						
					);
					this.$store.dispatch("changeLoading", false);
					break;
				default:
					break;
			}
		},
		/*async handleLayer(obj) {
			console.log(this.layersUrlFront)
			if (this.currentView === 1) {
				this.layerChecked1 = [];
			} else {
				this.layerChecked2 = [];
			}
			var arr = [99];
			obj.map((i) => {
				arr.push(i.id);
				console.log(i);
			});
			console.log(this.currentView, arr.includes(1));
			if (this.currentView === 1) {
				if (arr.includes(1)) {
					await this.showAllArrows();
					this.layerChecked1.push({ id: 1, text: "layer1" });
					console.log(
						"🚀 ~ file: lineEditor.vue ~ line 1297 ~ handleLayer ~ this.layerChecked1",
						this.layerChecked1
					);
					console.log(
						"🚀 ~ file: lineEditor.vue ~ line 1297 ~ handleLayer ~ this.layerList1[0]",
						this.layerList1[0]
					);
				}
				//this.layerChecked2.push(this.layerList2[0])}
				else {
					//this.layerChecked1.splice(this.layerChecked1.indexOf(this.layerList1[0]), 1)
					///this.layerChecked2.splice(this.layerChecked2.indexOf(this.layerList2[0]), 1);
					await this.deleteArrows();
				}
			} else {
				if (arr.includes(1)) {
					await this.showAllArrows();
					//this.layerChecked1.push(this.layerList1[0])}
					this.layerChecked2.push(this.layerList2[0]);
				} else {
					//this.layerChecked1.splice(this.layerChecked1.indexOf(this.layerList1[0]), 1)
					this.layerChecked2.splice(
						this.layerChecked2.indexOf(this.layerList2[0]),
						1
					);
					await this.deleteArrows();
				}
			}

			if (arr.includes(2)) {
				this.currentView === 1
					? this.layerChecked1.push(this.layerList1[1])
					: this.layerChecked2.push(this.layerList2[1]);

				if (this.currentView === 1) {
					fabric.Image.fromURL(
						this.layersUrlFront["layer_2"].urlPath, ////url of image
						(img) => {
							img.set({
								left: 0,
								top: 0,
								id: "View1_Overview",
								//id1:"View1_Overview",
								selectable: false,
							});
							img.scaleToHeight(this.newScaledHeight);
							this.canvas.add(img);
							this.canvas.moveTo(img, 0);
							this.canvas.renderAll();
						},
						{ crossOrigin: "anonymous" }
					);
				} else {
					fabric.Image.fromURL(
						this.layersUrlBack["layer_2"].urlPath, ////url of image
						(img) => {
							img.set({
								left: 0,
								top: 0,
								id: "View2_Overview",
								id1: "View2_Overview",
								selectable: false,
							});
							img.scaleToHeight(this.newScaledHeight);
							this.canvas.add(img);
							this.canvas.moveTo(img, 0);
							this.canvas.renderAll();
						},
						{ crossOrigin: "anonymous" }
					);
				}
			} else {
				this.currentView === 1
					? this.layerChecked1.splice(
							this.layerChecked1.indexOf(this.layerList1[1]),
							1
					)
					: this.layerChecked2.splice(
							this.layerChecked2.indexOf(this.layerList2[1]),
							1
					);

				if (this.currentView === 1) {
					this.canvas.getObjects().forEach((o) => {
						if (o.id1 === "View1_Overview") {
							this.canvas.remove(o);
						}
					});
				} else {
					this.canvas.getObjects().forEach((o) => {
						if (o.id1 === "View2_Overview") {
							this.canvas.remove(o);
						}
					});
				}
			}

			if (arr.includes(3)) {
				this.currentView === 1
					? this.layerChecked1.push(this.layerList1[2])
					: this.layerChecked2.push(this.layerList2[2]);

				if (this.currentView === 1) {
					fabric.Image.fromURL(
						this.layersUrlFront["layer_3"].urlPath, ////url of image
						(img) => {
							img.set({
								left: 0,
								top: 0,
								id: "View3_Overview",
								id1: "View3_Overview",

								selectable: false,
							});
							img.scaleToHeight(this.newScaledHeight);
							this.canvas.add(img);
							this.canvas.moveTo(img, 0);
							this.canvas.renderAll();
						},
						{ crossOrigin: "anonymous" }
					);
				} else {
					fabric.Image.fromURL(
						this.layersUrlBack["layer_3"].urlPath, ////url of image
						(img) => {
							img.set({
								left: 0,
								top: 0,
								id: "View4_Overview",
								id1: "View4_Overview",

								selectable: false,
							});
							img.scaleToHeight(this.newScaledHeight);
							this.canvas.add(img);
							this.canvas.moveTo(img, 0);
							this.canvas.renderAll();
						},
						{ crossOrigin: "anonymous" }
					);
				}
			} else {
				this.currentView === 1
					? this.layerChecked1.splice(
							this.layerChecked1.indexOf(this.layerList1[2]),
							1
					)
					: this.layerChecked2.splice(
							this.layerChecked2.indexOf(this.layerList2[2]),
							1
					);

				if (this.currentView === 1) {
					this.canvas.getObjects().forEach((o) => {
						if (o.id1 === "View3_Overview") {
							this.canvas.remove(o);
						}
					});
				} else {
					this.canvas.getObjects().forEach((o) => {
						if (o.id1 === "View4_Overview") {
							this.canvas.remove(o);
						}
					});
				}
			}
		},*/
		async handleLayer1() {
			//this.layerChecked1 = [];
			/*var arr = [];
			obj.map((i) => {
				arr.push(i.id);
				console.log(i);
			});*/
			if (this.layerChecked1.id.find((t) => t.id === 1)) {
				console.log("includes 1");
				//this.layerChecked1.push(this.layerList1[0])
				//	this.layerChecked1.push({ id: 1, text: "layer1" });

				await this.showAllArrows();
			} else {
				///this.layerChecked2.splice(this.layerChecked2.indexOf(this.layerList2[0]), 1);
				await this.deleteArrows();
			}

			if (this.layerChecked1.id.find((t) => t.id === 2)) {
				//this.layerChecked1.push({ id: 2, text: "layer2" });
				this.canvas.getObjects().forEach((o) => {
					if (o.id1 === "View1_Overview_front") {
						this.canvas.remove(o);
					}
				});
				fabric.Image.fromURL(
					this.layersUrlFront["layer_2"].urlPath, ////url of image
					(img) => {
						img.set({
							left: 0,
							top: 0,
							id: "View1_Overview_front",
							id1: "View1_Overview_front",
							selectable: false,
						});
						img.scaleToHeight(this.newScaledHeight);
						this.canvas.add(img);
						this.canvas.moveTo(img, 0);
						this.canvas.renderAll();
					},
					{ crossOrigin: "anonymous" }
				);
			} else {
				this.canvas.getObjects().forEach((o) => {
					if (o.id1 === "View1_Overview_front") {
						this.canvas.remove(o);
					}
				});
			}
			console.log(
				"djsdj",
				this.layerChecked1.id.find((t) => t.id === 3)
			);
			console.log(
				"🚀 ~ file: lineEditor.vue ~ line 1570 ~ handleLayer1 ~ this.layerChecked1",
				this.layerChecked1
			);
			if (this.layerChecked1.id.find((t) => t.id === 3)) {
				//	this.layerChecked1.push({ id: 3, text: "layer3" });
				this.canvas.getObjects().forEach((o) => {
					if (o.id1 === "View3_Overview_front") {
						this.canvas.remove(o);
					}
				});
				fabric.Image.fromURL(
					this.layersUrlFront["layer_3"].urlPath, ////url of image
					(img) => {
						img.set({
							left: 0,
							top: 0,
							id: "View3_Overview_front",
							id1: "View3_Overview_front",

							selectable: false,
						});
						img.scaleToHeight(this.newScaledHeight);
						this.canvas.add(img);
						this.canvas.moveTo(img, 0);
						this.canvas.renderAll();
					},
					{ crossOrigin: "anonymous" }
				);
			} else {
				if (this.currentView === 1) {
					this.canvas.getObjects().forEach((o) => {
						if (o.id1 === "View3_Overview_front") {
							this.canvas.remove(o);
						}
					});
				}
			}
		},
		async handleLayer2() {
			/*var arr = [];
			obj.map((i) => {
				arr.push(i.id);
				console.log(i);
			});*/
			if (this.layerChecked2.id.find((t) => t.id === 1)) {
				await this.showAllArrows();
			} else {
				await this.deleteArrows();
			}

			if (this.layerChecked2.id.find((t) => t.id === 2)) {
				this.canvas.getObjects().forEach((o) => {
					if (o.id1 === "View2_Overview") {
						this.canvas.remove(o);
					}
				});
				fabric.Image.fromURL(
					this.layersUrlBack["layer_2"].urlPath, ////url of image
					(img) => {
						img.set({
							left: 0,
							top: 0,
							id: "View2_Overview",
							id1: "View2_Overview",
							selectable: false,
						});
						img.scaleToHeight(this.newScaledHeight);
						this.canvas.add(img);
						this.canvas.moveTo(img, 0);
						this.canvas.renderAll();
					},
					{ crossOrigin: "anonymous" }
				);
			} else {
				this.canvas.getObjects().forEach((o) => {
					if (o.id1 === "View2_Overview") {
						this.canvas.remove(o);
					}
				});
			}

			if (this.layerChecked2.id.find((t) => t.id === 3)) {
				this.canvas.getObjects().forEach((o) => {
					if (o.id1 === "View4_Overview") {
						this.canvas.remove(o);
					}
				});
				fabric.Image.fromURL(
					this.layersUrlBack["layer_3"].urlPath, ////url of image
					(img) => {
						img.set({
							left: 0,
							top: 0,
							id: "View4_Overview",
							id1: "View4_Overview",

							selectable: false,
						});
						img.scaleToHeight(this.newScaledHeight);
						this.canvas.add(img);
						this.canvas.moveTo(img, 0);
						this.canvas.renderAll();
					},
					{ crossOrigin: "anonymous" }
				);
			} else {
				this.canvas.getObjects().forEach((o) => {
					if (o.id1 === "View4_Overview") {
						this.canvas.remove(o);
					}
				});
			}
		},
		handleObjectsList(obj) {
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 3004 ~ handleObjectsList ~ obj",
				obj
			);
			var arr = [];
			obj.map((i) => {
				arr.push(i.id);
				console.log(i);
			});
			if (this.currentView === 1) {
				this.objectsList.map((item) => {
					if (arr.includes(item.id)) {
						console.log("here1");
						this.canvas
							.getObjects()
							.filter((i) => {
								return i.id1 == item.id;
							})
							.forEach((o) => {
								console.log(o);

								o.set({
									visible: true,
								});
							});
						this.canvas.renderAll();
						//.set({					hidden:false	})
					} else {
						console.log("here2");

						this.canvas
							.getObjects()
							.filter((i) => {
								return i.id1 == item.id;
							})
							.forEach((o) => {
								console.log(o);
								o.set({
									visible: false,
								});
							});
						this.canvas.renderAll();
						//.set({					hidden:false	})
					}
					this.canvas.calcOffset();
				});
			} else {
				this.objectsList2.map((item) => {
					if (arr.includes(item.id)) {
						console.log("here1");
						this.canvas
							.getObjects()
							.filter((i) => {
								return i.id1 == item.id;
							})
							.forEach((o) => {
								console.log(o);

								o.set({
									visible: true,
								});
							});
						this.canvas.renderAll();
						//.set({					hidden:false	})
					} else {
						console.log("here2");

						this.canvas
							.getObjects()
							.filter((i) => {
								return i.id1 == item.id;
							})
							.forEach((o) => {
								console.log(o);
								o.set({
									visible: false,
								});
							});
						this.canvas.renderAll();
						//.set({					hidden:false	})
					}
					this.canvas.calcOffset();
				});
			}
		},
		async downloadJsonFile(json) {
			const data = JSON.stringify(json);
			//const blob = new Blob([data], {type: 'text/plain'})
			const e = document.createEvent("MouseEvents");
			// const link = document.createElement("a");
			const opts = {
				types: [
					{
						description: "Text file",
						accept: { "text/json": [".json"] },
					},
				],
				excludeAcceptAllOption: true,
				multiple: false,
			};
			let fileHandle = await window.showSaveFilePicker(opts);
			// const file = await fileHandle.getFile();
			//link.download = file.name
			/* link.href = window.URL.createObjectURL(blob)
      link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');*/
			const writable = await fileHandle.createWritable();
			await writable.write(data);
			await writable.close();
			e.initEvent("click", true, true);
			// link.dispatchEvent(e);
			//link.remove()
			//link.click();
		},
		vSelectMethod(event, selected) {
			console.log("v-selected", selected);
			//console.log("v-select:", event.target.value)
		},
		async saveTemplate(json, filename, type) {
			let file={type:type,filename:filename}
			await this.axios
				.post(
					this.databaseLocalHost + "/saveStep6",
					{ json: json, file: file },
					{ responseType: "blob" }
				)
				.then((response) => {
					console.log(response);
					const url = window.URL.createObjectURL(
						new Blob([response.data], {
							type: "application/" + type,
						})
					);
					const link = document.createElement("a");
					link.href = url;
					link.setAttribute("download",filename);
					document.body.appendChild(link);
					link.click();
					link.remove();
				})
				.catch((error) => {
					console.log(error);
				});
		},
		async saveTemplateWithoutDownload(json) {
			await this.axios
				.post(
					this.databaseLocalHost + "/saveState",
					{ json: json, step: "s6", id: this.uuid },
					{ responseType: "blob" }
				)
				.catch((error) => {
					console.log(error);
				});
		},
		async switchToPaintTool() {
			if (
				this.doneTransitionList["switchview"] === false &&
				this.flagSideUpload.front === true &&
				this.flagSideUpload.back === true
			) {
				this.switchViewDone = true;
				return;
			}

			let view1 = this.view1Save;
			let view2 = this.view2Save;

			console.log(view1, view2);

			this.$store.dispatch("changeLoading", true);

			if (this.currentView === 1) {
				view1 = await this.canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
					"id1",
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
					"id1",
				]);
				this.imageSwitch2.src = this.canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
			}

			this.$store.dispatch("changeCuttingLineEditor1SwitchObj", view1);
			this.$store.dispatch("changeCuttingLineEditor2SwitchObj", view2);
			let newSave = this.saveJson;
			newSave["cuttingLineEditor1SwitchObj"] = view1;
			newSave["cuttingLineEditor2SwitchObj"] = view2;
			newSave["jsonFront"] = this.json1;
			newSave["jsonBack"] = this.json2;
			await this.$store.dispatch("changeSaveJson", newSave);
			console.log(newSave);
			console.log(this.imageSwitch1.src);
			console.log(this.imageSwitch2.src);
			let back_image;
			let front_image;
			if (this.flagSideUpload.front === true) {
				front_image = await this.saveCanvasToBackend(
					this.imageSwitch1.src,
					"front.png"
				);
			}
			if (this.flagSideUpload.back === true) {
				back_image = await this.saveCanvasToBackend(
					this.imageSwitch2.src,
					"back.png"
				);
			}
			// let front_url = this.databaseLocalHost + "/static/switching/front.png";
			// let back_url = this.databaseLocalHost + "/static/switching/back.png";
			let templateObj = await this.createTemplateImage(
				front_image,
				back_image,
				this.template
			);
			console.log(templateObj);

			let template_image_url =
				this.databaseLocalHost + "/static/export/exported_image.png";
			//let template_size = templateObj.filesize;
			let template_size = {
				filesize: templateObj.filesize,
				frontImgOffsetX: templateObj.frontImgOffsetX,
				frontImgOffsetY: templateObj.frontImgOffsetY,
				backImgOffsetX: templateObj.backImgOffsetX,
				backImgOffsetY: templateObj.backImgOffsetY,
			};
			let template_layerPath={
				layer_1:templateObj.layer1_filepath,
				layer_2:templateObj.layer2_filepath,
				layer_3:templateObj.layer3_filepath
			}
            console.log("🚀 ~ file: lineEditor.vue ~ line 1928 ~ switchToPaintTool ~ template_layerPath", template_layerPath)
			console.log(
				"🚀 ~ file: lineEditor.vue ~ line 1920 ~ switchToPaintTool ~ template_size",
				template_size
			);
			this.$store.dispatch("changeTemplateImage", template_image_url);
			this.$store.dispatch("changeTemplateImageSize", template_size);

			this.$store.dispatch("changeLoading", false);
			this.$store.dispatch("changeLayerpainttool",template_layerPath)
			console.log("switch to paint tool");
			this.$router.push("paint_tool");
			console.log(this.saveJson);
		},

		async createTemplateImage(front, back, template) {
			console.log(
				"🚀 ~ file: lineEditor.vue ~ line 1940 ~ createTemplateImage ~ front",
				front
			);
			console.log(
				"🚀 ~ file: lineEditor.vue ~ line 1924 ~ createTemplateImage ~ back",
				back
			);
			let payload = {
				template: template,
				front_url: front,
				back_url: back,
				layersUrlBack: this.layersUrlBack,
				layersUrlFront: this.layersUrlFront,
				createLayers:this.flagSideUpload.back?true:false
			};
			let filepath = "";
			let layer1_filepath="";
			let layer2_filepath="";
			let layer3_filepath="";
			let filesize = [0, 0];
			let backImgOffsetY = 0;
			let frontImgOffsetX = 0;
			let frontImgOffsetY = 0;
			let backImgOffsetX = 0;
			console.log(this.layersUrlBack,this.layersUrlFront)
			
			await this.axios
				.post(this.databaseLocalHost + "/createExport", payload)
				.then((response) => {
					console.log(response);
					filepath = response["data"]["filepath"];
					filesize = response["data"]["filesize"];
					layer1_filepath=response["data"]["layer1_filepath"];
					layer2_filepath=response["data"]["layer2_filepath"];
					layer3_filepath=response["data"]["layer3_filepath"];
					frontImgOffsetX = response["data"]["frontImgOffsetX"];
					frontImgOffsetY = response["data"]["frontImgOffsetY"];
					backImgOffsetX = response["data"]["backImgOffsetX"];
					backImgOffsetY = response["data"]["backImgOffsetY"];
				})
				.catch((error) => {
					console.log(error);
				});

			return {
				filepath: filepath,
				layer1_filepath:layer1_filepath,
				layer2_filepath:layer2_filepath,
				layer3_filepath:layer3_filepath,
				filesize: filesize,
				frontImgOffsetX: frontImgOffsetX,
				frontImgOffsetY: frontImgOffsetY,
				backImgOffsetX: backImgOffsetX,
				backImgOffsetY: backImgOffsetY,
			};
		},

		async saveCanvasToBackend(image_data, filename) {
			// const options = {};//{crossOrigin:"Anonymous"};
			// var image = document.getElementsByClassName("lower-canvas")[0];
			// const printCanvas = await html2canvas(image, options);
			// let image_data = printCanvas.toDataURL({format: "image/png", multiplier: (1/this.scaleRatio)});

			let data = { image: image_data, filename: filename };
			let returnData = "";
			console.log(data);
			await this.axios
				.post(this.databaseLocalHost + "/saveCanvasToSwitch", data)
				.then((response) => {
					console.log(response);
					returnData = response["data"];
				})
				.catch((error) => {
					console.log(error);
				});
			return returnData;
		},
		async fetchFileName() {

			let returnData = "";
			await this.axios
				.post(this.databaseLocalHost + "/fetchFileName")
				.then((response) => {
					console.log(response);
					returnData = response["data"]["filename"];
				})
				.catch((error) => {
					console.log(error);
				});
			return returnData;
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
			this.$store.dispatch("changeLoading", true);

			this.view = true;
			this.showShapeSelection = false;
			this.layerChecked = this.layerChecked1;
			console.log(
				"🚀 ~ file: lineEditor.vue ~ line 1757 ~ switchView1 ~ this.layerChecked",
				this.layerChecked
			);
			console.log(
				"🚀 ~ file: lineEditor.vue ~ line 1799 ~ switchView2 ~ this.layerChecked",
				this.layerChecked1
			);

			if (this.currentView === 2) {
				if (this.last["view1"] != undefined) {
					this.lastelement = this.last["view1"];
				}
				console.log(this.lastelement);
				this.view2Save = canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
					"id1",
					"id",
				]);
				this.imageSwitch2.src = canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				console.log("her2e", this.view2Save);
				console.log("her2e", this.view1Save);

				//////////////////////////here////////////////////////////
				this.image2.src = canvas.toDataURL("image/png");
				canvas.clear();
				canvas.loadFromJSON(
					this.view1Save,
					this.canvas.renderAll.bind(canvas)
				);
				this.currentView = 1;
			}
			this.objectListChecked = this.objectListChecked1;
			this.currentView = 1;
			this.$store.dispatch("changeLoading", false);
		},
		//method to switch from "view 2" to "view 1"
		switchView2(canvas) {
			this.$store.dispatch("changeLoading", true);

			//console.log("img", this.background_image_view2);
			//console.log("flipped1", this.background_image_view1_flipped);
			//console.log("flipped2", this.background_image_view2_flipped);
			this.view = false;
			//this.objectListChecked = this.objectListChecked2;
			//this.layerChecked = this.layerChecked2;

			this.showShapeSelection = false;

			//  console.log("this.last[view2]", this.last["view2"]);
			if (this.background_image_view2 !== "") {
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
			if (this.currentView === 1) {
				if (this.last["view2"] != undefined) {
					this.lastelement = this.last["view2"];
				} else if (this.last["view2"] === undefined && this.nbr == 0) {
					this.last["view2"] = "none";
				}
				///console.log(canvas);
				console.log(canvas.backgroundImage.src);
				this.view1Save = {};

				this.view1Save = canvas.toObject([
					"cacheKey",
					"src",
					"width",
					"height",
					"top",
					"left",
					"lineCoords",
					"lineDirection",
					"lineType",
					"selectable",
					"opacity",
					"id1",
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

			let listTemp = {};
			listTemp = this.doneTransitionList;
			listTemp["switchview"] = true;
			this.$store.dispatch("changeDoneTransitionList", listTemp);
			this.currentView = 2;
			this.$store.dispatch("changeLoading", false);
		},
		/*viewHandler(event, canvas) {
      console.log("views", event.target.value);
      if (this.currentView === 1) {
        if (event.target.value === "views2-id") {
          canvas.getObjects().forEach(o => {
            if (o.id === "View4_Overview") {
              console.log('o.id', o.id)
              canvas.remove(o)
            }
          })
            var viewInstance2 = new fabric.Image(this.image2, {
          //var viewInstance2 = new fabric.Image(this.background_image_view2_flipped, {
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
        } else if (event.target.value === "views4-id"){
          canvas.getObjects().forEach(o => {
            if (o.id === "View2_Overview") {
              console.log('o.id', o.id)
              canvas.remove(o)
            }
          })
          console.log("flipped1", this.background_image_view2_flipped)
          fabric.Image.fromURL(this.background_image_view2_flipped,
              (img) => {
                img.set({
                  left: 0,
                  top: 0,
                  id: "View4_Overview",
                  selectable: false,
                });
                //img.set({height: this.background_image_size[0], width:this.background_image_size[1] }); //background_image_height = 500
                img.scaleToHeight(this.newScaledHeight);
                //img.scaleToHeight(this.background_image_size[0]); //background_image_height = 500
                //img.scaleToWidth(this.background_image_size[1]); //background_image_width = 500
                canvas.add(img);
                canvas.moveTo(img, 0);
                this.rangeView.addEventListener("change", () => {
                  img.set({
                    opacity: this.rangeView.value / this.rangeView.max,
                  });
                  canvas.renderAll();
                });
                canvas.renderAll();
              },
              {crossOrigin: "anonymous"}
          );
        }
      } else if (this.currentView === 2) {
        if (event.target.value === "views1-id") {
          canvas.getObjects().forEach(o => {
            if (o.id === "View3_Overview") {
              console.log('o.id', o.id)
              canvas.remove(o)
            }
          })
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
        } else if (event.target.value === "views3-id"){
          canvas.getObjects().forEach(o => {
            if (o.id === "View1_Overview") {
              console.log('o.id', o.id)
              canvas.remove(o)
            }
          })
          console.log("flipped1", this.background_image_view1_flipped)
          fabric.Image.fromURL(this.background_image_view1_flipped,
              (img) => {
                img.set({
                  left: 0,
                  top: 0,
                  id: "View3_Overview",
                  selectable: false,
                });
                //img.set({height: this.background_image_size[0], width:this.background_image_size[1] }); //background_image_height = 500
                img.scaleToHeight(this.newScaledHeight);
                //img.scaleToHeight(this.background_image_size[0]); //background_image_height = 500
                //img.scaleToWidth(this.background_image_size[1]); //background_image_width = 500
                canvas.add(img);
                canvas.moveTo(img, 0);
                this.rangeView.addEventListener("change", () => {
                  img.set({
                    opacity: this.rangeView.value / this.rangeView.max,
                  });
                  canvas.renderAll();
                });
                canvas.renderAll();
              },
              {crossOrigin: "anonymous"}
          );
        }
        else if (event.target.value === "none") {
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
          } else if (o.id === "View3_Overview") {
            console.log("o.id", o.id);
            canvas.remove(o);
          } else if (o.id === "View4_Overview") {
            console.log("o.id", o.id);
            canvas.remove(o);
          }
        });
      }
      canvas.renderAll();
    },*/
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
			this.showShapeSelection = true;

			var isDrawing;
			var line;
			var colorId = document.getElementById("text-color");
			var lineWidth = document.getElementById("line-width");
			let lineId = document.getElementById("line-type");
			var lineDirection = "";
			let lineCoords = [];
			let coord1 = {};
			let coord2 = {};
			let coords = {};

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
						id1: this.indexId,

						//lockScalingY: true,
					});
					this.indexId++;

					canvas.add(line);

					/*line.setControlsVisibility({ mtr: false,tr: false,
            tl: false,
            br: false,
            bl: false,
            mt: false,
            mb: false,
          });*/

					canvas.setActiveObject(line);

					if (lineId.value === "straightLine") {
						console.log(lineId.value);
						//line.set({ stroke: 5 });
						line.set({ stroke: colorId.value });
					} else if (lineId.value === "dashedLine") {
						line.set({ strokeDashArray: [20, 5] });
					} else if (lineId.value === "dottedLine") {
						console.log(lineId.value);
						line.set({ strokeDashArray: [5, 7] });
					}
					this.lineWidth(canvas);
					this.lineType(canvas);
					this.changeColor(canvas);
					console.log(line);
					if (this.currentView === 1) {
						this.indexstack++;
						this.view1SaveUndoRedo.length = this.indexstack - 1;
						this.view1SaveUndoRedo.push({
							action: "created",
							value: canvas._objects[canvas._objects.length - 1],
						});
					} else if (this.currentView === 2) {
						this.indexstack2++;
						this.view2SaveUndoRedo.length = this.indexstack2 - 1;
						this.view2SaveUndoRedo.push({
							action: "created",
							value: canvas._objects[canvas._objects.length - 1],
						});
					}
				}
			});
			canvas.on("mouse:move", function (o) {
				if (isDrawing) {
					var pointer = canvas.getPointer(o.e);
					//console.log("pointer.x", pointer.x, "pointer.y", pointer.y);
					line.set({ x2: pointer.x, y2: pointer.y });
					var startX = points[0];
					var startY = points[1];
					var x2 = pointer.x - startX;
					var y2 = pointer.y - startY;
					var angle = (Math.atan2(y2, x2) / Math.PI) * 180;
					/*console.log("pointer.x", pointer.x, "startX", startX);
          console.log("pointer.y", pointer.x, "startY", startY);*/
					console.log("x2", pointer.x, "startX", startX);
					console.log("y2", pointer.x, "startY", startY);
					angle = (angle % 360) + 180;
					console.log(
						"🚀 ~ file: PaintTool.vue ~ line 2185 ~ angle",
						angle
					);
					var r = Math.sqrt(x2 * x2 + y2 * y2);

					if (angle <= 22.5 || angle >= 337.5) {
                            angle = 0;
                            line.set({ x2: pointer.x, y2: startY });
                        } else if (angle <= 67.5) {
                            angle = 45;
                            line.set({ x2: pointer.x, y2: startY });

                        } else if (angle <= 112.5) {
                            angle = 90;
							line.set({ x2: pointer.x, y2: startY });

                        } else if (angle <= 157.5) {
                            angle = 135;
							line.set({ x2: pointer.x, y2: startY });

                        } else if (angle <= 202.5) {
                            angle = 180;
                        } else if (angle <= 247.5) {
                            angle = 225;
                        } else if (angle <= 292.5) {
                            angle = 270;
                            line.set({ x2: startX, y2: pointer.y });
                        } else if (angle < 337.5) {
                            angle = 315;
                            line.set({ x2: pointer.x, y2: startY });
                        }
						//line.set({ x2: startX, y2: pointer.y });
					angle -= 180;
					var cosx = r * Math.cos((angle * Math.PI) / 180);
					var sinx = r * Math.sin((angle * Math.PI) / 180);
					//console.log("lineDirection",lineDirection)
					line.set({
						x2: cosx + startX,
						y2: sinx + startY,
					});
					canvas.renderAll();
				}
				/*if(x2 === y2){
          lineDirection = "horizontal"
          console.log("lineDirection",lineDirection)
        } else if (x2 === startX === y2) {
          lineDirection = "vertical"
          console.log("vertical",lineDirection)
        }*/
			});

			canvas.on("mouse:up", function () {
				line.setCoords();
				canvas.setActiveObject(line);
				isDrawing = false;
				lineCoords = line.getCoords();
				coord1 = { x: line.left, y: line.top };
				coord2 = {
					x: line.left + line.width,
					y: line.top + line.height,
				};
				coords = [coord1, coord2];
				console.log("line coords", coords);
				//lineCoords = line.coords
				console.log("lineCoords", lineCoords);
				if (coord1.x === coord2.x) {
					//return 0;
					console.log("vertical");
					line.set({ lockScalingX: true, lockScalingY: false });
					line.setControlsVisibility({
						mtr: false,
						tr: false,
						tl: false,
						br: false,
						bl: false,
						mt: true,
						mb: true,
						mr: false,
						ml: false,
					});
				} else if (coord1.y === coord2.y) {
					//return 1;
					console.log("horizontal");
					line.set({ lockScalingX: false, lockScalingY: true });
					line.setControlsVisibility({
						mtr: false,
						tr: false,
						tl: false,
						br: false,
						bl: false,
						mt: false,
						mb: false,
					});
				}
				console.log(line);
			});
			console.log("lineDirection", lineDirection);
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
			this.objectListChecked1 = [];
			this.objectListChecked = [];
			console.log(this.layerChecked1);
			let tmp = this.layerChecked1;
			this.layerChecked1 = tmp;
			this.objectsList = [];
			this.objectsList2 = [];
			this.objectListChecked2 = [];
			this.shapeDraw = true;
			this.zoomMode = true;
			this.lineDraw = true;
			this.showShapeSelection = true;

			console.log(canvas._objects);
			this.removeCanvasEvents(canvas);
			canvas.selection = true;

			canvas.getObjects().forEach((o) => {
				//if (o.id === "added-line") {
				o.set({
					selectable: true,
				});
				switch (o.id) {
					case "added-line":
						this.lineWidth();
						this.lineType();
						this.changeColor();
						/*o.set({
							strokeWidth : 9
						});*/
						
						console.log("added line",o);
						break;
					default:
						console.log("any line",o);
				}
				/*this.lineWidth(canvas)
				this.lineType(canvas);
				this.changeColor(canvas);*/
				console.log(this.objectListChecked);
				if (this.currentView === 1) {
					this.objectsList.push({
						id: o.id1,
						value: "Shape line with ID: " + o.id1,
						selected: false,
					});
					if (o.visible === true) {
						this.objectListChecked.push({
							id: o.id1,
							value: "Shape line with ID: " + o.id1,
							selected: true,
						});
					}
				} else if (this.currentView === 2) {
					this.objectsList2.push({
						id: o.id1,
						value: "Shape line with ID: " + o.id1,
						selected: false,
					});
					this.objectListChecked.push({
						id: o.id1,
						value: "Shape line with ID: " + o.id1,
						selected: false,
					});
				}

				// }
			});

			/*for(let i=this.view?this.lengthOfJsonFront:this.lengthOfJsonBack;i<canvas.getObjects().length;i++){
      canvas.getObjects()[i].set({
            selectable: true,
          })

      }*/
			console.log("after selection");
			console.log(this.objectListChecked);
			canvas.on("selection:created", (e) => {
				//this.lineDraw = true;

				e.selected.forEach((o) => {
					this.tempSelectedObjects.push({
						type: o.id,
						id: o.id1,
						left: o.oCoords.tl.x,
						top: o.oCoords.tl.y,
					});
				});
				canvas.renderAll();
				console.log(
					"🚀 ~ file: lineEditor.vue ~ line 1464 ~ e.selected.forEach ~ this.tempSelectedObjects",
					this.tempSelectedObjects
				);
			});

			canvas.on("selection:cleared", (e) => {
				console.log(
					"🚀 ~ file: lineEditor.vue ~ line 1464 ~ e.selected.forEach ~ this.tempSelectedObjects",
					this.tempSelectedObjects
				);

				this.tempSelectedObjects = this.tempSelectedObjects.filter(
					(value, index, self) =>
						index === self.findIndex((t) => t.id === value.id)
				);

				if (
					e.deselected &&
					e?.deselected[0]?.left !==
						this?.tempSelectedObjects[0]?.left &&
					JSON.stringify(this.tempSelectedObjects) !== [] &&
					this.tempSelectedObjects?.length !== 0
				) {
					console.log("diffffff", e);
					if (this.currentView === 1 && e.e !== undefined) {
						console.log(
							"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2086 ~ canvas.on ~ currentViewjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"
						);
						this.indexstack++;
						this.view1SaveUndoRedo.length = this.indexstack - 1;
						this.view1SaveUndoRedo.push({
							action: "selected",
							value: JSON.stringify(this.tempSelectedObjects),
						});
					} else if (this.currentView === 2 && e.e !== undefined) {
						this.indexstack2++;
						this.view2SaveUndoRedo.length = this.indexstack2 - 1;
						this.view2SaveUndoRedo.push({
							action: "selected",
							value: JSON.stringify(this.tempSelectedObjects),
						});
					}
					this.tempSelectedObjects.length = 0;
				}

				this.tempSelectedObjects.length = 0;

				// console.log('cleared', e);
			});
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
					console.log(o)
					if (o.id === "added-line") {
						o.set({ strokeWidth: lineWidth.value });
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
			const step = 2;
			console.log("hello from escape listener");
			//window.onload = function () {
			var ctrlDown = false,
				ctrlKey = 17,
				cmdKey = 91,
				delKey = 46,
				//supprimKey = 8,
				vKey = 86,
				//xKey = 88,
				cKey = 67,
				yKey = 89,
				zKey = 90,
				leftKey = 37,
				upKey = 38,
				rightKey = 39,
				downKey = 40;
			//var clipboard

			document.addEventListener(
				"keydown",
				function (event) {
					console.log(event.keyCode);
					if (event.keyCode === ctrlKey || event.keyCode === cmdKey) {
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

						//this.message = "ctrl + paste pressed";
					}
					if (event.keyCode === delKey) {
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
					if (event.keyCode === rightKey ) {
						canvas.getActiveObjects().forEach((o) => {
							console.log(o)
							o.left = o.left + step;
						});
						canvas.renderAll();
					}
					if (event.keyCode === leftKey ) {
						canvas.getActiveObjects().forEach((o) => {
							console.log(o)
							o.left = o.left - step;
						});
						canvas.renderAll();
					}
					if (event.keyCode === upKey ) {
						event.preventDefault();
						canvas.getActiveObjects().forEach((o) => {
							console.log(o)
							o.top = o.top - step;
						});
						canvas.renderAll();
					}
					if (event.keyCode === downKey ) {
						event.preventDefault();
						canvas.getActiveObjects().forEach((o) => {
							console.log(o)
							o.top = o.top + step;
						});
						canvas.renderAll();
					}
				},
				false
			);
			//}
		},
		pasteObject(canvas) {
			var clipboard;
			this.showShapeSelection = false;

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
			this.showShapeSelection = false;

			if (doomedObj.type === "activeSelection") {
				this.view1SaveUndoRedo.length = this.indexstack;
				doomedObj.canvas = canvas;
				if (this.currentView === 1) {
					doomedObj.forEachObject(function (obj) {
						canvas.remove(obj);
					});
				} else if (this.currentView === 2) {
					doomedObj.forEachObject(function (obj) {
						canvas.remove(obj);
					});
				}
			} else {
				if (doomedObj !== null) {
					if (this.currentView === 1) {
						this.view1SaveUndoRedo.push({
							action: "deleted",
							value: doomedObj,
						});
						this.indexstack++;
					} else if (this.currentView === 2) {
						this.view2SaveUndoRedo.push({
							action: "deleted",
							value: doomedObj,
						});
						this.indexstack2++;
					}
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
		/*
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
          canvas._objects[canvas._objects.length - 1].id !== "fixed-line"
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
    },*/
		undoObject(canvas) {
			this.showShapeSelection = false;
			//view1SaveUndoRedo = this.view1Save
			if (this.currentView === 1 && this.indexstack - 1 >= 0) {
				if (
					this.currentView === 1
					//canvas._objects.length > 0 &&
					// canvas._objects[canvas._objects.length - 1].id !== "fixed-line"
				) {
					console.log(
						"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2627 ~ undoObject ~ this.view2SaveUndoRedo",
						this.view1SaveUndoRedo
					);
					console.log(
						"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2627 ~ undoObject ~ this.view2SaveUndoRedo",
						this.indexstack
					);
					if (
						this.view1SaveUndoRedo[this.indexstack - 1]?.action ===
						"deleted"
					) {
						canvas.add(
							this.view1SaveUndoRedo[this.indexstack - 1].value
						);
						this.indexstack--;
					} else if (
						this.view1SaveUndoRedo[this.indexstack - 1]?.action ===
						"created"
					) {
						canvas._objects.pop();
						this.indexstack--;
						///this.view2SaveUndoRedo.push(canvas._objects.pop());
					} else if (
						this.view1SaveUndoRedo[this.indexstack - 1]?.action ===
						"selected"
					) {
						console.log(this.indexstack);
						console.log(canvas.getObjects());

						JSON.parse(
							this.view1SaveUndoRedo[this.indexstack - 1]?.value
						).forEach((ob, index, array) => {
							let tmp = {};
							//tmp.left=canvas?.getObjects()[ob.id].left;
							// tmp.top=canvas?.getObjects()[ob.id].top;
							tmp.left = canvas
								?.getObjects()
								.find((e) => e.id1 === ob.id).left;
							tmp.top = canvas
								?.getObjects()
								.find((e) => e.id1 === ob.id).top;

							JSON.parse(
								this.view1SaveUndoRedo[this.indexstack - 1]
									.value
							).length > 1
								? canvas
										?.getObjects()
										.find((e) => e.id1 === ob.id)
										.set({
											left: ob.left,
											top: ob.top,
											selectable: true,
										})
								: canvas
										?.getObjects()
										.find((e) => e.id1 === ob.id)
										.set({
											left: ob.left,
											top: ob.top,
											selectable: true,
										});
							array[index].left = tmp.left;
							array[index].top = tmp.top;
							canvas.setActiveObject(
								canvas
									?.getObjects()
									.find((e) => e.id1 === ob.id)
							);
							if (index === array.length - 1) {
								this.view1SaveUndoRedo[
									this.indexstack - 1
								].value = JSON.stringify(array);
							}
						});
						canvas.renderAll();

						this.indexstack--;
						///this.view2SaveUndoRedo.push(canvas._objects.pop());*/
						//this.canvas.undo();
					}
					// }
					canvas.renderAll();
				}
			} else if (this.currentView === 2 && this.indexstack2 >= 0) {
				//this.view2SaveUndoRedo.push(canvas._objects.pop());

				if (
					this.view2SaveUndoRedo[this.indexstack2 - 1]?.action ===
					"deleted"
				) {
					canvas.add(
						this.view2SaveUndoRedo[this.indexstack2 - 1].value
					);
					this.indexstack2--;
				} else if (
					this.view2SaveUndoRedo[this.indexstack2 - 1]?.action ===
					"created"
				) {
					canvas._objects.pop();
					this.indexstack2--;
					///this.view2SaveUndoRedo.push(canvas._objects.pop());
				} else if (
					this.view2SaveUndoRedo[this.indexstack2 - 1]?.action ===
					"selected"
				) {
					console.log(
						"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2627 ~ undoObject ~ this.view2SaveUndoRedo",
						this.view2SaveUndoRedo
					);
					console.log(
						"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2627 ~ undoObject ~ this.view2SaveUndoRedo",
						this.indexstack2
					);

					JSON.parse(
						this.view2SaveUndoRedo[this.indexstack2 - 1]?.value
					).forEach((ob, index, array) => {
						let tmp = {};
						tmp.left = canvas
							?.getObjects()
							.find((e) => e.id1 === ob.id).left;
						tmp.top = canvas
							?.getObjects()
							.find((e) => e.id1 === ob.id).top;
						JSON.parse(
							this.view2SaveUndoRedo[this.indexstack2 - 1].value
						).length > 1
							? canvas
									?.getObjects()
									.find((e) => e.id1 === ob.id)
									.set({
										left: ob.left,
										top: ob.top,
										selectable: true,
									})
							: canvas
									?.getObjects()
									.find((e) => e.id1 === ob.id)
									.set({
										left: ob.left,
										top: ob.top,
										selectable: true,
									});
						array[index].left = tmp.left;
						array[index].top = tmp.top;
						canvas.setActiveObject(
							canvas?.getObjects().find((e) => e.id1 === ob.id)
						);
						if (index === array.length - 1) {
							this.view2SaveUndoRedo[this.indexstack2 - 1].value =
								JSON.stringify(array);
						}
					});
					canvas.renderAll();

					this.indexstack2--;
					///this.view2SaveUndoRedo.push(canvas._objects.pop());*/
					//this.canvas.undo();
				}
				canvas.renderAll();
			}
		},
		redoObject(canvas) {
			this.showShapeSelection = false;
			if (
				this.currentView === 1 &&
				this.indexstack <= this.view1SaveUndoRedo.length - 1
			) {
				if (
					this.view1SaveUndoRedo[this.indexstack]?.action ===
					"created"
				) {
					this.isRedoing = true;
					canvas.add(this.view1SaveUndoRedo[this.indexstack].value);
					this.indexstack++;
				} else if (
					this.view1SaveUndoRedo[this.indexstack]?.action ===
					"deleted"
				) {
					canvas._objects.pop();
					this.indexstack++;
				} else if (
					this.view1SaveUndoRedo[this.indexstack]?.action ===
					"selected"
				) {
					JSON.parse(
						this.view1SaveUndoRedo[this.indexstack].value
					).forEach((ob, index, array) => {
						let tmp = {};
						tmp.left = canvas
							?.getObjects()
							.find((e) => e.id1 === ob.id).left;
						tmp.top = canvas
							?.getObjects()
							.find((e) => e.id1 === ob.id).top;
						JSON.parse(
							this.view1SaveUndoRedo[this.indexstack].value
						).length > 1
							? canvas
									?.getObjects()
									.find((e) => e.id1 === ob.id)
									.set({
										left: ob.left,
										top: ob.top,
										selectable: true,
									})
							: canvas
									?.getObjects()
									.find((e) => e.id1 === ob.id)
									.set({
										left: ob.left,
										top: ob.top,
										selectable: true,
									});

						array[index].left = tmp.left;
						array[index].top = tmp.top;
						canvas.setActiveObject(
							canvas?.getObjects().find((e) => e.id1 === ob.id)
						);
						if (index === array.length - 1) {
							this.view1SaveUndoRedo[this.indexstack].value =
								JSON.stringify(array);
						}
						canvas.renderAll();
					});
					canvas.renderAll();
					this.indexstack++;
				}
			} else if (
				this.currentView === 2 &&
				this.indexstack2 < this.view2SaveUndoRedo.length
			) {
				if (
					this.view2SaveUndoRedo[this.indexstack2]?.action ===
					"created"
				) {
					this.isRedoing = true;
					canvas.add(this.view2SaveUndoRedo[this.indexstack2].value);
					this.indexstack2++;
				} else if (
					this.view2SaveUndoRedo[this.indexstack2]?.action ===
					"deleted"
				) {
					canvas._objects.pop();
					this.indexstack2++;
				} else if (
					this.view2SaveUndoRedo[this.indexstack2]?.action ===
					"selected"
				) {
					JSON.parse(
						this.view2SaveUndoRedo[this.indexstack2].value
					).forEach((ob, index, array) => {
						let tmp = {};
						tmp.left = canvas
							?.getObjects()
							.find((e) => e.id1 === ob.id).left;
						tmp.top = canvas
							?.getObjects()
							.find((e) => e.id1 === ob.id).top;
						JSON.parse(
							this.view2SaveUndoRedo[this.indexstack2].value
						).length > 1
							? canvas
									?.getObjects()
									.find((e) => e.id1 === ob.id)
									.set({
										left: ob.left,
										top: ob.top,
										selectable: true,
									})
							: canvas
									?.getObjects()
									.find((e) => e.id1 === ob.id)
									.set({
										left: ob.left,
										top: ob.top,
										selectable: true,
									});

						array[index].left = tmp.left;
						array[index].top = tmp.top;
						canvas.setActiveObject(
							canvas?.getObjects().find((e) => e.id1 === ob.id)
						);
						if (index === array.length - 1) {
							this.view2SaveUndoRedo[this.indexstack2].value =
								JSON.stringify(array);
						}
						canvas.renderAll();
					});
					canvas.renderAll();
					this.indexstack2++;
				}
			}
		},
		/*
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
        
    fabric.Image.fromURL(this.background_image_view1,
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
        {crossOrigin: "anonymous"}
    );
      } else if (this.currentView === 2) {
    fabric.Image.fromURL(this.background_image_view2,
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
        {crossOrigin: "anonymous"}
    );
      }
    },*/
		clearCanvas(canvas) {
			//var objRemove = {}
			this.shapeDraw = false;
			this.zoomMode = false;
			this.lineDraw = false;
			this.showShapeSelection = false;
			this.objectListChecked1 = [];
			this.objectsList = [];
			this.objectsList2 = [];
			this.objectListChecked2 = [];
			//this.viewSaveClearAllShap
			//this.viewSaveClearAllShapes.push(canvas._objects.pop());

			if (this.currentView === 1) {
				this.view1SaveUndoRedo.length = this.indexstack;
				this.view1Delete = canvas.toJSON(this.background_image_view1);
				console.log("this.view1Delete", this.view1Delete);
				//for each object in the canvas
				// this.view1SaveUndoRedo=[]
				canvas
					.getObjects()
					.reverse()
					.forEach((temp) => {
						console.log(this.view1SaveUndoRedo);
						this.view1SaveUndoRedo.push({
							action: "deleted",
							value: temp,
						});
						this.indexstack++;
					});
				this.view1SaveUndoRedo.length === this.indexstack
					? this.view1SaveUndoRedo.length === this.indexstack
					: this.view1SaveUndoRedo.length === this.indexstack - 1;
			} else if (this.currentView === 2) {
				this.view2SaveUndoRedo.length = this.indexstack2;
				//for each object in the canvas
				// this.view1SaveUndoRedo=[]
				canvas
					.getObjects()
					.reverse()
					.forEach((temp) => {
						this.view2SaveUndoRedo.push({
							action: "deleted",
							value: temp,
						});
						this.indexstack2++;
					});
			}

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
