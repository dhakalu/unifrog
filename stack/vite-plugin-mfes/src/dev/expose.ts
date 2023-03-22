import { parseExposeOptions } from '../utils'
import { parsedOptions } from '../globals'
import type { MfePlugin, MfePluginOptions } from '../../types'

export function devExposePlugin(
  options: MfePluginOptions
): MfePlugin {
  parsedOptions.devExpose = parseExposeOptions(options)

  return {
    name: 'originjs:expose-development'
  }
}