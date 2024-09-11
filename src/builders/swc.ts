import { transformFile } from '@swc/core'
import { rm, mkdir, writeFile } from 'node:fs/promises'

import path from 'node:path'

import { load } from '#/utils/config.js'

import { cli } from '#/utils/store.js'

import { resolveFullImportPaths } from '#/utils/paths.js'

const baseURL = process.cwd()

const { compilerOptions } = await load()

export async function swc(filename: string) {
  const { code, map } = await transformFile(filename, {
    jsc: {
      baseUrl: process.cwd(),
      parser: {
        syntax: 'typescript',
        decorators: true
      },
      preserveAllComments: true,
      target: 'es2022',
      experimental: {
        plugins: [],
        keepImportAttributes: true,
        emitAssertForImportAttributes: true
      },
      paths: compilerOptions.paths
    },

    module: {
      type: 'es6',
      strict: true,
      noInterop: true,
      preserveImportMeta: true
    },

    sourceMaps: true,
    inputSourceMap: true
  })

  const pathname = path
    .join(
      baseURL,
      cli.destination,
      filename.slice(path.join(baseURL, 'src').length)
    )
    .replace('.ts', '.js')

  await rm(pathname, {
    force: true
  })

  await mkdir(path.dirname(pathname), { recursive: true })

  const { name, ext } = path.parse(pathname)

  await writeFile(
    pathname,
    resolveFullImportPaths(`${code}\n//# sourceMappingURL=${name}${ext}.map`)
  )

  if (map) {
    await writeFile(pathname.replace('.js', '.js.map'), map)
  }
}
