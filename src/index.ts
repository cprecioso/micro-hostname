import { IncomingMessage, ServerResponse } from "http"
import { getHost } from "micro-host"

type TrustFn = (remoteAddress: string | undefined) => boolean

export interface Options {
  trustProxy: boolean | TrustFn
}

export const getHostname = (
  trustFn: TrustFn,
  req: IncomingMessage
): string | undefined => {
  const host = getHost(trustFn, req)
  if (!host) return
  const offset = host[0] === "[" ? host.indexOf("]") + 1 : 0
  const index = host.indexOf(":", offset)
  const hostname = index !== -1 ? host.substring(0, index) : host
  return hostname
}

const hostname = <I extends IncomingMessage, R extends ServerResponse>(
  innerListener: (req: I & { hostname?: string }, res: R) => Promise<void>,
  options?: Partial<Options>
): ((req: I, res: R) => Promise<void>) => {
  const _options: Options = { trustProxy: false, ...options }
  const trustFn =
    typeof _options.trustProxy === "function"
      ? _options.trustProxy
      : ((() => _options.trustProxy) as TrustFn)
  const _getHostname = getHostname.bind(null, trustFn)

  return (req, res) =>
    innerListener(Object.assign(req, { hostname: _getHostname(req) }), res)
}

export default hostname
