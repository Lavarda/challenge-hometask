const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const { getProfile } = require('../middleware/getProfile')
const Job = require('../models/Job')
const Contract = require('../models/Contract')
const Profile = require('../models/Profile')
const sequelize = require('../database/sequelize')

/**
 * @returns all the jobs that are not paid
 */
router.get('/unpaid', getProfile, async (req, res) => {
  try {
    const {
      dataValues: { id: profileId },
    } = req.profile
    const jobs = await Job.findAll({
      where: {
        paid: {
          [Op.not]: true,
        },
      },
      include: [
        {
          model: Contract,
          where: {
            status: 'in_progress',
            [Op.or]: [{ clientId: profileId }, { contractorId: profileId }],
          },
        },
      ],
    })
    res.json(jobs)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
router.post('/:job_id/pay', getProfile, async (req, res) => {
  const {
    dataValues: { id: profileId },
  } = req.profile
  const { job_id } = req.params
  const job = await Job.findOne({
    where: {
      id: job_id,
      paid: {
        [Op.not]: true,
      },
    },
    include: [
      {
        model: Contract,
        where: {
          status: 'in_progress',
          [Op.or]: [{ clientId: profileId }, { contractorId: profileId }],
        },
      },
    ],
  })

  if (!job) return res.status(404).end()

  const {
    amount,
    Contract: { id: contractId },
  } = job

  const client = await Profile.findOne({
    where: {
      id: profileId,
    },
  })

  const contractor = await Profile.findOne({
    where: {
      id: contractId,
    },
  })

  if (client.balance < amount) return res.status(400).json({ message: 'Insufficient funds' })

  const transaction = await sequelize.transaction()
  try {
    await client.update(
      {
        balance: client.balance - amount,
      },
      { transaction }
    )

    await contractor.update(
      {
        balance: contractor.balance + amount,
      },
      { transaction }
    )

    await job.update(
      {
        paid: true,
      },
      { transaction }
    )

    await job.Contract.update(
      {
        status: 'terminated',
      },
      { transaction }
    )

    await transaction.commit()
    res.send(job)
  } catch (error) {
    await transaction.rollback()
    return res.status(500).json({ message: 'Transaction error updating client and contractor balance.' })
  }
})

module.exports = router
