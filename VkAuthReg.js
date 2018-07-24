require('app-module-path').addPath(__dirname)

const openVk = require('./src/openVk')
const insertMainProfileInfo = require('./src/insertMainProfileInfo')
const getPhoneNumber = require('src/getPhoneNumber')
const GetPhoneNumberError = require('src/GetPhoneNumberError')


async function vkAutoReg(options = {}) {
  // Получение номера телефона для регистрации
  const phoneData = await getPhoneNumber(options.onlinesimKey)
  // Открываем страницу вк
  const webContext = await openVk(options.headless || false)
  // Данные пользователя
  const userData = {
    firstName: 'Константин',
    lastName: 'Иванов',
    password: Math.random().toString(20),
    birthday: [7, 10, 1994],
    ...options.userData
  }
  // Заполнение формы, получение и отправка sms кода
  const profileRegData = insertMainProfileInfo(webContext, userData, phoneData)

  // Закрываем номер
  await phoneData.getSmsCodeSuccess()

  return profileRegData
}

exports.GetPhoneNumberError = GetPhoneNumberError
exports.vkAutoReg = vkAutoReg
