const puppeteer = require('puppeteer')

async function getPic(headless = false) {
  const browser = await puppeteer.launch({ headless })
  const page = await browser.newPage()
  await page.goto('https://vk.com')

  return { browser, page }
}

module.exports = getPic
