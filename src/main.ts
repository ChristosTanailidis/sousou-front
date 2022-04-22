// register vue composition api globally
import { ViteSSG } from 'vite-ssg'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'

// windicss layers
import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
// your custom styles here
import './styles/main.css'
// windicss utilities should be the last style import
import 'virtual:windi-utilities.css'
// windicss devtools support (dev only)
import 'virtual:windi-devtools'

// My imports
import { useLocalUser } from './stores/local-user'
import User from './assets/entities/user'
import jwt_decode from 'jwt-decode'

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.globEager('./modules/*.ts')).forEach(i => i.install?.(ctx))

    ctx.router.beforeEach(async (to, _from, next) => {
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
        '/welcome/register'
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
  },
  
)

