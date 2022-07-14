<template>
	<v-container fluid>
		<v-row>
			<v-card elevation="0" class="lg-auto" max-width="730px">
				<!--max-width="1100px"-->
				<v-col cols="auto">
					<!--ml-n10-->
					<v-row no-gutters>
						<v-col class="sm-3">
							<v-btn-toggle
								tile
								color="deep-purple accent-3"
								group
							>
								<v-btn x-large @click="switchView1(canvas)">
									{{ $t("oppositeView.frontView") }}</v-btn
								>
								<!-- ビュー1 View 1-->
								<v-divider vertical></v-divider>
								<v-btn x-large @click="switchView2(canvas)">
									{{ $t("oppositeView.backView") }}</v-btn
								>
								<!-- ビュー2 View 2 -->
								<v-divider vertical></v-divider>
							</v-btn-toggle>
						</v-col>
						<v-col class="sm-2">
							<v-card class="pa-5">
								<div class="select">
									<select
										id="overlays-id"
										@change="handler($event, canvas)"
									>
										<option value="" disabled="disabled">
											{{
												$t("addOverlays.selectOverlay")
											}}
											<!--Select overlay-->
										</option>
										<!-- オーバーレイを選択 -->
										<option
											value="none"
											selected="selected"
										>
											{{ $t("addOverlays.none") }}
											<!--None-->
										</option>
										<!--index : yebda 0 -->
										<option id="id_view1" value="views1-id">
											{{ $t("oppositeView.selectView") }}
											1
										</option>
										<!-- Select view -->
										<option id="id_view2" value="views2-id">
											{{ $t("oppositeView.selectView") }}
											2
										</option>
										<!-- Select view -->
									</select>
								</div>
							</v-card>
						</v-col>
						<v-col class="sm-8">
							<v-card class="pa-4">
								<div class="rangeSlider">
									<label for="range" class="form-label">
										{{
											$t(
												"addOverlays.setOverlayTransparency"
											)
										}}
										<!--Set Overlay transparency--></label
									><br />
									<input
										type="range"
										class="form-range"
										id="range"
										min="0"
										max="100"
										value="50"
										oninput="this.nextElementSibling.value = this.value"
									/>
									<output
										for="range"
										id="slider-value"
									></output>
								</div>
							</v-card>
						</v-col>
					</v-row>
					<canvas ref="can" id="fabricCanvas"></canvas>
				</v-col>
				<v-card-actions>
					<v-btn
						color="green"
						outlined
						rounded
						text
						@click="clearCanvas(canvas)"
					>
						<v-icon dark> mdi-close </v-icon>
						{{ $t("functions.clear") }}
						<!--redo-->
						<!--やり直し-->
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-row>
	</v-container>
</template>

<script>
import { fabric } from "fabric";
import "fabric-history";

export default {
	created() {
		this.$root.$refs.ChipCuttingFront = this;
	},
	mounted() {
		this.image1 = new Image();
		this.image2 = new Image();
		this.imageSwitch1 = new Image();
		this.imageSwitch2 = new Image();
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

		//init switch views
		this.currentView = 1;
		// this.view1Cutting = {};
		// this.view2Cutting = {};

		//for clear
		this.view1Delete = {};
		this.view2Delete = {};

		this.view1 = document.querySelector(".one");
		this.view2 = document.querySelector(".two");

		this.range = document.getElementById("range");
		this.rangevalue = this.range.value / this.range.max;

		console.log(newScaledSizes.ratio);
		console.log(canvasW, canvasH);

		const ref = this.$refs.can;
		const canvas = new fabric.Canvas(ref, {
			width: canvasW,
			height: canvasH,
			fireMiddleClick: true,
			fireRightClick: true,
			stopContextMenu: true,
		});
		this.canvas = canvas;

		fabric.Image.fromURL(
			this.background_image_view1,
			(img) => {
				img.set({
					left: 0,
					top: 0,
				});
				img.scaleToHeight(canvasH);
				this.canvas.backgroundImage = img;

				this.canvas.renderAll();
			},
			{ crossOrigin: "anonymous" }
		);
		this.originalHeight = 0;
		this.originalWidth = 0;

		this.setUpCanvas(canvas);

		const select = document.getElementById("overlays-id");
		if (this.currentView === 1) {
			select.value = "none";
		} else if (this.currentView === 2) {
			select.value = "none";
		}

		this.lastelement = ""; //"none"
		this.index;
		this.tab = {};
		this.last = {};
		this.last["view2"] = "none";
		this.clipboard;

		this.view1CuttingUndoRedo = [];
		this.isRedoing = false;
		this.view2CuttingUndoRedo = [];

		this.json = {};
		canvas.isDrawingMode = false;
		canvas.selection = false;
		this.imageBeforeZoom =
			document.getElementsByClassName("lower-canvas")[0];
		this.imageView1 = new Image();
		this.imageView2 = new Image();
		this.lastPosX;
		this.lastPosY;
		this.nbr = 0;
		//this.switchView1(canvas)
		//this.canvas.historyInit();
		canvas.renderAll();

		this.zoom(canvas);
		// this.createRectangle(canvas);
	},
	components: {},
	props: {
		canvasWidth: Number,
		canvasHeight: Number,
		editorId: String,
		background_image_view1: String,
		background_image_view2: String,
		background_image_size: Array,
		activeTool: String,
		lineWidth: { type: Number, default: 2 },
		overview: String,
		overviewTransparency: Number,
	},
	computed: {
		chipFrontUrl() {
			return this.$store.state.chipFrontUrl;
		},
		databaseLocalHost() {
			return this.$store.state.databaseLocalHost;
		},
		paint1SwitchObj() {
			return this.$store.state.paint1SwitchObj;
		},
		paint2SwitchObj() {
			return this.$store.state.paint2SwitchObj;
		},
		cutting1SwitchObj() {
			return this.$store.state.cutting1SwitchObj;
		},
		cutting2SwitchObj() {
			return this.$store.state.cutting2SwitchObj;
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
		noLine() {
			let judge = true;
			this.canvas.getObjects().forEach((o) => {
				if (o.id.slice(0, 10) === "added-line") {
					judge = false;
				}
			});
			return judge;
		},
	},
	data: () => ({
		newScaledWidth: 0.0,
		newScaledHeight: 0.0,
		scaleRatio: 0.0,
		adjustedObjectList: [],
		selectedLine: null,
		directionArrows: {},
		objectCount: 0,
		lineCount: 0,
		rectCount: 0,
		lineIndex: {},
		rectIndex: {},
		lineDirection: {},
		view1Cutting: { backgroundImage: {}, objects: [], version: "" },
		view2Cutting: { backgroundImage: {}, objects: [], version: "" },
		paint1Index: 0,
		paint2Index: 0,
	}),
	watch: {
		activeTool(value) {
			console.log("active tool changed", value);
			const canvas = this.canvas;
			switch (value) {
				case "line":
					this.createLine(canvas);
					this.$emit("lineSelected", "none", "");
					canvas.discardActiveObject();
					canvas.renderAll();
					break;
				case "rect":
					this.createRectangle(canvas);
					this.$emit("lineSelected", "none", "");
					canvas.discardActiveObject();
					canvas.renderAll();
					break;
				case "select":
					this.selectionMode(canvas);
					break;
			}
		},
	},
	methods: {
		setUpCanvas(canvas) {
			console.log(this.paint1SwitchObj);
			console.log(this.paint2SwitchObj);
			console.log(this.cutting1SwitchObj);
			console.log(this.cutting2SwitchObj);

			let toInsertObjects1 = this.paint1SwitchObj;
			let toInsertObjects2 = this.paint2SwitchObj;
			let toInsertCutting1 = this.cutting1SwitchObj;
			let toInsertCutting2 = this.cutting2SwitchObj;

			for (let i = 0; i < toInsertObjects1.objects.length; ++i) {
				toInsertObjects1.objects[i].selectable = false;
			}
			for (let i = 0; i < toInsertObjects2.objects.length; ++i) {
				toInsertObjects2.objects[i].selectable = false;
			}

			this.view1Cutting = toInsertObjects1;
			this.view2Cutting = toInsertObjects2;

			this.paint1Index =
				toInsertObjects1.objects.length > 0
					? toInsertObjects1.objects.length - 1
					: 0;
			this.paint2Index =
				toInsertObjects2.objects.length > 0
					? toInsertObjects2.objects.length - 1
					: 0;

			if (toInsertCutting1.objects.length > 0) {
				this.view1Cutting.objects = this.view1Cutting.objects.concat(
					toInsertCutting1.objects
				);
			}
			if (toInsertCutting2.objects.length > 0) {
				this.view2Cutting.objects = this.view2Cutting.objects.concat(
					toInsertCutting2.objects
				);
			}

			console.log(this.view1Cutting);
			console.log(this.view2Cutting);

			canvas.loadFromJSON(
				this.view1Cutting,
				this.canvas.renderAll.bind(canvas)
			);

			console.log("why you not loading?");
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
		async uploadImageToFileSystem(image, filename) {
			let data = { image: image, filename: filename };
			let newFilename = "";
			console.log(data);
			await this.axios
				.post(this.databaseLocalHost + "/switchImageUpload", data)
				.then((response) => {
					console.log(response);
					newFilename = response["data"];
				})
				.catch((error) => {
					console.log(error);
				});

			return newFilename;
		},
		haveSameData(obj1, obj2) {
			const obj1Length = Object.keys(obj1).length;
			const obj2Length = Object.keys(obj2).length;

			if (obj1Length === obj2Length) {
				return Object.keys(obj1).every(
					(key) =>
						Object.hasOwnProperty.call(obj2, key) &&
						obj2[key] === obj1[key]
				);
			}
			return false;
		},
		objectContains(obj1, array) {
			let returnData = false;
			for (let i = 0; i < array.length; ++i) {
				returnData = this.haveSameData(obj1, array[i]);
			}
			return returnData;
		},
		switchCanvasMode() {
			this.$store.dispatch("changeLoading", true);

			// let newCutting1 = this.view1Cutting;
			// let newCutting2 = this.view2Cutting;
			let newCutting1 = this.view1Cutting;
			let newCutting2 = this.view2Cutting;
			//let paintObj2 = this.paint2SwitchObj;

			console.log(newCutting1);
			console.log(newCutting2);
			console.log(this.paint1SwitchObj);
			console.log(this.paint2SwitchObj);

			if (this.currentView === 1) {
				newCutting1 = this.canvas.getObjects();
			} else {
				newCutting2 = this.canvas.getObjects();
			}

			if (typeof newCutting1[this.paint1Index] !== "undefined") {
				console.log(
					JSON.parase(
						JSON.stringify(
							newCutting1.objects.slice(this.paint1Index)
						)
					)
				);
				newCutting1.objects = JSON.parase(
					JSON.stringify(newCutting1.objects.slice(this.paint1Index))
				);
			}

			if (typeof newCutting2[this.paint2Index] !== "undefined") {
				console.log(
					JSON.parse(
						JSON.stringify(
							newCutting2.objects.slice(this.paint2Index)
						)
					)
				);
				newCutting2.objects = JSON.parse(
					JSON.stringify(newCutting2.objects.slice(this.paint2Index))
				);
			}

			console.log(newCutting1);
			console.log(newCutting2);

			this.$store.dispatch("changeCutting1SwitchObj", newCutting1);
			this.$store.dispatch("changeCutting2SwitchObj", newCutting2);

			this.$store.dispatch("changeLoading", false);

			this.$router.push("paint_tool");
		},

		handler(event, canvas) {
			if (
				event.target.value === "views1-id" ||
				event.target.value === "views2-id"
			) {
				var index = 0;
				for (let i = 0; i < canvas._objects.length; i++) {
					if (canvas._objects[i].cacheKey == this.lastelement) {
						index = i;
						if (index != null) {
							canvas.remove(canvas._objects[index]);
						}
					}
				}
				console.log("views", event.target.value);
				if (this.currentView === 1) {
					if (event.target.value === "views2-id") {
						var viewInstance2 = new fabric.Image(
							this.image2,
							{
								/*cacheKey: event.target.value,
                            index: 1,*/
								selectable: false,
								opacity: 0.5,
								id: "View2_Overview",
							},
							{ crossOrigin: "anonymous" }
						);
						canvas.add(viewInstance2);
						canvas.moveTo(viewInstance2, 0);
						viewInstance2.set({ opacity: this.rangevalue });
						//overlayInstance.on("selected", () => {
						this.range.addEventListener("change", () => {
							//this.rangeView.addEventListener("change", () => {
							viewInstance2.set({
								opacity: this.range.value / this.range.max,
							});
							//console.log(viewInstance1.opacity);
							canvas.renderAll();
						});
					}
				} else if (this.currentView === 2) {
					//this.imageView2 = document.getElementsByClassName("lower-canvas")[0];
					//var imageView2 = document.getElementsByClassName("lower-canvas")[0];
					if (event.target.value === "views1-id") {
						var viewInstance1 = new fabric.Image(
							this.image1,
							{
								/*cacheKey: event.target.value,
                        index: 1,*/
								selectable: false,
								opacity: 0.5,
								id: "View1_Overview",
							},
							{ crossOrigin: "anonymous" }
						);
						canvas.add(viewInstance1);
						canvas.moveTo(viewInstance1, 0);
						viewInstance1.set({ opacity: this.rangevalue });
						//overlayInstance.on("selected", () => {
						this.range.addEventListener("change", () => {
							viewInstance1.set({
								opacity: this.range.value / this.range.max,
							});
							//console.log(viewInstance1.opacity);
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

				canvas.renderAll();
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
		deactivateLine(canvas) {
			/*var isDrawing
            var line;*/
			/*canvas.off('mouse:down')
            canvas.off('mouse:move')
            canvas.off('mouse:up')*/
			var colorId = document.getElementById("text-color");
			this.removeCanvasEvents(canvas);
			canvas.selection = true;
			console.log(canvas.getObjects());
			console.log(canvas.getObjects()[0].id);
			canvas.getObjects().forEach((o) => {
				if (o.id.slice(0, 10) === "added-line") {
					o.set({
						selectable: true,
					});
				} else if (o.id.slice(0, 10) === "added-rect") {
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

		switchView1(canvas) {
			this.view = true;
			//const selectOppositeView = document.getElementById("views-id");
			const selectOppositeView1 = document.getElementById("id_view1");
			const selectOppositeView2 = document.getElementById("id_view2");

			//console.log('selectOppositeView.value', selectOppositeView.value)
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
				//selectOppositeView.value = 'none'
			});
			//this.deactivateLine(canvas);
			//this.imageView2 = document.getElementsByClassName("lower-canvas")[0];
			const select = document.getElementById("overlays-id");

			for (var i = 0; i < canvas._objects.length; i++) {
				switch (this.last["view1"]) {
					case "id-overlay" + i:
						select.value = "id-overlay" + i;
						break;
					case "none":
						select.value = "none";
					/*default:
                    select.value = "none";
                    break;*/
				}
				console.log(select.value);
			}

			if (this.currentView === 2) {
				if (this.last["view1"] != undefined) {
					this.lastelement = this.last["view1"];
				}
				console.log(this.lastelement);
				this.view2Cutting = canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
				]);
				this.image2.src = canvas.toDataURL("image/png");
				this.imageSwitch2.src = canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				canvas.clear();
				canvas.loadFromJSON(
					this.view1Cutting,
					this.canvas.renderAll.bind(canvas)
				);
				select.value = this.lastelement; //to refresh the overlay dropdown
				this.currentView = 1;
				/*this.view1.disabled = true;
                this.view2.disabled = false;*/
				this.range.addEventListener("change", () => {
					canvas._objects[0].set({
						opacity: this.range.value / this.range.max,
					});
					canvas.renderAll();
				});
			}
			console.log(this.currentView);
			console.log("view2 save : ", this.view2Cutting);
		},
		//method to switch from "view 2" to "view 1"
		switchView2(canvas) {
			this.view = false;
			//const selectOppositeView = document.getElementById("views-id");
			const selectOppositeView1 = document.getElementById("id_view1");
			const selectOppositeView2 = document.getElementById("id_view2");
			//console.log('selectOppositeView.value', selectOppositeView.value)
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
				//selectOppositeView.value = 'none'
			});
			//this.deactivateLine(canvas);
			//this.imageView1 = document.getElementsByClassName("lower-canvas")[0];
			//used for select management
			const select = document.getElementById("overlays-id");
			/*if(this.nbr == 0) {
                select.value = 'none';
            }*/
			console.log("this.last[view2]", this.last["view2"]);
			for (var i = 0; i < canvas._objects.length; i++) {
				switch (this.last["view2"]) {
					case "id-overlay" + i:
						select.value = "id-overlay" + i;
						break;
					case "none":
						select.value = "none";
					/*default:
                    select.value = "none";
                    break;*/
				}
			}
			console.log("here");
			fabric.Image.fromURL(
				this.background_image_view2,
				(img) => {
					img.set(
						{
							left: 0,
							top: 0,
						},
						{ crossOrigin: "anonymous" }
					);
					img.scaleToHeight(this.newScaledHeight);

					this.canvas.backgroundImage = img;
					this.canvas.renderAll();
				},
				{ crossOrigin: "anonymous" }
			);
			if (this.currentView === 1) {
				if (this.last["view2"] != undefined) {
					this.lastelement = this.last["view2"];
					//select.value = "none" //to refresh the overlay dropdown
				} else if (this.last["view2"] === undefined && this.nbr == 0) {
					select.value = "none";
					this.last["view2"] = "none";
				}
				this.view1Cutting = canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
				]);
				this.image1.src = canvas.toDataURL("image/png");
				this.imageSwitch1.src = canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				canvas.clear();
				canvas.loadFromJSON(
					this.view2Cutting,
					canvas.renderAll.bind(canvas)
				);
				select.value = this.lastelement; //to refresh the overlay dropdown
				this.currentView = 2;
				/*this.view1.disabled = false;
                this.view2.disabled = true;*/
			}
			console.log(this.currentView);
			console.log("view 1 save : ", this.view2Cutting);
			this.nbr++;
			console.log("this.nbr", this.nbr);
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
				console.log(list[i]);
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

			let view1 = this.view1Cutting;
			let view2 = this.view2Cutting;

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

			let newList1 = view1.objects.slice(this.paint1Index + 1);
			let newList2 = view2.objects.slice(this.paint2Index + 1);

			console.log(newList1, newList2);

			let newJson1 = this.oneSideJsonCreation(newList1);
			let newJson2 = this.oneSideJsonCreation(newList2);

			console.log(newJson1, newJson2);

			// console.log(inputJson);

			//now pass it into the backend to save into the directory for cutting lien generation
			// await this.saveJsonToInput(newJson1);
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
			console.log("🚨 1", data);
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

			return newObject;
		},
		switchViews() {
			let json = JSON.stringify(this.canvas.toJson());
			console.log(json);
		},
		//Drawing rectangle function
		createRectangle(canvas) {
			var isDrawing;
			var rect;
			var x = 0;
			var y = 0;
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
						strokeWidth: this.lineWidth,
					});
					isDrawing = false;
				} else {
					isDrawing = true;
					var pointer = canvas.getPointer(o.e);
					origX = pointer.x;
					origY = pointer.y;
					console.log(pointer);
					//var points = [pointer.x, pointer.y, pointer.x, pointer.y];
					x = pointer.x;
					y = pointer.y;
					console.log("pointer.x", pointer.x, "pointer.y", pointer.y);
					rect = new fabric.Rect({
						id: `added-rect${this.rectCount}`,
						width: 1,
						height: 1,
						fill: "transparent",
						strokeWidth: 5,
						stroke: "#ffff00",
						selectable: false, //true
						hasRotatingPoint: true,
						type: "rect",
						/*left: pointer.x,
                        top: pointer.y,*/
						left: origX,
						top: origY,
						/*originX: 'left',
                        originY: 'top',*/
						/*width: pointer.x-origX,
                        height: pointer.y-origY,*/
					});
					//console.log("pickerId", showColor())
					console.log("left x", rect.left, "top y", rect.top);
					canvas.add(rect);
					this.rectIndex[this.rectCount] = this.objectCount;
					this.rectCount++;
					this.objectCount++;
					canvas.setActiveObject(rect);
					//rect.set({stroke: 5});
				}
			});

			canvas.on("mouse:move", function (o) {
				if (!isDrawing) {
					return false;
				} else if (isDrawing) {
					var pointer = canvas.getPointer(o.e);

					/*x = Math.min(pointer.x, x),
                    y = Math.min(pointer.y, y)*/
					var w = Math.abs(x - pointer.x),
						h = Math.abs(y - pointer.y);
					/* var w = Math.abs(pointer.x - x),
                    h = Math.abs(pointer.y - y);*/

					if (!w || !h) {
						return false;
					}
					var rect = canvas.getActiveObject();
					if (origX > pointer.x) {
						rect.set({ left: pointer.x, strokeWidth: 5 });
					}
					if (origY > pointer.y) {
						rect.set({ top: pointer.y, strokeWidth: 5 });
					}

					rect.set({ width: Math.abs(origX - pointer.x) });
					rect.set({ height: Math.abs(origY - pointer.y) });
					//rect.set('width', w).set('height', h);
					canvas.renderAll();
				}
			});
			canvas.on("mouse:up", function () {
				// rect.setCoords();
				console.log(canvas.getObjects());

				if (isDrawing) {
					//createNewAdjObjectCoord([rect.lineCoords.bl, rect.lineCoords.br, rect.lineCoords.tl, rect.lineCoords.tr], canvas.getActiveObject());
					if (canvas.getActiveObject()) {
						canvas.getActiveObject().hasControls = false;
						canvas.getActiveObject().hasBorders = false;
						canvas.getActiveObject().lockMovementX = true;
						canvas.getActiveObject().lockMovementY = true;
						canvas.getActiveObject().lockUniScaling = true;
					}
					canvas.renderAll();
				}
				console.log(canvas.getActiveObject().getCoords());
				console.log("lines", rect.lineCoords);
				console.log(canvas.getObjects());
				console.log(rect.getCoords());
				isDrawing = false;
			});

			// const createNewAdjObjectCoord = (coords, object) => {
			//     this.addToAdjustedList(object, "rect");
			// }

			canvas.hoverCursor = "auto";
			canvas.renderAll();
		},
		zoom(canvas) {
			let resetZoom = false;
			let isDragging = false;
			var canvasH = canvas.getHeight();
			var canvasW = canvas.getWidth();
			console.log("canvasH", canvasH);
			console.log("canvasW", canvasW);
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
				console.log(evt.button);
				if (evt.altKey === true || evt.button === 1) {
					isDragging = true;
					this.selection = false;
					this.lastPosX = evt.clientX;
					this.lastPosY = evt.clientY;
				} else if (evt.button === 2) {
					resetZoom = true;
				}
			});
			canvas.on("mouse:move", function (opt) {
				if (isDragging) {
					var e = opt.e;
					var vpt = this.viewportTransform;
					vpt[4] += e.clientX - this.lastPosX;
					vpt[5] += e.clientY - this.lastPosY;
					this.requestRenderAll();
					this.lastPosX = e.clientX;
					this.lastPosY = e.clientY;
					//console.log("this.lastPosX",this.lastPosX, "this.lastPosY", this.lastPosY)
				}
			});
			canvas.on("mouse:up", function (opt) {
				let evt = opt.e;
				if (evt.button === 2 && resetZoom) {
					this.setViewportTransform([1, 0, 0, 1, 0, 0]);
					resetZoom = false;
				}
				// on mouse up we want to recalculate new interaction
				// for all objects, so we call setViewportTransform
				this.setViewportTransform(this.viewportTransform);
				isDragging = false;
				this.selection = true;
			});
		},

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
						strokeWidth: this.lineWidth,
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
						strokeWidth: this.lineWidth, //5,
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
					this.lineIndex[this.lineCount] = this.objectCount;
					this.lineCount++;
					this.objectCount++;
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
				console.log("up");
				line.setCoords();

				// console.log(linePoints[0]);
				// const abs = new fabric.Point(linePoints[0].x, linePoints[0].y);

				// const localPoint = this.canvas.backgroundImage.toLocalPoint(abs, 'left', 'top');
				// console.log(localPoint);
				console.log(
					[linePoints[0], linePoints[1]],
					canvas.getActiveObject()
				);
				//createNewAdjObjectCoord([linePoints[0], linePoints[1]], canvas.getActiveObject());
				if (canvas.getActiveObject()) {
					canvas.getActiveObject().hasControls = false;
					canvas.getActiveObject().hasBorders = false;
					canvas.getActiveObject().lockMovementX = true;
					canvas.getActiveObject().lockMovementY = true;
					canvas.getActiveObject().lockUniScaling = true;
				}
				canvas.renderAll();
				isDrawing = false;
			});

			//   const createNewAdjObjectCoord = (coords, object) => {
			//     this.addToAdjustedList(object, "line");
			//   }

			//canvas.selection = false
			//canvas.hoverCursor = "auto"
			canvas.renderAll();
		},
		selectionMode(canvas) {
			/*var isDrawing
      var line;*/
			/*canvas.off('mouse:down')
      canvas.off('mouse:move')
      canvas.off('mouse:up')*/
			//var colorId = document.getElementById("text-color")
			//console.log("last overlay :", this.lastelement)
			//console.log(" this.last[view1]:",  this.last["view1"])
			//console.log(" this.last[view2]:",  this.last["view2"])
			console.log("canvas._objects[0]", canvas._objects[0]);
			this.removeCanvasEvents(canvas);
			canvas.selection = true;
			canvas.getObjects().forEach((o) => {
				if (o !== canvas._objects[0])
					o.set({
						selectable: true,
					});
				if (o.id.slice(0, 10) === "added-line") {
					o.set({
						selectable: true,
					});
				} else if (o.id.slice(0, 10) === "added-rect") {
					o.set({
						selectable: true,
					});
				} else {
					o.set({
						selectable: false,
					});
				}
			});
			canvas.on("selection:created", (obj) => {
				const selected = obj.selected;
				console.log(selected);
				if (selected.length === 1) {
					this.showLineDirectionOption(obj);
				}
			});
			canvas.on("selection:updated", (obj) => {
				this.$emit("lineSelected", "none");
				const selected = obj.selected;
				console.log(selected);
				if (selected.length === 1) {
					this.showLineDirectionOption(obj);
				}
			});
			canvas.on("selection:cleared", () => {
				this.$emit("lineSelected", "none");
			});
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
			// console.log('lineIndex:', this.lineIndex)
			// console.log('rectIndex:', this.rectIndex)
			// console.log('directionArrows:', this.directionArrows)
			// console.log('lineDirection:', this.lineDirection)
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
			if (this.noLine) {
				this.directionArrows = {};
			} else {
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
			}
			this.objectCount -= deleted.length;
		},
		deleteShape() {
			//   const canvas = this.canvas
			//   var doomedObj = canvas.getActiveObject();
			//   if (!doomedObj) {
			//     return
			//   }
			//   if (doomedObj.type === 'activeSelection') {
			//     // active selection needs a reference to the canvas.
			//     doomedObj.canvas = canvas;
			//     doomedObj.forEachObject((obj) => {
			//       let deletedList
			//       canvas.remove(obj);
			//       console.log('active selection', obj)
			//       const type = obj.id.slice(0,10), index = parseInt(obj.id.slice(10))
			//       if (type === 'added-line') {
			//           const deletedLine = this.lineIndex[index]
			//           deletedList = [deletedLine]
			//           if (this.directionArrows[deletedLine]) {
			//               const deletedArrow = this.directionArrows[deletedLine]
			//               deletedList = deletedList.concat(deletedArrow)
			//               for (let i = 0; i < 2; i++) {
			//                 this.canvas.remove(this.canvas.item(deletedArrow[0] - 1))
			//               }
			//           }
			//       } else if (type === 'added-rect') {
			//           deletedList = [this.rectIndex[index]]
			//       }
			//       console.log(deletedList)
			//       this.decreaseIndex(deletedList)
			//     });
			//   } //endif multiple objects
			//   else{
			//     if(doomedObj !== null ) {
			//       canvas.remove(doomedObj)
			//       const type = doomedObj.id.slice(0,10), index = parseInt(doomedObj.id.slice(10))
			//       let deletedList
			//       if (type === 'added-line') {
			//           const deletedLine = this.lineIndex[index]
			//           deletedList = [deletedLine]
			//           if (this.directionArrows[deletedLine]) {
			//               const deletedArrow = this.directionArrows[deletedLine]
			//               deletedList = deletedList.concat(deletedArrow)
			//               for (let i = 0; i < 2; i++) {
			//                 this.canvas.remove(this.canvas.item(deletedArrow[0] - 1))
			//               }
			//           }
			//       } else if (type === 'added-rect') {
			//           deletedList = [this.rectIndex[index]]
			//       }
			//       console.log(deletedList)
			//       this.decreaseIndex(deletedList)
			//     }
			//     console.log('doomedobj',doomedObj)
			//   }
			//   this.$emit('lineSelected', 'none', '')
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
		removeCanvasEvents(canvas) {
			canvas.off("mouse:down");
			canvas.off("mouse:move");
			canvas.off("mouse:up");
			canvas.off("object:moving");
			//canvas.off('selection:created')
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
				if (x1 === x2) {
					lineType = "vertical";
				} else {
					lineType = "horizontal";
				}
				const lineId = parseInt(selected.slice(10));
				if (this.lineDirection[lineId]) {
					initialValue = this.lineDirection[lineId];
				}
				this.$emit("lineSelected", lineType, initialValue);
			}
		},
	},
};
</script>

<style scoped></style>
