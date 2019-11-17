import { IncomingMessage, ServerResponse } from "http"

export interface Options {
  trustProxy: boolean | ((remoteAddress: string | undefined) => boolean)
}

const hostname = <I extends IncomingMessage, R extends ServerResponse>(
  innerListener: (req: I & { hostname?: string }, res: R) => void,
  options?: Partial<Options>
): ((req: I, res: R) => void) => {
  const _options: Options = { trustProxy: false, ...options }
  const trustFn =
    typeof _options.trustProxy === "function"
      ? _options.trustProxy
      : () => _options.trustProxy

  const getHostname = (req: IncomingMessage) => {
    let host = req.headers["x-forwarded-host"] as string | undefined
    if (!host || !trustFn(req.connection.remoteAddress)) {
      host = req.headers["host"]
    } else if (host.indexOf(",") !== -1) {
      // Note: X-Forwarded-Host is normally only ever a
      //       single value, but this is to be safe.
      host = host.substring(0, host.indexOf(",")).trimRight()
    }
    if (!host) return
    const offset = host[0] === "[" ? host.indexOf("]") + 1 : 0
    const index = host.indexOf(":", offset)
    return index !== -1 ? host.substring(0, index) : host
  }

  return (req, res) => {
    return innerListener(
      Object.assign(req, {
        hostname: getHostname(req)
      }),
      res
    )
  }
}

export default hostname
