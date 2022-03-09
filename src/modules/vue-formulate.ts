import VueFormulate from '@braid/vue-formulate'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
  app.use(VueFormulate.default)
}
