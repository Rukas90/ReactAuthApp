import { DispatchContext } from "./dispatch.type"

export abstract class Dispatch<TPayload = unknown> {
  abstract readonly name: string

  abstract execute(context: DispatchContext, payload: TPayload): Promise<void>
}
