import { router } from '/@nue/app-router.js'
import { keys } from '/@lib/helper.js'

router.configure({
  route: '/:',
  persistent_params: keys.split(' '),
})

router.initialize({
  root: document.body
})
