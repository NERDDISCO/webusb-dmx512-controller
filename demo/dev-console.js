export default class DevConsole {
  constructor() {
    this.output = document.getElementById('console')
  }

  log(message, data, type) {
    let fullMessage = ''

    switch (type) {
      case 'USBDevice':
        fullMessage = `${message}: ${data}`
        break

      case 'array':
        fullMessage = message + JSON.stringify(data)
        break

      case 'keyvalue':
        fullMessage = `${message}: ${data}`
        break

      default:
        fullMessage = message + ' ' + data
    }

    console.log(fullMessage)

    this.output.value += fullMessage + '\n'

    // Automatically scroll to the bottom
    this.output.scrollTop = this.output.scrollHeight
  }

}
