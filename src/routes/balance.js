const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const Job = require('../models/Job')
const Contract = require('../models/Contract')
const Profile = require('../models/Profile')
const { validateAmount } = require('../middleware/validators')

router.post('/deposit/:userId', validateAmount, async (req, res) => {
  try {
    const { userId } = req.params
    const { amount } = req.body

    console.log(userId, amount)

    const client = await Profile.findOne({
      where: {
        id: userId,
      },
    })

    if (!client) return res.status(404).json({ message: 'User not found' })

    const totalSumOfJobsNotPaid = await Job.sum('price', {
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
            clientId: userId,
          },
        },
      ],
    })

    if (amount > totalSumOfJobsNotPaid * 0.25)
      return res.status(400).json({ message: `You can't deposit more than 25% of your total amount of jobs to pay` })

    await client.update({
      balance: (client.balance ?? 0) + amount,
    })

    res.json(client)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
