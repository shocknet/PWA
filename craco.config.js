// https://github.com/welldone-software/why-did-you-render/issues/174#issuecomment-773901530
module.exports = {
  plugins: [
    {
      plugin: require("craco-plugin-scoped-css")
    }
  ],
  babel: {
    loaderOptions: babelLoaderOptions => {
      const origBabelPresetCRAIndex = babelLoaderOptions.presets.findIndex(
        preset => {
          return preset[0].includes("babel-preset-react-app");
        }
      );

      const origBabelPresetCRA =
        babelLoaderOptions.presets[origBabelPresetCRAIndex];

      babelLoaderOptions.presets[
        origBabelPresetCRAIndex
      ] = function overriddenPresetCRA(api, opts, env) {
        const babelPresetCRAResult = require(origBabelPresetCRA[0])(
          api,
          origBabelPresetCRA[1],
          env
        );

        babelPresetCRAResult.presets.forEach(preset => {
          // detect @babel/preset-react with {development: true, runtime: 'automatic'}
          const isReactPreset =
            preset?.[1]?.runtime === "automatic" &&
            preset?.[1]?.development === true;
          if (isReactPreset) {
            preset[1].importSource = "@welldone-software/why-did-you-render";
          }
        });

        return babelPresetCRAResult;
      };

      return babelLoaderOptions;
    }
  }
};
