// 1
import functions  from '../functions'
import { beforeEach } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

// 2
// beforeEach(() => {
//   mockReset(functions)
// })

// 3
const mockFunctions = mockDeep<functions>()
export default mockFunctions
