import { OAuthProviderData } from "Utils/Types/OAuthProviderData"
import { GET } from "Utils/Requests"
import React, { useEffect, useState } from "react"
import LabelHorizontalSeparator from "Components/Templates/LabelHorizontalSeparator"
import { TextSizeOption } from "Utils/Types/TextSizeOption"
import { HorizontalAlignment } from "Utils/Types/HorizontalAlignment"
import Spacer from "Components/Spacer"
import Spinner from "Components/Spinner"
import GoogleOAuthProvider from "./GoogleOAuthProvider"
import GithubOAuthProvider from "./GithubOAuthProvider"

interface ProviderComponentsMap {
  [key: string]: React.ComponentType<{ data: OAuthProviderData }>
}

const RenderProviderNode = (data: OAuthProviderData) => {
  const nodes: ProviderComponentsMap = {
    google: GoogleOAuthProvider,
    github: GithubOAuthProvider,
  }
  const Component = nodes[data.name.toLowerCase()] || undefined

  if (!Component) {
    return
  }
  return <Component data={data} />
}

const LinkedLoginMethods = () => {
  const [providers, setProviders] = useState<OAuthProviderData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true)

      const response = await GET("/oauth/providers")

      if (response && response.data) {
        const providersArray: OAuthProviderData[] = Object.values(
          response.data.providers
        )
        setProviders(providersArray)
      }
      setLoading(false)
    }
    fetchSessions()
  }, [])

  return (
    <>
      <LabelHorizontalSeparator
        label="Login Methods"
        alignment={HorizontalAlignment.Start}
        textSize={TextSizeOption.Regular}
      />
      <Spacer space={3.0} unit="rem" isVertical />
      {loading ? (
        <Spinner />
      ) : (
        <div className="row g-3">
          {providers.map((provider) => (
            <React.Fragment key={provider.id}>
              {RenderProviderNode(provider)}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  )
}
export default LinkedLoginMethods
