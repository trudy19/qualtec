<template>
	<div>
		<v-btn depressed color="success" @click="dialog = true"> Final </v-btn>
		<v-dialog
			v-model="dialog"
			width="50vh"
			height="100vh"
			@click:outside="handleExportDialogOff()"
		>
			<v-card>
				<v-card-title class="headline grey lighten-2">
					Please type in a name to export by:
				</v-card-title>
				<v-divider></v-divider>
				<v-container>
					<v-row align="center" justify="center">
						<v-col md="4">
							<v-text-field
								placeholder="Project Name"
								v-model="project_name"
							>
							</v-text-field>
						</v-col>
					</v-row>
				</v-container>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="primary" text @click="handleExport()">
						Export
					</v-btn>
					<v-btn
						color="primary"
						text
						@click="handleExportDialogOff()"
					>
						Cancel
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
//import Painterro from 'painterro';

export default {
	mounted() {},
	data: () => ({
		dialog: false,
		project_name: "final_project",
	}),
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
	},
	components: {},
	props: {},
	methods: {
		handleExportDialogOff() {
			this.dialog = false;
		},
		//export image inside of the file directory
		async handleExport() {
			let image_data = "";

			this.$store.dispatch("changeLoading", true);

			await this.axios
				.post(
					this.databaseLocalHost + "/createFinalExport",
					{ filename: this.project_name },
					{
						responseType: "arraybuffer",
					}
				)
				.then((response) => {
					image_data = Buffer.from(response.data, "binary").toString(
						"base64"
					);
				});
			console.log(image_data);

			var a = document.createElement("a"); //Create <a>
			a.href = "data:image/png;base64," + image_data; //Image Base64 Goes here
			a.download = "Image.png"; //File name Here
			a.click(); //Downloaded file

			this.$store.dispatch("changeLoading", false);
			this.dialog = false;
		},
	},
};
</script>

<style scoped></style>
