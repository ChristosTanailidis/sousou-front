import { NavigationGuardWithThis } from 'vue-router'
import { Auth } from 'src/boot/custom-auth'

// todo: selida no-access isws gia tis periptwseis apo katw

const consoleOn = false

export const isLogged:NavigationGuardWithThis<undefined> = (_to, _from, next) => {
  const { hasToken, isValid } = Auth().tokenState()
  consoleOn && console.log('hasToken', hasToken)
  consoleOn && console.log('isValid', isValid)
  if (!hasToken) {
    next('/auth/login')
  } else if (hasToken && !isValid) {
    localStorage.removeItem('sousou_token')
    next('/auth/login')
  } else {
    consoleOn && console.log('Pass!')
    next()
  }
}

export const isNotLogged:NavigationGuardWithThis<undefined> = (_to, from, next) => {
  const { hasToken } = Auth().tokenState()
  consoleOn && console.log('hasToken', hasToken)
  if (hasToken) {
    next(from.fullPath)
  } else {
    consoleOn && console.log('Pass!')
    next()
  }
}
