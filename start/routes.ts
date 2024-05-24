/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')

router.on('/login').render('pages/login')

router.on('/template').render('pages/templates')

router.on('/assets').render('pages/assets')
