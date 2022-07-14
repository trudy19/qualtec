<template>
	<div>
		<!--<v-select
			style="margin-top: 20px; margin-left: 5px"
			v-if="currentRoute === 'PaintTool'"
			:items="saveDropdown"
			item-text="text"
			item-value="value"
			label="Save Mode"
			class="d-flex"
			cols="10"
			sm="5"
			@change="handleSave"
		></v-select>-->
		<v-btn v-if="currentRoute !== 'PaintTool'"  depressed color="primary" @click="dialog = true">
			{{ $t("navigation.saveButton") }}
		</v-btn>

		<v-btn v-else
            depressed
            color="primary"
            @click="dialog = true"
        >
            {{$t('navigation.saveButton')}} <!--Go to Cutting Line Editor-->
        </v-btn>
        <v-dialog
            v-model="dialog"
            width="120vh"
            height="100vh"
            @click:outside="dialog = false"
        >
            <v-card>
                <v-card-title class="headline grey lighten-2">
                  {{$t('navigation.saveButton')}} <!--Generate cutting lines-->
                </v-card-title>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
						v-if="currentRoute === 'PaintTool'"
                        color="primary"
                        text
                        @click="handleSave(1)"
                    >
                      カットサンプル・追い込み順シート <!--Yes-->
                    </v-btn>
                    <v-btn
					v-if="currentRoute === 'PaintTool'"
                        color="primary"
                        text
                        @click="handleSave(2)"
                    >
                      マーキング装置入力データ  <!--No-->
                    </v-btn>
					<v-btn
					v-if="currentRoute === 'PaintTool'"
                        color="primary"
                        text
                        @click="handleSave(0)"
                    >
                      プロジェクトデータ  <!--No-->
                    </v-btn>
					<v-btn
					v-if="currentRoute === 'PaintTool'"
                        color="primary"
                        text
                        @click="handleSave(5)"
                    >
                      download Zip project  <!--No-->
                    </v-btn>
					<v-btn
					v-if="currentRoute === 'CuttingLineEditor'"
                        color="primary"
                        text
                        @click="handleSave(3)"
                    >
                      EXCEL1  <!--No-->
                    </v-btn>
					<v-btn
					v-if="currentRoute === 'CuttingLineEditor'"
                        color="primary"
                        text
                        @click="handleSave(4)"
                    >
                      EXCEL2  <!--No-->
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>



	</div>
</template>

<script>
export default {
	mounted() {
		console.log(this.currentview);
		this.escapeListener();
	},
	data: () => ({
		dialog: false,
		saveDropdown: [
			{ text: "Export Json from front", value: 0 },
			{ text: "Export Spreed sheet from the back", value: 1 },
			{ text: "Export JSON from the back", value: 2 },
		],
	}),

	computed: {
		databaseLocalHost() {
			return this.$store.state.databaseLocalHost;
		},
		localHostName() {
			return this.$store.state.localHostName;
		},
		currentRoute() {
			return this.$route.name;
		},
		chipFrontUrlAdj() {
			return this.$store.state.chipFrontUrlAdj;
		},
		chipBackUrlAdj() {
			return this.$store.state.chipBackUrlAdj;
		},
		chipInstructionAdjustDropdownAdj() {
			return this.$store.state.chipInstructionAdjustDropdownAdj;
		},
		chipFrontSize() {
			return this.$store.state.chipFrontSize;
		},
		cutting1SwitchObj() {
			return this.$store.state.cutting1SwitchObj;
		},
		cutting2SwitchObj() {
			return this.$store.state.cutting2SwitchObj;
		},
		cuttingLineEditor1SwitchObj() {
			return this.$store.state.cuttingLineEditor1SwitchObj;
		},
		cuttingLineEditor2SwitchObj() {
			return this.$store.state.cuttingLineEditor2SwitchObj;
		},
		paintSwitchObj() {
			return this.$store.state.paintSwitchObj;
		},
		templateImage() {
			return this.$store.state.templateImage;
		},
	},
	components: {},
	props: {
		currentview: String,
	},
	methods: {
		escapeListener() {
			var ref = this;
			//var canvas = ref.canvas;
			
			console.log("hello from escape listener");
			//window.onload = function () {
			var ctrlDown = false,
				ctrlKey = 17,
				cmdKey = 91,
				sKey = 83;
			//var clipboard

			document.addEventListener(
				"keydown",
				function (event) {
					console.log(event.keyCode);
					if (event.keyCode === ctrlKey || event.keyCode === cmdKey) {
						ctrlDown = true;
					}
					
					if (ctrlDown && event.keyCode === sKey) {
						event.preventDefault();
						ref.dialog = true;
						/*if ( ref.currentRoute === 'PaintTool') {
							ref.dialog = true;
						} else {
							ref.dialog = false;
						}*/
					}
					//ctrlDown = false;
				},
				false
			);

			//}
		},
		async handleSave(index) {
			this.dialog = false;
			console.log(
				"🚀 ~ file: ChipAppSave.vue ~ line 76 ~ handleSave ~ index",
				index
			);
			let saveJson = {
				chipFrontUrlAdj: this.chipFrontUrlAdj,
				chipBackUrlAdj: this.chipBackUrlAdj,
				chipFrontSize: this.chipFrontSize,
				chipInstructionAdjustDropdownAdj:
					this.chipInstructionAdjustDropdownAdj,
				chipFrontUrl: this.chipFrontUrl,
				chipBackUrl: this.chipBackUrl,
				chipInstructionUrls: this.chipInstructionUrls,
				chipInstructionAdjustUrls: this.chipInstructionAdjustUrls,
				cutting1SwitchObj: this.cutting1SwitchObj,
				cutting2SwitchObj: this.cutting2SwitchObj,
				cuttingLineEditor1SwitchObj: this.cuttingLineEditor1SwitchObj,
				cuttingLineEditor2SwitchObj: this.cuttingLineEditor2SwitchObj,
				paintSwitchObj: this.paintSwitchObj,
				templateImage: this.templateImage,
				uuid: this.$store.state.uuid,
			};
			console.log(this.cuttingLineEditor1SwitchObj);
			this.$store.dispatch("changeSaveJson", saveJson);
			/* console.log("hello");
        if(this.$router.currentRoute.name === 'ChipCutting') {
            console.log("I'm in chip cutting");
            this.$root.$refs.ChipCuttingFront.saveState();
        }*/

			console.log("hello cutting editor");

			console.log("hello cutting editor");

			if (this.$router.currentRoute.name === "CuttingLineEditor") {
				console.log("I'm in chip CuttingLineEditor");
				this.$root.$refs.lineEditor.saveState(index);
			}
			console.log("I made it");
			if (this.$router.currentRoute.name === "PaintTool") {
				console.log("I'm in paint tool");
				this.$root.$refs.PaintTool1.saveState(index);
			}
		},
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
};
</script>

<style scoped></style>
