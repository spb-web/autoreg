const openVk = require('./src/openVk')
const insertMainProfileInfo = require('./src/insertMainProfileInfo')


async function VkAutoReg(options = {}) {
  if (typeof options.getPhone !== 'function') {
    throw new Error('Не передан options.getPhone')
  }

  // Получение номера телефона для регистрации
  const phoneData = await options.getPhone() //await getPhoneNumber(options.onlinesimKey)
  if (typeof phoneData !== 'object' || typeof phoneData.phone !== 'string' || typeof phoneData.getSmsCode !== 'function' || typeof phoneData.setOperationSuccess !== 'function') {
    throw new Error(
      'Вызов await options.getPhone() должен был вернуть объект вида: \n' +
      '{phone:\'Номер телефона\', getSmsCode: function, setOperationSuccess: function}'
    )
  }


  // Открываем страницу вк
  const webContext = await openVk(options.puppeteerOptions || {})
  // Данные пользователя
  const userData = {
    firstName: 'Ирина',
    lastName: 'Грибоедова',
    password: Math.random().toString(20),
    birthday: [7, 10, 1994],
    gender: 'famale',
    ...options.userData
  }
  // Заполнение формы, получение и отправка sms кода
  const profileRegData = insertMainProfileInfo(webContext, userData, phoneData)

  // Закрываем номер
  await phoneData.setOperationSuccess()

  return profileRegData
}

module.exports = VkAutoReg
