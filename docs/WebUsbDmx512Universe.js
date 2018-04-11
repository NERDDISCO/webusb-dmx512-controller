export default class WebUsbDmx512Universe {
  constructor(args) {
    this.universe = args.universe || new Array(512).fill(0)
  }

  update(channel, value) {
    return new Promise((resolve, reject) => {

      // The array starts at 0, but the DMX512 channel with 1
      channel = channel - 1

      if (Number.isInteger(value)) {
        this.universe.splice(channel, 1, value)
      } else if (Array.isArray(value)) {
        this.universe.splice(channel, value.length, ...value)
      } else {
        return reject(new Error('Could not update channel because value is not of type Integer or Array'))
      }

      return resolve(this.universe)

    })
  }

}
