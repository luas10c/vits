export const pids = new Set<number>()

export const cli = {
  watch: false,
  ignores: [
    /^\..+|node_modules|dist|tests|__tests__/i,
    /^.+\.config\.(?:js|ts)$/i,
    /.+\.(?:test|spec)\.(?:js|ts)$/i
  ],
  entrypoint: [] as string[],
  nodeArgs: [] as string[],
  destination: 'dist'
}
