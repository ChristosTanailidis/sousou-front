import { Notify, QNotifyCreateOptions } from 'quasar'

type NotifyType = 'success' | 'error' | 'warn' | 'default'

export default (
  type = 'success' as NotifyType,
  message: string | string[],
  caption?: string,
  args?: QNotifyCreateOptions
) => {
  let obj: { color: string | undefined, icon: string | undefined }
  switch (type) {
    case 'success':
      obj = { color: 'positive', icon: 'done' }
      break
    case 'error':
      obj = { color: 'negative', icon: 'report' }
      break
    case 'warn':
      obj = { color: 'warning', icon: 'priority_high' }
      break
    default:
      obj = { color: undefined, icon: undefined }
      break
  }

  if (typeof (message) === 'string') {
    Notify.create({ ...obj, message, caption, ...args })
  } else {
    message.forEach(m => Notify.create({ ...obj, message: m, caption, ...args }))
  }
}
