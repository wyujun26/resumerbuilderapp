/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROXY_SERVER_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
