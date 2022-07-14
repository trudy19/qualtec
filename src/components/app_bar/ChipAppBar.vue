<template>
	<v-app-bar color="deep-purple accent-4" dark flat>
		<v-toolbar-title> {{ $t("titles.chipProject") }}</v-toolbar-title>
		<!--Chip Project-->

		<v-spacer></v-spacer>
		<template v-if="currentRoute === 'CuttingLine'">
			<ChipCuttingLineDialog />
		</template>
		<template v-else> </template>
		<template v-if="currentRoute === 'CuttingLineEditor'">
			<v-btn depressed color="success" @click="handleContinuePaint()">
				{{ $t("navigation.GoToPaintTool") }}
				<!--Go to Paint Tool-->
			</v-btn>
		</template>
		<template v-if="currentRoute === 'CuttingLine'">
			<ChipCuttingGotoPaint />
		</template>
		<template v-if="currentRoute === 'PaintTool'">
			<ChipPaintToolReturn />
		</template>
		<template v-if="currentRoute === 'CuttingLineEditor'">
			<ChipCuttingReturn />
		</template>
		<!--            <ChooseLanguage />-->
		<ChipAppSave
			:currentview="currentRoute"
			v-if="
				currentRoute === 'PaintTool' ||
				currentRoute === 'CuttingLineEditor'
			"
		/>
	</v-app-bar>
</template>

<script>
// import ChipFinalExport from '../export/ChipFinalExport';
// import ChipExportButton from "../export/ChipExportButton";
// import ChipShowEditor from "../export/ChipShowEditor";
// import ChipAppBarDialog from './ChipAppBarDialog';
// import ChipCuttingLineEditorDialog from '../cutting_line_editor/ChipCuttingLineEditorDialog';
import ChipCuttingLineDialog from "../chip_cutting/ChipCuttingLineDialog";
import ChipPaintToolReturn from "../paint_tool/ChipPaintToolReturn";
import ChipCuttingReturn from "../cutting_line_editor/ChipCuttingReturn";
import ChipCuttingGotoPaint from "../chip_cutting/ChipCuttingGotoPaint";
import ChipAppSave from "./ChipAppSave";
//import ChooseLanguage from './ChooseLanguage'
import Painterro from "painterro";

export default {
	mounted() {
		this.$nextTick(() => {
			this.painterro = Painterro({
				saveHandler: (image, done) => {
					let filename = "file.png";
					const type = "image/png";
					const file = new File([image.asBlob(type)], filename, {
						type: type,
					});
					this.downloadImage(file, filename);
					done(true);
				},
			});
		});
	},
	props: {},
	components: {
		// ChipFinalExport
		// ,ChipExportButton
		// ,ChipShowEditor
		// ,ChipAppBarDialog
		ChipPaintToolReturn,
		ChipCuttingReturn,
		//ChooseLanguage,
		ChipAppSave,
		ChipCuttingLineDialog,
		ChipCuttingGotoPaint,
		// ,ChipCuttingLineEditorDialog
	},
	watch: {
		$route: "checkdata",
	},
	computed: {
		currentEditImage() {
			return this.$store.state.currentEditImage;
		},
		databaseLocalHost() {
			return this.$store.state.databaseLocalHost;
		},
		localHostName() {
			return this.$store.state.localHostName;
		},
		showFinalEdit() {
			return this.$store.state.showFinalEdit;
		},
		showPaintTool() {
			return this.$store.state.showPaintTool;
		},
		currentRoute() {
			return this.$route.name;
		},
		paintSwitchObj() {
			return this.$store.state.paintSwitchObj;
		},
	},
	data: () => ({
		painterro: null,
	}),
	methods: {
		checkdata() {
			console.log(this.currentRoute);
		},
		showPainterro(payload) {
			if (payload) {
				if (payload.image && payload.image_size) {
					console.log("Hello");
					this.painterro = Painterro({
						saveHandler: (image, done) => {
							let filename = "file.png";
							const type = "image/png";
							const file = new File(
								[image.asBlob(type)],
								filename,
								{ type: type }
							);

							let newFilename =
								this.uploadImageToFileSystem(file);
							console.log(newFilename);
							this.$store.dispatch(
								"changeCurrentEditImage",
								this.databaseLocalHost +
									"/static/final/" +
									filename
							);
							this.downloadImage(file, filename);
							done(true);
						},
						defaultSize:
							payload.image_size[0] + "x" + payload.image_size[1],
						backplateImgUrl: payload.image,
					});
					this.painterro.show();
				}
			} else {
				// console.log(this.currentEditImage);
				// this.painterro.clear();
				// console.log(this.currentEditImage + "#" + new Date().getTime())
				// this.painterro.show(this.currentEditImage + "#" + new Date().getTime());
				this.painterro.show();
			}
		},
		async downloadImage(image_info, filename) {
			//await this.downloadImage(this.activeMarker.picture);
			console.log(image_info);
			console.log(filename);

			// console.log(response);
			// var fileURL = window.URL.createObjectURL(new Blob([response.data]));
			var fileURL = window.URL.createObjectURL(image_info);
			var fileLink = document.createElement("a");

			fileLink.href = fileURL;
			fileLink.setAttribute("download", filename);
			document.body.appendChild(fileLink);

			fileLink.click();
			this.$store.dispatch("changeLoading", false);
		},
		async uploadImageToFileSystem(file) {
			console.log(file);
			let newFilename = "";
			var data = new FormData();
			data.append("file", file);
			console.log(data);

			this.$store.dispatch("changeLoading", true);
			await this.axios
				.post(this.databaseLocalHost + "/uploadImageFinal", data, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				})
				.then((response) => {
					console.log(response);
					newFilename = response["data"];
				})
				.catch((error) => {
					console.log(error);
				});
			this.$store.dispatch("changeLoading", false);
			return newFilename;
		},
		handleContinueCutting() {
			console.log(this.$router.currentRoute.name);
			this.$root.$refs.PaintTool1.switchCanvasMode();
		},
		handleContinuePaint() {
			console.log(this.$root.$refs.PaintTool);
			this.$root.$refs.lineEditor.switchToPaintTool();
		},
	},
};
</script>

<style scoped></style>
