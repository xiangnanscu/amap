import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

import { VueRouterAutoImports } from "unplugin-vue-router";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import VueRouter from "unplugin-vue-router/vite";

import { config } from "dotenv";

const { parsed: DOTENV } = config({ processEnv: {} });
// https://vitejs.dev/config/
export default defineConfig({
  base: "/amap/",
  define: Object.fromEntries(
    Object.entries(DOTENV || {}).map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)]),
  ),
  plugins: [
    // https://github.com/unplugin/unplugin-vue-components?tab=readme-ov-file#configuration
    Components({
      dirs: ["./components", "./src/components", "./src/localComponents"],
      extensions: ["vue"],
      dts: "./src/unplugin/components.d.ts",
      directoryAsNamespace: true,
      collapseSamePrefixes: true,
      resolvers: [
        // AntDesignVueResolver({ resolveIcons: true }),
        // PrimeVueResolver()
      ],
    }),
    // https://uvr.esm.is/guide/configuration.html
    // https://uvr.esm.is/introduction.html#from-scratch
    VueRouter({
      // Folder(s) to scan for vue components and generate routes. Can be a string, or
      // an object, or an array of those.
      routesFolder: ["./views"],
      // allowed extensions to be considered as routes
      extensions: [".vue"],
      // list of glob files to exclude from the routes generation
      // e.g. ['**/__*'] will exclude all files starting with `__`
      // e.g. ['**/__*/**/*'] will exclude all files within folders starting with `__`
      exclude: [],
      dts: "./src/unplugin/typed-router.d.ts",
      getRouteName: (arg: any) => arg.value.rawSegment,
      routeBlockLang: "json5",
      importMode: process.env.NODE_ENV === "production" ? "sync" : "async",
    }),
    vue(),
    vueJsx(),
    // https://github.com/unplugin/unplugin-auto-import?tab=readme-ov-file#configuration
    AutoImport({
      defaultExportByFilename: true,
      eslintrc: {
        enabled: true, // Default `false`
        filepath: "./src/unplugin/.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      imports: ["vue", VueRouterAutoImports, { "vue-router/auto": ["useLink"] }, "@vueuse/core"],
      dts: "./src/unplugin/auto-imports.d.ts",
      vueTemplate: true,
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
      ],
      dirs: [
        "./components", // only root modules
        "./composables", // only root modules
        "./globals",
        "./src/components", // only root modules
        "./src/composables", // only root modules
        "./src/globals",
        "./src/store/**", // all nested modules
      ],
    }),
  ],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
