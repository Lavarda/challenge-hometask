const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const sequelize = require('../database/sequelize')
const Contract = require('../models/Contract')
const Profile = require('../models/Profile')
const Job = require('../models/Job')
const { validateDates } = require('../middleware/validators')

router.get('/best-profession', validateDates, async (req, res) => {
  try {
    const { start, end } = req.query

    const professionEarnings = await Profile.findOne({
      subQuery: false,
      attributes: [
        'profession',
        [
          sequelize.fn('SUM', sequelize.col('Contractor.Jobs.price')),
          'professionEarning',
        ],
      ],
      include: [
        {
          model: Contract,
          as: 'Contractor',
          attributes: [],
          include: [
            {
              model: Job,
              attributes: [],
              where: {
                paid: true,
                paymentDate: {
                  [Op.between]: [start, end],
                },
              },
            },
          ],
        },
      ],
      group: ['profession'],
      where: {
        type: 'contractor',
      },
      having: sequelize.where(sequelize.literal('professionEarning'), '>', 0),
      order: [[sequelize.literal('professionEarning'), 'DESC']],
    })

    if (!professionEarnings) return res.status(404).json({ message: 'No jobs found for this profession' })

    return res.json({ profession: professionEarnings.profession, totalEarned: professionEarnings.get('professionEarning') ?? 0 })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/best-clients', validateDates, async (req, res) => {
    try {
        const { start, end, limit } = req.query
    
        const queryLimit = parseInt(limit) || 2
    
        const totalEarnedByClient = await Profile.findOne({
            subQuery: false,
            attributes: [
                ['id', 'id'],
                [
                    sequelize.fn('SUM', sequelize.col('Client.Jobs.price')),
                    'paid'
                ],
                [
                    sequelize.literal("firstName || ' ' || lastName"),
                    'fullName'
                ]
            ],
            include: [
                {
                    model: Contract,
                    as: 'Client',
                    attributes: [],
                    include: [
                        {
                            model: Job,
                            attributes: [],
                            where: {
                                paid: true,
                                paymentDate: {
                                    [Op.between]: [start, end],
                                },
                            },
                        },
                    ],
                },
            ],
            group: ['Profile.id'],
            where: {
                type: 'client',
            },
            having: sequelize.where(sequelize.literal('paid'), '>', 0),
            order: [[sequelize.literal('paid'), 'DESC']],
            limit: queryLimit,
        })
    
        if (!totalEarnedByClient) return res.status(404).json({ message: 'No jobs found for this client' })
    
        return res.json(totalEarnedByClient)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
})

module.exports = router