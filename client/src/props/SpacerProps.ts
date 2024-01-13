export interface SpacerProps {
    space: number // The amount of space to be applied
    unit?: "px" | "rem" | "%" // Unit for the spacing (defaults to pixels)
    isVertical: boolean // Determines if the spacing is vertical or horizontal
}