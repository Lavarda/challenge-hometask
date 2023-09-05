const validateAmount = (req, res, next) => {
    const { amount } = req.body
    if (!amount) return res.status(400).json({ message: 'Amount is required'})
    if (typeof amount !== 'number') return res.status(400).json({ message: 'Amount must be a number'})
    if (amount < 0) return res.status(400).json({ message: 'Amount must be positive'})

    next()
}

module.exports = {
    validateAmount,
}