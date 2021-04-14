const express = require('express')
const router = express.Router()

const { getTag } = require('./getTag')
const { createTag } = require('./createTag')
const { deleteTag } = require('./deleteTag')

router.get('/', getTag)
router.post('/', createTag)
router.delete('/:id', deleteTag)

module.exports = router
