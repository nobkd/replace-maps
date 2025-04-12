import { router } from '/@nue/app-router.js'

router.configure({
  route: '/:',
  persistent_params: ['theme', 'disabled_hosts', 'resizable'],
})
