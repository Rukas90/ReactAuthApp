/**
 * ValidationGroupCondition Interface
 *
 * Represents a single condition within a validation group.
 * It is generic to accommodate different types of values.
 *
 * Generic Type:
 * - T: The type of the value that the condition will evaluate.
 *
 * Properties:
 * - evaluateFunc: A function that evaluates the provided value against the condition.
 *   It takes a value of type T and returns a boolean indicating whether the condition is met.
 * - conditionText: A descriptive string that represents the condition being evaluated.
 *   This is typically used for display purposes to describe the condition to the user.
 */
export interface ValidationGroupCondition<T> {
  evaluateFunc: (value: T) => boolean
  conditionText: string
}
