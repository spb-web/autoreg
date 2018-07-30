const sleepPromise = require('./sleepPromise')
const debug = require('debug')('VkAutoReg')

async function selectBirthdayDay(page, value) {
  debug('Установка дня даты рождения')
  await page.click('.ij_bday .selector_dropdown')
  await sleepPromise(300)
  await page.click(`.ij_bday li:nth-child(${value + 1})`)
  await sleepPromise(300)
}

async function selectBirthdayMonth(page, value) {
  debug('Установка месяца даты рождения')
  await page.click('.ij_bmonth .selector_dropdown')
  await sleepPromise(300)
  await page.click(`.ij_bmonth li:nth-child(${value + 1})`)
  await sleepPromise(300)
}

async function selectBirthdayYear(page, value) {
  debug('Установка года даты рождения')
  await page.click('.ij_byear .selector_dropdown')
  await sleepPromise(300)
  await page.click(`.ij_byear li[val="${value}"]`)
  await sleepPromise(300)
}

async function selectGender(page, value) {
  debug('Установка пола даты рождения')
  const index = value === 'male' ? 3 : 2

  await page.click(`#ij_sex_row .radiobtn:nth-child(${ index })`)
  await sleepPromise(300)
}

async function insertPhoneAndPassword(page, phoneData, password) {
  debug('Ввод номера телефона')
  await page.type('#join_phone', phoneData.phone.replace('+7', ''))
  await sleepPromise(300)
  debug('Установка галочки принятия правил')
  await page.click('#join_accept_terms_checkbox .checkbox')
  await sleepPromise(300)
  debug('Нажимаем "Получить код"')
  await page.click('#join_send_phone')

  // Тут нужна проверка не заблокирован ли номер телефона
  debug('Ожиание отправки смс сервером')
  await page.waitForSelector('#join_code')
  await sleepPromise(5000)
  debug('Ожиание получения смс')
  const smsCode = await phoneData.getSmsCode()
  debug('Код получен: ' + smsCode)
  debug('Вводим код')
  await page.type('#join_code', smsCode)

  await sleepPromise(300)
  debug('отправляем полученный код')
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
 const {
   firstName='Саша',
   lastName='Иванов',
   birthday=[7, 10, 1995],
   password,
   gender
 } = profileInfo


  await webContext.page.type('#ij_first_name', firstName)
  await webContext.page.type('#ij_last_name', lastName)

  await selectBirthdayDay(webContext.page, birthday[0])
  await selectBirthdayMonth(webContext.page, birthday[1])
  await selectBirthdayYear(webContext.page, birthday[2])
  //await selectGender(webContext.page, gender)

  await webContext.page.click('#ij_submit')
  await webContext.page.waitForSelector('#join_phone')

  let profileRegData = await insertPhoneAndPassword(webContext.page, phoneData, password)

  return profileRegData
}

module.exports = insertMainProfileInfo
