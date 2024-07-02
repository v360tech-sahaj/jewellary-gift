import router from '@adonisjs/core/services/router'
import GoogleSignInsController from '#controllers/google_sign_ins_controller'
import AssetsController from '#controllers/assets_controller'
import TemplatesController from '#controllers/templates_controller'
import CheckoutsController from '#controllers/checkouts_controller'

router.get('/google/sign-in', [GoogleSignInsController, 'redirect'])
router.get('/google/sign-in/callback', [GoogleSignInsController, 'handleCallback'])

router.group(() => {
  router.on('/').render('pages/home').as('home')

  router.on('/login').render('pages/login')

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
