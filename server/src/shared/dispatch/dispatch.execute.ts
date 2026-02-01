import { dispatchRegistry } from "./dispatch.registry"
import { DispatchContext } from "./dispatch.type"

export const executeDispatch = async <TPayload = unknown>(
  dispatchName: string,
  context: DispatchContext,
  payload: TPayload,
): Promise<void> => {
  const dispatch = dispatchRegistry.getDispatch(dispatchName)

  if (!dispatch) {
    throw new Error(`No dispatch under name ${dispatchName}, was found.`)
  }
  await dispatch.execute(context, payload)
}
