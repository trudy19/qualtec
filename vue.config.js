module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    devServer: {
      watchOptions: {
        ignored: [/node_modules/, /public/],
      },
      // entry: {
      //   app: [
      //    './src/main.js'
      //   ]
      // },
    },
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        "nsis": {
          "deleteAppDataOnUninstall": true,
          "oneClick": false,
          "include": "nsis/installer.nsh",
        },
        "files": [
          "**/*"
        ],
        // "extraFiles": [
        //   {
        //     "from": "dist_python/",
        //     "to": "dist_python",
        //     "filter": ["**/*"]
        //   },
        // ]
        "extraResources": [
          "dist_python/"
        ]
        
        // "directories": {
        //   "buildResources":
        // },
        // productName: "my-application",
        // appId: "com.sample.myapplication",
        // win: {
        //   icon: 'src/assets/app.ico',
        //   target: [
        //     {
        //       target: 'zip', // 'zip', 'nsis', 'portable'
        //       arch: ['x64'] // 'x64', 'ia32'
        //     }
        //   ]
        // }
      }
    }
  }
}
