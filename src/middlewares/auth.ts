import { NavigationGuardWithThis } from 'vue-router'
import { Auth } from 'src/boot/custom-auth'

// todo: selida no-access isws gia tis periptwseis apo katw

export const isLogged:NavigationGuardWithThis<undefined> = (_to, _from, next) => {
  const { hasToken, isValid } = Auth().tokenState()
  console.log('hasToken', hasToken)
  console.log('isValid', isValid)
  if (!hasToken) {
    next('/auth/login')
  } else if (hasToken && !isValid) {
    next('/auth/logout')
  } else {
    console.log('Pass!')
    next()
  }
}

export const isNotLogged:NavigationGuardWithThis<undefined> = (_to, from, next) => {
  const { hasToken } = Auth().tokenState()
  console.log('hasToken', hasToken)
  if (hasToken) {
    next(from.fullPath)
  } else {
    console.log('Pass!')
    next()
  }
}
