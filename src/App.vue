<template>
	<v-app>
		<v-main>
			<ChipError> </ChipError>

			<ChipOverlay />
			<ChipAppBar />
			<!-- <router-view/> -->
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script>
import ChipAppBar from "./components/app_bar/ChipAppBar";
import ChipError from "./components/ChipError.vue";
import ChipOverlay from "./components/ChipOverlay";

export default {
	name: "App",
	mounted() {
		this.waitForServerResponse();
	},
	components: {
		ChipAppBar,
		ChipOverlay,
		ChipError,
	},
	computed: {
		chipFrontUrl() {
			return this.$store.state.chipFrontUrl;
		},
		databaseLocalHost() {
			return this.$store.state.databaseLocalHost;
		},
	},
	data: () => ({
		async waitForServerResponse() {
			this.$store.dispatch("changeLoading", true);
			let isLoaded = false;
			while (!isLoaded) {
				await new Promise((r) => setTimeout(r, 2000));
				await this.axios
					.get(this.databaseLocalHost + "/")
					.then((response) => {
						console.log(response);
						isLoaded = true;
					})
					.catch((error) => {
						console.log(error);
					});
			}
			this.$store.dispatch("changeLoading", false);
		},
	}),
};
</script>
