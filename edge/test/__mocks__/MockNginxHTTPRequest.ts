export class MockNjsByteString extends String implements NjsByteString {
  constructor(private str: string) {
    super(str)
  }

  fromBytes(start?: number, end?: number): string {
    return this.substring(start, end)
  }

  fromUTF8(start: number = 0, end: number = this.length) {
    return this.substring(start, end)
  }

  toString(): string {
    return this.str
  }
}

type MockNginxHTTPRequestOpts = {
  args: NginxHTTPArgs
  headersIn: NginxHeadersIn
  headersOut: NginxHeadersOut
  httpVersion: NjsByteString
  method: NjsByteString
  remoteAddress: NjsByteString
  requestBody: NjsByteString
  responseBody: NjsByteString
  uri: NjsByteString
  variables: NginxVariables
}

export default class MockNginxHTTPRequest implements NginxHTTPRequest {
  args: NginxHTTPArgs
  headersIn: NginxHeadersIn
  headersOut: NginxHeadersOut
  httpVersion: NjsByteString
  method: NjsByteString
  parent?: NginxHTTPRequest
  remoteAddress: NjsByteString
  requestBody?: NjsByteString
  responseBody?: NjsByteString
  uri: NjsByteString
  variables: NginxVariables
  status: number

  constructor({
    args,
    headersIn,
    headersOut,
    httpVersion,
    method,
    remoteAddress,
    requestBody,
    responseBody,
    uri,
    variables,
  }: MockNginxHTTPRequestOpts) {
    this.args = args
    this.headersIn = headersIn
    this.headersOut = headersOut
    this.httpVersion = httpVersion
    this.method = method
    this.remoteAddress = remoteAddress
    this.requestBody = requestBody
    this.responseBody = responseBody
    this.uri = uri
    this.variables = variables
    // assume status is 200 when the object is created
    this.status = 200
  }

  error(message: NjsStringLike): void {
    console.error(`Error: ${message}`)
  }

  finish(): void {
    console.log('Finished sending response to client.')
  }

  internalRedirect(uri: NjsStringLike): void {
    console.log(`Internally redirected to: ${uri}`)
  }

  log(message: NjsStringLike): void {
    console.log(`Log: ${message}`)
  }

  return(status: number, body?: NjsStringLike): void {
    this.status = status
    console.log(`Response status: ${status}, body: ${body}`)
  }

  send(part: NjsStringLike): void {
    console.log(`Sending: ${part}`)
    // usually you should update the response body and headers here
  }

  sendHeader(): void {
    console.log('Sending header to client.')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async subrequest(args: any): Promise<any> {
    console.log('This function is not implemented', args)
  }

  warn(message: NjsStringLike): void {
    console.warn(`Warning: ${message}`)
  }
}
