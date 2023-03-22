import type {
    ConfigEnv,
    Plugin,
    UserConfig,
    ViteDevServer,
    ResolvedConfig
  } from 'vite'
  import virtual from '@rollup/plugin-virtual'
  import { dirname } from 'path'
  import { prodRemotePlugin } from './prod/remote'
  import { builderInfo, DEFAULT_ENTRY_FILENAME, parsedOptions } from './globals'
  import type { ModuleInfo } from 'rollup'
  import { prodSharedPlugin } from './prod/shared'
  import { prodExposePlugin } from './prod/expose'
  import { devSharedPlugin } from './dev/shared'
  import { devRemotePlugin } from './dev/remote'
  import { devExposePlugin } from './dev/expose'
import { MfePlugin, MfePluginOptions } from '../types'
  
  export default function federation(
    options: MfePluginOptions
  ): MfePlugin {
    options.filename = options.filename
      ? options.filename
      : DEFAULT_ENTRY_FILENAME
  
    let pluginList: MfePlugin[] = []
    let virtualMod
    let registerCount = 0
  
    function registerPlugins(mode: string, command: string) {
      if (mode === 'development' || command === 'serve') {
        pluginList = [
          devSharedPlugin(options),
          devExposePlugin(options),
          devRemotePlugin(options)
        ]
      } else if (mode === 'production' || command === 'build') {
        pluginList = [
          prodSharedPlugin(options),
          prodExposePlugin(options),
          prodRemotePlugin(options)
        ]
      } else {
        pluginList = []
      }
      builderInfo.isHost = !!(
        parsedOptions.prodRemote.length || parsedOptions.devRemote.length
      )
      builderInfo.isRemote = !!(
        parsedOptions.prodExpose.length || parsedOptions.devExpose.length
      )
      builderInfo.isShared = !!(
        parsedOptions.prodShared.length || parsedOptions.devShared.length
      )
  
      let virtualFiles = {}
      pluginList.forEach((plugin) => {
        if (plugin.virtualFile) {
          virtualFiles = Object.assign(virtualFiles, plugin.virtualFile)
        }
      })
      virtualMod = virtual(virtualFiles)
    }
  
    return {
      name: 'originjs:federation',
      // for scenario vite.config.js build.cssCodeSplit: false
      // vite:css-post plugin will summarize all the styles in the style.xxxxxx.css file
      // so, this plugin need run after vite:css-post in post plugin list
      enforce: 'post',
      // apply:'build',
      options(_options) {
        // rollup doesnt has options.mode and options.command
        if (!registerCount++) {
          registerPlugins((options.mode = options.mode ?? 'production'), '')
        }
  
        if (typeof _options.input === 'string') {
          _options.input = { index: _options.input }
        }
        _options.external = _options.external || []
        if (!Array.isArray(_options.external)) {
          _options.external = [_options.external as string]
        }
        for (const pluginHook of pluginList) {
          pluginHook.options?.call(this, _options)
        }
        return _options
      },
      config(config: UserConfig, env: ConfigEnv) {
        options.mode = env.mode
        registerPlugins(options.mode, env.command)
        registerCount++
        for (const pluginHook of pluginList) {
          pluginHook.config?.call(this, config, env)
        }
  
        // only run when builder is vite,rollup doesnt has hook named `config`
        builderInfo.builder = 'vite'
        builderInfo.assetsDir = config?.build?.assetsDir ?? 'assets'
      },
      configureServer(server: ViteDevServer) {
        for (const pluginHook of pluginList) {
          pluginHook.configureServer?.call(this, server)
        }
      },
      configResolved(config: ResolvedConfig) {
        for (const pluginHook of pluginList) {
          pluginHook.configResolved?.call(this, config)
        }
      },
      buildStart(inputOptions) {
        for (const pluginHook of pluginList) {
          pluginHook.buildStart?.call(this, inputOptions)
        }
      },
  
      async resolveId(...args) {
        const v = virtualMod.resolveId.call(this, ...args)
        if (v) {
          return v
        }
        if (args[0] === '\0virtual:__federation_fn_import') {
          return {
            id: '\0virtual:__federation_fn_import',
            moduleSideEffects: true
          }
        }
        if (args[0] === '__federation_fn_satisfy') {
          const federationId = (
            await this.resolve('@originjs/vite-plugin-federation')
          )?.id
          return await this.resolve(`${dirname(federationId!)}/satisfy.mjs`)
        }
        return null
      },
  
      load(...args) {
        const v = virtualMod.load.call(this, ...args)
        if (v) {
          return v
        }
        return null
      },
  
      transform(code: string, id: string) {
        for (const pluginHook of pluginList) {
          const result = pluginHook.transform?.call(this, code, id)
          if (result) {
            return result
          }
        }
        return code
      },
      moduleParsed(moduleInfo: ModuleInfo): void {
        for (const pluginHook of pluginList) {
          pluginHook.moduleParsed?.call(this, moduleInfo)
        }
      },
  
      outputOptions(outputOptions) {
        for (const pluginHook of pluginList) {
          pluginHook.outputOptions?.call(this, outputOptions)
        }
        return outputOptions
      },
  
      renderChunk(code, chunkInfo, _options) {
        for (const pluginHook of pluginList) {
          const result = pluginHook.renderChunk?.call(
            this,
            code,
            chunkInfo,
            _options
          )
          if (result) {
            return result
          }
        }
        return null
      },
  
      generateBundle: function (_options, bundle, isWrite) {
        for (const pluginHook of pluginList) {
          pluginHook.generateBundle?.call(this, _options, bundle, isWrite)
        }
      }
    }
  }