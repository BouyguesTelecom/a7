import { afterEach, describe, it, expect, vi } from 'vitest'
import expand from '../src/actions/expand'
import MockNginxHTTPRequest, { MockNginxHTTPRequestOpts } from './__mocks__/MockNginxHTTPRequest'
import * as File from '../src/helpers/File'

export type DebugActionOpts = {
  name: string
  input: MockNginxHTTPRequestOpts
  output: Partial<MockNginxHTTPRequest>
  fileContent?: string
}
export function debugAction({ name, input, output, fileContent }: DebugActionOpts) {
  const isDebug = Boolean(process.env.DEBUG_MODE)
  describe(`DEBUG_MODE: action=${name}`, () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })
    it.runIf(isDebug)('Should return something', () => {
      vi.spyOn(File, 'readFile').mockReturnValueOnce(fileContent ?? 'test')

      const httpReq = new MockNginxHTTPRequest(input)
      expand(httpReq)
      expect(httpReq).toMatchObject(output)
    })
  })
}
