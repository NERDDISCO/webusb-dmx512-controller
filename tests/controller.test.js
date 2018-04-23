import Controller from '../controller.js'

test('Use controller with default arguments', () => {
  const controller = new Controller()

  // Device not defined
  expect(controller.device).toBe(undefined)

  // Universe is an array with 512 values
  expect(Array.isArray(controller.universe)).toBe(true)
  expect(controller.universe.length).toBe(512)

  // Filters is an array with 7 filtered devices
  expect(Array.isArray(controller.filters)).toBe(true)
  expect(controller.filters.length).toBe(7)
})



test('Use controller with custom arguments (device, universe and filters)', () => {
  const controller = new Controller({
    filters: [],
    universe: new Array(512).fill(1),
    device: {}
  })

  expect(controller.filters).toEqual([])
  expect(controller.universe[0]).toEqual(1)
  expect(controller.device).toEqual({})
})



test('Arduino Leonardo is allowed', () => {
  const controller = new Controller()

  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2341, productId: 0x8036 })
  )
  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2341, productId: 0x0036 })
  )
  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2a03, productId: 0x8036 })
  )
  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2a03, productId: 0x0036 })
  )
})



test('Arduino Leonardo ETH is allowed', () => {
  const controller = new Controller()

  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2a03, productId: 0x0040 })
  )
  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2a03, productId: 0x8040 })
  )
})



test('Seeeduino Lite is allowed', () => {
  const controller = new Controller()

  expect(controller.filters).toContainEqual(
    expect.objectContaining({ vendorId: 0x2886, productId: 0x8002 })
  )
})
