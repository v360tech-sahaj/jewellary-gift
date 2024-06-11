import router from '@adonisjs/core/services/router'
import GoogleSignInsController from '#controllers/google_sign_ins_controller'

router.get('/google/sign-in', [GoogleSignInsController, 'redirect'])
router.get('/google/sign-in/callback', [GoogleSignInsController, 'handleCallback'])

router.group(() => {
  router.on('/').render('pages/home')

  router.on('/login').render('pages/login')

  router.on('/assets').render('pages/assets')
})
