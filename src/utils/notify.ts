import { notify as vNotify } from '@kyvg/vue3-notification'

export default function notify (type: 'warn' | 'success' | 'error' | 'info', title: string, text?: string) {
  vNotify({
    type,
    title,
    text,
  })
}

interface ErrorType {
  message: string; 
  path: string[]; 
  extensions: { code: string }
}

export const notifyRequestErrors = (errors?: Array<ErrorType>) => {
  if (!errors || !errors.length) return

  errors.forEach(error => notify('error', error.extensions.code, error.message))
}