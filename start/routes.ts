import router from '@adonisjs/core/services/router'
import GoogleSignInsController from '#controllers/google_sign_ins_controller'
import AssetsController from '#controllers/assets_controller'
import TemplatesController from '#controllers/templates_controller'
import CheckoutsController from '#controllers/checkouts_controller'
import UsersController from '#controllers/users_controller'
import SessionController from '#controllers/session_controller'
import { middleware } from './kernel.js'
import TwitterSignInsController from '#controllers/twitter_sign_ins_controller'

//register
router.get('/register', [UsersController, 'create']).as('register')
router.post('/register/store', [UsersController, 'store']).as('register.store')

// Google login
router.get('/google/sign-in', [GoogleSignInsController, 'redirect'])
router.get('/google/sign-in/callback', [GoogleSignInsController, 'handleCallback'])

// Twitter login
router.get('/twitter/sign-in', [TwitterSignInsController, 'redirect'])
router.get('/twitter/sign-in/callback', [TwitterSignInsController, 'handleCallback'])

// login with email and password
router.get('/login', [UsersController, 'login']).as('login')
router.post('/login', [SessionController, 'login']).as('login.store')

router.group(() => {
  router.get('/', [UsersController, 'home']).as('home').use(middleware.auth())

  router.get('assets/', [AssetsController, 'index']).as('assets.index')

  router.get('assets/create/:gsId', [AssetsController, 'create']).as('assets.create')
  router.post('assets/:gsId', [AssetsController, 'store']).as('assets.store')

  router.get('templates/:gsId', [TemplatesController, 'index']).as('templates.index')
  router.post('templates/:gsId', [TemplatesController, 'store']).as('templates.store')

  router.get('templates/detail/:gsId', [TemplatesController, 'detail']).as('templates.detail')
  router
    .post('templates/detail/store/:gsId', [TemplatesController, 'storeDetail'])
    .as('templates.detail.store')

  router.get('checkout/:gsId', [CheckoutsController, 'index']).as('checkout.index')
  router.post('checkout/:gsId', [CheckoutsController, 'store']).as('checkout.store')
})
