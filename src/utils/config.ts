import { readFile } from 'node:fs/promises'
import json5 from 'json5'
import path from 'node:path'

function parser<T>(data: string) {
  const obj = json5.parse(data)
  return obj
}

export async function load(): Promise<any> {
  const baseURL = process.cwd()

  try {
    const data = await readFile(path.join(baseURL, 'tsconfig.json'), 'utf-8')
    const parsed = parser(data)

    return parsed
  } catch {}
}
