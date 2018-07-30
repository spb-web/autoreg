const VkAutoReg = require('../VkAutoReg')


const Onlinesim = require('node-onlinesim-api')
const GetPhoneNumberError = require('../src/Errors/GetPhoneNumberError')
const sleepPromise = (time = 0) => new Promise((resolve, reject) => {
  setTimeout(() => resolve(), time)
})
//
// function getPhoneNumber() {
//   const onlinesim = Onlinesim(onlinesimKey)
//
//   return onlinesim.getNum('vk').then((res) => {
//     if (res.response == 1) {
//       return onlinesim.getState(res.tzid)
//     } else {
//       throw new GetPhoneNumberError(`onlinesim: ${res.response}`)
//     }
//   }).then(res => {
//     return {
//       number: res[0].number,
//       getSmsCode: () => {
//         return getStatus(res[0].tzid)
//       },
//       setOperationSuccess: () => {
//         return onlinesim.setOperationOk(res[0].tzid)
//       }
//     }
//   })
// }

async function getPhoneNumberFake() {
  return {
    phone: '+79217461921',
    getSmsCode: async () => {
      return '12345'
    },
    setOperationSuccess: async () => { }
  }
}

async function getStatus(tzid) {
  let status = null
  let resp = null

  while (status != 'TZ_NUM_ANSWER') {
    resp = await onlinesim.getState(tzid)
    status = resp[0].response

    console.log(new Date(), 'Ожидание смс кода', status)

    await sleepPromise(1000)
  }

  return resp[0].msg
}




async function start() {
  const options = {
    getPhone: getPhoneNumberFake,
    puppeteerOptions: {
      headless: false,
      args: [
       '--proxy-server=http://213.219.244.145:7951', // Or whatever the address is
      ]
    }
  }
  const userData = await VkAutoReg(options)
}

start().catch(console.error)
