const isValidDate = (value) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(value)) {
      return false
    }
    const date = new Date(value)
    return date instanceof Date && !isNaN(date)
  }

module.exports = {
    isValidDate,
}