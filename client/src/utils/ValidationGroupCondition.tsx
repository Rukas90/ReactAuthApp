export interface ValidationGroupCondition<T> {
  evaluateFunc: (value: T) => boolean
  conditionText: string
}
