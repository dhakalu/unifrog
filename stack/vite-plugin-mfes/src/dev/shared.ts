import { MfePlugin, MfePluginOptions } from '../../types'

export function devSharedPlugin(): MfePlugin {
  return {
    name: 'originjs:shared-development'
  }
}