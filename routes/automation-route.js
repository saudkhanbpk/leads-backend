const express = require('express')

const router = express.Router()

const automationCtrl = require('../controllers/automation-ctrl')

router.get('/', automationCtrl.getAutomation)

module.exports = router

