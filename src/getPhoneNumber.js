const Onlinesim = require('node-onlinesim-api')
const sleepPromise = require('./sleepPromise')
const GetPhoneNumberError = require('./GetPhoneNumberError')


function getPhoneNumber(onlinesimKey) {
  const onlinesim = Onlinesim(onlinesimKey)

  return onlinesim.getNum('vk').then((res) => {
    if (res.response == 1) {
      return onlinesim.getState(res.tzid)
    } else {
      throw new GetPhoneNumberError(`onlinesim: ${res.response}`)
    }
  }).then(res => {
    return {
      number: res[0].number,
      getSmsCode: () => {
        return getStatus(res[0].tzid)
      },
      getSmsCodeSuccess: () => {
        return onlinesim.setOperationOk(res[0].tzid)
      }
    }
  })
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

module.exports = getPhoneNumber
