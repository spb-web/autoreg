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

/**
Зареганные аки
79163197819 12qwaszx
79154416099 12qwaszx

9153048652 https://vk.com/id467471772
- 9161417984
9851606409 https://vk.com/id467472027  Петр Ершев
9154081677

{ phone: '+79858443927',
  pass: '12qwaszx',
  id: 'https://vk.com/id467501831' }


{ phone: '+79167019826',
pass: '12qwaszx',
id: 'https://vk.com/id467509515' }



{ phone: '+79168086251',
  pass: '12qwaszx',
  id: 'https://vk.com/id467507766' }

*/
