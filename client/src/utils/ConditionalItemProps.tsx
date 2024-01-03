export interface ConditionalItemProps<T> {
  value: T
  evaluateFunc: (value: T) => boolean
  conditionText: string
}
