<template>
	<div id="mapid">
		<l-map
			:min-zoom="minZoom"
			@click="addMarker"
			:crs="crs"
			:center="[0, 0]"
			style="z-index: 0"
			:zoom="zoomRange"
		>
			<l-image-overlay :url="url" :bounds="[[0, 0], bounds]" />
			<l-marker
				v-for="marker in markers"
				:key="marker.label"
				:lat-lng="marker"
				:draggable="true"
				@dragstart="dragStartHandler"
				@dragend="dragEndHandler"
				:angleImage="angleImage"
			>
				<l-tooltip :options="tooltipOptions">
					{{ marker.label }}
				</l-tooltip>
			</l-marker>
		</l-map>
	</div>
</template>

<script>
import { Icon } from "leaflet";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

import L from "leaflet";
import { LMap, LImageOverlay, LMarker, LTooltip } from "vue2-leaflet";
export default {
	mount() {},
	data: () => ({
		minZoom: -4,

		crs: L.Util.extend(L.CRS.Simple, {
			transformation: new L.Transformation(1, 0, 1, 0),
		}),
		tooltipOptions: {
			permanent: true,
		},
		prevMarkerCoord: [],
		testImage: "",
		labels: 1,
		chip_instruction_url: "",
		chip_instruction_index: 0,
		currentPoint: [],
		overlayMapImage: "",
		instructionMapBounds: [0, 0],
		currentIndex: 0,
	}),
	props: {
		markers: Array,
		url: String,
		angleImage: Number,
		bounds: Array,
		zoomRange: Number,
	},
	computed: {
		databaseLocalHost() {
			return this.$store.state.databaseLocalHost;
		},
		localHostName() {
			return this.$store.state.localHostName;
		},
	},
	components: {
		LMap,
		LImageOverlay,
		LMarker,
		LTooltip,
	},
	methods: {
		addMarker(event) {
			console.log("url", this.url);
			console.log("angleImage", this.angleImage);
			console.log(event);
			console.log(this.markers);
			if (this.markers.length <= 3) {
				let newMarker = {};
				let label = this.markers.length + 1;
				newMarker = {
					label: label,
					lat: event.latlng["lat"],
					lng: event.latlng["lng"],
					rotate: true,
				};
				console.log(newMarker);
				// this.markers.push(newMarker);
				// console.log(this.markers);

				let newMarkers = this.markers;
				newMarkers.push(newMarker);
				console.log(newMarkers);
				this.$emit("update-marker", newMarkers);
			}
		},
		getMarkerFromCoords(coord) {
			for (let i = 0; i < this.markers.length; ++i) {
				if (
					this.markers[i].lat === coord[0] &&
					this.markers[i].lng === coord[1]
				) {
					return this.markers[i];
				}
			}
			return {};
		},
		dragStartHandler(e) {
			console.log(e);
			let coords = [e.target._latlng.lat, e.target._latlng.lng];
			this.currentPoint = this.getMarkerFromCoords(coords);
		},
		dragEndHandler(e) {
			console.log(e);
			let coords = [e.target._latlng.lat, e.target._latlng.lng];
			let newCoords = {};
			let indexToChange = 0;
			for (let i = 0; i < this.markers.length; ++i) {
				if (this.markers[i] === this.currentPoint) {
					newCoords.lat = coords[0];
					newCoords.lng = coords[1];
					indexToChange = i;
				}
			}
			let newMarkers = this.markers;
			newMarkers[indexToChange].lat = newCoords.lat;
			newMarkers[indexToChange].lng = newCoords.lng;
			console.log(newMarkers);
			this.$emit("update-marker", newMarkers);
		},
		rotation() {},
	},
};
</script>

<style scoped>
#mapid {
	height: 60vh;
	width: 80vh;
	z-index: 0;
	display: block;
	align-items: center;
}
.overlayId {
	transform: rotate(45deg);
}
.leaflet-tooltip {
	background-color: #006fff;
	color: #ffffff;
}
</style>
