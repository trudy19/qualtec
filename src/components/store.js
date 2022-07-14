import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		localHostName: process.env.VUE_APP_FRONTEND_URL, //localhost link for front end
		databaseLocalHost: process.env.VUE_APP_BACKEND_URL, //localhost link for python backend
		globalMode: "fileUpload",
		template: "", //template type chosen when exporting
		loading: false, //for loading spinner
		errorMsg: [], //error message array
		showError: false, //boolean for showing error on alert
		chipInstructionUrls: [], //image for cutting line instructions
		newChipInstructionUrls: [],
		chipInstructionSizes: [], //size of image of chip instruction
		newChipInstructionDropdown: [],
		newChipInstructionSizes: [],
		chipInstructionAdjustUrls: [],
		chipFrontUrl: "", //image for chip
		chipFrontUrlAdj: "",
		chipFrontNewImageData: "",
		chipBackNewImageData: "",
		chipFrontPaintImageUrl: "",
		chipBackPaintImageUrl: "",
		chipBackUrlAdj: "",
		showFinalEdit: false,
		chipFrontSize: [0, 0], //size of image of chip instruction
		currentEditImage: "", //edit of final image
		mapBounds: [0, 0],
		chipBackUrl: "", //image for chip
		chipCropArray: [], //for the array of cropping dimensions in ChipCrop
		chipInstructionDropdown: [{ text: "", value: "" }],
		chipInstructionAdjustDropdown: [],
		chipInstructionAdjustDropdownAdj: [],
		chipBackSize: [0, 0], //size of image of chip instructionx
		showPaintTool: false, //bool to showing the paint tool
		cuttingLineFrontJson: {}, //cutting line tool front json
		cuttingLineBackJson: {}, //for the backside
		toolSwitchFrontImg: "",
		toolSwitchBackImg: "",
		paintSwitchObj: {},
		cutting1SwitchObj: {},
		cutting2SwitchObj: {},
		jsonFront: {},
		jsonFrontFlipped: {},
		jsonBack: {},
		jsonBackFlipped: {},
		orderImageFront: "",
		orderImageFrontFlipped: "",
		orderImageBack: "",
		orderImageBackFipped: "",
		templateImage: "",
		templateImageSize: [0, 0],
		chipInstructionAdjustDropdownBack: [],
		chipInstructionAdjustDropdownAdjBack: [],
		saveJson: {},
		cuttingLineEditor1SwitchObj: {},
		cuttingLineEditor2SwitchObj: {},
		doneTransitionList: { switchview: false },
		uuid: "",
		flagSideUpload: { front: true, back: true },
		arrowCoordinates: [],
		arrowCoordinates2: [],

		layersUrlFront: {},
		layersUrlBack: {},
		loadstate: false,
		layerPaintool:"",
		
	},
	mutations: {
		// ----- misc changes -----
		changeLoading(state, load) {
			state.loading = load;
		},
		changeGlobalMode(state, mode) {
			state.globalMode = mode;
		},
		changeTemplate(state, template) {
			state.template = template;
		},
		changeMapBounds(state, sizeArr) {
			console.log(sizeArr);
			state.mapBounds = [sizeArr[1], sizeArr[0]];
		},
		changeErrorMsg(state, errorArr) {
			state.errorMsg = errorArr;
		},
		changeShowError(state, bool) {
			state.showError = bool;
		},
		changeCurrentEditImage(state, filePath) {
			state.currentEditImage = filePath;
		},
		changeShowPaintTool(state, mode) {
			state.showPaintTool = mode;
		},
		changeShowFinalEdit(state, mode) {
			state.showFinalEdit = mode;
		},
		// ----- changing chip mutations ----
		changeChipInstructionUrls(state, filePaths) {
			state.chipInstructionUrls = filePaths;
		},
		changeChipInstructionSizes(state, sizeArr) {
			state.chipInstructionSizes = sizeArr;
		},
		changeChipInstructionAdjustUrls(state, urlArr) {
			state.chipInstructionAdjustUrls = urlArr;
		},
		changeChipInstructionDropdown(state, list) {
			state.chipInstructionDropdown = list;
		},
		changeNewChipInstructionDropdown(state, list) {
			state.newChipInstructionDropdown = list;
		},
		changeNewChipInstructionSizes(state, list) {
			state.newChipInstructionSizes = list;
		},
		changeNewChipInstructionUrls(state, filePaths) {
			state.newChipInstructionUrls = filePaths;
		},
		changeChipInstructionAdjustDropdown(state, list) {
			state.chipInstructionAdjustDropdown = list;
		},
		changeChipInstructionAdjustDropdownAdj(state, list) {
			state.chipInstructionAdjustDropdownAdj = list;
		},
		changeChipInstructionAdjustDropdownBack(state, list) {
			state.chipInstructionAdjustDropdownBack = list;
		},
		changeChipInstructionAdjustDropdownAdjBack(state, list) {
			state.chipInstructionAdjustDropdownAdjBack = list;
		},
		changeDoneTransitionList(state, list) {
			state.doneTransitionList = list;
		},
		changeChipFrontUrl(state, filePath) {
			state.chipFrontUrl = filePath;
		},
		changeChipFrontUrlAdj(state, filePath) {
			state.chipFrontUrlAdj = filePath;
		},
		changeChipFrontSize(state, size) {
			state.chipFrontSize = size;
		},
		changeChipFrontNewImageData(state, data) {
			state.chipFrontNewImageData = data;
		},
		changeChipBackNewImageData(state, data) {
			state.chipBackNewImageData = data;
		},
		changeChipFrontPaintImageUrl(state, data) {
			state.chipFrontPaintImageUrl = data;
		},
		changeChipBackPaintImageUrl(state, data) {
			state.chipBackPaintImageUrl = data;
		},
		changeChipBackUrlAdj(state, filePath) {
			state.chipBackUrlAdj = filePath;
		},
		changeChipBackUrl(state, filePath) {
			state.chipBackUrl = filePath;
		},
		changeChipBackSize(state, size) {
			state.chipBackSize = size;
		},
		changeChipCropArray(state, array) {
			state.chipCropArray = array;
		},
		changeToolSwitchFrontImg(state, filepath) {
			state.toolSwitchFrontImg = filepath;
		},
		changeToolSwitchBackImg(state, filepath) {
			state.toolSwitchBackImg = filepath;
		},
		changePaintSwitchObj(state, object) {
			state.paintSwitchObj = object;
		},
		changeCutting1SwitchObj(state, object) {
			state.cutting1SwitchObj = object;
		},
		changeCutting2SwitchObj(state, object) {
			state.cutting2SwitchObj = object;
		},
		changeCuttingLineEditor1SwitchObj(state, object) {
			state.cuttingLineEditor1SwitchObj = object;
		},
		changeCuttingLineEditor2SwitchObj(state, object) {
			state.cuttingLineEditor2SwitchObj = object;
		},
		changeJsonFront(state, array) {
			state.jsonFront = array;
		},
		changeJsonFrontFlipped(state, array) {
			state.jsonFrontFlipped = array;
		},
		changeJsonBack(state, array) {
			state.jsonBack = array;
		},
		changeJsonBackFlipped(state, array) {
			state.jsonBackFlipped = array;
		},
		changeOrderImageFront(state, filename) {
			state.orderImageFront = filename;
		},
		changeOrderImageFrontFlipped(state, filename) {
			state.orderImageFrontFlipped = filename;
		},
		changeOrderImageBack(state, filename) {
			state.orderImageBack = filename;
		},
		changeOrderImageBackFipped(state, filename) {
			state.orderImageBackFipped = filename;
		},
		changeTemplateImage(state, filename) {
			state.templateImage = filename;
		},
		changeTemplateImageSize(state, array) {
			state.templateImageSize = array;
		},
		changeSaveJson(state, object) {
			state.saveJson = object;
		},
		changeUuid(state, uuid) {
			state.uuid = uuid;
		},
		changeFlagUploadSide(state, object) {
			state.flagSideUpload = object;
		},
		changeArrowCoordinates(state, array) {
			state.arrowCoordinates = array;
		},
		changeArrowCoordinates2(state, array) {
			state.arrowCoordinates2 = array;
		},
		changeLayersUrlFront(state, object) {
			state.layersUrlFront = object;
		},
		changeLayersUrlBack(state, object) {
			state.layersUrlBack = object;
		},
		changeLoadState(state, loadstate) {
			state.load = loadstate;
		},
		changeLayerpainttool(state,layerPaths){
			state.layerPaintool=layerPaths;
		}
	},
	actions: {
		// ------ misc changes ------
		changeLoading(context, load) {
			context.commit("changeLoading", load);
		},
		changeLayerpainttool(context,layerPaths){
			context.commit("changeLayerpainttool", layerPaths);
		},
		changeGlobalMode(context, mode) {
			context.commit("changeGlobalMode", mode);
		},
		changeTemplate(context, template) {
			context.commit("changeTemplate", template);
		},
		// changeTabMode(context, mode) {
		//     context.commit('changeTabMode', mode);
		// },
		changeMapBounds(context, sizeArr) {
			context.commit("changeMapBounds", sizeArr);
		},
		changeErrorMsg(context, errorArr) {
			context.commit("changeErrorMsg", errorArr);
		},
		changeShowError(context, bool) {
			context.commit("changeShowError", bool);
		},
		changeCurrentEditImage(context, filePath) {
			context.commit("changeCurrentEditImage", filePath);
		},
		changeShowPaintTool(context, mode) {
			context.commit("changeShowPaintTool", mode);
		},
		changeShowFinalEdit(context, mode) {
			context.commit("changeShowFinalEdit", mode);
		},
		// ------  changing chip data ------
		//NOTE: this takes in an array for filepaths
		changeChipInstructionUrls(context, filePaths) {
			context.commit("changeChipInstructionUrls", filePaths);
		},
		changeNewChipInstructionUrls(context, filePaths) {
			context.commit("changeNewChipInstructionUrls", filePaths);
		},
		changeChipInstructionSizes(context, sizeArr) {
			context.commit("changeChipInstructionSizes", sizeArr);
		},
		changeNewChipInstructionSizes(context, sizeArr) {
			context.commit("changeNewChipInstructionSizes", sizeArr);
		},
		changeChipInstructionAdjustUrls(context, urlArr) {
			context.commit("changeChipInstructionAdjustUrls", urlArr);
		},
		changeChipInstructionDropdown(context, list) {
			context.commit("changeChipInstructionDropdown", list);
		},
		changeNewChipInstructionDropdown(context, list) {
			context.commit("changeNewChipInstructionDropdown", list);
		},
		changeChipInstructionAdjustDropdown(context, list) {
			context.commit("changeChipInstructionAdjustDropdown", list);
		},
		changeChipInstructionAdjustDropdownAdj(context, list) {
			context.commit("changeChipInstructionAdjustDropdownAdj", list);
		},
		changeChipInstructionAdjustDropdownAdjBack(context, list) {
			context.commit("changeChipInstructionAdjustDropdownAdjBack", list);
		},
		changeDoneTransitionList(context, list) {
			context.commit("changeDoneTransitionList", list);
		},
		changeChipFrontUrl(context, filePath) {
			context.commit("changeChipFrontUrl", filePath);
		},
		changeChipFrontUrlAdj(context, filePath) {
			context.commit("changeChipFrontUrlAdj", filePath);
		},
		changeChipFrontSize(context, size) {
			context.commit("changeChipFrontSize", size);
		},
		changeChipFrontNewImageData(context, data) {
			context.commit("changeChipFrontNewImageData", data);
		},
		changeChipBackNewImageData(context, data) {
			context.commit("changeChipBackNewImageData", data);
		},
		changeChipFrontPaintImageUrl(context, data) {
			context.commit("changeChipFrontPaintImageUrl", data);
		},
		changeChipBackPaintImageUrl(context, data) {
			context.commit("changeChipBackPaintImageUrl", data);
		},
		changeChipBackUrl(context, filePath) {
			context.commit("changeChipBackUrl", filePath);
		},
		changeChipBackUrlAdj(context, filePath) {
			context.commit("changeChipBackUrlAdj", filePath);
		},
		changeChipBackSize(context, size) {
			context.commit("changeChipBackSize", size);
		},
		changeChipCropArray(context, array) {
			context.commit("changeChipCropArray", array);
		},
		changeToolSwitchFrontImg(context, filepath) {
			context.commit("changeToolSwitchFrontImg", filepath);
		},
		changeToolSwitchBackImg(context, filepath) {
			context.commit("changeToolSwitchBackImg", filepath);
		},
		changePaintSwitchObj(context, object) {
			context.commit("changePaintSwitchObj", object);
		},
		changeCutting1SwitchObj(context, object) {
			context.commit("changeCutting1SwitchObj", object);
		},
		changeCutting2SwitchObj(context, object) {
			context.commit("changeCutting2SwitchObj", object);
		},
		changeCuttingLineEditor1SwitchObj(context, object) {
			context.commit("changeCuttingLineEditor1SwitchObj", object);
		},
		changeCuttingLineEditor2SwitchObj(context, object) {
			context.commit("changeCuttingLineEditor2SwitchObj", object);
		},
		changeJsonFront(context, array) {
			context.commit("changeJsonFront", array);
		},
		changeJsonFrontFlipped(context, array) {
			context.commit("changeJsonFrontFlipped", array);
		},
		changeJsonBack(context, array) {
			context.commit("changeJsonBack", array);
		},
		changeJsonBackFlipped(context, array) {
			context.commit("changeJsonBackFlipped", array);
		},
		changeOrderImageFront(context, filename) {
			context.commit("changeOrderImageFront", filename);
		},
		changeOrderImageFrontFlipped(context, filename) {
			context.commit("changeOrderImageFrontFlipped", filename);
		},
		changeOrderImageBack(context, filename) {
			context.commit("changeOrderImageBack", filename);
		},
		changeOrderImageBackFipped(context, filename) {
			context.commit("changeOrderImageBackFipped", filename);
		},
		changeTemplateImage(context, filename) {
			context.commit("changeTemplateImage", filename);
		},
		changeTemplateImageSize(context, array) {
			context.commit("changeTemplateImageSize", array);
		},
		changeSaveJson(context, object) {
			context.commit("changeSaveJson", object);
		},
		changeUuid(context, uuid) {
			context.commit("changeUuid", uuid);
		},
		changeFlagUploadSide(context, object) {
			console.log("object", object);
			context.commit("changeFlagUploadSide", object);
		},
		changeArrowCoordinates(context, object) {
			context.commit("changeArrowCoordinates", object);
		},
		changeArrowCoordinates2(context, object) {
			context.commit("changeArrowCoordinates2", object);
		},
		changeLayersUrlFront(context, object) {
			context.commit("changeLayersUrlFront", object);
		},
		changeLayersUrlBack(context, object) {
			context.commit("changeLayersUrlBack", object);
		},
		changeLoadState(context, loadstate) {
			context.commit("changeLoadState", loadstate);
		},
	},
});
