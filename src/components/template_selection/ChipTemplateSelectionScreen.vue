<template>
	<v-container primary fill-height fluid>
		<v-row>
			<v-col cols="12" align="center" justify="center">
				<!--<v-card
                    width="100vh"
                    height="50vh"
                    v-if="hide"
                >
                    <v-card-title class="headline grey lighten-2">
                       Choose template type  <!-Chooser a template to export as:->
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-container >
                        <v-btn @click="landscape()"> Landspcape </v-btn>
                        <v-btn @click="portraitTemp()"> Portrait </v-btn>
                    </v-container>
                    </v-card>-->

				<v-card width="100vh" height="50vh">
					<!-- v-if="showTemplate" -->
					<v-card-title class="headline grey lighten-2">
						{{ $t("titles.templateToExpertAs") }}:
						<!--Chooser a template to export as:-->
					</v-card-title>
					<v-divider></v-divider>
					<v-form v-if="showTemplate">
						<v-radio-group
							:disabled="disabled"
							v-if="changeFlagUploadSide === true"
							v-model="templateSelection"
							mandatory
							@change="handler"
						>
							<v-row>
								<v-radio
									value="A"
									class="pa-2"
									v-if="landscapeTemps"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_a.png')
											"
											lazy-src=""
											max-width="15vh"
											max-height="10vh"
										>
										</v-img>
									</template>
								</v-radio>

								<v-radio
									value="E"
									class="pa-2"
									v-if="landscapeTemps"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_e.png')
											"
											lazy-src=""
											max-width="15vh"
											max-height="10vh"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="F"
									class="pa-2"
									v-if="landscapeTemps"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_f.png')
											"
											lazy-src=""
											max-width="15vh"
											max-height="10vh"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="B"
									class="pa-2"
									v-if="portraitTemplate"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_c.png')
											"
											lazy-src=""
											max-width="50px"
											max-height="100px"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="G"
									class="pa-2"
									v-if="landscapeTemps"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_g.png')
											"
											lazy-src=""
											max-width="15vh"
											max-height="10vh"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="H"
									class="pa-2"
									v-if="landscapeTemps"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_h.png')
											"
											lazy-src=""
											max-width="15vh"
											max-height="10vh"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="I"
									class="pa-2"
									v-if="landscapeTemps"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_i.png')
											"
											lazy-src=""
											max-width="15vh"
											max-height="10vh"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="J"
									class="pa-2"
									v-if="landscapeTemps"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_j.png')
											"
											lazy-src=""
											max-width="15vh"
											max-height="10vh"
										>
										</v-img>
									</template>
								</v-radio>
								<v-card
									v-if="previewPath"
									style="
										margin-left: auto;
										margin-right: auto;
										display: flex;
										flex-direction: column;
									"
								>
									<v-card-title>Preview</v-card-title>
									<v-card-actions>
										<v-img
											contain
											style="
												border: solid;
												align-item: center;
												justify-content: center;
											"
											v-bind:src="previewPath"
											width="100px"
										></v-img>
									</v-card-actions>
								</v-card>
							</v-row>
						</v-radio-group>
						<v-radio-group
							:disabled="disabled"
							v-else
							v-model="templateSelection"
							mandatory
							@change="handler"
						>
							<v-row>
								<v-radio
									value="M"
									class="pa-2"
									v-if="landscapeTemps"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_m.png')
											"
											lazy-src=""
											max-width="15vh"
											max-height="10vh"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="N"
									class="pa-2"
									v-if="landscapeTemps"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_n.png')
											"
											lazy-src=""
											max-width="15vh"
											max-height="10vh"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="O"
									class="pa-2"
									v-if="portraitTemplate"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_o.png')
											"
											lazy-src=""
											max-width="50px"
											max-height="100px"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="P"
									class="pa-2"
									v-if="portraitTemplate"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_p.png')
											"
											lazy-src=""
											max-width="50px"
											max-height="100px"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="Q"
									class="pa-2"
									v-if="portraitTemplate"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_q.png')
											"
											lazy-src=""
											max-width="50px"
											max-height="100px"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="R"
									class="pa-2"
									v-if="portraitTemplate"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_r.png')
											"
											lazy-src=""
											max-width="50px"
											max-height="100px"
										>
										</v-img>
									</template>
								</v-radio>
								<v-radio
									value="S"
									class="pa-2"
									v-if="portraitTemplate"
								>
									<template v-slot:label>
										<v-img
											:src="
												require('../../assets/chip_template_s.png')
											"
											lazy-src=""
											max-width="50px"
											max-height="100px"
										>
										</v-img>
									</template>
								</v-radio>
								<v-card
									v-if="previewPath"
									style="
										margin-left: auto;
										margin-right: auto;
										display: flex;
										flex-direction: column;
									"
								>
									<v-card-title>Preview</v-card-title>
									<v-card-actions>
										<v-img
											contain
											style="
												border: solid;
												align-item: center;
												justify-content: center;
											"
											v-bind:src="previewPath"
											width="100px"
										></v-img>
									</v-card-actions>
								</v-card>
							</v-row>
						</v-radio-group>
					</v-form>

					<v-card-actions>
						<v-btn color="primary" text @click="landscape()">
							ヨコ
						</v-btn>
						<!-- Landspcape -->
						<v-btn color="primary" text @click="portraitTemp()">
							タテ
						</v-btn>
						<!-- Portrait -->
						<v-spacer></v-spacer>
						<v-btn color="primary" text @click="handleFinish()">
							{{ $t("navigation.finishButton") }}
							<!--Finish-->
						</v-btn>
						<v-btn color="primary" text @click="handlePrevious()">
							{{ $t("navigation.returnButton") }}
							<!--Return-->
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	mount() {
		let frontUrl = "testing/chip_compare1.png";
		this.newTest = frontUrl;
	},
	mounted() {
		console.log(this.chipFrontUrl);
	},

	components: {},
	data: function () {
		return {
			errorMsg: [],
			templateSelection: "",
			landscapeTemps: false,
			portraitTemplate: false,
			showTemplate: false,
			test: true,
			hide: true,
			previewPath: "../../assets/chip_template_s.png",
			disabled: false,
		};
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
		template() {
			return this.$store.state.template;
		},
		chipFrontNewImageData() {
			return this.$store.state.chipFrontNewImageData;
		},
		chipBackNewImageData() {
			return this.$store.state.chipBackNewImageData;
		},
		changeFlagUploadSide() {
			return this.$store.state.flagSideUpload.back;
		},
	},
	async created() {
		/// this.previewPath=await this.createTemplateImage(this.chipFrontUrl,this.chipBackUrl,"A")
	},
	watch: {
		previewPath(val) {
			console.log(
				"🚀 ~ file: ChipTemphglateSelectionScreen.vue ~ line 366 ~ previewPath ~ val",
				val
			);
			// this.previewPath =
		},
	},
	methods: {
		handleFinish() {
			this.$store.dispatch("changeTemplate", this.templateSelection);
			this.$router.push("chip_cutting");
		},
		handlePrevious() {
			this.$router.push("point_selection");
		},
		landscape() {
			this.landscapeTemps = true;
			this.portraitTemplate = false;
			this.portrait = false;
			this.showTemplate = true;
			this.hide = false;
		},
		portraitTemp() {
			this.portraitTemplate = true;
			this.landscapeTemps = false;
			this.showTemplate = true;
			this.hide = false;
		},
		async handler() {
			console.log("jdj", this.templateSelection);
			let a;
			this.disabled = true;
			if (this.templateSelection)
				a = await this.createTemplateImage(
					this.chipFrontUrl,
					this.chipBackUrl,
					this.templateSelection
				);
			console.log(
				"🚀 ~ file: ChipTemplateSelectionScreen.vue ~ line 396 ~ handler ~ a",
				a
			);
			this.previewPath = null;
			this.previewPath =
				`${process.env.VUE_APP_BACKEND_URL}/static/export/exported_image.png?` +
				Math.random();
		},
		async createTemplateImage(front, back, template) {
			let payload = {
				template: template,
				front_url: front,
				back_url: this.changeFlagUploadSide ? back : undefined,
				createLayers:false

			};
			let filepath = "";

			await this.axios
				.post(this.databaseLocalHost + "/createExport", payload)
				.then((response) => {
					console.log(response);
					filepath = response["data"]["filepath"];
					this.disabled = false;
				})
				.catch((error) => {
					console.log(error);
				});

			return {
				filepath: filepath,
			};
		},
	},
};
</script>

<style scoped>
.main-card {
	/* align-items: "center"; */
	padding-bottom: 30px;
}
.displayTemplate {
	opacity: 0.5;
	display: none;
}
</style>
