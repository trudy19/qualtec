<template>
  <v-card>
    <v-row
      ><v-col cols="1" class="mt-2"
        ><v-btn
          :dark="activeTool === 'line'"
          x-large
          @click="changeActiveTool('line')"
          class="ml-2"
          ><v-icon dark>mdi-slash-forward</v-icon></v-btn
        ></v-col
      ><v-col cols="1" class="mt-2"
        ><v-btn
          :dark="activeTool === 'rect'"
          x-large
          @click="changeActiveTool('rect')"
          class="ml-2"
          ><v-icon dark>mdi-rectangle-outline</v-icon></v-btn
        ></v-col
      ><v-col cols="1" class="mt-2"
        ><v-btn
          v-if="activeTool !== 'select'"
          x-large
          @click="changeActiveTool('select')"
          class="ml-2"
          >select</v-btn
        ><v-btn
          v-else
          dark
          x-large
          @click="$emit('delete')"
          class="ml-2"
          color="red"
          >delete</v-btn
        ></v-col
      ><v-col cols="2" v-if="activeTool !== 'select'"
        ><v-card outlined class="pa-2 ml-4"
          ><div class="select">
            <select @change="lineWidth($event)">
              <option value="" selected disabled>line width</option>
              <option
                v-for="(n, index) in [2, 3, 4, 5]"
                :key="index"
                :value="n * (index + 1)"
              >
                {{ n * (index + 1) }}
              </option>
            </select>
          </div></v-card
        ></v-col
      ><v-col cols="2" v-if="activeTool === 'select' && lineSelected !== 'none'"
        ><v-card outlined class="pa-2 ml-4"
          ><div class="select">
            <select @change="lineDirection($event)" v-model="directionSelected">
              <option value="" disabled>line direction</option>
              <option
                v-for="(n, index) in lineDirectionOption[lineSelected]"
                :key="index"
                :value="n"
              >
                {{ n }}
              </option>
            </select>
          </div></v-card
        ></v-col
      ><v-spacer /><v-col cols="2"
        ><v-card outlined class="pa-2">
          <div class="select">
            <select id="views-id" @change="viewHandler($event)">
              <option value="" selected disabled>
                {{ $t("oppositeView.selectView") }}
                <!--Select View-->
              </option>
              <!-- オーバーレイを選択 -->
              <option value="none">
                {{ $t("addOverlays.none") }}
                <!--None-->
              </option>
              <!--index : yebda 0 -->
              <option id="id_view1" value="views1-id">
                {{ $t("oppositeView.selectView") }} 1
              </option>
              <!-- Select view -->
              <option id="id_view2" value="views2-id">
                {{ $t("oppositeView.selectView") }} 2
              </option>
              <!-- Select view -->
              <!--            <option v-for="(index, i) in overlays.length" v-bind:key="index" :value="'id-overlay'+i">{{"overlay"+i}}</option>-->
            </select>
          </div></v-card
        ></v-col
      ><v-col cols="2">
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
            @change="setOverviewTransparency($event)"
          />
          <output
            for="rangeViewOpacity"
            id="slider-value-view"
          ></output></div></v-col
    ></v-row>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    overviewTransparencyInput: null,
    lineDirectionOption: {
      vertical: ["left", "right"],
      horizontal: ["above", "under"],
      none: [],
    },
    lineSelected: "none",
    directionSelected: "",
  }),
  props: {
    activeTool: {
      type: String,
    },
  },
  mounted() {
    this.overviewTransparencyInput =
      document.getElementById("rangeViewOpacity");
  },
  methods: {
    changeActiveTool(value) {
      if (this.activeTool !== value) {
        this.$emit("changeActiveTool", value);
      }
    },
    lineWidth(event) {
      this.$emit("lineWidth", event.target.value);
      console.log(`lineWidth, ${event.target.value}`);
    },
    lineDirection(event) {
      const direction = event.target.value;
      if (direction) {
        this.$emit("lineDirection", direction);
        console.log("lineDirection", direction);
      }
    },
    fontFamilyText(event) {
      this.$emit("fontFamilyText", event.target.value);
      console.log(`fontFamilyText, ${event.target.value}`);
    },
    sizeText(event) {
      this.$emit("sizeText", event.target.value);
      console.log(`sizeText, ${event.target.value}`);
    },
    clickChangeColor() {
      const changeColorInput = document.getElementById("text-color");
      changeColorInput.click();
    },
    changeColor(event) {
      this.$emit("changeColor", event.target.value);
      console.log(`changeColor, ${event.target.value}`);
    },
    viewHandler(event) {
      this.$emit("viewHandler", event.target.value);
      console.log(`viewHandler, ${event.target.value}`);
    },
    setOverviewTransparency(event) {
      this.$emit("setOverviewTransparency", event.target.value);
      console.log(`setOverviewTransparency, ${event.target.value}`);
    },
    changeLineSelected(type, direction) {
      this.lineSelected = type;
      this.directionSelected = direction;
    },
  },
  computed: {},
};
</script>

<style scoped>
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
  outline: 0;
  background-image: none;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0 0 0 0.5em;
  cursor: pointer;
}
.select {
  position: relative;
  display: block;
  height: 3em;
  line-height: 3;
  overflow: hidden;
  border-radius: 0.25em;
}
select::-ms-expand {
  display: none;
}
.select::after {
  content: "\25BC";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 0;
  background: whitesmoke;
  pointer-events: none;
}
.select:hover::after {
  color: #f39c12;
}
.v-btn {
  text-transform: none;
}
</style>
