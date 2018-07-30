const puppeteer = require('puppeteer')
const { URL } = require('url')

async function getPic(puppeteerOptions) {
  const browser = await puppeteer.launch(puppeteerOptions)
  const page = await browser.newPage()
  await page.authenticate({username: 'rp3080718', password: 's0rkSutjye'})
  await page.goto('https://vk.com')
  page.on('request', interceptedRequest => {
    const myURL = new URL(interceptedRequest.url)

    if (myURL.host + myURL.pathname === 'www.google.com/recaptcha/api2/reload') {
      console.log('eeeeeeeeeeeboy!', myURL.searchParams)
    }


    //interceptedRequest.continue();
  })

  return { browser, page }
}

module.exports = getPic
