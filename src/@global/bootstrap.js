import { router } from '/@nue/app-router.js'

router.configure({
  route: '/:',
  url_params: ['q', 'pb', 'z'],
  persistent_params: ['theme', 'disabled_hosts', 'resizable'],
})

router.initialize({ root: document.body })
