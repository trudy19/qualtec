<template>
	<div id="app">
		<div>{{ message }}</div>
		<div v-if="overlays">
			<div v-for="(image, index) in overlays" v-bind:key="index">
				<img
					:src="image"
					alt=""
					:id="'id-overlay' + index"
					crossorigin="anonymous"
				/>
				<!--        <img :src="image" alt="" :id="'id-overlay_back'+index" crossorigin="anonymous"/>-->
			</div>
		</div>
		<!--    <div v-if="overlays_back">-->
		<div v-for="(image, index) in overlays_back" v-bind:key="index">
			<!--        <img :src="image" alt="" :id="'id-overlay'+index" crossorigin="anonymous"/>-->
			<img
				:src="image"
				alt=""
				:id="'id-overlay_back' + index"
				crossorigin="anonymous"
			/>
		</div>
		<!-- select opposite view and transparency -->

		<div class="navbarStyle">
			<v-app-bar elevation="4" class="navbarStyleW" outlined rounded>
				<!-- style="width: 1200px"-->

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

				<!-- <v-btn @click="changeColor(canvas)" v-bind:class="{ img2: !shapeDraw }">
          <v-icon dark> mdi-format-color-fill </v-icon>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <input
                type="color"
                value=""
                id="text-color"
                size="50"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <span>{{ $t("tools.changeColor") }}</span>
          </v-tooltip>
          <v-divider vertical></v-divider>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <input
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
        </v-btn> -->

				<template
					v-if="currentSelected == 'line'"
					v-bind:class="{ img2: !lineDraw }"
				>
					<v-card
						height="40px"
						class="d-flex justify-center navbar"
						flat
					>
						<!-- class="select"-->
						<!--            <div class="select">-->
						<v-select
							:items="directionsDropdown[directionIndex]"
							item-text="text"
							item-value="value"
							v-model="directionSelection"
							:label="
								$t('navigation.faceToSelectCuttinglineArrow')
							"
							class="d-flex"
							cols="12"
							sm="6"
							@change="handleChangeDirection"
						></v-select>
						<!--            </div>-->
					</v-card>
				</template>
				<!--<template v-if='showShapeSelection===true' v-bind:class="{ img2: !lineDraw }">
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
						></v-combobox>
						
					</v-card>
				</template>-->

				<template>
					<v-card class="d-flex justify-center navbar" flat
						><!--mb-6-->
						<v-card
							class="pa-2"
							v-bind:class="{ img2: !lineTools }"
							height="40px"
						>
							<div class="select">
								<select
									id="line-width"
									@change="lineWidth(canvas)"
								>
									<option value="" disabled="disabled">
										line width
										<!--Choose Text Size-->
									</option>
									<option value="3">3</option>
									<option value="5" selected="selected">
										5
									</option>
									<option value="7">7</option>
									<option value="9">9</option>
								</select>
							</div>
						</v-card>

						<v-card
							class="pa-2"
							v-bind:class="{ img2: !lineTools }"
							height="40px"
						>
							<div class="select">
								<select
									id="line-type"
									@change="lineType(canvas)"
								>
									<option
										value=""
										selected="selected"
										disabled="disabled"
									>
										{{ $t("lineType.chooseLineType") }}
										<!--Choose Line Type-->
									</option>
									<option
										value="straightLine"
										id="straightLine"
									>
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
						<v-card
							class="pa-2"
							v-bind:class="{ img2: !lineDraw }"
							height="40px"
						>
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<p v-bind="attrs" v-on="on">
										<v-icon color="black">
											mdi-angle-acute</v-icon
										>
										{{ lastAngle }}
									</p>
								</template>
								<span> drawing line angle </span>
							</v-tooltip>
						</v-card>
					</v-card>
				</template>

				<v-card class="d-flex justify-center navbar" flat height="40px">
					<select
						v-bind:class="{ img2: !overlayOptions }"
						id="views-id"
						@change="viewHandler($event, canvas)"
					>
						<option
							value=""
							selected="selected"
							disabled="disabled"
						>
							{{ $t("oppositeView.selectView") }}
							<!--Select View-->
						</option>
						<option value="none" selected="selected">
							{{ $t("addOverlays.none") }}
							<!--None-->
						</option>
						<!--index : yebda 0 -->
						<option
							v-for="(index, i) in overlays.length"
							v-bind:key="index"
							:value="'id-overlay' + i"
						>
							{{ $t("addOverlays.overlay") + i }}
							<!-- {{"overlay"+i}} -->
						</option>
						<!-- オーバーレイを選択 -->
						<option id="id_view1" value="views1-id">
							{{ $t("oppositeView.selectView") }} 1
						</option>
						<!-- Select view -->
						<option id="id_view2" value="views2-id">
							{{ $t("oppositeView.selectView") }} 2
						</option>
					</select>
					<img
						src="/arrow.png"
						id="my-image"
						width="500px"
						height="500px"
					/>

					<select
						v-bind:class="{ img2: !overlayBackOptions }"
						id="views-id"
						@change="viewHandler1($event, canvas)"
					>
						<option
							value=""
							selected="selected"
							disabled="disabled"
						>
							{{ $t("oppositeView.selectView") }}
							<!--Select View-->
						</option>
						<option value="none" selected="selected">
							{{ $t("addOverlays.none") }}
							<!--None-->
						</option>
						<!--index : yebda 0 -->
						<option
							v-for="(index, i) in overlays_back.length"
							v-bind:key="index"
							:value="'id-overlay_back' + i"
						>
							{{ $t("addOverlays.overlay") + i }}
							<!-- {{"overlay"+i}} -->
						</option>
						<!-- オーバーレイを選択 -->
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
										@click="createRectangle(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:change="
											latestType = $t(
												'addshapes.rectangle'
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
								@click="switchView1(canvas)"
							>
								{{ $t("oppositeView.frontView") }}</v-btn
							>
							<!-- ビュー1 View 1-->
							<v-divider vertical></v-divider>
							<v-btn
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
							<v-icon dark> mdi-download-outline </v-icon>
							{{ $t("functions.exportFunc") }}
							<!--redo-->
							<!--やり直し-->
						</v-btn>
					</v-card-actions>
				</v-card>

				<div class="text-center">
					<v-dialog v-model="overlaped" width="500">
						<v-card>
							<v-card-title class="text-h5 grey lighten-2">
								{{ $t("popup.titleWarnings") }}
							</v-card-title>

							<v-card-text>
								{{ $t("popup.warningInspection") }}
							</v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn
									color="primary"
									text
									@click="overlaped = false"
								>
									{{ $t("popup.yes") }}
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
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
				</div>
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
		background_image_size: Array,
		overlays: Array,
		overlays_back: Array,
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
			lineTools: false,
			zoomMode: false,
			overlayOptions: false,
			overlayBackOptions: false,
			latestType: "",
			//latestType: "Select Tool",
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
			selectedLine: null,
			directionArrows: {},
			objectCount: 0,
			rectCount: 0,
			lineIndex: {},
			rectIndex: {},
			lineDirection: {},
			directionsDropdown1: [1, 2],
			directionsDropdown: [
				[
					{ text: "左", value: 3 },
					{ text: "右", value: 1 },
				],
				[
					{ text: "上", value: 0 },
					{ text: "下", value: 2 },
				],
				[],
				[],
				[
					{ text: "上", value: 4 },
					{ text: "下", value: 5 },
				],
				[],
				[
					{ text: "上", value: 6 },
					{ text: "下", value: 7 },
				],
				[],
				[
					{ text: "上", value: 8 },
					{ text: "下", value: 9 },
				],
				[],

				[
					{ text: "上", value: 10 },
					{ text: "下", value: 11 },
				],
				[],

				[
					{ text: "左", value: 12 },
					{ text: "右", value: 13 },
				],
				[],
				[
					{ text: "右", value: 14 },
					{ text: "左", value: 15 },
				],
			],
			directionSelection: 0,
			directionIndex: 1,
			overlaped: false,
			indexstack: 0,
			indexstack2: 0,
			indexId: 0,
			switchViewDone: false,
			currentView: 1,
			id: null,
			lastAngle: 0,
			listBoxesBack: [],
			objectsList: [],
			objectsList2: [],
			objectListChecked: [],
			objectListChecked1: [],
			objectListChecked2: [],
			showShapeSelection: false,
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
		saveJson() {
			return this.$store.state.saveJson;
		},
		cutting1SwitchObj() {
			return this.$store.state.cutting1SwitchObj;
		},
		cutting2SwitchObj() {
			return this.$store.state.cutting2SwitchObj;
		},
		doneTransitionList() {
			return this.$store.state.doneTransitionList;
		},
		template() {
			return this.$store.state.template;
		},
		uuid() {
			return this.$store.state.uuid;
		},
		flagSideUpload() {
			return this.$store.state.flagSideUpload;
		},
		arrowCoordinates() {
			return this.$store.state.arrowCoordinates;
		},
		arrowCoordinates2() {
			return this.$store.state.arrowCoordinates2;
		},
		layersUrlFront() {
			return this.$store.state.layersUrlFront;
		},
		layersUrlBack() {
			return this.$store.state.layersUrlBack;
		},
		orderImageFront() {
			return this.$store.state.orderImageFront;
		},
		orderImageBack() {
			return this.$store.state.orderImageBack;
		},

		/*newCyclists: function () {
           const newID = this.$uuid.v4();
    return   newID;
          
  }*/
	},
	mounted() {
		console.log(this.json1);
		console.log(
			"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 482 ~me",
			this.uuid
		);
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
		console.log(
			"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 876 ~ mounted ~ this.background_image_size[0]",
			this.background_image_size[0]
		);
		scaleW = this.$originalWidth / this.background_image_size[1];
		console.log(
			"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 878 ~ mounted ~ this.background_image_size[1]",
			this.background_image_size[1]
		);
		console.log("STEP3: scaleH, scaleW", scaleH, scaleW);

		let newScaledSizes = this.scaleCanvas(
			this.canvasWidth,
			this.canvasHeight,
			this.background_image_size[0],
			this.background_image_size[1]
		);

		var canvasW = newScaledSizes.width;
		console.log(
			"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 887 ~ mounted ~ canvasW",
			newScaledSizes.width
		);
		var canvasH = newScaledSizes.height;
		console.log(
			"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 889 ~ mounted ~ canvasH",
			newScaledSizes.height
		);
		this.scaleRatio = newScaledSizes.ratio;
		this.newScaledHeight = newScaledSizes.height;
		this.newScaledWidth = newScaledSizes.width;

		const ref = this.$refs.can;
		const canvas = new fabric.Canvas(ref, {
			width: canvasW,
			height: canvasH,
		});

		this.canvas = canvas;
		/// this.canvas.historyInit();
		let listTemp = {};
		listTemp = this.doneTransitionList;
		listTemp["switchview"] = false;
		this.$store.dispatch("changeDoneTransitionList", listTemp);
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
		} else if (
			this.flagSideUpload.back === true &&
			this.flagSideUpload.front === false
		) {
			this.currentView = 2;
			this.switchView2(this.canvas);

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
		}
		this.originalHeight = 0;
		this.originalWidth = 0;

		this.checkIfloaded(canvas);

		this.rangeView = document.getElementById("rangeViewOpacity");
		this.rangevalueView = this.rangeView.value / this.rangeView.max;
		this.lastelement = ""; //"none"
		this.index;
		this.tab = {};
		this.last = {};
		this.last["view2"] = "none";
		this.clipboard;
		this.view1SaveUndoRedo = [];
		this.view2SaveUndoRedo = [];
		this.tempSelectedObjects = [];

		this.viewSaveClearAllShapes = [];
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
		this.overlayOptions = true;

		///this.canvas.historyInit();
		//////////////////
		Object.keys(this.cutting1SwitchObj).length === 0 &&
			this.predictcall(canvas);
		console.log(
			"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 1013 ~ mounted ~ Object.keys(this.cutting1SwitchObj).length",
			Object.keys(this.cutting1SwitchObj).length
		);
		this.objectListChecked = this.objectListChecked1;

		this.zoom(canvas);
	},
	methods: {
		checkIfloaded(canvas) {
			console.log("I am in check loaded");
			console.log(this.cutting1SwitchObj);
			if (Object.keys(this.cutting1SwitchObj).length > 0) {
				this.view1Save = this.cutting1SwitchObj;
				console.log("hello");
			}
			if (Object.keys(this.cutting2SwitchObj).length > 0) {
				this.view2Save = this.cutting2SwitchObj;
				console.log("hello");
			}
			if (this.flagSideUpload.front === true) {
				canvas.loadFromJSON(
					this.view1Save,
					canvas.renderAll.bind(canvas)
				);
			} else if (
				this.flagSideUpload.back === true &&
				this.flagSideUpload.front === false
			) {
				canvas.loadFromJSON(
					this.view2Save,
					canvas.renderAll.bind(canvas)
				);
			}
		},
		async saveState() {
			this.$store.dispatch("changeLoading", true);
			let view1 = this.view1Save;
			let view2 = this.view2Save;

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
					"lineCoordinates",
					"id1",
					"angleRotation",
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
					"lineCoordinates",
					"id1",
					"angleRotation",
				]);
			}

			this.$store.dispatch("changeCutting1SwitchObj", view1);
			this.$store.dispatch("changeCutting2SwitchObj", view2);

			let newSave = this.saveJson;

			newSave["cutting1SwitchObj"] = view1;
			newSave["cutting2SwitchObj"] = view2;

			this.$store.dispatch("changeSaveJson", newSave);
			console.log(newSave);
			this.saveTemplate(newSave);
			this.$store.dispatch("changeLoading", false);
		},

		async saveTemplate(json) {
			await this.axios
				.post(this.databaseLocalHost + "/saveState", {
					json: json,
				})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		},
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

		async oneSideJsonCreationWithFlippedOne(list, flippedList) {
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
				} else if (list[i].type === "line") {
					//it's a line
					coord1 = {
						x: list[i].lineCoordinates[0].x,
						y: list[i].lineCoordinates[0].y,
					};
					coord2 = {
						x: list[i].lineCoordinates[1].x, //+ list[i].width,
						y: list[i].lineCoordinates[1].y, //+ list[i].height,
					};
					coords = [coord1, coord2];
					console.log("line", coords);
				}
				console.log(newAdjustedList);
				console.log(list[i]);
				list[i]["is_flipped"] = false;
				newAdjustedList.push(
					this.addToAdjustedList(list[i], coords, false)
				);
			}

			////////////////////flippped process/////////////////////////////////////////////
			bl = {};
			br = {};
			tl = {};
			tr = {};
			coord1 = {};
			coord2 = {};
			coords = {};

			for (let i = 0; i < flippedList.length; ++i) {
				// console.log(i, list[i]);
				if (flippedList[i].type === "rect") {
					bl = {
						x: flippedList[i].left,
						y: flippedList[i].top + flippedList[i].height,
					};
					br = {
						x: flippedList[i].left + flippedList[i].width,
						y: flippedList[i].top + flippedList[i].height,
					};
					tl = { x: flippedList[i].left, y: flippedList[i].top };
					tr = {
						x: flippedList[i].left + flippedList[i].width,
						y: flippedList[i].top,
					};
					let brTemp = this.FlippedCoordinateFunction(bl.x);
					let blTemp = this.FlippedCoordinateFunction(br.x);
					let trTemp = this.FlippedCoordinateFunction(tl.x);
					let tlTemp = this.FlippedCoordinateFunction(tr.x);
					br.x = brTemp;
					bl.x = blTemp;
					tr.x = trTemp;
					tl.x = tlTemp;
					coords = [bl, br, tl, tr];
				} else if (flippedList[i].type === "line") {
					//it's a line
					coord1 = {
						x: flippedList[i].lineCoordinates[0].x,
						y: flippedList[i].lineCoordinates[0].y,
					};
					coord2 = {
						x: flippedList[i].lineCoordinates[1].x, // + flippedList[i].width,
						y: flippedList[i].lineCoordinates[1].y, // + flippedList[i].height,
					};
					let coord2Temp = this.FlippedCoordinateFunction(coord1.x);
					let coord1Temp = this.FlippedCoordinateFunction(coord2.x);
					coord2.x = coord2Temp;
					coord1.x = coord1Temp;
					coords = [coord1, coord2];
				}
				flippedList[i]["is_flipped"] = true;

				newAdjustedList.push(
					this.addToAdjustedList(flippedList[i], coords, true)
				);
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
			if (!this.validateOverlaps(rectList, lineList)) {
				console.log("ERROR");
				this.overlaped = true;
				return;
			}

			// //now convert the arrays into a Json
			let inputJson = this.createJson(rectList, lineList);

			return inputJson;
		},

		async oneSideJsonCreation(list) {
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 1281 ~ oneSideJsonCreation ~ list",
				list
			);
			let newAdjustedList = [];
			let bl = {};
			let br = {};
			let tl = {};
			let tr = {};
			let coord1 = {};
			let coord2 = {};
			let coords = {};

			for (let i = 0; i < list.length; ++i) {
				console.log(i, list[i]);
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
				} else if (list[i].type === "line") {
					console.log(
						"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 1308 ~ oneSideJsonCreation ~ list",
						list[i]
					);
					//it's a line
					coord1 = {
						x: list[i]?.lineCoordinates[0].x,
						y: list[i]?.lineCoordinates[0].y,
					};
					coord2 = {
						x: list[i]?.lineCoordinates[1].x, //+ list[i].height,
						y: list[i].lineCoordinates[1].y, //+ list[i].height,
					};
					coords = [coord1, coord2];
					console.log("line", coords);
				}
				list[i]["is_flipped"] = false;

				newAdjustedList.push(
					this.addToAdjustedList(list[i], coords, false)
				);
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
			if (!this.validateOverlaps(rectList, lineList)) {
				console.log("ERROR");
				this.overlaped = true;
				return;
			}

			// //now convert the arrays into a Json
			let inputJson = this.createJson(rectList, lineList);

			return inputJson;
		},
		//takes the adjusted list and validates if all lines are contained within rectangles
		showAllArrows() {
			let allObjs = this.canvas.getObjects();
			for (let i = 0; i < allObjs.length; ++i) {
				if (allObjs[i].type === "line") {
					this.showArrows(allObjs[i]);
				}
			}
		},

		///function to calculate the flipped coordinate (Rectangle and Line )
		async oneSideJsonCreationFlipped(list) {
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
					let brTemp = this.FlippedCoordinateFunction(bl.x);
					let blTemp = this.FlippedCoordinateFunction(br.x);
					let trTemp = this.FlippedCoordinateFunction(tl.x);
					let tlTemp = this.FlippedCoordinateFunction(tr.x);
					br.x = brTemp;
					bl.x = blTemp;
					tr.x = trTemp;
					tl.x = tlTemp;
					coords = [bl, br, tl, tr];
				} else if (list[i].type === "line") {
					//it's a line
					coord1 = {
						x: list[i]?.lineCoordinates[0].x,
						y: list[i]?.lineCoordinates[0].y,
					};
					coord2 = {
						x: list[i]?.lineCoordinates[1].y, //+ list[i].height,
						y: list[i].lineCoordinates[1].y, //+ list[i].height,
					};
					let coord2Temp = this.FlippedCoordinateFunction(coord1.x);
					let coord1Temp = this.FlippedCoordinateFunction(coord2.x);
					coord2.x = coord2Temp;
					coord1.x = coord1Temp;
					coords = [coord1, coord2];
				}
				newAdjustedList.push(this.addToAdjustedList(list[i], coords));
			}
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
			if (!this.validateOverlaps(rectList, lineList)) {
				console.log("ERROR");
				this.overlaped = true;
				return;
			}

			// //now convert the arrays into a Json
			let inputJson = this.createJson(rectList, lineList);

			return inputJson;
		},
		//calculate the flipped single coordinate
		FlippedCoordinateFunction(x) {
			let flippedX = this.newScaledWidth - x;
			return flippedX;
		},
		/// call this function before moving to next window to genrate cutting lines
		async createJsonFromPoints() {
			let arr1;
			if (
				this.doneTransitionList["switchview"] === false &&
				this.flagSideUpload.front === true &&
				this.flagSideUpload.back === true
			) {
				this.switchViewDone = true;
				return;
			}

			//split the rects and lines into their own seperate arrays
			await this.deleteArrows();
			let view1 = this.view1Save;
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 1004 ~ createJsonFromPoints ~ view1",
				view1
			);
			let view2 = this.view2Save;
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 1005 ~ createJsonFromPoints ~ view2",
				view2
			);
			this.canvas.discardActiveObject().renderAll();

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
					"lineCoordinates",
					"id1",
					"angleRotation",
				]);
				this.showAllArrows();
				arr1 = [];
				let coord;
				for (let i = 0; i < this.canvas.getObjects().length; ++i) {
					if (this.canvas.getObjects()[i].type === "arrow") {
						//arr1.push(this.canvas.getObjects()[i]);
						coord = this.convertCoordsToAbsolute({
							x: this.canvas.getObjects()[i].left,
							y: this.canvas.getObjects()[i].top,
						});
						console.log(
							"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2124 ~ createJson ~ coord",
							coord
						);
						arr1.push({
							left: coord.x,
							top: this.background_image_size[1] - coord.y,
							angle: this.canvas.getObjects()[i].angle,
						});
					}
				}
				console.log(arr1);
				await this.deleteArrows();

				this.$store.dispatch("changeArrowCoordinates", arr1);
				this.imageSwitch1.src = this.canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
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
					"lineCoordinates",
					"id1",
					"angleRotation",
				]);
				this.showAllArrows();
				arr1 = [];
				let coord;

				for (let i = 0; i < this.canvas.getObjects().length; ++i) {
					if (this.canvas.getObjects()[i].type === "arrow") {
						//arr1.push(this.canvas.getObjects()[i]);
						coord = this.convertCoordsToAbsolute({
							x: this.canvas.getObjects()[i].left,
							y: this.canvas.getObjects()[i].top,
						});
						console.log(
							"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2124 ~ createJson ~ coord",
							coord
						);
						arr1.push({
							left: coord.x,
							top: this.background_image_size[1] - coord.y,
							angle: this.canvas.getObjects()[i].angle,
						});
					}
				}
				console.log(arr1);
				await this.deleteArrows();

				this.$store.dispatch("changeArrowCoordinates2", arr1);

				this.imageSwitch2.src = this.canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
			}
			this.$store.dispatch("changeCutting1SwitchObj", view1);
			this.$store.dispatch("changeCutting2SwitchObj", view2);
			let newJson1;
			let newJson2;
			///this.$store.dispatch("changeJsonFront",[])
			// newJson1 = await this.oneSideJsonCreation(view1.objects);
			//newJson1Flipped = await this.oneSideJsonCreationFlipped(view1.objects);

			///test if we are switching at least one time to switch 2 to avoid errors and bugs
			//  if(this.doneTransitionList["switchview"]){

			//    newJson1 = await this.oneSideJsonCreationWithFlippedOne(view1.objects,view2.objects);
			// newJson2 = await this.oneSideJsonCreation(view2.objects);
			//   newJson2 = await this.oneSideJsonCreationWithFlippedOne(view2.objects,view1.objects);
			// newJson2Flipped = await this.oneSideJsonCreationFlipped(view2.objects);
			//  }
			if (
				this.flagSideUpload.front === true &&
				this.flagSideUpload.back === true
			) {
				newJson1 = await this.oneSideJsonCreationWithFlippedOne(
					view1.objects,
					view2.objects
				);
				newJson2 = await this.oneSideJsonCreationWithFlippedOne(
					view2.objects,
					view1.objects
				);
			} else if (
				this.flagSideUpload.front === true &&
				this.flagSideUpload.back === false
			) {
				newJson1 = await this.oneSideJsonCreation(view1.objects);
			} else if (
				this.flagSideUpload.front === false &&
				this.flagSideUpload.back === true
			) {
				newJson2 = await this.oneSideJsonCreation(view2.objects);
			}

			//now pass it into the backend to save into the directory for cutting lien generation
			console.log(newJson1);
			console.log(newJson2);
			if (this.overlaped === false) {
				/// traiting the flipped image and json for view1

				if (
					this.flagSideUpload.front === true &&
					this.flagSideUpload.back === true
				) {
					console.log("here0");
					//if(this.doneTransitionList["switchview"]){

					this.$store.dispatch("changeLoading", true);
					newJson1["path"] = this.orderImageFront;
					await this.saveJsonToBackend(newJson1);
					await this.saveCanvasToBackend(this.imageSwitch1.src);
					await this.callCuttingLineAPI();
					await this.copyJsonToFolder("json1.json");
					let outputJson1 = await this.saveJsonToStore("json1.json");
					let outputImage1 = await this.saveOrderImage(
						this.uuid + "output1.png"
					);
					outputImage1["ratio"] = this.scaleRatio;
					this.$store.dispatch(
						"changeOrderImageFront",
						outputImage1["main"].urlPath
					);
					this.$store.dispatch("changeLayersUrlFront", outputImage1);
					this.$store.dispatch("changeJsonFront", outputJson1);
					console.log(outputJson1);
					// await this.saveJsonToInput(newJson2);
					await this.saveJsonToBackend(newJson2);
					await this.saveCanvasToBackend(this.imageSwitch2.src);
					await this.callCuttingLineAPI();
					await this.copyJsonToFolder("json2.json");
					let outputJson2 = await this.saveJsonToStore("json2.json");
					let outputImage2 = await this.saveOrderImage(
						this.uuid + "output2.png"
					);
					this.$store.dispatch(
						"changeOrderImageBack",
						outputImage2["main"].urlPath
					);
					this.$store.dispatch("changeLayersUrlBack", outputImage2);

					this.$store.dispatch("changeJsonBack", outputJson2);
					console.log(outputJson2);
					//else{
					//this.$store.dispatch('changeOrderImageBack', this.background_image_view2);
					// }
					this.$router.push("cutting_line_editor");
					this.$store.dispatch("changeLoading", false);
					console.log("here1");
					//  }
					// else
					// {
					///   this.switchViewDone=true
					//  console.log("here2")

					// }
				} else if (
					this.flagSideUpload.front === true &&
					this.flagSideUpload.back === false
				) {
					newJson1["path"] = this.orderImageFront;

					this.$store.dispatch("changeLoading", true);
					await this.saveJsonToBackend(newJson1);
					await this.saveCanvasToBackend(this.imageSwitch1.src);
					await this.callCuttingLineAPI();
					await this.copyJsonToFolder("json1.json");
					let outputJson1 = await this.saveJsonToStore("json1.json");
					let outputImage1 = await this.saveOrderImage(
						this.uuid + "output1.png"
					);
					this.$store.dispatch(
						"changeOrderImageFront",
						outputImage1["main"].urlPath
					);
					outputImage1["ratio"] = this.scaleRatio;

					this.$store.dispatch("changeLayersUrlFront", outputImage1);
					this.$store.dispatch("changeJsonFront", outputJson1);
					console.log(outputJson1);
					this.$router.push("cutting_line_editor");
					this.$store.dispatch("changeLoading", false);
					// await this.saveJsonToInput(newJson2);
				} else if (
					this.flagSideUpload.front === false &&
					this.flagSideUpload.back === true
				) {
					newJson1["path"] = this.orderImageFront;

					this.$store.dispatch("changeLoading", true);
					await this.saveJsonToBackend(newJson2);
					await this.saveCanvasToBackend(this.imageSwitch2.src);
					await this.callCuttingLineAPI();
					await this.copyJsonToFolder("json2.json");
					let outputJson1 = await this.saveJsonToStore("json2.json");
					let outputImage1 = await this.saveOrderImage(
						this.uuid + "output2.png"
					);
					this.$store.dispatch(
						"changeOrderImageBack",
						outputImage1["main"].urlPath
					);
					this.$store.dispatch("changeLayersUrlBack", outputImage1);
					this.$store.dispatch("changeJsonBack", outputJson1);
					console.log(outputJson1);
					this.$router.push("cutting_line_editor");
					this.$store.dispatch("changeLoading", false);
				}
				/// traiting the flipped image and json for view2
			}
			console.log(this.arrowCoordinates);
			console.log(this.arrowCoordinates2);
		},
		async GoToPainttool() {
			//split the rects and lines into their own seperate arrays
			this.deleteArrows();
			let view1 = this.view1Save;
			let view2 = this.view2Save;
			if (
				this.doneTransitionList["switchview"] === false &&
				this.flagSideUpload.front === true &&
				this.flagSideUpload.back === true
			) {
				this.switchViewDone = true;
				return;
			}
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
					"lineCoordinates",
					"id1",
					"angleRotation",
				]);
				this.showAllArrows();
				this.imageSwitch1.src = this.canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				this.deleteArrows();
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
					"lineCoordinates",
					"id1",
					"angleRotation",
				]);
				this.showAllArrows();
				this.imageSwitch2.src = this.canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				this.deleteArrows();
			}
			this.$store.dispatch("changeCutting1SwitchObj", view1);
			this.$store.dispatch("changeCutting2SwitchObj", view2);
			let newJson1;
			let newJson2;

			///test if we are switching at least one time to switch 2 to avoid errors and bugs
			if (
				this.flagSideUpload.front === true &&
				this.flagSideUpload.back === true
			) {
				newJson1 = await this.oneSideJsonCreationWithFlippedOne(
					view1.objects,
					view2.objects
				);
				newJson2 = await this.oneSideJsonCreationWithFlippedOne(
					view2.objects,
					view1.objects
				);
			} else if (
				this.flagSideUpload.front === true &&
				this.flagSideUpload.back === false
			) {
				newJson1 = await this.oneSideJsonCreation(view1.objects);
			} else if (
				this.flagSideUpload.front === false &&
				this.flagSideUpload.back === true
			) {
				newJson2 = await this.oneSideJsonCreation(view2.objects);
			}

			//now pass it into the backend to save into the directory for cutting lien generation

			if (this.overlaped === false) {
				/// traiting the flipped image and json for view1

				this.$store.dispatch("changeLoading", true);
				await this.saveJsonToBackend(newJson1);
				await this.saveCanvasToBackend(this.imageSwitch1.src);
				await this.callCuttingLineAPI();
				await this.copyJsonToFolder("json1.json");
				let outputJson1 = await this.saveJsonToStore("json1.json");
				var outputImage1 = await this.saveOrderImage(
					this.uuid + "output1.png"
				);
				//let outputImage1 = await this.saveCanvasToBackend(this.imageSwitch1.src, "front.png");
				this.$store.dispatch("changeLayersUrlFront", outputImage1);

				this.$store.dispatch(
					"changeOrderImageFront",
					outputImage1["main"].Directorypath
				);
				this.$store.dispatch("changeJsonFront", outputJson1);
				console.log(outputJson1);
				// await this.saveJsonToInput(newJson2);
				if (this.doneTransitionList["switchview"]) {
					await this.saveJsonToBackend(newJson2);
					await this.saveCanvasToBackend(this.imageSwitch2.src);
					await this.callCuttingLineAPI();
					await this.copyJsonToFolder("json2.json");
					let outputJson2 = await this.saveJsonToStore("json2.json");
					var outputImage2 = await this.saveOrderImage(
						this.uuid + "output2.png"
					);
					// let outputImage2 = await this.saveCanvasToBackend(this.imageSwitch1.src, "back.png");
					this.$store.dispatch("changeLayersUrlBack", outputImage2);

					this.$store.dispatch(
						"changeOrderImageBack",
						outputImage2["main"].Directorypath
					);
					this.$store.dispatch("changeJsonBack", outputJson2);
					console.log(outputJson2);
				} else {
					this.$store.dispatch(
						"changeOrderImageBack",
						this.background_image_view2
					);
				}

				/// traiting the flipped image and json for view2
				let back_image;
				if (this.flagSideUpload.back === true) {
					back_image = outputImage2["main"].Directorypath;
				}
				let templateObj = await this.createTemplateImage(
					outputImage1["main"].Directorypath,
					//this.doneTransitionList["switchview"]
					back_image,
					this.template
				);
				let template_size = {
					filesize: templateObj.filesize,
					frontImgOffsetX: templateObj.frontImgOffsetX,
					frontImgOffsetY: templateObj.frontImgOffsetY,
					backImgOffsetX: templateObj.backImgOffsetX,
					backImgOffsetY: templateObj.backImgOffsetY,
				};
				let template_image_url =
					this.databaseLocalHost +
					"/static/export/exported_image.png";
				///let template_size = templateObj.filesize;
				this.$store.dispatch("changeTemplateImage", template_image_url);
				this.$store.dispatch("changeTemplateImageSize", template_size);
				this.$store.dispatch("changeLoading", false);

				console.log("switch to paint tool");
				this.$router.push("paint_tool");
			}
		},
		async createTemplateImage(front, back, template) {
			let payload = {
				template: template,
				front_url: front,
				back_url: back,
				layersUrlBack: this.layersUrlBack,
				layersUrlFront: this.layersUrlFront,
				createLayers:this.flagSideUpload.back?true:false

			};
			let filepath = "";
			let filesize = [0, 0];
			let backImgOffsetY = 0;
			let frontImgOffsetX = 0;
			let frontImgOffsetY = 0;
			let backImgOffsetX = 0;

			await this.axios
				.post(this.databaseLocalHost + "/createExport", payload)
				.then((response) => {
					filepath = response["data"]["filepath"];
					filesize = response["data"]["filesize"];
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
				filesize: filesize,
				frontImgOffsetX: frontImgOffsetX,
				frontImgOffsetY: frontImgOffsetY,
				backImgOffsetX: backImgOffsetX,
				backImgOffsetY: backImgOffsetY,
			};
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
				.post(this.databaseLocalHost + "/copyJson", {
					filename: file,
				})
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
			console.log(data);
			await this.axios
				.post(this.databaseLocalHost + "/saveCanvasToInput", data)
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		async saveFlippedCanvasToBackend(image_data) {
			// const options = {};//{crossOrigin:"Anonymous"};
			// var image = document.getElementsByClassName("lower-canvas")[0];
			// const printCanvas = await html2canvas(image, options);
			// let image_data = printCanvas.toDataURL({format: "image/png", multiplier: (1/this.scaleRatio)});

			let data = { image: image_data };
			console.log(data);
			await this.axios
				.post(
					this.databaseLocalHost + "/saveFlippedCanvasToInput",
					data
				)
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		async saveFlippedbackgroundToBackend(image_data) {
			// const options = {};//{crossOrigin:"Anonymous"};
			// var image = document.getElementsByClassName("lower-canvas")[0];
			// const printCanvas = await html2canvas(image, options);
			// let image_data = printCanvas.toDataURL({format: "image/png", multiplier: (1/this.scaleRatio)});

			let data = { image: image_data };
			console.log(data);
			await this.axios
				.post(this.databaseLocalHost + "/saveFlippedImage", data)
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		createJson(rectList, lineList) {
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 1305 ~ createJson ~ lineList",
				lineList
			);
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 1305 ~ createJson ~ rectList",
				rectList
			);
			console.log("createJson");
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

			masterJson["millimeter_to_pixel"] = 3; //TODO
			masterJson["UUID"] = this.uuid;
			masterJson["ratio"] = this.scaleRatio;
			masterJson["main_rect_length_y"] = this.background_image_size[1];
			masterJson["main_rect_length_x"] = this.background_image_size[0];
			masterJson["Layer1CoordinatesFront"] = this.arrowCoordinates;
			masterJson["Layer1CoordinatesBack"] = this.arrowCoordinates2;
			masterJson["objects"] = [];
			//run through the list
			for (let i = 0; i < adjRectArr.length; ++i) {
				//create a line array to push into the masterJson
				lineArray = [];
				lineType = [];
				for (let j = 0; j < adjRectArr[i].lines.length; ++j) {
					lineCoords = adjRectArr[i].lines[j].coords;
					// lineType.push(this.lineTypeChecker(lineCoords));
					console.log(adjRectArr[i].lines[j].info);
					let lineTypeTemp;
					if (
						[1, 6, 4, 8, 10].includes(
							adjRectArr[i].lines[j].info.lineDirection
						)
					)
						lineTypeTemp = 0;
					else if (
						[2, 5, 7, 9, 11].includes(
							adjRectArr[i].lines[j].info.lineDirection
						)
					)
						lineTypeTemp = 2;
					else if (
						[3, 12, 14].includes(
							adjRectArr[i].lines[j].info.lineDirection
						)
					)
						lineTypeTemp = 1;
					else if (
						[0, 13, 15].includes(
							adjRectArr[i].lines[j].info.lineDirection
						)
					)
						lineTypeTemp = 3;
					lineType.push(lineTypeTemp);
					console.log(
						"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 1986 ~ createJson ~ lineTypeTemp",
						lineTypeTemp
					);
					//lineType.push(adjRectArr[i].lines[j].info.lineDirection);
					console.log(Math.round(lineCoords[0].x));
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
					rect_name: (adjRectArr[i].rect.index+1).toString(),
					flipped: adjRectArr[i].rect.info.is_flipped,
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
			this.showAllArrows();
			/*let arr1 = [];
			let coord ={}
				for (let i = 0; i < this.canvas.getObjects().length; ++i) {
					if (this.canvas.getObjects()[i].type === "arrow") {
						console.log(this.canvas.getObjects()[i].left,this.canvas.getObjects()[i].top)
						coord=this.convertCoordsToAbsolute({"x":this.canvas.getObjects()[i].left,"y":this.canvas.getObjects()[i].top})
                        console.log("🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2124 ~ createJson ~ coord", coord)
						arr1.push({"left":coord.x,"top":this.background_image_size[1]-coord.y,"angle":this.canvas.getObjects()[i].angle});
				
				
				}
				}*/
			//console.log(arr1)
			//masterJson["Layer1Coordinates"]=arr1 ;
			this.deleteArrows();
			console.log(masterJson);
			console.log(this.canvasW, this.canvasH);
			// let finalInputJson = JSON.stringify(masterJson, null, 2);
			return masterJson;
		},

		//check if line is horizontal (0) or vertical (1) or if neither, -1
		lineTypeChecker(lineCoords, angle) {
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 1899 ~ lineTypeChecker ~ angle",
				angle
			);
			//we are going to test only with angle because now we are  drawing freely the lines
			/*if (lineCoords[1].x === lineCoords[0].x ) {
        ///vertical line (0)
				return 0;
			} else if (lineCoords[1].y === lineCoords[0].y) {
        ///horizontal line (1)
				return 1;
			} else {
				return -1;
			}*/

			//0=>-79  || keys : 10  UP && 11 DOWN
			//-79=>-102	|| keys : 12  LEFT && 13 RIGHT
			//-102=>-180 || keys : 8  UP && 9 DOWN
			//0=>79		|| keys : 4  UP && 5 DOWN
			//79=>102	|| keys : 14  LEFT && 15 RIGHT
			//102=>179	|| keys : 6  UP && 7 DOWN

			if (angle === -90 || angle === 90) {
				return 0;
			} else if (angle === 0 || angle === -180) {
				return 1;
			} else if (angle >= 0 && angle <= 65) {
				return 4;
			} else if (angle >= 65 && angle <= 115) {
				return 14;
			} else if (angle >= 115 && angle <= 179) {
				return 6;
			} else if (angle >= -180 && angle < -115) {
				return 8;
			} else if (angle >= -115 && angle <= -65) {
				return 12;
			} else if (angle >= -65 && angle <= 0) {
				return 10;
			} else return -1;
		},
		//validates to see if any lines or rets overlap each other
		validateOverlaps(rectList, lineList) {
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2205 ~ validateOverlaps ~ lineList",
				lineList
			);
			let overlapList = [];

			//check rectangles with rectangles
			console.log("checking rects with rects");
			for (let i = 0; i < rectList.length; ++i) {
				for (let j = i + 1; j < rectList.length; ++j) {
					if (
						this.objectOverlapsRect(
							rectList[i].coords,
							rectList[j].coords
						)
					) {
						console.log("overlaps between rect1 and rect2");

						console.log("hello: i: " + i + " j: " + j);
						overlapList.push(rectList[j]);
					} else if (
						this.objectOverlapsRect(
							rectList[j].coords,
							rectList[i].coords
						)
					) {
						console.log("overlaps between rect2 and rect1");
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
			console.log("checking lines with rectangles", lineList);
			for (let i = 0; i < lineList.length; ++i) {
				if (!this.lineIsContainedInRect(lineList[i], rectList)) {
					console.log("hello: i: " + i);
					overlapList.push(lineList[i]);
				}
			}
			//check if the rectangle is empty of the line objects
			console.log("checking if rect is empty");
			for (let i = 0; i < rectList.length; ++i) {
				if (!this.rectContainedAnLine(lineList, rectList[i])) {
					console.log("hello: i: " + i);
					overlapList.push(rectList[i]);
				}
			}

			console.log(overlapList);
			if (overlapList.length > 0) {
				this.highlightOverlaps(overlapList);
				console.log("I'm false");
				this.overlaped = false;
				return false;
			} else {
				return true;
			}
		},
		highlightOverlaps(overlapList) {
			for (let i = 0; i < overlapList.length; ++i) {
				console.log(!!this.canvas.getObjects()[overlapList[i].index]);
				console.log(overlapList[i].info);
				console.log(this.canvas);
				console.log(this.canvas.getObjects());
				if (this.canvas.getObjects().length > 0) {
					!!this.canvas.getObjects()[overlapList[i].index] &&
						this.canvas.setActiveObject(
							this.canvas.getObjects()[overlapList[i].index]
						);
					!!this.canvas.getObjects()[overlapList[i].index] &&
						this.canvas
							.getActiveObject()
							.set({ stroke: "#B6B6B6" });
				}
				console.log(overlapList[i].info.stroke);
			}
		},
		//check if rectangle contains this point
		rectangleContainsPoint(coord, rectCoords) {
			let rectBL = rectCoords[0];
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 1479 ~ rectangleContainsPoint ~ rectBL",
				rectBL
			);
			let rectTR = rectCoords[3];
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 1481 ~ rectangleContainsPoint ~ rectTR",
				rectTR
			);
			console.log(coord.x, coord.y);

			if (
				coord.x > rectBL.x &&
				coord.x < rectTR.x &&
				coord.y < rectBL.y &&
				coord.y > rectTR.y
			) {
				console.log("I'm contained");
				return true;
			} else {
				console.log("I'm not  contained");
				return false;
			}
		},

		//check overlaps function
		objectOverlaps(objCoords, rectCoords) {
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2321 ~ objectOverlaps ~ objCoords",
				objCoords
			);
			//console.log("object overlaps rect",objCoords,rectCoords)
			for (let i = 0; i < objCoords.length; ++i) {
				if (!this.rectangleContainsPoint(objCoords[i], rectCoords)) {
					return false;
				}
			}
			return true;
		},
		objectOverlapsRect(objCoords, rectCoords) {
			console.log("object overlaps rect", objCoords, rectCoords);
			for (let i = 0; i < objCoords.length; ++i) {
				if (this.rectangleContainsPoint(objCoords[i], rectCoords)) {
					console.log("rect overlaps rect ");

					return true;
				}
			}
			return false;
		},
		lineIsContainedInRect(line, rectList) {
			for (let i = 0; i < rectList.length; ++i) {
				if (this.objectOverlaps(line.coords, rectList[i].coords)) {
					return true;
				}
			}
			this.overlaped = true;
			return false;
		},
		rectContainedAnLine(lineList, rect) {
			for (let i = 0; i < lineList.length; ++i) {
				if (this.objectOverlaps(lineList[i].coords, rect.coords)) {
					return true;
				}
			}
			this.overlaped = true;
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
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2391 ~ convertCoordsToAbsolute ~ coords",
				coords
			);

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
				console.log(newCoords);
				adjObjectCoord.push(newCoords);
			}
			return adjObjectCoord;
		},
		//create a new object with new coords and add it to the list
		addToAdjustedList(object, coords, flipped) {
			console.log("coords Add to Adjusted", coords);
			console.log("type", object.type);
			let newObject = {
				info: object,
				coords: this.createNewAdjObjectCoord(coords),
				type: object.type,
				is_flipped: flipped,
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
			this.$store.dispatch("changeLoading", true);

			this.showAllArrows();
			let arr1 = [];
			let coord;

			for (let i = 0; i < this.canvas.getObjects().length; ++i) {
				if (this.canvas.getObjects()[i].type === "arrow") {
					//arr1.push(this.canvas.getObjects()[i]);
					coord = this.convertCoordsToAbsolute({
						x: this.canvas.getObjects()[i].left,
						y: this.canvas.getObjects()[i].top,
					});
					console.log(
						"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2124 ~ createJson ~ coord",
						coord
					);
					arr1.push({
						left: coord.x,
						top: this.background_image_size[1] - coord.y,
						angle: this.canvas.getObjects()[i].angle,
					});
				}
			}
			console.log(arr1);
			this.deleteArrows();
			this.$store.dispatch("changeArrowCoordinates2", arr1);
			this.objectListChecked = this.objectListChecked1;
			this.showShapeSelection = false;

			this.deleteArrows();
			this.view = true;
			this.overlayBackOptions = false;
			this.overlayOptions = true;
			const selectOppositeView = document.getElementById("views-id");
			//const selectOppositeView1 = document.getElementById("id_view1");
			//const selectOppositeView2 = document.getElementById("id_view2");
			//console.log("selectOppositeView.value", selectOppositeView.value);
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
				//	selectOppositeView1.disabled = true;
				//	selectOppositeView2.disabled = false;
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
					"lineCoordinates",
					"angleRotation",
				]);
				console.log("here", this.view2Save);
				//////////////////////////here////////////////////////////
				//this.showAllArrows();
				this.imageSwitch2.src = canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				//this.deleteArrows();
				this.image2.src = canvas.toDataURL("image/png");
				canvas.clear();
				canvas.loadFromJSON(
					this.view1Save,
					this.canvas.renderAll.bind(canvas)
				);
				this.currentView = 1;
			}
			this.$store.dispatch("changeLoading", false);
		},
		//method to switch from "view 2" to "view 1"
		async switchView2(canvas) {
			this.$store.dispatch("changeLoading", true);

			await this.showAllArrows();
			let coord;

			let arr1 = [];
			for (let i = 0; i < this.canvas.getObjects().length; ++i) {
				if (this.canvas.getObjects()[i].type === "arrow") {
					//arr1.push(this.canvas.getObjects()[i]);
					console.log(
						"zdd",
						this.canvas.getObjects()[i].left,
						this.canvas.getObjects()[i].top
					);
					coord = this.convertCoordsToAbsolute({
						x: this.canvas.getObjects()[i].left,
						y: this.canvas.getObjects()[i].top,
					});
					console.log(
						"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2124 ~ createJson ~ coord",
						coord
					);
					arr1.push({
						left: coord.x,
						top: this.background_image_size[1] - coord.y,
						angle: this.canvas.getObjects()[i].angle,
					});
				}
			}
			console.log(arr1);
			await this.deleteArrows();
			this.$store.dispatch("changeArrowCoordinates", arr1);
			this.showShapeSelection = false;
			this.objectListChecked = this.objectListChecked2;
			this.deleteArrows();
			this.view = false;
			this.overlayBackOptions = true;
			this.overlayOptions = false;
			const selectOppositeView = document.getElementById("views-id");
			//const selectOppositeView1 = document.getElementById("id_view1");
			//const selectOppositeView2 = document.getElementById("id_view2");
			//console.log("selectOppositeView.value", selectOppositeView.value);
			canvas.getObjects().forEach((o) => {
				if (o.id === "View1_Overview") {
					console.log("o.id", o.id);
					canvas.remove(o);
				} else if (o.id === "View2_Overview") {
					console.log("o.id", o.id);
					canvas.remove(o);
				}
				//selectOppositeView1.disabled = false;
				//selectOppositeView2.disabled = true;
				selectOppositeView.value = "none";
			});
			// this.deactivateLine(canvas);

			//console.log("this.last[view2]", this.last["view2"]);

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
					"lineCoordinates",
					"angleRotation",
				]);
				console.log(this.view1Save);
				//this.showAllArrows();
				this.imageSwitch1.src = canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				//this.deleteArrows();
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
			if (this.doneTransitionList["switchview"] === false)
				this.createRectangleFromPredictedValues(
					canvas,
					this.listBoxesBack
				);
			//this.predictcall(canvas, 2);

			let listTemp = {};
			listTemp = this.doneTransitionList;
			listTemp["switchview"] = true;
			this.$store.dispatch("changeDoneTransitionList", listTemp);
			this.$store.dispatch("changeLoading", false);
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
				console.log("overlayInstance", overlayInstance.src);
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
							flipX: true,
							//left: -0.1,
							scaleX: 1,
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
							flipX: true,
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
		viewHandler1(event, canvas) {
			console.log("views", event.target.value);
			if (
				event.target.value == "none" ||
				event.target.value == "id-overlay_back0" ||
				event.target.value == "id-overlay_back1" ||
				event.target.value == "id-overlay_back2"
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
				console.log("overlayInstance", overlayInstance.src);
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
							flipX: true,
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
							flipX: true,
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
			var lineWidth = document.getElementById("line-width");
			let lineId = document.getElementById("line-type");
			this.lineDraw = true;
			this.lineTools = true;
			this.showShapeSelection = false;
			this.deleteArrows();
			canvas.discardActiveObject();
			//let ctx = canvas.getContext('2d');
			//this.removeCanvasEvents(canvas);
			//canvas.off("mouse:wheel");
			this.drawingMode(canvas);
			canvas.selection = false;
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
						strokeWidth: Number(lineWidth.value), //5,
						selectable: false, //true
						stroke: "#ff0000",
						type: "line",
						//selectable: false,
						hasRotatingPoint: true,
						lineType: 0,
						lineDirection: 0,
						lineCoordinates: [],
						id1: this.indexId,
						lockScalingY: true,

						//flipY: true
						//angle: 45,
					});
					this.indexId++;
					//this.directionArrows.push(false)
					canvas.add(line);
					/*	if (this.currentView === 1) {
						this.objectsList.push({
							id: line.id1,
							value: "Shape line with ID: " + line.id1,
							selected: false,
						});
						this.objectListChecked1.push({
							id: line.id1,
							value: "Shape line with ID: " + line.id1,
							selected: false,
						});
					} else if (this.currentView === 2) {
						this.objectsList2.push({
							id: line.id1,
							value: "Shape line with ID: " + line.id1,
							selected: false,
						});
						this.objectListChecked2.push({
							id: line.id1,
							value: "Shape line with ID: " + line.id1,
							selected: false,
						});
					}
*/
					line.setControlsVisibility({
						tr: false,
						tl: false,
						br: false,
						bl: false,
						mt: false,
						mb: false,
						/*ml: false,
            mr: false,
            mtr: false*/
					});
					this.lineIndex[this.lineCount] = this.objectCount;
					this.lineCount++;
					this.objectCount++;
					//canvas.setActiveObject(line);
					if (lineId.value === "straightLine") {
						console.log(lineId.value);
						line.set({ stroke: "red" });
					} else if (lineId.value === "dashedLine") {
						line.set({ strokeDashArray: [20, 5] });
					} else if (lineId.value === "dottedLine") {
						console.log(lineId.value);
						line.set({ strokeDashArray: [5, 7] });
					}
					this.lineWidth(canvas);
					this.lineType(canvas);
					//line.set({strokeWidth: this.lineWidth});
					//line.set({stroke: 5});
					console.log(line);
					linePoints[0].x = pointer.x;
					linePoints[0].y = pointer.y;
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

			canvas.on("mouse:move", (o) => {
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

					angle = Number.parseInt((angle % 360) + 180);
					/*	if (angle <= 45 || angle >= 315) {
						angle = 0;
					} else if (angle <= 135) {
						angle = 90;
					} else if (angle <= 225) {
						angle = 180;
					} else if (angle <= 315) {
						angle = 270;
					}*/
					angle -= 180;
					console.log(
						"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2781 ~ angle",
						angle
					);

					var cosx = r * Math.cos((angle * Math.PI) / 180);
					var sinx = r * Math.sin((angle * Math.PI) / 180);

					line.set({
						x2: cosx + startX,
						y2: sinx + startY,
					});

					linePoints[1].x = cosx + startX;
					linePoints[1].y = sinx + startY;
					this.lastAngle = Number.parseInt(angle);
					canvas.renderAll();
					return this.lastAngle;
				}
			});
			canvas.on("mouse:up", (o) => {
				var pointer = canvas.getPointer(o.e);
				var startX = points[0];
				var startY = points[1];
				var x2 = pointer.x - startX;
				var y2 = pointer.y - startY;
				var angle = (Math.atan2(y2, x2) / Math.PI) * 180;
				angle = Number.parseInt((angle % 360) + 180);
				angle -= 180;
				console.log(
					"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2786 ~ angle",
					angle
				);

				let coord1 = { x: line.x1, y: line.y1 };
				let coord2 = {
					x: line.x2,
					y: line.y2,
				};

				let lineTyping = lineTypeCall([coord1, coord2], angle);
				console.log(lineTyping);
				line.set({ lineType: lineTyping, angleRotation: angle });
				if (lineTyping === 0) {
					line.set({ lineDirection: 1 });
				} else if (lineTyping === 1) {
					line.set({ lineDirection: 0 });
				} else if (lineTyping === 4) {
					line.set({ lineDirection: 4 });
				} else if (lineTyping === 6) {
					line.set({ lineDirection: 6 });
				} else if (lineTyping === 8) {
					line.set({ lineDirection: 8 });
				} else if (lineTyping === 10) {
					line.set({ lineDirection: 10 });
				} else if (lineTyping === 12) {
					line.set({ lineDirection: 12 });
				} else if (lineTyping === 14) {
					line.set({ lineDirection: 14 });
				}
				console.log(line.lineCoords);
				line.set({ lineCoordinates: [coord1, coord2] });

				line.setCoords();
				console.log(line);
				// canvas.setActiveObject(line);
				isDrawing = false;
			});

			const lineTypeCall = (lineCoords, angle) => {
				console.log(lineCoords);
				return this.lineTypeChecker(lineCoords, angle);
			};

			canvas.renderAll();
			return this.lastAngle;
		},

		handleChangeDirection(newDir) {
			console.log(newDir);
			console.log(this.canvas.getActiveObject());
			this.canvas.getActiveObject().set({ lineDirection: newDir });
			this.currentSelected = "line";
			console.log(this.canvas.getActiveObject());
			this.deleteArrows();
			this.showArrows(this.canvas.getActiveObject());
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

		async predictcall(canvas) {
			this.$store.dispatch("changeLoading", true);

			//E:\acads\Freelance\chip_project\qualtec_gui-main\back_end/static/originals/demo_4_front.png

			// let path_url = this.$store.state.chipFrontUrl;
			// let idx = path_url.lastIndexOf("/")

			console.log("ffyayy");

			console.log(this.$store.state.chipFrontUrl);
			let data = {
				front_url: this.$store.state.chipFrontUrl,
				back_url: this.$store.state.chipBackUrl,
				width: canvas.getWidth(),
				height: canvas.getHeight(),
			};
			let listBoxes = [];
			console.log(data);
			await this.axios
				.post(this.databaseLocalHost + "/predict", data)
				.then((response) => {
					console.log(response);
					listBoxes = response["data"];
					console.log("fffff");
					//console.log(str);
					//if (str == 1) {
					this.createRectangleFromPredictedValues(
						canvas,
						listBoxes.front
					);
					//	} else {
					/*this.createRectangleFromPredictedValues(
							canvas,
							listBoxes.back
						);*/

					this.listBoxesBack = listBoxes.back;
					///	}
					this.$store.dispatch("changeLoading", false);
				})
				.catch((error) => {
					console.log(error);
				});
		},

		createRectangleFromPredictedValues(canvas, pointsList) {
			console.log("my func entered");

			this.deleteArrows();

			this.drawingMode(canvas);
			//this.removeCanvasEvents(canvas);
			canvas.selection = false;

			var rect;

			// pointsList = [[140, 18, 107, 48],
			//               [14, 14, 106, 47],
			//               [14, 10, 108, 49]
			// ];

			for (let i = 0; i < pointsList.length; i++) {
				console.log("ddd");
				console.log(pointsList[i][0]);
				console.log(pointsList[i][1]);
				console.log(pointsList[i][2]);
				console.log(pointsList[i][3]);
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
					left: pointsList[i][0],
					top: pointsList[i][1],
				});
				rect.set({ width: pointsList[i][2] });
				rect.set({ height: pointsList[i][3] });
				canvas.add(rect);
			}

			canvas.renderAll();
		},

		//Drawing rectangle function
		createRectangle(canvas) {
			this.deleteArrows();
			var isDrawing;
			var rect;
			var x = 0;
			var y = 0;
			this.imageUpload = false;
			this.shapeDraw = true;
			this.zoomMode = false;
			this.lineDraw = true;
			this.lineTools = true;
			this.textDraw = false;
			this.showShapeSelection = false;
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
						id1: this.indexId,
					});
					this.indexId++;
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

					/*if (this.currentView === 1) {
						this.objectsList.push({
							id: rect.id1,
							value: "Shape rectangle with ID: " + rect.id1,
							selected: true,
						});
						this.objectListChecked1.push({
							id: rect.id1,
							value: "Shape line with ID: " + rect.id1,
							selected: false,
						});
					} else if (this.currentView === 2) {
						this.objectsList2.push({
							id: rect.id1,
							value: "Shape rectangle with ID: " + rect.id1,
							selected: true,
						});
						this.objectListChecked2.push({
							id: rect.id1,
							value: "Shape line with ID: " + rect.id1,
							selected: false,
						});
					}
*/
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
					//test
					// this.view1SaveUndoRedo.push( canvas.toObject(["cacheKey", "type", "selectable", "opacity"]))
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
			// var colorId = document.getElementById("text-color");
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
				} else if (o.id === "overlaySelection") {
					o.set({
						selectable: false,
					});
				}
			});
			console.log("after selection");
		},
		getLineCenter(lineCoords) {
			const target = lineCoords;
			const x1 = target[0].x,
				x2 = target[1].x,
				y1 = target[0].y,
				y2 = target[1].y;
			if (x1 === x2) {
				return { x: x1, y: (y1 + y2) / 2 };
			} else if (y1 === y2) {
				return { x: (x1 + x2) / 2, y: y1 };
			} else {
				return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
			}
		},
		showArrows(obj) {
			console.log(obj);
			let coord1 = {
				x: obj.lineCoordinates[0].x,
				y: obj.lineCoordinates[0].y,
			};
			//let coord2 = { x: obj.left + obj.width, y: obj.top + obj.height };
			let coord2 = {
				x: obj.lineCoordinates[1].x,
				y: obj.lineCoordinates[1].y,
			};
			let center = this.getLineCenter([coord1, coord2]);
			let angle = 0;
			let leftAdjust = 0;
			let topAdjust = 0;
			let lineCoords = [];
			let lineWidth = 5;
			let lineLeftAdjust;
			switch (obj.lineDirection) {
				case 0:
					center.y += lineWidth;
					angle = 0;
					leftAdjust = -15;
					lineCoords = [
						center.x - 7.5,
						center.y + 10,
						center.x - 7.5,
						center.y + 30,
					];
					break;
				case 1:
					angle = 90;
					topAdjust = -15;
					lineCoords = [
						center.x - 30,
						center.y - 7.5,
						center.x - 10,
						center.y - 7.5,
					];
					break;
				case 2:
					angle = 180;
					leftAdjust = 15;
					lineCoords = [
						center.x - 7.5,
						center.y - 30,
						center.x - 7.5,
						center.y - 10,
					];
					break;
				case 3:
					center.x += lineWidth;
					angle = 270;
					topAdjust = 15;
					lineCoords = [
						center.x + 10,
						center.y - 7.5,
						center.x + 30,
						center.y - 7.5,
					];
					break;
				case 4:
					angle = obj.angleRotation;
					leftAdjust = -15;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;
				case 5:
					angle = obj.angleRotation - 180;
					leftAdjust = 15;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;
				case 6:
					angle = obj.angleRotation - 180;
					leftAdjust = 15;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;
				case 7:
					angle = obj.angleRotation;
					leftAdjust = -15;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;

				case 8:
					angle = obj.angleRotation - 180;
					leftAdjust = -15;
					//topAdjust= -5;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;
				case 9:
					angle = obj.angleRotation;
					leftAdjust = 15;
					//topAdjust= -5;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;
				case 10:
					angle = obj.angleRotation;
					leftAdjust = 15;
					//topAdjust= -5;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;
				case 11:
					angle = obj.angleRotation - 180;
					leftAdjust = -15;
					//topAdjust= -5;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;
				case 12:
					angle = obj.angleRotation;
					leftAdjust = 15;
					//topAdjust= -5;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;
				case 13:
					angle = obj.angleRotation - 180;
					leftAdjust = -15;
					//topAdjust= -5;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;
				case 14:
					angle = obj.angleRotation;
					leftAdjust = -15;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;
				case 15:
					angle = obj.angleRotation - 180;
					leftAdjust = 15;
					///lineLeftAdjust = -5;
					lineCoords = [center.x, center.y, center.x, center.y];
					break;
			}
			console.log(
				"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 3185 ~ showArrows ~  obj.angleRotation",
				obj.angleRotation
			);

			console.log(center);
			console.log(leftAdjust, topAdjust);
			console.log(angle);
			console.log(lineCoords);
			console.log(lineLeftAdjust);
			/*	const head = new fabric.Triangle({
				type: "arrow",
				width: 30,
				height: 10,
				left: center.x + leftAdjust,
				top: center.y + topAdjust,
				fill: "#ff0000",
				angle: angle,
				selectable: false,
			});
      let arr=[4,5,6,7,8]
      console.log(lineLeftAdjust)
			const line = new fabric.Line(lineCoords, {
        left: center.x +leftAdjust+ lineLeftAdjust,
				//top: center.y ,
				type: "arrow",
				strokeWidth: 15,
				stroke: "#ff0000",
				selectable: false,
        angle: arr.includes(obj.lineDirection) &&  angle,
			});
			console.log("head", head);
			console.log("line", line);
      


			this.canvas.add(head);
			this.canvas.add(line);*/

			var imgElement = document.getElementById("my-image");

			var head = new fabric.Image(imgElement, {
				type: "arrow",
				width: 30,
				height: 30,
				left: center.x + leftAdjust,
				top: center.y + topAdjust,
				fill: "#ff0000",
				angle: angle,
				selectable: false,
			});
			this.canvas.add(head);

			this.canvas.renderAll();
		},
		deleteArrows() {
			//  console.log(this.canvas.getObjects());
			let toRemoveObjs = [];
			this.objectListChecked1 = [];
			this.objectsList = [];
			this.objectsList2 = [];
			this.objectListChecked2 = [];
			for (let i = 0; i < this.canvas.getObjects().length; ++i) {
				if (this.canvas.getObjects()[i].type === "arrow") {
					toRemoveObjs.push(this.canvas.getObjects()[i]);
				}
			}
			for (let i = 0; i < toRemoveObjs.length; ++i) {
				this.canvas.remove(toRemoveObjs[i]);
			}
			//console.log(this.canvas.getObjects());
			//this.$store.dispatch("changeArrowCoordinates", toRemoveObjs);
		},
		switchToLine(obj) {
			console.log(obj);
			this.deleteArrows();
			this.directionIndex = obj.lineType;
			this.directionSelection = obj.lineDirection;
			this.currentSelected = "line";
			this.showArrows(obj);
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
			this.lineTools = true;
			console.log(canvas._objects);
			this.removeCanvasEvents(canvas);
			canvas.selection = true;
			this.objectListChecked = [];
			this.objectsList = [];
			this.objectsList2 = [];
			this.objectListChecked2 = [];
			var lineWidth = document.getElementById("line-width");
			let lineId = document.getElementById("line-type");
			canvas.getObjects().forEach((o) => {
				//if (o.id === "added-line") {
				o.set({
					selectable: true,
				});
				if (o.type === "line") {
				lineWidth.addEventListener("change", () => {
						o.set({ strokeWidth: lineWidth.value });
						canvas.renderAll();
					});
				console.log("o.id", o.id)
				
				lineId.addEventListener("change", () => {
				//canvas.getActiveObjects().forEach((o) => {
					//if (o.id === "added-line") {
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
					//}
				});
				//});

				}
			//});

				/*this.lineWidth();
				this.lineType();
				this.changeColor();*/
				// }
				console.log(this.objectsList);
				console.log(this.objectListChecked1);

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
			});
			console.log(this.objectsList);
			console.log(this.objectListChecked1);
			console.log("hi");
			this.showShapeSelection = true;
			canvas.on("selection:created", (e) => {
				//this.lineDraw = true;
				console.log("selection:created");
				if (!returnLineDrawing()) {
					e.selected.forEach((o) => {
						this.tempSelectedObjects.push({
							type: o.id,
							id: o.id1,
							left: o.oCoords.tl.x,
							top: o.oCoords.tl.y,
						});
					});
					canvas.renderAll();
					if (e.target.type === "line") {
						updateCurrentSelectedLine(e.target);
					}
				}
			});
			canvas.on("selection:updated", (e) => {
				console.log("selection:updated");
				if (!returnLineDrawing()) {
					console.log("updated!", e);
					if (e.target.type === "line") {
						updateCurrentSelectedLine(e.target);
					}
				}
			});
			canvas.on("selection:cleared", (e) => {
				var line;
				console.log(e);
				e?.deselected?.forEach((obj) => {
					if (obj.type === "line") {
						line = canvas
							?.getObjects()
							.find((e) => e.id1 === obj.id1);
						console.log(
							0 <= obj.angleRotation <= 90,
							-180 <= obj.angleRotation <= -90,
							-90 <= obj.angleRotation <= 0
						);
						if (
							(0 <= obj.angleRotation &&
								obj.angleRotation <= 90) ||
							(-180 <= obj.angleRotation &&
								obj.angleRotation <= -90)
						) {
							let coord1 = obj.lineCoords["tl"];
							let coord2 = obj.lineCoords["br"];
							line.set({ lineCoordinates: [coord1, coord2] });
							line.set({width:obj.width})
							line.set({height:obj.height})

							line.set({
								x1: coord1.x,
								y1: coord1.y,
								x2: coord2.x-obj.strokeWidth,
								y2: coord2.y-obj.strokeWidth,
							});
						} else {
							let coord1 = obj.lineCoords["bl"];
							let coord2 = obj.lineCoords["tr"];
							line.set({ lineCoordinates: [coord1, coord2] });
							line.set({
								x1: coord1.x,
								y1: coord1.y,
								x2: coord2.x-obj.strokeWidth,
								y2: coord2.y-obj.strokeWidth,
							});
						}
					}
				});
				console.log("selection:cleared");
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
				if (!returnLineDrawing()) {
					// console.log('cleared', e);
					clearSelectedLine();
				}
			});

			/*for(let i=this.view?this.lengthOfJsonFront:this.lengthOfJsonBack;i<canvas.getObjects().length;i++){
      canvas.getObjects()[i].set({
            selectable: true,
          })

      }*/
			const returnLineDrawing = () => {
				console.log("line draw", this.lineDraw);
				return this.lineDraw;
			};

			const updateCurrentSelectedLine = (obj) => {
				this.switchToLine(obj);
			};

			const clearSelectedLine = () => {
				this.deleteArrows();
				this.currentSelected = "";
			};
			console.log("after selection");
		},
		setLineDirection(direction) {
			//this.selectedLineについて、研磨方向をdirectionとしてjsonに記入
			console.log("Line Direction is ...", direction);
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
				type: "arrow",
				width: 30,
				height: 10,
				left: centerX + leftAdjust,
				top: centerY + topAdjust,
				fill: "#ff0000",
				angle: angle,
				selectable: false,
			});
			const line = new fabric.Line(lineCoords, {
				type: "arrow",
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
			head.set({ type: "arrow" });
			line.set({ type: "arrow" });
			this.canvas.renderAll();
			//add direction information to this.adjustedObjectList
		},
		decreaseIndex(deleted) {
			Object.keys(this.rectIndex).forEach((rect) => {
				const originalIndex = this.rectIndex[rect];
				let decreaseValue = 0;
				for (let i = 0; i < deleted.length; i++) {
					if (deleted[i] < originalIndex) {
						decreaseValue++;
					}
				}
				this.rectIndex[rect] -= decreaseValue;
			});
			Object.keys(this.lineIndex).forEach((line) => {
				const originalIndex = this.lineIndex[line];
				let decreaseValue = 0;
				for (let i = 0; i < deleted.length; i++) {
					if (deleted[i] < originalIndex) {
						decreaseValue++;
					}
				}
				this.lineIndex[line] -= decreaseValue;
			});
			let newDirectionArrows = {};
			Object.keys(this.directionArrows).forEach((line) => {
				const originalArrow = this.directionArrows[line][0];
				let decreaseLine = 0,
					decreaseArrow = 0;
				for (let i = 0; i < deleted.length; i++) {
					if (deleted[i] < line) {
						decreaseLine++;
					}
					if (deleted[i] < originalArrow) {
						decreaseArrow++;
					}
				}
				newDirectionArrows[line - decreaseLine] = [
					originalArrow - decreaseArrow,
					originalArrow - decreaseArrow + 1,
				];
			});
			this.directionArrows = newDirectionArrows;
			this.objectCount -= deleted.length;
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
			//var activeObject = this.canvas.getActiveObject();
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
					if (event.keyCode === rightKey) {
						canvas.getActiveObjects().forEach((o) => {
							console.log(o);
							o.left = o.left + step;
						});
						canvas.renderAll();
					}
					if (event.keyCode === leftKey) {
						canvas.getActiveObjects().forEach((o) => {
							console.log(o);
							o.left = o.left - step;
						});
						canvas.renderAll();
					}
					if (event.keyCode === upKey) {
						event.preventDefault();
						canvas.getActiveObjects().forEach((o) => {
							console.log(o);
							o.top = o.top - step;
						});
						canvas.renderAll();
					}
					if (event.keyCode === downKey) {
						event.preventDefault();
						canvas.getActiveObjects().forEach((o) => {
							console.log(o);
							o.top = o.top + step;
						});
						canvas.renderAll();
					}
				},
				false
			);
			//}
		},

		/*moveSelected(direction) {

            var activeObject = canvas.getActiveObject();
            var activeGroup = canvas.getActiveGroup();
			var canvas = ref.canvas;

            if (activeObject) {
                switch (direction) {
                case Direction.LEFT:
                    activeObject.setLeft(activeObject.getLeft() - STEP);
                    break;
                case Direction.UP:
                    activeObject.setTop(activeObject.getTop() - STEP);
                    break;
                case Direction.RIGHT:
                    activeObject.setLeft(activeObject.getLeft() + STEP);
                    break;
                case Direction.DOWN:
                    activeObject.setTop(activeObject.getTop() + STEP);
                    break;
                }
                activeObject.setCoords();
                canvas.renderAll();
                console.log('selected objects was moved');
            } else if (activeGroup) {
                switch (direction) {
                case Direction.LEFT:
                    activeGroup.setLeft(activeGroup.getLeft() - STEP);
                    break;
                case Direction.UP:
                    activeGroup.setTop(activeGroup.getTop() - STEP);
                    break;
                case Direction.RIGHT:
                    activeGroup.setLeft(activeGroup.getLeft() + STEP);
                    break;
                case Direction.DOWN:
                    activeGroup.setTop(activeGroup.getTop() + STEP);
                    break;
                }
                activeGroup.setCoords();
                canvas.renderAll();
                console.log('selected group was moved');
            } else {
                console.log('no object selected');
            }

        },	*/

		pasteObject(canvas) {
			this.deleteArrows();
			this.showShapeSelection = false;
			var clipboard;
			console.log(canvas.getActiveObject());
			var direction = canvas.getActiveObject().lineDirection;
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
				clonedObj.lineDirection = direction;
				clipboard.top += 10;
				clipboard.left += 10;
				canvas.setActiveObject(clonedObj);
				canvas.requestRenderAll();
				console.log("this.clipboard PASTE", clipboard);
			});
		},
		//Delete selected shape
		deleteShape(canvas) {
			this.deleteArrows();
			this.showShapeSelection = false;
			console.log("hello1111111", this.view1SaveUndoRedo);
			var doomedObj = canvas.getActiveObject();
			if (doomedObj.type === "activeSelection") {
				this.view1SaveUndoRedo.length = this.indexstack;
				doomedObj.canvas = canvas;
				if (this.currentView === 1) {
					doomedObj.forEachObject((obj) => {
						this.view1SaveUndoRedo.push({
							action: "deleted",
							value: obj,
						});
						this.indexstack++;
						this.objectsList = this.objectsList.filter(
							(obj1) => obj1.id === obj.id1
						);

						canvas.remove(obj);
					});
					this.view1SaveUndoRedo.length = this.indexstack;
				} else if (this.currentView === 2) {
					doomedObj.forEachObject((obj) => {
						this.view2SaveUndoRedo.push({
							action: "deleted",
							value: obj,
						});
						this.indexstack2++;
						this.objectsList2 = this.objectsList2.filter(
							(obj1) => obj1.id === obj.id1
						);

						canvas.remove(obj);
					});
					this.view2SaveUndoRedo.length = this.indexstack2;
				}
			} else {
				if (doomedObj !== null) {
					if (this.currentView === 1) {
						this.view1SaveUndoRedo.push({
							action: "deleted",
							value: doomedObj,
						});
						this.objectsList = this.objectsList.filter(
							(obj) => obj.id === doomedObj.id1
						);

						this.indexstack++;
					} else if (this.currentView === 2) {
						this.objectsList2 = this.objectsList2.filter(
							(obj) => obj.id === doomedObj.id1
						);

						this.view2SaveUndoRedo.push({
							action: "deleted",
							value: doomedObj,
						});
						this.indexstack2++;
					}
					console.log(
						"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 4069 ~ deleteShape ~ doomedObj",
						doomedObj
					);
					canvas.remove(doomedObj);

					const type = doomedObj.id.slice(0, 10),
						index = parseInt(doomedObj.id.slice(10));
					let deletedList;
					if (type === "line") {
						const deletedLine = this.lineIndex[index];
						deletedList = [deletedLine];
						if (this.directionArrows[deletedLine]) {
							const deletedArrow =
								this.directionArrows[deletedLine];
							deletedList = deletedList.concat(deletedArrow);
							for (let i = 0; i < 2; i++) {
								this.canvas.remove(
									this.canvas.item(deletedArrow[0] - 1)
								);
							}
						}
					} else if (type === "rect") {
						deletedList = [this.rectIndex[index]];
					}
					console.log(deletedList);
					if (deletedList !== undefined)
						this.decreaseIndex(deletedList);
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
				if (zoom > 100) zoom = 100;
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
			this.deleteArrows();
			this.showShapeSelection = false;
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
					console.log(
						"🚀 ~ file: ChipCuttingLineCanvas3.vue ~ line 2627 ~ undoObject ~ this.view2SaveUndoRedo",
						this.view1SaveUndoRedo[this.indexstack - 1]
					);
					if (
						this.view1SaveUndoRedo[this.indexstack - 1]?.action ===
						"deleted"
					) {
						console.log("here");
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
			this.deleteArrows();
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

		showLineDirectionToolbar(obj) {
			console.log(obj);
		},

		showLineDirectionOption(obj) {
			this.selectedLine = obj;
			console.log(obj);
			const selected = obj.target.id;
			console.log(selected);
			if (selected.slice(0, 10) === "added-line") {
				const x1 = obj.target.x1,
					x2 = obj.target.x2;
				let lineType,
					initialValue = "";
				console.log(initialValue);
				if (x1 === x2) {
					lineType = "vertical";
				} else {
					lineType = "horizontal";
				}
				console.log(lineType);
				// this.$emit('lineSelected', lineType)
				const lineId = parseInt(selected.slice(10));
				if (this.lineDirection[lineId]) {
					initialValue = this.lineDirection[lineId];
				}
				// this.$emit('lineSelected', lineType, initialValue)
			}
		},
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
/*
#app {
  margin-left: 150px;
}*/

/*
#app {
 margin-left: 150px;
} */
.navbarStyle {
	margin-left: 90px;
}

@media only screen and (max-width: 1000px) {
	#app {
		transform: scale(0.6);
		margin-bottom: -214px;
		margin-top: -229px;
		width: 90%;
		margin-right: 16%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.navbarStyle {
		/* margin-left: 0px;*/
		width: 155%;
	}
}
@media only screen and (max-width: 1600px) and (min-width: 1000px) {
	#app {
		/* margin-left: 150px;
  /*-webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 1000px;
  margin-left: -100px;
  width: 100%;*/
		transform: scale(0.6);
		margin-bottom: -259px;
		margin-top: -229px;
		width: 90%;
		margin-left: 0%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.navbarStyle {
		/* margin-left: 0px;*/
		width: 155%;
	}
}

@media only screen and (min-width: 1600px) {
	#app {
		transform: scale(0.8);
		margin-bottom: -150px;
		margin-top: -110px;
		width: 90%;
		margin-right: 16%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.navbarStyle {
		/* margin-left: 0px;*/
		width: 90%;
	}
}
.flipImage {
	-webkit-transform: scaleX(-1);
	transform: scaleX(-1);
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
