const sleepPromise = require('./sleepPromise')

async function selectBirthdayDay(page, value) {
  await page.click('.ij_bday .selector_dropdown')
  await sleepPromise(300)
  await page.click(`.ij_bday li:nth-child(${value + 1})`)
  await sleepPromise(300)
}

async function selectBirthdayMonth(page, value) {
  await page.click('.ij_bmonth .selector_dropdown')
  await sleepPromise(300)
  await page.click(`.ij_bmonth li:nth-child(${value + 1})`)
  await sleepPromise(300)
}

async function selectBirthdayYear(page, value) {
  await page.click('.ij_byear .selector_dropdown')
  await sleepPromise(300)
  await page.click(`.ij_byear li[val="${value}"]`)
  await sleepPromise(300)
}

async function insertPhoneAndPassword(page, phoneData, password) {
  await page.type('#join_phone', phoneData.phone.replace('+7', ''))
  await sleepPromise(300)
  await page.click('#join_send_phone')

  // Тут нужна проверка не заблокирован ли номер телефона

  await page.waitForSelector('#join_code')
  await page.type('#join_code', await phoneData.getSmsCode())
  await sleepPromise(300)
  await page.click('#join_send_code')

  await sleepPromise(5000)
  await page.waitForSelector('#join_code')
  await page.type('#join_pass', password)
  await sleepPromise(300)
  await page.click('#join_send_pass')

  // Тут проверка на переход к профилю
  await page.waitForSelector('#l_pr a')
  const id = await page.$eval('#l_pr a', e => e.href.replace(/^\/?id/, ''))

  return { id, login: phoneData.phone, password }
}


async function insertMainProfileInfo(webContext, profileInfo={}, phoneData) {
 const { firstName='Иван', lastName='Иванов', birthday=[7, 10, 1995], password } = profileInfo


  await webContext.page.type('#ij_first_name', firstName)
  await webContext.page.type('#ij_last_name', lastName)

  await selectBirthdayDay(webContext.page, birthday[0])
  await selectBirthdayMonth(webContext.page, birthday[1])
  await selectBirthdayYear(webContext.page, birthday[2])

  await webContext.page.click('#ij_submit')
  await webContext.page.waitForSelector('#join_phone')

  let profileRegData = await insertPhoneAndPassword(webContext.page, phoneData, password)

  return profileRegData
}

module.exports = insertMainProfileInfo
