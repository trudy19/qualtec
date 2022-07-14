import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../components/store';
import ChipCuttingLine from '../components/chip_cutting/ChipCuttingLine';
import ChipFileUploadScreen from '../components/file_upload/ChipFileUploadScreen';
import ChipCropScreen from '../components/cropping/ChipCropScreen';
import ChipPointSelectionScreen from '../components/point_selection/ChipPointSelectionScreen';
import ChipPaintToolScreen from '../components/paint_tool/ChipPaintToolScreen';
import ChipCuttingLineEditor from '../components/cutting_line_editor/ChipCuttingLineEditor';
import ChipTemplateSelectionScreen from '../components/template_selection/ChipTemplateSelectionScreen';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/file_upload'
  },
  {
    path: '/file_upload',
    name: 'FileUpload',
    component: ChipFileUploadScreen
  },
  {
    path: '/test_cutting',
    name: 'TestCutting',
    component: ChipCuttingLine
  },
  {
    path: '/crop',
    name: 'Crop',
    component: ChipCropScreen,
    beforeEnter: (to, from, next) => {
      console.log(to);
      if(store.state.chipFrontUrl !== ""
          && store.state.chipFrontSize !== 0
          && store.state.chipBackUrl !== ""
          && store.state.chipBackSize !== 0
          && (from.name === "FileUpload" || from.name === "PointSelection")) {
        next();
      }
      else {
        console.log(from.name);
        if(from.name !== "FileUpload") {
          next({name: "FileUpload"});
        } else {
          next(false);
        }
      }
    },
  },
  {
    path: '/point_selection',
    name: 'PointSelection',
    component: ChipPointSelectionScreen,
    beforeEnter: (to, from, next) => {
      console.log(to);
      console.log(store.state.newChipInstructionUrls)
      if(store.state.newChipInstructionUrls?.length===0&&from.name === "Crop"){
        console.log('step1')
        next({name: "TemplateSelection"});
      }
      else if(store.state.newChipInstructionUrls !== ""
          && store.state.newChipInstructionSizes !== 0
          && store.state.newChipInstructionDropdown.length > 0
          && from.name === "Crop") {
            console.log('step2')
        next();
      }
      else {
        console.log(from.name);
        if(from.name !== "FileUpload") {
          next({name: "FileUpload"});
        } else {
          next(false);
        }
      }
    },
  },
  {
    path: '/paint_tool',
    name: 'PaintTool',
    component: ChipPaintToolScreen,
    beforeEnter: (to, from, next) => {
      console.log(to);
      console.log(from.name);
      if((from.name === "CuttingLineEditor" || from.name === "FileUpload"|| from.name === "CuttingLine")) {
        next();
      }
      else {
        console.log(from.name);
        if(from.name !== "FileUpload") {
          next({name: "FileUpload"});
        } else {
          next(false);
        }
      }
    },
  },
  {
    path: '/chip_cutting',
    name: 'CuttingLine',
    component: ChipCuttingLine,
    beforeEnter: (to, from, next) => {
      // console.log(to);
      // if(store.state.chipFrontNewImageData !== "") {
      //   next();
      // }
      // else {
      //   console.log(from.name);
      //   if(from.name !== "FileUpload") {
      //     next({name: "FileUpload"});
      //   } else {
      //     next(false);
      //   }
      // }
      console.log(to, from);
      next();
    },
  },
  {
    path: '/cutting_line_editor',
    name: 'CuttingLineEditor',
    component: ChipCuttingLineEditor,
    beforeEnter: (to, from, next) => {
      // console.log(to);
      // if(store.state.chipFrontNewImageData !== "") {
      //   next();
      // }
      // else {
      //   console.log(from.name);
      //   if(from.name !== "FileUpload") {
      //     next({name: "FileUpload"});
      //   } else {
      //     next(false);
      //   }
      // }
      console.log(to, from);
      next();
    },
  },
  {
    path: '/template_selection',
    name: 'TemplateSelection',
    component: ChipTemplateSelectionScreen,
    beforeEnter: (to, from, next) => {
      console.log(to, from);
      next();
    },
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
})

export default router
