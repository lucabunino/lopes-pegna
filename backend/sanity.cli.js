import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'vj46ri0x',
    dataset: 'production'
  },
  studioHost: 'lopespegna',
  deployment: {
    appId: 'yibv2jxglejgwpuakrmyd34i',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: false,
  }
})
