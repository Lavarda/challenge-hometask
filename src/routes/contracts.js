const express = require('express')
const { getProfile } = require('../middleware/getProfile')
const Contract = require('../models/Contract')

const router = express.Router()

/**
 * @returns contract by id
 */
router.get('/:id', getProfile, async (req, res) => {
  const {
    dataValues: { id: profileId },
} = req.profile
  const { id } = req.params
  const contract = await Contract.findOne({
    where: {
        id,
        clientId: profileId,
    },
})
  if (!contract) return res.status(404).end()
  res.json(contract)
})

module.exports = router