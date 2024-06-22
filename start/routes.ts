import router from '@adonisjs/core/services/router'
import GoogleSignInsController from '#controllers/google_sign_ins_controller'
import AssetsController from '#controllers/assets_controller'
import TemplatesController from '#controllers/templates_controller'
import TemplateDetailsController from '#controllers/template_details_controller'
import CheckoutsController from '#controllers/checkouts_controller'

router.get('/google/sign-in', [GoogleSignInsController, 'redirect'])
router.get('/google/sign-in/callback', [GoogleSignInsController, 'handleCallback'])

router.group(() => {
  router.on('/').render('pages/home').as('home')

  router.on('/login').render('pages/login')

  router.get('assets/', [AssetsController, 'index']).as('assets.index')
  router.post('assets/:giftSession/', [AssetsController, 'store']).as('assets.store')

  router.get('templates/', [TemplatesController, 'index']).as('templates.index')
  router.post('templates/:giftSession', [TemplatesController, 'store']).as('templates.store')

  router
    .get('templates_details/', [TemplateDetailsController, 'index'])
    .as('templates_details.index')
  router
    .post('templates_details/:giftSession', [TemplateDetailsController, 'store'])
    .as('templates_details.store')

  router.get('checkout/', [CheckoutsController, 'index']).as('checkout.index')
  router.post('checkout/:giftSession', [CheckoutsController, 'store']).as('checkout.store')

  // router.resource('assets', AssetsController)
  // router.resource('templates', TemplatesController)
  // router.resource('templates_details', TemplateDetailsController)
  // router.resource('checkout', CheckoutsController)
})
