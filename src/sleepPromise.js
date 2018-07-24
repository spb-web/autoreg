module.exports = (time = 0) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(), time)
})
