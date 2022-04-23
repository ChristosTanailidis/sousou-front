import { Router } from 'vue-router'
import { useLocalUser } from './stores/local-user'
import jwt_decode from 'jwt-decode'
import User from './assets/entities/user'

let router: Router

export function setRouter(r: Router): void {
  
  r.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token')
        
    // <---------- LOCAL_USER REFETCHING ---------->
    const localUser = useLocalUser()
  
    // If localUser is removed refetch him based on the token
    if (token && !localUser.user) {
      const jwtUser = (jwt_decode(token) as User)
      const user = await localUser.getUserByID(jwtUser.id)
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
    if (!token && is_on_guarded_path) { 
      next('/welcome')
    } 
    // Preventing access to welcome pages when user is logged
    else if (token && !is_on_guarded_path) { 
      next('/')
    } 
    // User is logged and can access all guarded routes
    else { 
      next()
    }
  })

  router = r
}


export { router }