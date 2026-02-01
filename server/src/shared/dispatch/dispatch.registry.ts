import { Dispatch } from "./dispatch.base"

class DispatchRegistry {
  private dispatches = new Map<string, Dispatch<unknown>>()

  register<TPayload>(dispatch: Dispatch<TPayload>): void {
    if (this.dispatches.has(dispatch.name)) {
      throw new Error(`Dispatch "${dispatch.name}" is already registered`)
    }
    this.dispatches.set(dispatch.name, dispatch)
  }
  getDispatch<TPayload>(name: string): Dispatch<TPayload> {
    const dispatch = this.dispatches.get(name)

    if (!dispatch) {
      throw new Error(`No dispatch registered with name: ${name}`)
    }
    return dispatch
  }
}
export const dispatchRegistry = new DispatchRegistry()
