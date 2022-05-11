import type { Router } from 'vue-router'
import { useLocalUser } from './stores/local-user'

// eslint-disable-next-line import/no-mutable-exports
let router: Router

export function setRouter(r: Router): void {
  r.beforeEach(async(to, from, next) => {
    const token = localStorage.getItem('token')

    // <---------- LOCAL_USER REFETCHING ---------->
    const localUser = useLocalUser()

    // If localUser is removed refetch him based on the token
    if (token && !localUser.user) {
      const user = await localUser.getLoggedUser()
      localUser.user = user
      localUser.token = token
    }

    // <---------- ROUTE GUARDS ---------->
    // Paths not guarded by user authentication
    const unguarded_paths = [
      '/welcome',
      '/welcome/login',
      '/welcome/register',
      '/welcome/logout',
      '/logout',
    ]

    // True if user is on a guarded path
    const is_on_guarded_path = !unguarded_paths.includes(to.path)

    // Login redirect when user is not logged
    if (!token && is_on_guarded_path)
      next('/welcome')

    // Allow logout route only when user is logged
    else if (['/logout', '/welcome/logout'].includes(to.path))
      next()

    // Preventing access to welcome pages when user is logged
    else if (token && !is_on_guarded_path)
      next('/')

    // User is logged and can access all guarded routes
    else next()
  })

  router = r
}

export { router }
