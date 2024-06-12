import router from '@adonisjs/core/services/router'
import GoogleSignInsController from '#controllers/google_sign_ins_controller'

router.get('/google/sign-in', [GoogleSignInsController, 'redirect'])
router.get('/google/sign-in/callback', [GoogleSignInsController, 'handleCallback'])

router.group(() => {
  router.on('/').render('pages/home')

  router.on('/login').render('pages/login')

  router.on('/add-assets').render('pages/addAssets')
  router.on('/templates').render('pages/templates')
  router.on('/template-details').render('pages/templateDetails')
  router.on('/summary').render('pages/summary')
})
