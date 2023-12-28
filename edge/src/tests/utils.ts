import { afterEach, describe, it, expect, vi } from 'vitest'
import actions from '../main'
import MockNginxHTTPRequest, { MockNginxHTTPRequestOpts } from './__mocks__/MockNginxHTTPRequest'

export type DebugActionOpts = {
  name: Exclude<keyof typeof actions, 'evaluators'>
  input: MockNginxHTTPRequestOpts
  output: Partial<MockNginxHTTPRequest>
  fileContent?: string
}
export function debugAction({ name, input, output }: DebugActionOpts) {
  const isDebug = Boolean(process.env.DEBUG_MODE)
  describe(`DEBUG_MODE: action=${name}`, () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })
    it.runIf(isDebug)('Should return something', () => {
      const httpReq = new MockNginxHTTPRequest(input)
      actions[name](httpReq)
      expect(httpReq).toMatchObject(output)
    })
  })
}
