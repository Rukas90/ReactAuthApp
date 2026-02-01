import { Dispatch } from "./dispatch.base"

export type DispatchContext = {
  userId: string
  verificationId: string
  createdAt: Date
}

export type DispatchData<TPayload> = {
  dispatchName: string
  dispatchPayload: TPayload
}

export type DispatchPayload<T> = T extends Dispatch<infer P> ? P : never
