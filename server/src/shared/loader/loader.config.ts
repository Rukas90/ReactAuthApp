import path from "path"

export const FeaturesDirectory = path.join(process.cwd(), "src/feature")

export type LoadOptions = {
  pattern: string
  path?: string
}
