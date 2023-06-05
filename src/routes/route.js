const { Router } = require('express');
const { tourPlan, findTour } = require('../controller/controller');
const router = Router()

router.post('/tour', tourPlan)
router.post('/travel', findTour)

module.exports = router