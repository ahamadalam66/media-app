const express = require('express')
const router = express.Router()

const { getOneAsset } = require('./getOneAsset')
const { getManyAsset } = require('./getManyAsset')
const { createAsset } = require('./createAsset')
const { updateAsset } = require('./updateAsset')
const { deleteOneAsset } = require('./deleteOneAsset')
const { deleteManyAsset } = require('./deleteManyAsset')

router.get('/:id', getOneAsset)
router.get('/', getManyAsset)
router.post('/', createAsset)
router.put('/', updateAsset)
router.delete('/:id', deleteOneAsset)
router.delete('/', deleteManyAsset)

module.exports = router
