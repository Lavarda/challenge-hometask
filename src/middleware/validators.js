const { isValidDate } = require('../utils/validations')

const validateAmount = (req, res, next) => {
  const { amount } = req.body
  if (!amount) return res.status(400).json({ message: 'Amount is required' })
  if (typeof amount !== 'number') return res.status(400).json({ message: 'Amount must be a number' })
  if (amount < 0) return res.status(400).json({ message: 'Amount must be positive' })

  next()
}

const validateDates = (req, res, next) => {
  const { start, end } = req.query

  if (!start) return res.status(400).json({ message: 'start date is required' })
  if (!end) return res.status(400).json({ message: 'end date is required' })

  if (!isValidDate(start) || !isValidDate(end))
    return res.status(400).json({ message: 'start and end must follow the format YYYY-MM-DD' })

  next()
}

module.exports = {
  validateAmount,
  validateDates,
}
