/**
 * ConditionalItemProps Interface
 *
 * Describes the properties for a ConditionalItem component.
 * This interface is generic to support various types of values.
 *
 * Generic Type:
 * - T: The type of the value that will be evaluated against the condition.
 *
 * Properties:
 * - value: The actual value to be evaluated.
 * - evaluateFunc: A function that takes the value and returns a boolean
 *   indicating whether the value meets a specific condition.
 * - conditionText: A descriptive text or label associated with the condition.
 */
export interface ConditionalItemProps<T> {
  value: T
  evaluateFunc: (value: T) => boolean
  conditionText: string
}
