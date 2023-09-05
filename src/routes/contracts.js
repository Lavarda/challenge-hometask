const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const { getProfile } = require('../middleware/getProfile')
const Contract = require('../models/Contract')

/**
 * @returns all contracts from the profile
 */
router.get('/', getProfile, async (req, res) => {
  const {
      dataValues: { id: profileId },
  } = req.profile
  const contracts = await Contract.findAll({
      where: {
          status: {
              [Op.not]: 'terminated',
          },
          [Op.or]: [{ clientId: profileId }, { contractorId: profileId }],
      },
  })
  res.json(contracts)
})


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