import type { SessionLocation } from "@project/shared"

export const getLocationDisplay = (location: SessionLocation | null) => {
  if (!location) {
    return { city: "Unknown location", country: "Unknown location" }
  }
  if (location === "localhost") {
    return { city: "Localhost", country: "Localhost" }
  }
  return {
    city: location.city,
    country: location.country,
  }
}
export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  })
}
