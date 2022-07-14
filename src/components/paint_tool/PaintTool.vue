<template>
	<!--v-on:keyup.ctrl.86="pasteObject(canvas)"-->
	<!--main div-->
	<div id="app">
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
		<!--    </div>-->
		<div>{{ message }}</div>
		<div class="navbarStyle">
			<v-app-bar elevation="4" outlined rounded>
				<v-card class="d-flex justify-center" flat height="40px">
					<v-card class="pa-2">
						<div class="select">
							<select
								id="overlays-id"
								@change="handler($event, canvas)"
							>
								<option value="" disabled="disabled">
									{{ $t("addOverlays.selectOverlay") }}
									<!--Select overlay-->
								</option>
								<!-- オーバーレイを選択 -->
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
								<!--                <option value="none1">{{$t('addOverlays.none')}} &lt;!&ndash;None&ndash;&gt;</option>-->
								<option id="id_view1" value="views1-id">
									{{ $t("oppositeView.selectView") }} 1
								</option>
								<!-- Select view -->
								<!--                <option id="id_view2" value="views2-id"> {{$t('oppositeView.selectView')}} 2</option> &lt;!&ndash; Select view &ndash;&gt;-->
							</select>
							<!--          <select v-else id="overlays-id" @change="handler($event,canvas)">
                          <option value="" disabled="disabled"> {{$t('addOverlays.selectOverlay')}} &lt;!&ndash;Select overlay&ndash;&gt;</option> &lt;!&ndash; オーバーレイを選択 &ndash;&gt;
                          <option value="none" selected="selected"> {{$t('addOverlays.none')}} &lt;!&ndash;None&ndash;&gt;</option> &lt;!&ndash;index : yebda 0 &ndash;&gt;
                          <option v-for="(index, i) in overlays.length" v-bind:key="index" :value="'id-overlay'+i">
                            {{$t('addOverlays.overlay')+i }} &lt;!&ndash; {{"overlay"+i}} &ndash;&gt; </option>
                        </select>-->
						</div>
					</v-card>

					<v-card class="pa-2">
						<!-- outlined -->
						<div class="rangeSlider">
							<label for="range" class="form-label">
								{{ $t("addOverlays.setOverlayTransparency") }}
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
							<output for="range" id="slider-value1"></output>
						</div>
					</v-card>
				</v-card>
				<v-card class="d-flex justify-center" flat height="40px">
					<v-card class="pa-2">
						<div class="select">
							<select
								id="overlays-back-id"
								@change="handler1($event, canvas)"
							>
								<option value="" disabled="disabled">
									{{ $t("addOverlays.selectOverlay") }}
									<!--Select overlay-->
								</option>
								<!-- オーバーレイを選択 -->
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
								<!--                <option value="none1">{{$t('addOverlays.none')}} &lt;!&ndash;None&ndash;&gt;</option>-->
								<!--                <option id="id_view1" value="views1-id"> {{$t('oppositeView.selectView')}} 1</option> &lt;!&ndash; Select view &ndash;&gt;-->
								<option id="id_view2" value="views2-id">
									{{ $t("oppositeView.selectView") }} 2
								</option>
								<!-- Select view -->
							</select>
							<!--          <select v-else id="overlays-id" @change="handler($event,canvas)">
                          <option value="" disabled="disabled"> {{$t('addOverlays.selectOverlay')}} &lt;!&ndash;Select overlay&ndash;&gt;</option> &lt;!&ndash; オーバーレイを選択 &ndash;&gt;
                          <option value="none" selected="selected"> {{$t('addOverlays.none')}} &lt;!&ndash;None&ndash;&gt;</option> &lt;!&ndash;index : yebda 0 &ndash;&gt;
                          <option v-for="(index, i) in overlays.length" v-bind:key="index" :value="'id-overlay'+i">
                            {{$t('addOverlays.overlay')+i }} &lt;!&ndash; {{"overlay"+i}} &ndash;&gt; </option>
                        </select>-->
						</div>
					</v-card>

					<v-card class="pa-2">
						<!-- outlined -->
						<div class="rangeSlider">
							<label for="range1" class="form-label">
								{{ $t("addOverlays.setOverlayTransparency") }}
								<!--Set Overlay transparency--></label
							><br />
							<input
								type="range"
								class="form-range"
								id="range1"
								min="0"
								max="100"
								value="50"
								oninput="this.nextElementSibling.value = this.value"
							/>
							<output for="range1" id="slider-value"></output>
						</div>
					</v-card>
				</v-card>
			</v-app-bar>
			<v-app-bar elevation="4" outlined rounded>
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
							<v-icon dark> mdi-magnify-scan</v-icon>
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
					<v-icon dark> mdi-format-color-fill</v-icon>
					<!--{{$t('tools.changeColor')}}-->
					<!--Change Color-->
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<input
								type="color"
								value=""
								id="stroke-color"
								size="50"
								v-bind="attrs"
								v-on="on"
							/><!-- 色を変える -->
						</template>
						<span>{{ $t("tools.changeColor") }}</span>
					</v-tooltip>
				</v-btn>

				<v-btn
					@click="changeColor(canvas)"
					v-bind:class="{ img2: !textColor }"
				>
					<v-icon dark> mdi-format-color-fill</v-icon>
					<!--{{$t('tools.changeColor')}}-->
					<!--Change Color-->
					<v-tooltip bottom>
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
					<v-tooltip bottom>
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
						<span> {{ $t("tools.backgroundColor") }}</span>
						<!-- Background color -->
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								tile
								outlined
								small
								@click="transparentColor(canvas)"
								value=""
								id="textBackground-transp"
								size="25"
								opacity="0"
								v-bind="attrs"
								v-on="on"
							>
								<v-icon dark> mdi-invert-colors-off</v-icon>
							</v-btn>
							<!--              <input @click="transparentColor(canvas)" type="color" value="" id="textBackground-transp" size="50" opacity="30" v-bind="attrs" v-on="on">-->
						</template>
						<span> {{ $t("tools.nobackgroundColor") }}</span>
						<!-- Transparent Background color  -->
					</v-tooltip>
				</v-btn>



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
	
					</v-card>
				</template>
				<v-card class="d-flex justify-center" height="40px" flat
					><!--mb-6-->
					<v-card class="pa-2" v-bind:class="{ img2: !textDraw }">
						<v-tooltip bottom>
							<template v-slot:activator="{ on, attrs }">
								<div class="rangeSlider">
									<!--              <label for="range" class="form-label">Background Color Opacity</label><br>-->
									<input
										type="range"
										class="form-range"
										id="rangeColor"
										min="0"
										max="100"
										value="50"
										oninput="this.nextElementSibling.value = this.value"
										v-bind="attrs"
										v-on="on"
									/>
									<output
										for="range"
										id="sliderColor-value"
									></output>
								</div>
							</template>
							<span>
								{{ $t("tools.transpbackgroundColor") }}</span
							>
							<!-- Background color Opacity  -->
						</v-tooltip>
					</v-card>
					<v-card class="pa-2" v-bind:class="{ img2: !textDraw }">
						<div class="select">
							<select
								id="font-family"
								@change="fontFamilyText(canvas)"
							>
								<option
									value=""
									selected="selected"
									disabled="disabled"
								>
									{{ $t("chooseTextFont.chooseFont") }}
									<!--Choose Font-->
								</option>
								<!-- npm  -->
								<option
									value="Century Gothic"
									id="CenturyGothic"
								>
									{{ $t("chooseTextFont.centuryGothic") }}
									<!--Century Gothic-->
								</option>
								<!--index : yebda 0 -->
								<option value="Candara" id="Candara">
									{{ $t("chooseTextFont.candara") }}
									<!--Candara-->
								</option>
								<!--index : yebda 0 -->
								<option value="Trebuchet MS" id="TrebuchetMS">
									{{ $t("chooseTextFont.trebuchetMS") }}
									<!--Trebuchet MS-->
								</option>
								<!--index : yebda 0 -->
								<option value="Comic Sans MS" id="ComicSansMS">
									{{ $t("chooseTextFont.comicSansMS") }}
									<!--Comic Sans MS-->
								</option>
								<!--index : yebda 0 -->
								<!--              <option v-for="(index, i) in overlays.length" v-bind:key="index" :value="'id-overlay'+i">{{"overlay"+i}}</option>-->
							</select>
						</div>
					</v-card>
					<!--          <v-card
                        class="pa-2"

                        v-bind:class="{ img2: !textDraw }"

                    >
                      <div class="select">
                        <select id="text-size" @change="sizeText(canvas)">
                          <option value="" selected="selected" disabled="disabled"> {{$t('chooseTextSize')}} &lt;!&ndash;Choose Text Size&ndash;&gt;</option> &lt;!&ndash; npm  &ndash;&gt;
                          <option v-for="(n, index) in 10" :key="index" :value="n * index">{{(n * index)}}</option>
                        </select>
                      </div>
                    </v-card>-->
					<v-card class="pa-2" v-bind:class="{ img2: !textDraw }">
						<div>
							<v-text-field
								label="Text Size"
								value=""
								type="number"
								@click="sizeText(canvas)"
								id="input-text-size"
							></v-text-field>
							<!--              <input value="12" type="number" @click="sizeText(canvas)" id="input-text-size">
                            <output for="number" id="input-text-size-value"></output>-->
						</div>
					</v-card>
				</v-card>

				<v-card class="d-flex justify-center" flat
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
								<!-- npm  -->
								<!--                <option v-for="(n, index) in 5" :key="index" :value="n * index+2" selected="selected">{{ n +"*"+ index +"2 :"+  (n * index+2)}}</option>-->
								<!--                <option v-for="(n, index) in 5" :key="index" :value="n * index">{{(n * index)}}</option>-->
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
								<!-- npm  -->
								<option value="straightLine" id="straightLine">
									{{ $t("lineType.straightLine") }}
									<!--Straight Line-->
								</option>
								<!--index : yebda 0 -->
								<option value="dashedLine" id="dashedLine">
									{{ $t("lineType.dashedLine")
									}}<!--Dashed Line-->
								</option>
								<!--index : yebda 0 -->
								<option value="dottedLine" id="dottedLine">
									{{ $t("lineType.dottedLine") }}
									<!--Dotted Line-->
								</option>
								<!--index : yebda 0 -->
								<!--                <option value="arrowLine" id="arrowLine">{{$t('lineType.arrowLine')}} &lt;!&ndash;Arrow Line&ndash;&gt;</option> &lt;!&ndash;index : yebda 0 &ndash;&gt;-->
								<!--              <option v-for="(index, i) in overlays.length" v-bind:key="index" :value="'id-overlay'+i">{{"overlay"+i}}</option>-->
							</select>
						</div>
					</v-card>
					<v-card
						class="pa-2"
						v-bind:class="{ img2: !lineDraw }"
						height="40px"
					>
						<div>
							<p>{{ lastAngle }}</p>
						</div>
					</v-card>
					<input
						v-bind:class="{ img2: !imageUpload }"
						id="uploader"
						multiple
						type="file"
						@change="addImage(canvas)"
					/>
				</v-card>
				<v-spacer></v-spacer>
			</v-app-bar>
		</div>
		<v-divider horizontal></v-divider>
		<v-row>
			<v-col sm="1" style="max-width: 6.6%" class="sidebarStyle">
				<v-btn-toggle
					v-model="toggle_one"
					mandatory
					tile
					color="deep-purple accent-3"
					group
				>
						<img
							src="/arrow.png"
							id="my-image"
							width="500px"
							height="500px"
						/>
					<v-col justify="space-around">
						<!--        <v-btn-toggle tile color="deep-purple accent-3" group>-->
						<v-row
							class="spacingStyleSideBar"
							style="margin-top: -25px"
						>
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
										<v-icon dark> mdi-select-drag</v-icon>
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
											latestType = $t('tools.drawingMode')
										"
									>
										<!--drawing mode-->
										<v-icon dark> mdi-draw</v-icon>
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
										v-on:change="
											latestType = $t('addshapes.lines')
										"
									>
										<!--line-->
										<v-icon dark> mdi-slash-forward</v-icon>
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
										@click="drawArrow(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:change="
											latestType = $t('addshapes.arrow')
										"
									>
										<v-icon dark>
											mdi-trending-neutral</v-icon
										>
										<!--{{$t('addshapes.addArrowLines')}}-->
										<!--Add Arrow Lines-->
										<!--行を追加-->
									</v-btn>
								</template>
								<span>{{ $t("addshapes.arrow") }}</span>
							</v-tooltip>
						</v-row>

						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="createXShape(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:change="
											latestType = $t('addshapes.XShape')
										"
									>
										<!-- drawX(canvas)-->
										<v-icon dark> mdi-close</v-icon>
										<!--{{$t('addshapes.addXShape')}}-->
										<!--Add "X" shape-->
										<!-- 「X」字型を追加 -->
									</v-btn>
								</template>
								<span>{{ $t("addshapes.addXShape") }}</span>
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
											mdi-rectangle-outline</v-icon
										>
									</v-btn>
								</template>
								<span>{{ $t("addshapes.addRectangle") }}</span>
							</v-tooltip>
						</v-row>

						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="createCircle(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:change="
											latestType = $t('addshapes.circles')
										"
									>
										<v-icon dark>
											mdi-circle-outline</v-icon
										>
										<!--{{$t('addshapes.addCircles')}}-->
										<!--Add Circles-->
										<!--円を追加-->
									</v-btn>
								</template>
								<span>{{ $t("addshapes.addCircles") }}</span>
							</v-tooltip>
						</v-row>

						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="createText(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:change="
											latestType = $t('addshapes.text')
										"
									>
										<v-icon dark>
											mdi-format-textbox</v-icon
										>
										<!--{{$t('addshapes.addText')}}-->
										<!--Add Text-->
										<!--テキストを追加-->
									</v-btn>
								</template>
								<span>{{ $t("addshapes.addText") }}</span>
							</v-tooltip>
						</v-row>
						<v-row class="spacingStyleSideBar">
							<v-tooltip right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										@click="addImage(canvas)"
										v-bind="attrs"
										v-on="on"
										v-on:change="
											latestType = $t('addshapes.image')
										"
									>
										<v-icon dark> mdi-image</v-icon>
										<!--{{$t('addshapes.addText')}}-->
										<!--Add Text-->
										<!--テキストを追加-->
									</v-btn>
								</template>
								<span>{{ $t("addshapes.addText") }}</span>
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
										<v-icon dark> mdi-contrast</v-icon>
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
											mdi-delete-empty-outline</v-icon
										>
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
										<v-icon dark> mdi-content-copy</v-icon>
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
											mdi-arrow-u-left-top</v-icon
										>
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
											mdi-arrow-u-right-top</v-icon
										>
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

			<v-col sm="11" class="cardCanvasStyle data">
				<!--class="cardCanvasStyle"-->
				<v-card
					elevation="0"
					class="lg-auto"
					v-on:keydown.ctrl.86="pasteObject(canvas)"
				>
					<!-- max-width="730px" max-width="1100px"-->
					<v-col cols="2" class="py-2">
						<!--ml-n10-->
						<v-btn-toggle tile color="deep-purple accent-3" group>
							<!--              <v-btn x-large @click="switchView1(canvas)"> {{$t('oppositeView.frontView')}}</v-btn> &lt;!&ndash; ビュー1 View 1&ndash;&gt;-->
							<v-divider vertical></v-divider>
							<!--              <v-btn x-large @click="switchView2(canvas)"> {{$t('oppositeView.backView')}}</v-btn> &lt;!&ndash; ビュー2 View 2 &ndash;&gt;
                            <v-divider
                              vertical
                            ></v-divider>-->
							<v-btn
								x-large
								class="mx-2"
								color="primary"
								text
								@click="downloadImg1()"
							>
								<v-icon dark> mdi-download-outline</v-icon>
								{{ $t("functions.download") }}
							</v-btn>
							<v-btn
								color="primary"
								text
								@click="clearCanvas(canvas)"
							>
								<v-icon dark> mdi-close</v-icon>
								{{ $t("functions.clear") }}
								<!--redo-->
								<!--やり直し-->
							</v-btn>
							<!-- ビュー2 View 2 {{$t('oppositeView.backView')}} -->
							<v-divider vertical></v-divider>

							<!--              <v-btn x-large class="mx-2"
                     color="primary"
                     text @click="downloadJsonFile(json,expl)">
                <v-icon dark> mdi-download-outline</v-icon>
                 saveState
              </v-btn> &lt;!&ndash; ビュー2 View 2 {{$t('oppositeView.backView')}} &ndash;&gt;
              <v-divider
                  vertical
              ></v-divider>-->
						</v-btn-toggle>

						<!-- Paintable canvas -->
						<canvas
							ref="can"
							id="fabricCanvas"
							class="canvasLayout"
						></canvas>
						<!--style="transform: rotate(90deg)"-->
					</v-col>
					<!-- import image -->
					<img src="" id="imgConverted" />
					<!--          <input v-bind:class="{ img2: !imageUpload }" id="uploader" multiple type="file" @change="addImage(canvas)"/>-->
					<!--          <input multiple type="file" @change="onFileChange">
                    <button @click="imageBackground(canvas)" class="btn btn-outline-dark">Display background image</button>-->
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
						<!--            <v-btn x-large @click="downloadImg1(canvas)"> Download </v-btn> &lt;!&ndash; ビュー2 View 2 {{$t('oppositeView.backView')}} &ndash;&gt;-->
						<!--
                        <v-btn x-large @click="rotateImage90()"> Angle 90 </v-btn> &lt;!&ndash; ビュー2 View 2 {{$t('oppositeView.backView')}} &ndash;&gt;
                        <v-btn x-large @click="rotateImage0()"> Angle 0 </v-btn> &lt;!&ndash; ビュー2 View 2 {{$t('oppositeView.backView')}} &ndash;&gt;
            -->
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
<!--<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.4/jspdf.min.js"></script>-->
<script>
//import libraries
import { fabric } from "fabric";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "fabric-history";
//import Hotkeys from 'vue-hotkeys-rt';

export default {
	name: "PaintTool",
	created() {
		this.$root.$refs.PaintTool1 = this;
	},
	//components: {Hotkeys},
	props: {
		canvasWidth: Number,
		canvasHeight: Number,
		background_image_view1: String,
		background_image_view2: String,
		overlays: Array,
		overlays_back: Array,
		background_image_size: Array,
		saveViews: {},
		templateSize: Array,
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
			lineD0: false,
			textDraw: false,
			textColor: false,
			zoomMode: false,
			imageUpload: false,
			latestType: "", //Select Tool 選択ツール
			items: ["none", "overlay0", "overlay1", "overlay2"],
			selected: "",
			newScaledWidth: 0.0,
			newScaledHeight: 0.0,
			scaleRatio: 0.0,
			toggle_one: 0,
			view1Paint: { backgroundImage: {}, objects: [], version: "" },
			view2Paint: { backgroundImage: {}, objects: [], version: "" },
			cutting1Index: 0,
			cutting2Index: 0,
			lastAngle: 0,
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
			layerChecked: [],
			layerChecked1: [],
			currentView: 1,
			layerChecked2: [],
		};
	},
	computed: {
		databaseLocalHost() {
			return this.$store.state.databaseLocalHost;
		},
		toolSwitchFrontImg() {
			return this.$store.state.toolSwitchFrontImg;
		},
		toolSwitchBackImg() {
			return this.$store.state.toolSwitchBackImg;
		},
		paintSwitchObj() {
			return this.$store.state.paintSwitchObj;
		},
		saveJson() {
			return this.$store.state.saveJson;
		},
		templateImageSize() {
			return this.$store.state.templateImageSize;
		},
		flagSideUpload() {
			return this.$store.state.flagSideUpload;
		},
		template() {
			return this.$store.state.template;
		},
		uuid() {
			return this.$store.state.uuid;
		},
		layerPaintool(){
			return this.$store.state.layerPaintool;

		},
		arrowCoordinates() {
			return this.$store.state.arrowCoordinates;
		},
		arrowCoordinates2() {
			return this.$store.state.arrowCoordinates2;
		},
		orderImageFront() {
                return this.$store.state.orderImageFront;
            },
		orderImageBack() {
                return this.$store.state.orderImageBack;
            },
		chipFrontUrlAdj() {
                return this.$store.state.chipFrontUrlAdj;
            },
		chipBackUrlAdj() {
                return this.$store.state.chipBackUrlAdj;
            },
		jsonFront() {
                return this.$store.state.jsonFront;
            },
        jsonBack() {
                return this.$store.state.jsonBack;
            },
		chipInstructionUrls() {
                return this.$store.state.chipInstructionUrls;
            },
		newChipInstructionUrls(){
				return this.$store.state.newChipInstructionUrls;

		},
		chipFrontUrl() {
                return this.$store.state.chipFrontUrl;
            },
		chipBackUrl() {
                return this.$store.state.chipBackUrl;
            },
			
	},
	mounted() {
		console.log(this.layerPaintool);
		this.image1 = new Image();
		this.image2 = new Image();
		this.imageSwitch1 = new Image();
		this.imageSwitch2 = new Image();
		let imageSize = new Image();
		imageSize.src = this.background_image_view1;
		console.log("STEP1:  imageSize.src", imageSize.src);
		// var scaleH;
		// var scaleW;
		this.image = new Image();

		// scaleH = this.$originalHeight/ this.background_image_size[0]
		// scaleW = this.$originalWidth / this.background_image_size[1]
		// console.log("STEP3: scaleH, scaleW", scaleH, scaleW)

		// var canvasH = this.$originalHeight / scaleH
		// var canvasW = this.$originalWidth / scaleH

		let newScaledSizes = this.scaleCanvas(
			this.canvasWidth,
			this.canvasHeight,
			this.background_image_size[0],
			this.background_image_size[1]
		);
		console.log(
			"🚀 ~ file: PaintTool.vue ~ line 629 ~ mounted ~ newScaledSizes",
			newScaledSizes
		);
		console.log(
			this.background_image_size[0],
			this.background_image_size[1]
		);

		let canvasH = newScaledSizes.height;
		let canvasW = newScaledSizes.width;
		this.scaleRatio = newScaledSizes.ratio;
		this.newScaledWidth = canvasW;
		this.newScaledHeight = canvasH;

		const ref = this.$refs.can;
		const canvas = new fabric.Canvas(ref, {
			width: this.templateImageSize.filesize[0], //canvasW * 2, //canvasW //this.background_image_size[0], //this.background_image_size[0], //800
			height: this.templateImageSize.filesize[1], //canvasH, //this.background_image_size[1], //this.background_image_size[1], //350 500 this.background_image_size[1]
		});
		this.canvas = canvas;
		this.vueCanvas = canvas.getContext();
		//grfxconsole.log("angleCanvas", this.canvas.angle)
		//init switch views
		this.currentView = 1;
		// this.view1Paint = {};
		// this.view2Paint = {};

		//for clear
		this.view1Delete = {};
		this.view2Delete = {};

		this.view1 = document.querySelector(".one");
		this.view2 = document.querySelector(".two");

		//var imageAngle
		let t;
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
					console.log(img.width);
					this.originalWidth = img.width;
					this.originalHeight = img.height;
					img.scaleToHeight(this.templateImageSize.filesize[1]); //background_image_height = 500
					img.scaleToWidth(this.templateImageSize.filesize[0]); //background_image_height = 500
					console.log("angle", img.angle);
					//img.scaleToWidth(this.background_image_size[1]); //background_image_width = 500
					this.canvas.backgroundImage = img;
					this.rotateThisImage = img;
					this.canvas.renderAll();
					if (
						this.templateImageSize[1] > 4000 ||
						this.templateImageSize.filesize[0] > 4000
					) {
						t = document.querySelector(
							"#app > div.row > div.cardCanvasStyle.data.col-sm-11.col > div > div.py-2.col.col-2 > div.canvas-container"
						);
						t.style.transform = "scale(0.2)";
					} else if (
						this.templateImageSize.filesize[0] > 3000 ||
						this.templateImageSize.filesize[1] > 3000
					) {
						t = document.querySelector(
							"#app > div.row > div.cardCanvasStyle.data.col-sm-11.col > div > div.py-2.col.col-2 > div.canvas-container"
						);
						t.style.transform = "scale(0.2)";
					} else if (
						this.templateImageSize.filesize[0] > 2000 ||
						this.templateImageSize.filesize[1] > 2000
					) {
						t = document.querySelector(
							"#app > div.row > div.cardCanvasStyle.data.col-sm-11.col > div > div.py-2.col.col-2 > div.canvas-container"
						);
						t.style.transform = "scale(0.5)";
					} else if (
						this.templateImageSize.filesize[0] > 1000 ||
						this.templateImageSize.filesize[1] > 1000
					) {
						t = document.querySelector(
							"#app > div.row > div.cardCanvasStyle.data.col-sm-11.col > div > div.py-2.col.col-2 > div.canvas-container"
						);
					}
					t.style.width = "100%";
					t.style.height = "100%";
					//imageAngle = img
				},
				{ crossOrigin: "anonymous" }
			);
			this.$store.dispatch("changeLoading", false);
		}, 2000);

		//console.log("background angle", imageAngle.angle)
		//here set up the objects list for switching
		this.checkIfloaded(canvas);

		///handling size image background
		console.log(
			"🚀 ~ file: PaintTool.vue ~ line 1030 ~ mounted ~ this.background_image_size[0]",
			this.background_image_size[0]
		);
		console.log(
			"🚀 ~ file: PaintTool.vue ~ line 1030 ~ mounted ~ this.background_image_size[0]",
			this.background_image_size[1]
		);
		console.log(
			"🚀 ~ file: PaintTool.vue ~ line 1032 ~ mounted ~ this.originalWidth",
			this.originalWidth
		);

		console.log(this.canvas.getObjects());
		//this.originalHeight = 0;
		//this.originalWidth = 0;
		this.range = document.getElementById("range");
		this.rangevalue = this.range.value / this.range.max;

		this.range1 = document.getElementById("range1");
		this.rangevalue1 = this.range1.value / this.range1.max;

		this.rangeColor = document.getElementById("rangeColor");
		this.rangevalueColor = this.rangeColor.value / this.rangeColor.max;

		/*this.rangeView = document.getElementById("rangeViewOpacity");
    this.rangevalueView = this.rangeView.value / this.rangeView.max;*/

		//this.Vselect = document.getElementById("v-selectValue");
		//console.log(this.Vselect.value)

		const select = document.getElementById("overlays-id");
		const select_back = document.getElementById("overlays-back-id");
		if (this.currentView === 1) {
			select.value = "none";
			select_back.value = "none";
		} else if (this.currentView === 2) {
			select.value = "none";
			select_back.value = "none";
		}

		this.lastelement = ""; //"none"
		this.index;
		this.tab = {};
		this.last = {};
		this.last["view2"] = "none";
		this.clipboard;

		this.view1PaintUndoRedo = [];
		this.isRedoing = false;
		this.view2PaintUndoRedo = [];

		this.json = {};
		canvas.isDrawingMode = false;
		console.log("I am right before escape");
		this.escapeListener();
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
		this.image2.src = canvas.toDataURL({
			format: "image/png",
			//multiplier: 1/this.scaleRatio,
			left: this.newScaledWidth,
		}); //, multiplier: 1/this.scaleRatio
		this.image1.src = canvas.toDataURL({
			format: "image/png",
			//multiplier: 1/this.scaleRatio,
			left: -this.newScaledWidth,
		});
		console.log("saveJson", this.saveJson);
		this.zoom(canvas)
	},
	methods: {
	async showAllArrows() {
		
				for (let i = 0; i < this.arrowCoordinates.length; ++i) {
					await this.showArrows(this.arrowCoordinates[i],"front");
					console.log(
						"🚀 ~ file: lineEditor.vue ~ line 991 ~ showAllArrows ~ this.arrowCoordinates[i]",
						this.arrowCoordinates[i]
					);
				}
				for (let i = 0; i < this.arrowCoordinates2.length; ++i) {
					await this.showArrows(this.arrowCoordinates2[i],"back");
					console.log(
						"🚀 ~ file: lineEditor.vue ~ line 991 ~ showAllArrows ~ this.arrowCoordinates[i]",
						this.arrowCoordinates2[i]
					);
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
		async showArrows(obj,face) {
			console.log(
				"🚀 ~ file: lineEditor.vue ~ line 995 ~ showArrows ~ obj",
				obj.top,
				obj.left
			);

			var imgElement = document.getElementById("my-image");
            console.log("🚀 ~ file: PaintTool.vue ~ line 1256 ~ showArrows ~ imgElement", imgElement)
			let lefttemp=(face==="front"?this.templateImageSize.frontImgOffsetX:this.templateImageSize.backImgOffsetX )
			let toptemp=(face==="front"?this.templateImageSize.frontImgOffsetY:this.templateImageSize.backImgOffsetY )
			var head = new fabric.Image(imgElement, {
				id: "arrow",
				width: 400,
				height: 30,
				left: obj.left+ lefttemp,
				top:
					this.background_image_size[1]+toptemp - obj.top ,
				fill: "#ff0000",
				angle: obj.angle,
				selectable: false,
				id1: "arrow",
			});
			this.canvas.add(head);

			this.canvas.renderAll();
		},
	async handleLayer1() {
			//this.layerChecked1 = [];
			/*var arr = [];
			obj.map((i) => {
				arr.push(i.id);
				console.log(i);
			});*/
			/*if (this.layerChecked1.id.find((t) => t.id === 1)) {
				console.log("includes 1");
				//this.layerChecked1.push(this.layerList1[0])
				//	this.layerChecked1.push({ id: 1, text: "layer1" });

				await this.showAllArrows();
			} else {
				///this.layerChecked2.splice(this.layerChecked2.indexOf(this.layerList2[0]), 1);
				await this.deleteArrows();
			}
*/


		/*	if (this.layerChecked1.id.find((t) => t.id === 1)) {
				//this.layerChecked1.push({ id: 2, text: "layer2" });
				this.canvas.getObjects().forEach((o) => {
					if (o.id1 === "View1_Overview_front") {
						this.canvas.remove(o);
					}
				});
				fabric.Image.fromURL(
					this.layerPaintool.layer_1, ////url of image
					(img) => {
						img.set({
							left: 0,
							top: 0,
							id: "View1_Overview_front_layer1",
							id1: "View1_Overview_front_layer1",
							selectable: false,
						});
						this.canvas.add(img);
						this.canvas.moveTo(img, 0);
						this.canvas.renderAll();
					},
					{ crossOrigin: "anonymous" }
				);
			} else {
				this.canvas.getObjects().forEach((o) => {
					if (o.id1 === "View1_Overview_front_layer1") {
						this.canvas.remove(o);
					}
				});
			}*/
			if (this.layerChecked1.id.find((t) => t.id === 1)) {
				await this.showAllArrows();
			} else {
				await this.deleteArrows();
			}
			console.log(this.layerPaintool)
			if (this.layerChecked1.id.find((t) => t.id === 2)) {
				//this.layerChecked1.push({ id: 2, text: "layer2" });
				this.canvas.getObjects().forEach((o) => {
					if (o.id1 === "View1_Overview_front") {
						this.canvas.remove(o);
					}
				});
				fabric.Image.fromURL(
					this.layerPaintool.layer_2, ////url of image
					(img) => {
						img.set({
							left: 0,
							top: 0,
							id: "View1_Overview_front",
							id1: "View1_Overview_front",
							selectable: false,
							fill:'transparent'
						});
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
					this.layerPaintool.layer_3, ////url of image
					(img) => {
						img.set({
							left: 0,
							top: 0,
							id: "View3_Overview_front",
							id1: "View3_Overview_front",

							selectable: false,
						});
						//img.scaleToHeight(this.newScaledHeight);
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
		checkIfloaded(canvas) {
			console.log("I am in check loaded");
			console.log(this.paintSwitchObj);
			if (Object.keys(this.paintSwitchObj).length > 0) {
				canvas.loadFromJSON(
					this.paintSwitchObj,
					canvas.renderAll.bind(canvas)
				);
				console.log("hello");
			}
		},
		async saveState(index) {
			await console.log(this.saveJson);
			this.$store.dispatch("changeLoading", true);
			let viewObj = await this.canvas.toObject([
				"id",
				"type",
				"selectable",
				"opacity",
			]);
			this.$store.dispatch("changePaintSwitchObj", viewObj);
			let newSave = await this.saveJson;
			let dataExport={}
			console.log("newSave", newSave);
			newSave["paintSwitchObj"] = viewObj;
			this.$store.dispatch("changeSaveJson", newSave);
			let view1;
			let view2;
			switch (index) {
				case 0:
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


					this.$store.dispatch("changeSaveJson", newSave);
					console.log(newSave);
					//this.saveTemplate(newSave, "FRONT_END", "json");
					this.downloadJsonFile(newSave);
					this.$store.dispatch("changeLoading", false);
					break;
				case 1:
					// Export spreed sheet from the back side
					this.saveTemplate(
						"/saveStep6",
						newSave,
						"s6",
						"zip",
						"backend_spreadsheet"
					);
					this.$store.dispatch("changeLoading", false);
					break;
				case 2:
					// export JSON  from the  back side
					this.saveTemplate(
						"/saveStep7",
						newSave,
						"s7",
						"json",
						"backend_json"
					);
					this.$store.dispatch("changeLoading", false);
					break;
				case 5:
					// export JSON  from the  back side
										newSave = this.saveJson;
					newSave["uuid"] = this.uuid;
					newSave["cuttingLineEditor1SwitchObj"] = view1;
					newSave["cuttingLineEditor2SwitchObj"] = view2;
					newSave["jsonFront"] = this.json1;
					newSave["jsonBack"] = this.json2;
					
					dataExport["paintoolPath"]=this.background_image_view1
					
					//dataExport["cuttingLineEditorFront"]=this.orderImageFront
					//dataExport["cuttingLineEditorBack"]=this.orderImageBack
					dataExport["cuttingLineFront"]=this.chipFrontUrl
					dataExport["cuttingLineBack"]=this.flagSideUpload.back===true?this.chipBackUrl:""
					//dataExport["jsonFront_cuttingLineEditor"]=this.jsonFront
					//dataExport["jsonBack_cuttingLineEditor"]=this.jsonBack
					//dataExport["chipInstructionUrls"]=this.chipInstructionUrls
					dataExport["numberInstruction"]=this.newChipInstructionUrls.length
					dataExport["newChipInstructionUrls"]=this.newChipInstructionUrls

					this.saveTemplateWithoutDownload(this.saveJson)
					
					console.log(dataExport);
					this.saveTemplate(
						"/sendProjectZip",
						dataExport,"s7","zip"
					);
					this.$store.dispatch("changeLoading", false);
					break;
				default:
					break;
			}
		},

		async saveTemplate(url, json, mode, type, name) {
            console.log("🚀 ~ file: PaintTool.vue ~ line 1630 ~ saveTemplate ~ json", json)
			await this.axios
				.post(
					this.databaseLocalHost + url,
					{ json: json, step: mode,file:{type:type} },
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
					link.setAttribute("download", name + "." + type);
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
					{ json: json, step: "s7" },
					{ responseType: "blob" }
				)
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

		switchCanvasMode() {
			this.$store.dispatch("changeLoading", true);

			// let image_data = this.canvas.toDataURL({format: "image/png", multiplier: 1/this.scaleRatio});
			// let imageSourceFront = this.imageSwitch1.src;
			// let imageSourceBack = this.imageSwitch2.src;
			// let chipFront = '';
			// let chipBack = '';

			let newPaint1 = this.view1Paint;
			let newPaint2 = this.view2Paint;

			console.log(newPaint1);
			console.log(newPaint2);
			console.log(this.view1Paint);
			console.log(this.view2Paint);

			if (this.currentView === 1) {
				newPaint1 = this.canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
				]);
			} else {
				newPaint2 = this.canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
				]);
			}

			if (typeof newPaint1[this.cutting1Index] !== "undefined") {
				newPaint1.objects = newPaint1.objects.slice(this.cutting1Index);
			}
			if (typeof newPaint2[this.cutting2Index] !== "undefined") {
				newPaint2.objects = newPaint2.objects.slice(this.cutting2Index);
			}

			this.$store.dispatch("changePaint1SwitchObj", newPaint1);
			this.$store.dispatch("changePaint2SwitchObj", newPaint2);

			// chipFront = imageSourceFront !== '' ? await this.uploadImageToFileSystem(imageSourceFront, "chip_front_switch.png") : this.toolSwitchFrontImg;
			// chipBack = imageSourceBack !== '' ? await this.uploadImageToFileSystem(imageSourceBack, "chip_back_switch.png") : this.toolSwitchBackImg;

			// let newFrontPath = this.databaseLocalHost + "/" + chipFront.short_path;
			// let newBackPath = this.databaseLocalHost + "/" + chipBack.short_path;

			// this.$store.dispatch('changeToolSwitchFrontImg', newFrontPath);
			// this.$store.dispatch('changeToolSwitchBackImg', newBackPath);

			// console.log(chipFront);
			// console.log(chipBack);
			// console.log(newFrontPath);
			// console.log(newBackPath);
			this.$store.dispatch("changeLoading", false);

			this.$router.push("chip_cutting");
		},

		vSelectMethod(event, selected) {
			console.log("v-selected", selected);
			//console.log("v-select:", event.target.value)
		},
		/*async downloadJsonFile(json) {
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "expl" + ".json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      //link.click();
    },*/
		async downloadJsonFile(json) {
			const data = JSON.stringify(json);
			//const blob = new Blob([data], {type: 'text/plain'})
			//const e = document.createEvent('MouseEvents')
			const link = document.createElement("a");
			//link.download = "fromPaintTool.json"
			//link.download = await window.showSaveFilePicker({suggestedName: "wafaTest.txt"})
			const opts = {
				types: [
					{
						description: "Text file",
						accept: { "text/plain": [".txt"] },
					},
				],
				excludeAcceptAllOption: true,
				multiple: false,
			};
			const saveFile = await window.showSaveFilePicker(opts);
			const file = await saveFile.getFile();
			link.download = await file.name;
			const writer = await saveFile.createWritable();
			await writer.write(data);
			await writer.close();
			//link.href = window.URL.createObjectURL(blob)
			link.dataset.downloadurl = [
				"text/json",
				link.download,
				link.href,
			].join(":");

			//e.initEvent('click', true, true);
			//link.dispatchEvent(e);
			link.remove();
			//link.click();
		},

		async downloadImg1(image) {
			//const options = {};
			image = document.getElementsByClassName("lower-canvas")[0];
			const e = document.createEvent("MouseEvents");
			const opts = {
				types: [
					{
						description: "Images",
						accept: {
							"image/*": [".png", ".jpeg", ".jpg"],
						},
					},
				],
				excludeAcceptAllOption: true,
				multiple: false,
			};
			console.log(image);
			const printCanvas = await html2canvas(image, opts);
			const link = document.createElement("a");
			//link.setAttribute("download", "download.png");
			link.setAttribute(
				"href",
				printCanvas
					.toDataURL("image/*")
					.replace("image/*", "image/octet-stream")
			);
			const image_data = printCanvas.toDataURL({
				format: "image/*",
				multiplier: 1 / this.scaleRatio,
			});
			var pdf = new jsPDF({
				orientation: "landscape",
				unit: "px",
				format: [printCanvas.width, printCanvas.height],
			});
			console.log("this.scaleRatio", this.scaleRatio);
			pdf.addImage(
				image_data,
				"PNG",
				0,
				0,
				printCanvas.width,
				printCanvas.height
			);
			//const savePdf = pdf.addImage(image_data, 'PNG', 0, 0,printCanvas.width, printCanvas.height);

			//const blob = new Blob([image], {type: 'Images'})
			const saveFile = await window.showSaveFilePicker(opts);
			//const file = await saveFile.getFile();
			link.download = await saveFile.name;
			pdf.save("canvas.pdf");

			const writer = await saveFile.createWritable();
			//await writer.write(pdf)
			await writer.write(image_data);
			await writer.close();
			//link.href = window.URL.createObjectURL(blob)
			//link.dataset.downloadurl = ['Images', link.download, link.href].join(':');
			e.initEvent("click", true, true);
			console.log(image_data);
			console.log(writer);
			this.$store.dispatch("changeChipFrontNewImageData", image_data);
			link.click();
			//canvas.renderAll();
		},

		/*chooseOrientation(){
      var image = document.getElementsByClassName("lower-canvas")[0];

      var curAngle = image
      console.log(curAngle.angle)
      curAngle.style.transform = "rotate(90deg)";
    },

    rotateImage90(){
      var image = document.getElementsByClassName("lower-canvas")[0];

      var curAngle = image
      console.log(curAngle.style.transform)
      curAngle.style.transform = "rotate(90deg)";
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

		async downloadImg() {
			const options = {}; //{crossOrigin:"Anonymous"};
			var image = document.getElementsByClassName("lower-canvas")[0];
			const printCanvas = await html2canvas(image, options);

			let image_data = printCanvas.toDataURL({
				format: "image/png",
				multiplier: 1 / this.scaleRatio,
			});
			console.log(image_data);
			if (this.currentView === 1) {
				this.$store.dispatch("changeChipFrontNewImageData", image_data);
			} else {
				this.$store.dispatch("changeChipBackNewImageData", image_data);
			}
			console.log(printCanvas);
		},
		//method to Switch from "view 1" to "view 2"
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
			const select_back = document.getElementById("overlays-back-id");

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
				switch (this.last["view1"]) {
					case "id-overlay_back" + i:
						select_back.value = "id-overlay_back" + i;
						break;
					case "none":
						select_back.value = "none";
					/*default:
              select.value = "none";
              break;*/
				}
				console.log(select_back.value);
			}
			/*switch (this.last["view1"]) {
        case "id-overlay1":
          select.value = "id-overlay1";
          break;
        case "id-overlay2":
          select.value = "id-overlay2";
          break;
        case "id-overlay3":
          select.value = "id-overlay3";
          break;
        default:
          select.value = "none";
      }*/
			if (this.currentView === 2) {
				//select.value = "none"
				//select.value = this.lastelement; //to refresh the overlay dropdown
				if (this.last["view1"] != undefined) {
					this.lastelement = this.last["view1"];
				} /*else if(this.last["view2"] === undefined) {
          select.value = 'none';
          this.last["view2"] = 'none';
        }*/
				console.log(this.lastelement);
				this.view2Paint = canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
				]);
				this.image2.src = canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				this.imageSwitch2.src = canvas.toDataURL("image/png");
				canvas.clear();
				canvas.loadFromJSON(
					this.view1Paint,
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
			console.log("view2 save : ", this.view2Paint);
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
				switch (this.last["view2"]) {
					case "id-overlay_back" + i:
						select.value = "id-overlay_back" + i;
						break;
					case "none":
						select.value = "none";
					/*default:
              select.value = "none";
              break;*/
				}
			}
			/*switch (this.last["view2"]) {
        case "id-overlay1":
          select.value = "id-overlay1";
          break;
        case "id-overlay2":
          select.value = "id-overlay2";
          break;
        case "id-overlay3":
          select.value = "id-overlay3";
          break;
        default:
          select.value = "none";
      }*/
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
					/*canvas.height = img.height
            canvas.width = img.width*/
					this.canvas.backgroundImage = img;
					this.canvas.renderAll();
					/*console.log("height", img.height, "width", img.width)
            console.log("this.canvas.height", this.canvas.height)
            console.log("this.canvas.width", this.canvas.width)*/
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
				this.view1Paint = canvas.toObject([
					"cacheKey",
					"selectable",
					"opacity",
				]);
				this.image1.src = canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				this.imageSwitch1.src = canvas.toDataURL("image/png");
				canvas.clear();
				canvas.loadFromJSON(
					this.view2Paint,
					canvas.renderAll.bind(canvas)
				);
				select.value = this.lastelement; //to refresh the overlay dropdown
				this.currentView = 2;
				/*this.view1.disabled = false;
        this.view2.disabled = true;*/
			}
			console.log(this.currentView);
			console.log("view 1 save : ", this.view2Paint);
			this.nbr++;
			console.log("this.nbr", this.nbr);
		},

		handler(event, canvas) {
			console.log("handler", event.target.value);
			if (
				event.target.value == "none" ||
				event.target.value == "id-overlay0" ||
				event.target.value == "id-overlay1" ||
				event.target.value == "id-overlay2" ||
				event.target.value === "views2-id"
			) {
				console.log(canvas._objects);
				canvas.getObjects().forEach((o) => {
					if (o.cacheKey === "views1-id") {
						console.log("o.id", o.id);
						canvas.remove(o);
					} else if (o.cacheKey === "views2-id") {
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
				/*
				var rateWidth = (this.newScaledWidth * 2) / this.originalWidth;
				var offsetWidth = rateWidth * this.templateImageSize.frontImgOffsetX;
				var scaleWidth = this.newScaledWidth - offsetWidth * 2;

				var rateHeight = this.newScaledHeight / this.originalHeight;
				var offsetHeight = rateHeight * this.templateImageSize.frontImgOffsetY;
				var scaleHeight = (this.newScaledHeight - offsetHeight * 2) / 2;*/

				this.image1.src = canvas.toDataURL({
					format: "image/png",
					left: this.newScaledWidth,
					//multiplier: 1/this.scaleRatio,
					//left: -this.newScaledWidth+offsetHeight*2
					//left: this.newScaledWidth-offsetHeight*2
				});

				this.image2.src = canvas.toDataURL({
					format: "image/png",
					left: -this.newScaledWidth,
					//multiplier: 1/this.scaleRatio,
					//left: this.newScaledWidth-offsetHeight*2
					//left: -this.newScaledWidth+offsetHeight*2
				});

				if (this.tab[event.target.value] == undefined) {
					var overlayInstance = new fabric.Image(
						overlayElement,
						{
							cacheKey: event.target.value,
							index: 1,
							selectable: false,
							id: "overlaySelection",
							left: this.templateImageSize.frontImgOffsetX,
							top: this.templateImageSize.frontImgOffsetY,
						},
						{ crossOrigin: "anonymous" }
					);
					//overlayInstance.scaleToHeight(this.newScaledHeight);
					// let realHeight=(this.newScaledHeight)-offsetHeight*1.5

					overlayInstance.scaleToHeight(
						this.background_image_size[1]
					);

					console.log("this.newScaledWidth", this.newScaledWidth);
					console.log("width", overlayInstance.width);
					console.log("height", overlayInstance.height);
					console.log(this.background_image_size[0]);
					console.log(
						this.templateImageSize.filesize[0] -
							this.templateImageSize.frontImgOffsetX * 2
					);
					overlayInstance.scaleToWidth(this.background_image_size[0]);
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
				this.range.addEventListener("change", () => {
					overlayInstance.set({
						opacity: this.range.value / this.range.max,
					});
					console.log(overlayInstance.opacity);
					canvas.renderAll();
				});
				//});
			} else if (event.target.value === "views1-id") {
				//view
				for (i = 0; i < canvas._objects.length; i++) {
					if (canvas._objects[i].cacheKey == this.lastelement) {
						index = i;
						if (index != null) {
							canvas.remove(canvas._objects[index]);
						}
					}
				}

				console.log("views", event.target.value);
				//if (this.currentView === 1) {
				console.log("multiplier", 1 / this.scaleRatio);
				this.image1.src = canvas.toDataURL({
					format: "image/png",
					//multiplier: 1/this.scaleRatio,
					//left: 1100  //857
					left: 0,
					//left: this.newScaledWidth-offsetHeight*2
				});
				this.image2.src = canvas.toDataURL({
					format: "image/png",
					//multiplier: 1/this.scaleRatio,
					//left: -1100  // -857
					left: -this.newScaledWidth,
					//left: -this.newScaledWidth+offsetHeight*2
				});
				//, multiplier: 1/this.scaleRatio
				//this.image2.src = canvas.toDataURL({format: "image/png",multiplier: 1.001}); //, multiplier: 1/this.scaleRatio
				//console.log(this.image1.src)
				/*if(event.target.value === 'views2-id') {
          var viewInstance2 = new fabric.Image(this.image2, {
              /!*cacheKey: event.target.value,
              index: 1,*!/
              selectable: false,
              opacity: 0.5,
              id: 'View2_Overview'
            },
            {crossOrigin: "anonymous"});
          canvas.add(viewInstance2)
          canvas.moveTo(viewInstance2, 0);
          viewInstance2.set({opacity: this.rangevalue});
          //overlayInstance.on("selected", () => {
          this.range.addEventListener("change", () => { //this.rangeView.addEventListener("change", () => {
            viewInstance2.set({opacity: this.range.value / this.range.max});
            //console.log(viewInstance1.opacity);
            canvas.renderAll();
          });
        }*/
				//} else if (this.currentView === 2) {
				//this.imageView2 = document.getElementsByClassName("lower-canvas")[0];
				//var imageView2 = document.getElementsByClassName("lower-canvas")[0];
				let templateKey1 = ["A", "E", "F"];
				let templateKey2 = ["B", "G", "H"];
				let templateKey3 = ["J"];
				let flipX = false;
				let flipY = false;
				if (templateKey1.includes(this.template)) {
					flipX = true;
				} else if (templateKey2.includes(this.template)) {
					flipY = true;
				} else if (templateKey3.includes(this.template)) {
					flipX = true;
					flipY = true;
				}
				console.log(
					"🚀 ~ file: PaintTool.vue ~ line 1952 ~ //overlayInstance.on ~ flipX",
					flipX
				);
				console.log(
					"🚀 ~ file: PaintTool.vue ~ line 1953 ~ //overlayInstance.on ~ flipY",
					flipY
				);

				if (event.target.value === "views1-id") {
					var viewInstance1 = new fabric.Image(
						this.image1,
						{
							cacheKey: event.target.value,
							index: 1,
							selectable: false,
							/*opacity: 0.5,*/
							id: "View1_Overview",
							flipX: true,
							flipY: false,
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
						} else if (o.id === "View2_Overview") {
							canvas.remove(o);
						}
					});
				}
				//}

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
		handler1(event, canvas) {
			console.log("handler1", event.target.value);
			if (
				event.target.value == "none" ||
				event.target.value == "id-overlay_back0" ||
				event.target.value == "id-overlay_back1" ||
				event.target.value == "id-overlay_back2" ||
				event.target.value === "views1-id"
			) {
				console.log(canvas._objects);
				canvas.getObjects().forEach((o) => {
					if (o.cacheKey === "views1-id") {
						//cacheKey: "views1-id" id: "overlaySelection"
						console.log("o.id", o.id);
						canvas.remove(o);
					} else if (o.cacheKey === "views2-id") {
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

				//var rateWidth = (this.newScaledWidth * 2) / this.originalWidth;
				//var offsetWidth = rateWidth * 100;
				//var scaleWidth = this.newScaledWidth - offsetWidth * 2;
				//var rateHeight = this.newScaledHeight / this.originalHeight;
				//var offsetHeight = rateHeight * 100;
				//var scaleHeight = (this.newScaledHeight - offsetHeight * 2) / 2;
				this.image1.src = canvas.toDataURL({
					format: "image/png",
					//multiplier: 1/this.scaleRatio,
					//left: 1100
					left: this.templateImageSize.frontImgOffsetX,
				});

				this.image2.src = canvas.toDataURL({
					format: "image/png",
					//multiplier: 1/this.scaleRatio,
					//left: -1100
					left: -this.templateImageSize.backImgOffsetX,
				});
				console.log(this.templateImageSize);
				if (this.tab[event.target.value] == undefined) {
					var overlayInstance = new fabric.Image(
						overlayElement,
						{
							cacheKey: event.target.value,
							index: 1,
							selectable: false,
							id: "overlaySelection",
							left: this.templateImageSize.backImgOffsetX,
							top: this.templateImageSize.backImgOffsetY,
						},
						{ crossOrigin: "anonymous" }
					);

					overlayInstance.scaleToHeight(
						this.background_image_size[1]
					);
					overlayInstance.scaleToWidth(this.background_image_size[0]);

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
				overlayInstance.set({ opacity: this.rangevalue1 });
				//overlayInstance.on("selected", () => {
				this.range1.addEventListener("change", () => {
					overlayInstance.set({
						opacity: this.range1.value / this.range1.max,
					});
					console.log(overlayInstance.opacity);
					canvas.renderAll();
				});
				//});
			} else if (event.target.value === "views2-id") {
				//view
				for (i = 0; i < canvas._objects.length; i++) {
					if (canvas._objects[i].cacheKey == this.lastelement) {
						index = i;
						if (index != null) {
							canvas.remove(canvas._objects[index]);
						}
					}
				}
				console.log("views", event.target.value);
				//if (this.currentView === 1) {
				this.image2.src = canvas.toDataURL({
					format: "image/png",
					//multiplier: 1/this.scaleRatio,
					//left: -1100
					left: -this.newScaledWidth,
				}); //, multiplier: 1/this.scaleRatio
				this.image1.src = canvas.toDataURL({
					format: "image/png",
					//multiplier: 1/this.scaleRatio,
					//left: 1100
					left: this.newScaledWidth,
				}); //, multiplier: 1/this.scaleRatio
				if (event.target.value === "views2-id") {
					var viewInstance2 = new fabric.Image(
						this.image2,
						{
							cacheKey: event.target.value,
							index: 1,
							selectable: false,
							/*opacity: 0.5,*/
							id: "View2_Overview",
						},
						{ crossOrigin: "anonymous" }
					);
					canvas.add(viewInstance2);
					canvas.moveTo(viewInstance2, 0);
					viewInstance2.set({ opacity: this.rangevalue1 });
					//overlayInstance.on("selected", () => {
					this.range1.addEventListener("change", () => {
						//this.rangeView.addEventListener("change", () => {
						viewInstance2.set({
							opacity: this.range1.value / this.range1.max,
						});
						console.log(
							"viewInstance1.opacity",
							viewInstance2.opacity
						);
						canvas.renderAll();
					});
				}
				//} else if (this.currentView === 2) {
				//this.imageView2 = document.getElementsByClassName("lower-canvas")[0];
				//var imageView2 = document.getElementsByClassName("lower-canvas")[0];
				//this.image2.src = canvas.toDataURL({format: "image/png", multiplier: 1.1}); //, multiplier: 1/this.scaleRatio
				/*if(event.target.value === 'views1-id') {
          var viewInstance1 = new fabric.Image(this.image1, {
                /!*cacheKey: event.target.value,
                index: 1,*!/
                selectable: false,
                opacity: 0.5,
                id: 'View1_Overview'
              },
              {crossOrigin: "anonymous"});
          canvas.add(viewInstance1)
          canvas.moveTo(viewInstance1, 0);
          viewInstance1.set({opacity: this.rangevalue});
          //overlayInstance.on("selected", () => {
          this.range.addEventListener("change", () => {
            viewInstance1.set({opacity: this.range.value / this.range.max});
            //console.log(viewInstance1.opacity);
            canvas.renderAll();
          });*/
			} else if (event.target.value === "none") {
				canvas.getObjects().forEach((o) => {
					if (o.id === "View1_Overview") {
						canvas.remove(o);
					} else if (o.id === "View2_Overview") {
						canvas.remove(o);
					}
				});
			}
			//}

			canvas.renderAll();
			//}
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
				const imgInstance = new fabric.Image(
					imgElement,
					{
						selectable: false,
						index: -1,
					},
					{ crossOrigin: "anonymous" }
				);
				imgInstance.scaleToHeight(this.newScaledHeight);
				imgInstance.scaleToWidth(this.newScaledWidth);
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

		addImage(canvas) {
			this.imageUpload = true;
			this.shapeDraw = false;
			this.zoomMode = false;
			this.lineDraw = false;
			this.textColor = false;
			this.textDraw = false;
			this.drawingMode(canvas);
			document.getElementById("uploader").onchange = function (e) {
				var reader = new FileReader();
				reader.readAsDataURL(e.target.files[0]);
				reader.onload = function (e) {
					var image = new Image();
					image.src = e.target.result;
					image.onload = function () {
						var img = new fabric.Image(image);
						img.set({
							id: "IdImage",
							left: 100,
							top: 60,
						});
						//img.scaleToWidth(200);
						console.log(img);
						var imgWidth = img.width;
						var imgHeight = img.height;
						console.log(
							"imgWidth",
							imgWidth,
							"imgHeight",
							imgHeight
						);
						if (img.width > 3000) {
							//|| (img.height > 3000)
							console.log("image must be scaled");
							img.scaleToWidth(3000);
							//img.set({height: imgHeight})
							//console.log("new scaling width", img.width, "new scaling height", img.height)
						} else if (img.height > 3000) {
							img.scaleToHeight(3000);
						} else if (img.height > 3000 && img.width > 3000) {
							img.scaleToWidth(3000);
							img.scaleToHeight(3000);
							//console.log("new scaling width", img.width, "new scaling height", img.height)
						}
						canvas.add(img).setActiveObject(img);
						canvas.renderAll();
					};
				};
				canvas.renderAll();
			};
		},

		//Drawing circle function
		createCircle(canvas) {
			var isDrawing;
			var circle;
			var origX;
			this.imageUpload = false;
			this.shapeDraw = true;
			this.zoomMode = false;
			this.lineDraw = true;
			this.textColor = false;
			this.textDraw = false;
			//var origY;
			var colorId = document.getElementById("stroke-color");
			let lineId = document.getElementById("line-type");
			//this.removeCanvasEvents(canvas);
			this.drawingMode(canvas);
			canvas.selection = false;
			canvas.on("mouse:down", (o) => {
				var evt = o.e;
				if (evt.ctrlKey === true) {
					//this.isDragging = true;
					circle.set({
						selectable: false,
						strokeWidth: 5,
					});
					isDrawing = false;
				} else {
					isDrawing = true;
					var pointer = canvas.getPointer(o.e);
					origX = pointer.x;
					//origY = pointer.y;
					//var points = [pointer.x, pointer.y, pointer.x, pointer.y];
					circle = new fabric.Circle({
						id: "added-circle",
						left: pointer.x,
						top: pointer.y,
						radius: 1,
						strokeWidth: 5,
						stroke: colorId.value,
						fill: "transparent",
						selectable: false, //true
						originX: "center",
						originY: "center",
					});
					canvas.add(circle);
					if (lineId.value === "straightLine") {
						console.log(lineId.value);
						circle.set({ stroke: colorId.value });
					} else if (lineId.value === "dashedLine") {
						circle.set({ strokeDashArray: [20, 5] });
					} else if (lineId.value === "dottedLine") {
						console.log(lineId.value);
						circle.set({ strokeDashArray: [5, 7] });
					}
					//canvas.setActiveObject(circle);
					this.lineType(canvas);
				}
			});

			canvas.on("mouse:move", function (o) {
				if (isDrawing) {
					var pointer = canvas.getPointer(o.e);
					circle.set({ radius: Math.abs(origX - pointer.x) });
					canvas.renderAll();
				}
			});

			canvas.on("mouse:up", function () {
				//circle.setCoords();
				isDrawing = false;
				//canvas.setActiveObject(circle);
			});
			//canvas.selection = false
			canvas.hoverCursor = "auto";
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
			this.textColor = false;
			this.textDraw = false;
			var colorId = document.getElementById("stroke-color");
			let lineId = document.getElementById("line-type");
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
					//var points = [pointer.x, pointer.y, pointer.x, pointer.y];
					x = pointer.x;
					y = pointer.y;
					console.log("pointer.x", pointer.x, "pointer.y", pointer.y);
					rect = new fabric.Rect({
						id: "added-rect",
						width: 1,
						height: 1,
						fill: "transparent",
						strokeWidth: 5,
						stroke: colorId.value,
						selectable: false, //true
						hasRotatingPoint: true,
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
					console.log("colorId.value", colorId.value);
					console.log("left x", rect.left, "top y", rect.top);
					canvas.add(rect);
					//canvas.setActiveObject(rect);
					if (lineId.value === "straightLine") {
						console.log(lineId.value);
						rect.set({ stroke: colorId.value });
					} else if (lineId.value === "dashedLine") {
						rect.set({ strokeDashArray: [20, 5] });
					} else if (lineId.value === "dottedLine") {
						console.log(lineId.value);
						rect.set({ strokeDashArray: [5, 7] });
					}
					console.log(rect);
					this.lineType(canvas);
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
					//var rect = canvas.getActiveObject();
					if (origX > pointer.x) {
						rect.set({ left: pointer.x, strokeWidth: 5 }); //rect.set
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
				//rect.setCoords();
				canvas.getObjects();
				isDrawing = false;
				//canvas.setActiveObject(rect);
				/*if (canvas.getActiveObject()) {
          canvas.getActiveObject().hasControls = false;
          canvas.getActiveObject().hasBorders = false;
          canvas.getActiveObject().lockMovementX = true;
          canvas.getActiveObject().lockMovementY = true;
          canvas.getActiveObject().lockUniScaling = true;
        }
        canvas.renderAll();*/
				//this.isDragging = false;
				//lezem dima nenzel aala add rect beshh yjiiblii rectangle
				/*canvas.off('mouse:down')
        canvas.off('mouse:move')
        canvas.off('mouse:up')*/
			});
			//canvas.selection = false

			canvas.hoverCursor = "auto";
			canvas.renderAll();
		},

		//Drawing Line function
		createLine(canvas) {
			var isDrawing;
			var line;
			var colorId = document.getElementById("stroke-color");
			var lineWidth = document.getElementById("line-width");
			let lineId = document.getElementById("line-type");

			this.imageUpload = false;
			this.shapeDraw = true;
			this.zoomMode = false;
			this.lineDraw = true;
			this.textDraw = false;
			this.textColor = false;
			var points;
			this.drawingMode(canvas);
			canvas.selection = false;
			canvas.on("mouse:down", (o) => {
				//var mode = canvas.getActiveObject();
				//console.log("mode", mode)
				/*if (mode === undefined || mode === null) {
          isDrawing = true;
        } else {
          isDrawing = false;
        }*/
				isDrawing = true;
				if (isDrawing) {
					isDrawing = true;
					var pointer = canvas.getPointer(o.e);
					points = [pointer.x, pointer.y, pointer.x, pointer.y];
					line = new fabric.Line(points, {
						id: "added-line",
						stroke: colorId.value,
						strokeWidth: Number(lineWidth.value),
						//strokeWidth: lineWidth.value,  //5,
						selectable: false, //true
						strokeDashArray: [],
						//selectable: false,
						hasRotatingPoint: true,
						//lockScalingFlip: true,
						lockScalingY: true,
						//hasControls: false
					});
					canvas.add(line);
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

					//line.setControlsVisibility({ mtr: false });
					/*line.lockMovementX = true;
          line.lockMovementY = true;*/
					//line.lockUniscaling = true

					//canvas.setActiveObject(line);
					if (lineId.value === "straightLine") {
						console.log(lineId.value);
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
				}
			});
			canvas.on("mouse:move", (o) => {
				var evt = o.e;
				if (isDrawing) {
					var pointer = canvas.getPointer(o.e);
					////just change here to make it work
					console.log("pointer.x", pointer.x, "pointer.y", pointer.y);
					line.set({ x2: pointer.x, y2: pointer.y });
					var startX = points[0];
					var startY = points[1];
					var x2 = pointer.x - startX;
					var y2 = pointer.y - startY;
					var angle = (Math.atan2(y2, x2) / Math.PI) * 180;
					angle = (angle % 360) + 180;
					var r = Math.sqrt(x2 * x2 + y2 * y2);
					console.log(
						"🚀 ~ file: PaintTool.vue ~ line 2185 ~ angle",
						angle
					);
					if (evt.shiftKey === true) {
						if (angle <= 22.5 || angle >= 337.5) {
							angle = 0;
							line.set({ x2: pointer.x, y2: startY });
						} else if (angle <= 67.5) {
							angle = 45;
							line.set({ x2: pointer.x, y2: startY });
						} else if (angle <= 112.5) {
							angle = 90;
						} else if (angle <= 157.5) {
							angle = 135;
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
					}
					angle -= 180;
					var cosx = r * Math.cos((angle * Math.PI) / 180);
					var sinx = r * Math.sin((angle * Math.PI) / 180);

					line.set({
						x2: cosx + startX,
						y2: sinx + startY,
					});
					/*if ((angle < 225 && angle >= 135) || angle >= 315 || angle <= 45) {
            line.set({ x2: pointer.x, y2: startY });
          } else if (
              (angle > 225 && angle < 315) ||
              (angle > 45 && angle < 135)
          )*/
					//line.set({ x2: startX, y2: pointer.y });
					/*line.set({ x2: pointer.x, y2: pointer.y });*/

					this.lastAngle = Number.parseInt(angle);
					//console.log("lastAngle",lastAngle)
					canvas.renderAll();
					return this.lastAngle;
				}
			});

			canvas.on("mouse:up", () => {
				//line.setCoords();
				//canvas.setActiveObject(line);
				/*line.set('flipX',true)*/
				isDrawing = false;
				console.log("mouseUp", this.lastAngle);
				canvas.renderAll();
				return this.lastAngle;
			});

			canvas.renderAll();
		},
		/*    createLine(canvas) {
          var isDrawing
          var line;
          var colorId = document.getElementById("text-color")
          let lineId = document.getElementById("line-type")
          var lineWidth = document.getElementById("line-width")
          this.imageUpload = false
          this.shapeDraw=true ;
          this.zoomMode=false ;
          this.lineDraw = true;
          this.textDraw = false;
          //var lineStorke = 5
          var points
          //let ctx = canvas.getContext('2d');
          //this.removeCanvasEvents(canvas);
          this.drawingMode(canvas)
          canvas.selection = false;
          canvas.on('mouse:down', (o) => {
            var evt = o.e;
            if (evt.ctrlKey === true) {
              //this.isDragging = true;
              line.set({
                selectable: false,
                //strokeWidth: lineWidth.value,
              })
              isDrawing = false;
            } else {
              isDrawing = true;
              var pointer = canvas.getPointer(o.e);
              console.log(pointer)
              points = [pointer.x, pointer.y, pointer.x, pointer.y];
              console.log(pointer.x, pointer.y)
              line = new fabric.Line(points, {
                id: "added-line",
                strokeWidth: lineWidth.value,  //5,
                stroke: colorId.value,
                selectable: false, //true
                strokeDashArray: [],
                //selectable: false,
                hasRotatingPoint: true,
                //flipY: true
                //angle: 45,
              });
              canvas.add(line);
              console.log("strokeWidthBeforeSet", line.strokeWidth)
              //canvas.setActiveObject(line);
              //line.set({strokeWidth: lineWidth.value});
              console.log("strokeWidthAfterSet", line.strokeWidth)
              if (lineId.value === "straightLine") {
                console.log(lineId.value)
                line.set({stroke: colorId.value});
              } else if (lineId.value === "dashedLine") {
                line.set({strokeDashArray: [20, 5]})
              } else if (lineId.value === "dottedLine") {
                console.log(lineId.value)
                line.set({strokeDashArray: [5, 7]});
              } /!*else if (lineId.value === "arrowLine") {
                console.log(lineId.value)
                line.set({strokeDashArray: [5, 7]});
              }*!/
              console.log(line)
              this.lineWidth(canvas)
              this.lineType(canvas);
              this.changeColor(canvas);
              //canvas.renderAll()
            }
          });

          canvas.on('mouse:move', function (o) {
            var evt = o.e;
            if (isDrawing) {
              var pointer = canvas.getPointer(o.e);
              console.log('pointer.x',pointer.x, 'pointer.y',pointer.y)
              //line.set({x1: pointer.x, y1: pointer.y, x2: pointer.x, y2: pointer.y});


              var startX = points[0];
              var startY = points[1];
              var x2 = pointer.x - startX;
              var y2 = pointer.y - startY;
              var r = Math.sqrt(x2*x2 + y2*y2);
              var angle = (Math.atan2(y2, x2) / Math.PI * 180);
              line.set({x2: pointer.x, y2: pointer.y});
              angle = (angle) % 360 + 180;

              if (evt.shiftKey === true) {
                if (angle <= 22.5 || angle >= 337.5) {
                  angle = 0;
                } else if (angle <= 67.5) {
                  angle = 45;
                } else if (angle <= 112.5) {
                  angle = 90;
                } else if (angle <= 157.5) {
                  angle = 135
                } else if (angle <= 202.5) {
                  angle = 180
                } else if (angle <= 247.5) {
                  angle = 225
                } else if (angle <= 292.5) {
                  angle = 270
                } else if (angle < 337.5) {
                  angle = 315
                }
                angle -= 180;

                var cosx = r * Math.cos(angle * Math.PI / 180);
                var sinx = r * Math.sin(angle * Math.PI / 180);

                line.set({
                  x2: cosx + startX,
                  y2: sinx + startY
                });
              }
              //line.set({x2: cosx + startX, y2: sinx + startY});
              canvas.renderAll();
            }
          });

          canvas.on('mouse:up', function () {
            line.setCoords();
            canvas.setActiveObject(line);
            isDrawing = false;
          });
          //canvas.selection = false
          //canvas.hoverCursor = "auto"
          canvas.renderAll();
        },*/

		createText(canvas) {
			var fontTextId = document.getElementById("font-family");
			//var textSize = document.getElementById("text-size")
			var textSizeValue = 50;
			var colorId = document.getElementById("text-color");
			this.imageUpload = false;
			this.shapeDraw = false;
			this.zoomMode = false;
			this.lineDraw = false;
			this.textDraw = true;
			this.textColor = true;
			// eslint-disable-next-line no-unused-vars
			var isDrawing = true;
			var txt;

			this.removeCanvasEvents(canvas);
			canvas.on("mouse:down", (o) => {
				var mode = canvas.getActiveObject();
				if (mode === undefined || mode === null) {
					isDrawing = true;
				} else {
					isDrawing = false;
				}
				if (isDrawing) {
					var pointer = canvas.getPointer(o.e);
					isDrawing = true;
					txt = new fabric.IText("Add your text", {
						id: "added-text",
						//fontFamily: fontTextId.value,
						fontFamily: "Century Gothic", //'Helvetica',
						fontSize: textSizeValue,
						left: pointer.x, //100,
						top: pointer.y, //100,
						fill: colorId.value,
						//backgroundColor: 'red',
						objecttype: "text",
					});
					canvas.add(txt);
					// canvas.setActiveObject(txt);
					/*txt.set({fontSize: textSize.value});
          txt.set({fontFamily: 'Century Gothic'});*/
					console.log("font", fontTextId.value);
					txt.set({ fontFamily: fontTextId.value });
					console.log("font family : ", fontTextId.value);
					fontTextId.onchange = function () {
						txt.set({ fontFamily: fontTextId.value });
						canvas.renderAll();
					};
					this.fontFamilyText(canvas);
					this.sizeText(canvas);
					this.changeColor(canvas);
					isDrawing = false;
				} else {
					txt.set({ fontFamily: fontTextId.value });
					console.log("font family : ", fontTextId.value);
					fontTextId.onchange = function () {
						txt.set({ fontFamily: fontTextId.value });
						canvas.renderAll();
					};
					this.fontFamilyText(canvas);
					this.sizeText(canvas);
					this.changeColor(canvas);
				}
			});
			canvas.on("mouse:up", function () {
				// txt.setCoords();
				isDrawing = false;
				//  canvas.setActiveObject(txt);
				// canvas.off('mouse:down')
				canvas.renderAll();
			});
			canvas.renderAll();
		},

		drawArrow(canvas) {
			var colorId = document.getElementById("stroke-color");
			var alltogetherObj;
			var isDrawing = true;
			this.imageUpload = false;
			this.shapeDraw = true;
			this.zoomMode = false;
			this.lineDraw = false;
			this.textDraw = false;
			this.textColor = false;
			this.removeCanvasEvents(canvas);
			canvas.on("mouse:down", (o) => {
				var mode = canvas.getActiveObject();
				if (mode === undefined || mode === null) {
					isDrawing = true;
				} else {
					isDrawing = false;
				}
				if (isDrawing) {
					var pointer = canvas.getPointer(o.e);
					//points = [pointer.x, pointer.y, pointer.x, pointer.y];
					isDrawing = true;
					var triangle = new fabric.Triangle({
						//id: 'arrow-head',
						width: 15,
						height: 20,
						left: pointer.x + 160, //235,
						top: pointer.y - 5, //65,
						fill: colorId.value,
						angle: 90,
					});
					//canvas.setActiveObject(triangle);
					var line = new fabric.Line([50, 100, 200, 100], {
						id: "added-arrow",
						strokeWidth: 5,
						left: pointer.x, //75,
						top: pointer.y, //70
						stroke: colorId.value,
					});
					//canvas.setActiveObject(line);
					var objs = [line, triangle];

					alltogetherObj = new fabric.Group(objs); //, {id: 'arrow-head',stroke: colorId.value,fill: colorId.value}
					canvas.add(alltogetherObj);
					canvas.setActiveObject(alltogetherObj);
					this.changeColor(canvas);
				}
			});

			canvas.on("mouse:up", function () {
				//alltogetherObj.setCoords();
				isDrawing = false;
				console.log(alltogetherObj.stroke);
			});
			//canvas.selection = false
			//canvas.hoverCursor = "auto"
			canvas.renderAll();
		},

		createXShape(canvas) {
			var colorId = document.getElementById("stroke-color");
			var alltogetherObj;
			var isDrawing = true;
			this.imageUpload = false;
			this.shapeDraw = true;
			this.zoomMode = false;
			this.lineDraw = false;
			this.textDraw = false;
			this.textColor = false;
			this.removeCanvasEvents(canvas);
			canvas.on("mouse:down", (o) => {
				var mode = canvas.getActiveObject();
				if (mode === undefined || mode === null) {
					isDrawing = true;
				} else {
					isDrawing = false;
				}
				if (isDrawing) {
					var pointer = canvas.getPointer(o.e);
					//points = [pointer.x, pointer.y, pointer.x, pointer.y];
					isDrawing = true;
					var triangle = new fabric.Line([50, 100, 200, 300], {
						id: "added-arrow",
						strokeWidth: 10,
						left: pointer.x, //75,
						top: pointer.y, //70
						stroke: colorId.value,
					});
					//canvas.setActiveObject(triangle);
					var line = new fabric.Line([50, 100, 200, -100], {
						id: "added-arrow",
						strokeWidth: 10,
						left: pointer.x, //75,
						top: pointer.y, //70
						stroke: colorId.value,
					});
					//canvas.setActiveObject(line);
					//var objs = [line];
					var objs = [line, triangle];

					alltogetherObj = new fabric.Group(objs); //, {id: 'arrow-head',stroke: colorId.value,fill: colorId.value}
					canvas.add(alltogetherObj);
					canvas.setActiveObject(alltogetherObj);
					this.changeColor(canvas);
				}
			});

			canvas.on("mouse:up", function () {
				//alltogetherObj.setCoords();
				isDrawing = false;
				//console.log(alltogetherObj.stroke)
			});
			//canvas.selection = false
			//canvas.hoverCursor = "auto"
			canvas.renderAll();
		},

		//Drag mode function
		deactivateLine(canvas) {
			/*var isDrawing
      var line;*/
			/*canvas.off('mouse:down')
      canvas.off('mouse:move')
      canvas.off('mouse:up')*/
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
			/*var isDrawing
      var line;*/
			/*canvas.off('mouse:down')
      canvas.off('mouse:move')
      canvas.off('mouse:up')*/
			//var colorId = document.getElementById("text-color")

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
			/*var isDrawing
      var line;*/
			/*canvas.off('mouse:down')
      canvas.off('mouse:move')
      canvas.off('mouse:up')*/
			//var colorId = document.getElementById("text-color")
			this.imageUpload = false;
			this.shapeDraw = true;
			this.zoomMode = false;
			this.lineDraw = false;
			//this.lineDraw = true;
			this.textDraw = false;
			this.textColor = false;
			//const select = document.getElementById("overlays-id");
			//let varType
			let varId;
			let varType0;
			//var varType1;
			/*console.log("select value :", select.value)
      console.log("last overlay :", this.lastelement)
      console.log(" this.last[view1]:",  this.last["view1"])
      console.log(" this.last[view2]:",  this.last["view2"])
      console.log("canvas._objects[0]",  canvas._objects[0])*/
			this.removeCanvasEvents(canvas);
			canvas.selection = true;
			let arr = ["line", "rect", "circle", "i-text", "group", "image"];
			let overlayArr = [
				"id-overlay0",
				"id-overlay1",
				"id-overlay2",
				"id-overlay3",
				"id-overlay4",
				"id-overlay5",
			];
			canvas.getObjects().forEach((o, index) => {
				if (
					arr.includes(canvas._objects[index].type) &&
					!overlayArr.includes(canvas._objects[index].cacheKey)
				) {
					// (o.cacheKey !== "id-overlay1")
					o.set({
						selectable: true,
					});
				}
				switch (o.id) {
					case "added-line":
						o.set({
							selectable: true,
						});
						this.lineWidth(canvas)
						this.lineType(canvas);
						this.changeColor(canvas);
						console.log(o);
						break;
					case "added-rect":
						o.set({
							selectable: true,
						});
						break;
					case "added-circle":
						o.set({
							selectable: true,
						});
						break;
					case "added-text":
						o.set({
							selectable: true,
						});
						break;
					case "arrow-head":
						o.set({
							selectable: true,
						});
						break;
					case "lineArrow-added":
						o.set({
							selectable: true,
						});
						break;
					case "added-XShape":
						o.set({
							selectable: true,
						});
						break;
					case "IdImage":
						o.set({
							selectable: true,
						});
						break;
					case "overlaySelection":
						o.set({
							selectable: true,
						});
						break;
					default:
						o.set({
							selectable: true,
						});
				}
				/*if (o.id === 'added-line') {
          o.set({
            selectable: true,
          })
        } else if (o.id === 'added-rect') {
          o.set({
            selectable: true
          })
        } else if (o.id === 'added-circle') {
          o.set({
            selectable: true
          })
        } else if (o.id === 'added-text') {
          o.set({
            selectable: true
          })
        } else if (o.id === 'arrow-head') {
          o.set({
            selectable: true
          })
        } else if (o.id === 'lineArrow-added') {
          console.log(o)
          o.set({
            selectable: true,
            /!*stroke: colorId.value,
            fill: colorId.value,*!/
          })
        } else if (o.id === 'added-XShape') {
          o.set({
            selectable: true
          })
        } else if (o.id === 'IdImage') {
          o.set({
            selectable: true
          })
        } else if (o.id === 'overlaySelection') {
          o.set({
            selectable: false
          })
        }*/
				/*if(o.id !== "overlaySelection")
        o.set({
          selectable: true
        });*/
				/*if(o.id === "overlaySelection"){
        o.set({
            selectable: false
          })
        }*/
				varType0 = canvas._objects[index].type;
				//this.selected = canvas._objects[index].type
				console.log(
					"selected elements type",
					canvas._objects[index].type
				);
				canvas.on("selection:created", (o) => {
					console.log("varType0", varType0);
					varId = o.target.id;
					console.log("varId", varId);
					switch (varId) {
						case "added-rect":
						case "added-line":
						case "added-circle":
							this.imageUpload = false;
							this.shapeDraw = true;
							this.zoomMode = false;
							this.lineDraw = true;
							this.textDraw = false;
							this.textColor = false;
							break;
						case "added-text":
							this.imageUpload = false;
							this.shapeDraw = false;
							this.zoomMode = false;
							this.lineDraw = false;
							this.textDraw = true;
							this.textColor = true;
							break;
						case "IdImage":
							this.imageUpload = true;
							this.shapeDraw = false;
							this.zoomMode = false;
							this.lineDraw = false;
							this.textDraw = false;
							this.textColor = false;
							break;
						default:
							this.imageUpload = false;
							this.shapeDraw = true;
							this.zoomMode = false;
							this.lineDraw = false;
							this.textDraw = false;
							this.textColor = false;
					}
				});
			});
			console.log("selected elements nbr", canvas.getObjects().length);
		},

		lineType(canvas) {
			let lineId = document.getElementById("line-type");
			//var colorId = document.getElementById("stroke-color");
			//canvas.getActiveObject().set({fontSize: textSize.value});
			lineId.addEventListener("change", () => {
				canvas.getActiveObjects().forEach((o) => {
					if (o.id === "added-line" || o.type === "line") {
						//if (lineId.value === "dottedLine") {
						//canvas.getActiveObjects().forEach(o => {
						if (lineId.value === "straightLine") {
							o.set({ 
								//stroke: colorId.value,
								strokeDashArray: [20, 0] });
						} else if (lineId.value === "dashedLine") {
							console.log(lineId);
							o.set({ strokeDashArray: [20, 5] });
						} else if (lineId.value === "dottedLine") {
							console.log(lineId);
							o.set({ strokeDashArray: [5, 7] });
						}
						console.log(lineId.value);
						//});
					}
					canvas.renderAll();
					//}
				});
			});
			/*if (lineId.value === "dottedLine") {
        canvas.getActiveObjects().forEach(o => {
          if (lineId.value === "straightLine") {
            o.set({stroke: 5 });
          } else if (o.id === 'added-line') {
            console.log(lineId.value)
            o.set({strokeDashArray: [20, 5]});
          } else if (lineId.value === "dashedLine") {
            console.log(lineId.value)
            o.set({strokeDashArray: [5, 7]});
          }
          console.log(lineId.value)
        });*/
		},

		lineWidth(canvas) {
			var lineWidth = document.getElementById("line-width");
			//var colorId = document.getElementById("text-color")
			//canvas.getActiveObject().set({fontSize: textSize.value});
			lineWidth.addEventListener("change", () => {
				canvas.getActiveObjects().forEach((o) => {
					if (o.id === "added-line") {
						o.set({ strokeWidth: lineWidth.value });
						canvas.renderAll();
					}
				});
			});
		},
		sizeText(canvas) {
			//var textSize = document.getElementById("text-size")
			var textSizeInput = document.getElementById("input-text-size");
			//canvas.getActiveObject().set({fontSize: textSize.value});
			/*textSize.addEventListener("change", () => {
        canvas.getActiveObjects().forEach(o => {
          if (o.id === 'added-text') {
            o.set({fontSize: textSize.value});
            canvas.renderAll();
          }
        });
      });*/
			textSizeInput.addEventListener("change", () => {
				canvas.getActiveObjects().forEach((o) => {
					if (o.id === "added-text" || o.type === "i-text") {
						o.set({ fontSize: textSizeInput.value });
						canvas.renderAll();
					}
				});
			});
		},

		fontFamilyText(canvas) {
			let fontTextId = document.getElementById("font-family");
			//canvas.getActiveObject().set({fontFamily:fontTextId.value});
			console.log("font family : ", fontTextId.value);
			document.getElementById("font-family").onchange = function () {
				canvas.getActiveObject().set({ fontFamily: fontTextId.value });
				canvas.renderAll();
			};
			/*overlayInstance.set({opacity: this.rangevalue});
      //overlayInstance.on("selected", () => {
      this.range.addEventListener("change", () => {
        overlayInstance.set({opacity: this.range.value / this.range.max});
        console.log(overlayInstance.opacity);
        canvas.renderAll();
      });*/
			/*   canvas.getActiveObjects().forEach(o => {
           fontTextId.addEventListener("change", () => {
           if (o.id === 'added-text') {
             o.set({fontFamily: fontTextId.value});
           }
         });
       });*/
		},

		changeColor(canvas) {
			var colorId = document.getElementById("text-color");
			var colorIdstroke = document.getElementById("stroke-color");
			var colorIdBackground = document.getElementById(
				"textBackground-color"
			);
			colorId.addEventListener("change", () => {
				canvas.getActiveObjects().forEach((o) => {
					switch (o.id) {
						case "added-text":
							o.set({ fill: colorId.value });
							canvas.renderAll();
							break;
						default:
							o.set({ fill: colorId.value });
							break;
					}
				});
			});
			colorIdstroke.addEventListener("change", () => {
				canvas.getActiveObjects().forEach((o) => {
					console.log("o", o);
					switch (o.id) {
						case "added-line":
							o.set({ stroke: colorIdstroke.value });
							break;
						case "added-rect":
							o.set({ stroke: colorIdstroke.value });
							break;
						case "added-circle":
							o.set({ stroke: colorIdstroke.value });
							break;
						case "added-XShape":
							o.set({ fill: colorIdstroke.value });
							break;
						case "added-text":
							o.set({ fill: colorIdstroke.value });
							canvas.renderAll();
							break;
						case "added-object-cloned":
							o.set({ stroke: colorIdstroke.value });
							break;
						/*case 'lineArrow-added':
                o.set({fill: colorId.value, stroke: colorId.value});
                break;*/
						case "added-arrow":
							o.set({ stroke: colorIdstroke.value });
							break;
						case "arrow-head":
							o.set({
								stroke: colorIdstroke.value,
								fill: colorIdstroke.value,
							});
							break;
						default:
							o.set({ stroke: colorIdstroke.value });
							break;
					}
					canvas.renderAll();
				});
			});
			colorIdBackground.addEventListener("change", () => {
				console.log(colorIdBackground.value);
				canvas.getActiveObjects().forEach((o) => {
					if (o.id === "added-text" || o.type === "i-text") {
						o.set({ backgroundColor: colorIdBackground.value });
						/*this.rangeColor.addEventListener("change", () => {
              var rgbaCol = 'rgba(' + parseInt(colorIdBackground.value.slice(-6, -4), 16) + ',' + parseInt(colorIdBackground.value.slice(-4, -2), 16) + ',' + parseInt(colorIdBackground.value.slice(-2), 16) + ',' + this.rangeColor.value / 100 + ')';
              console.log(rgbaCol)
              o.set({backgroundColor: rgbaCol}) //'rgba(219, 24, 182, 0.13)'
              canvas.renderAll();
            });*/
						canvas.renderAll();
					}
				});
			});
			this.rangeColor.addEventListener("change", () => {
				canvas.getActiveObjects().forEach((o) => {
					var rgbaCol =
						"rgba(" +
						parseInt(colorIdBackground.value.slice(-6, -4), 16) +
						"," +
						parseInt(colorIdBackground.value.slice(-4, -2), 16) +
						"," +
						parseInt(colorIdBackground.value.slice(-2), 16) +
						"," +
						this.rangeColor.value / 100 +
						")";
					console.log(rgbaCol);
					o.set({ backgroundColor: rgbaCol }); //'rgba(219, 24, 182, 0.13)'
					canvas.renderAll();
				});
			});
		},
		transparentColor(canvas) {
			console.log("transparent color button clicked 1");
			var colorTranspBackground = document.getElementById(
				"textBackground-transp"
			);
			var colorIdBackground = document.getElementById(
				"textBackground-color"
			);
			//colorTranspBackground.addEventListener("change", () => {
			canvas.getActiveObjects().forEach((o) => {
				if (o.id === "added-text") {
					o.set({ backgroundColor: colorTranspBackground.value });
					//this.rangeColor.addEventListener("change", () => {
					var rgbaCol =
						"rgba(" +
						parseInt(colorIdBackground.value.slice(-6, -4), 16) +
						"," +
						parseInt(colorIdBackground.value.slice(-4, -2), 16) +
						"," +
						parseInt(colorIdBackground.value.slice(-2), 16) +
						"," +
						0 +
						")";
					console.log(rgbaCol);
					o.set({ backgroundColor: rgbaCol }); //'rgba(219, 24, 182, 0.13)'
					canvas.renderAll();
					//});
					canvas.renderAll();
				}
			});
			//});
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
						console.log("copy");
						//ref.copyObject(canvas)
					}
					if (ctrlDown && event.keyCode === vKey) {
						console.log("paste");
						if (canvas.getActiveObject()) {
							ref.pasteObject(canvas);
							ctrlDown = false;
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
						ctrlDown = false;
					}
					if (ctrlDown && event.keyCode === yKey) {
						console.log("redo");
						ref.redoObject(canvas);
						ctrlDown = false;
					}
					if (event.keyCode === rightKey ) {
						event.preventDefault();
						canvas.getActiveObjects().forEach((o) => {
							console.log(o)
							o.left = o.left + step;
						});
						canvas.renderAll();
					}
					if (event.keyCode === leftKey ) {
						event.preventDefault();
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
					//ctrlDown = false;
				},
				false
			);

			//}
		},
		/*escapeListener() {
      var ref = this
      var canvas = ref.canvas
      window.onload = function () {
        var ctrlDown = false,
            ctrlKey = 17,
            cmdKey = 91,
            delKey = 46,
            //supprimKey = 8,
            vKey = 86,
            //xKey = 88,
            cKey = 67,
            yKey = 89,
            zKey = 90
        //var clipboard
        console.log("hello");

        document.addEventListener('keydown', function (event) {
          console.log(event)
          console.log(event.keyCode);

          if (event.keyCode === ctrlKey || event.keyCode === cmdKey) {
            ctrlDown = true;
          }

          if (ctrlDown && (event.keyCode === cKey)) {
            //this.copyObject(canvas);
            console.log("copy");
            //ref.copyObject(canvas)
          }
          if (ctrlDown && (event.keyCode === vKey)) {
            console.log("paste")
            if (canvas.getActiveObject()) {
              ref.pasteObject(canvas)
            }

            //this.message = "ctrl + paste pressed";
          }
          if (event.keyCode === delKey) {
            console.log("deleted object")
            ref.deleteShape(canvas)
          }
          if (ctrlDown && (event.keyCode === zKey)) {
            console.log("undo")
            ref.undoObject(canvas)
          }
          if (ctrlDown && (event.keyCode === yKey)) {
            console.log("redo")
            ref.redoObject(canvas)
          }
        }, false);
      }
    },*/

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
				// active selection needs a reference to the canvas.
				doomedObj.canvas = canvas;
				doomedObj.forEachObject(function (obj) {
					/*if (this.currentView === 1) {
            this.view1PaintUndoRedo.push(obj);
          } else if (this.currentView === 2) {
            this.view2PaintUndoRedo.push(obj);
          }*/
					canvas.remove(obj);
				});
			} //endif multiple objects
			else {
				//If single object, then delete it
				/*canvas.getObjects().forEach(o => {
        if (o.id === 'lineArrow-added'){
            canvas.remove(o);
          } /!*else if (o.id === 'lineArrow-added'){
          canvas.remove(o);
        }*!/
          });*/
				//var activeObject = canvas.getActiveObject();
				//How to delete multiple objects?
				//if(activeObject !== null && activeObject.type === 'rectangle') {
				if (doomedObj !== null) {
					if (this.currentView === 1) {
						this.view1PaintUndoRedo.push(doomedObj);
					} else if (this.currentView === 2) {
						this.view2PaintUndoRedo.push(doomedObj);
					}
					canvas.remove(doomedObj);
				}
				console.log("doomedobj", doomedObj);
			}
		},

		rasterize() {
			if (this.currentView === 1) {
				this.$view1image.src = this.canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
				this.$view2image.src = this.image2.src;
			} else if (this.currentView === 2) {
				this.$view1image.src = this.image1.src;
				this.$view2image.src = this.canvas.toDataURL({
					format: "image/png",
					multiplier: 1 / this.scaleRatio,
				});
			}
			console.log("IMAGE 1", this.$view1image.src);
			console.log("IMAGE 2", this.$view2image.src);

			return {
				"this.view1image": this.$view1image.src,
				"this.view2image": this.$view2image.src,
			};
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
			this.textDraw = false;
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
					//console.log("this.lastPosX",this.lastPosX, "this.lastPosY", this.lastPosY)
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
			//view1SaveUndoRedo = this.view1Paint
			if (this.currentView === 1) {
				if (canvas._objects.length > 0) {
					this.view1PaintUndoRedo.push(canvas._objects.pop());
					canvas.renderAll();
				}
			} else if (this.currentView === 2) {
				if (canvas._objects.length > 0) {
					this.view2PaintUndoRedo.push(canvas._objects.pop());
					canvas.renderAll();
				}
			}
		},

		redoObject(canvas) {
			if (this.currentView === 1) {
				if (this.view1PaintUndoRedo.length > 0) {
					this.isRedoing = true;
					canvas.add(this.view1PaintUndoRedo.pop());
				}
			} else if (this.currentView === 2) {
				if (this.view2PaintUndoRedo.length > 0) {
					this.isRedoing = true;
					canvas.add(this.view2PaintUndoRedo.pop());
				}
			}
		},
		clearCanvas(canvas) {
			//var objRemove = {}
			this.shapeDraw = false;
			this.zoomMode = false;
			this.lineDraw = false;
			this.textDraw = false;
			this.view1Delete = canvas.toJSON(this.background_image_view1);
			console.log("this.view1Delete", this.view1Delete);
			const select = document.getElementById("overlays-id");
			if (canvas._objects.length > 0) {
				canvas.clear();
			}
			if (this.currentView === 1) {
				fabric.Image.fromURL(
					this.background_image_view1,
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
			} else if (this.currentView === 2) {
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
			}
			select.value = "none";
		},
	},
};
</script>

<style scoped>
#app {
	margin-left: 150px;
} /*
@media only screen and (max-width: 2000px) {
	#app {
  margin-left: 150px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 1000px;
  margin-left: -100px;
  width: 100%;
		
	}
}*/

.navbarStyle {
	margin-left: 90px;
	width: 2500px;
}

.cardCanvasStyle {
	margin-left: 0px; /*<--- here*/
	width: 500px;

	/*border: 5px black solid*/
}

.sidebarStyle {
	margin-right: 0px; /*1300*/
}

.spacingStyleSideBar {
	margin-bottom: -30px;
}

img {
	width: 100%;
	margin: auto;
	/*display: block;*/
	/*margin-bottom: 10px;*/
	display: none;
}

button {
	padding: 15px;
	/*border: 1px solid blue;*/
	font-size: 18px;
	margin: 15px;
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

/* The container must be positioned relative: */
/*select {
  !*margin-left: 150px;*!
  width: 300px;
  display: inline-block;
  font-size: 16px;
  position: relative;
  text-align: left;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 0;
  border-bottom: 2px solid
}*/
.canvasLayout {
	border: 3px black solid; /*#006FFF*/
}

.data {
	overflow-x: scroll;
	/*display: flex;*/
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
