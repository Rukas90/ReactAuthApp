import { OAuthProviderData } from "Data/OAuthProviderData"
import { GET } from "Utils/Requests"
import React, { useEffect, useState } from "react"
import LabelHorizontalSeparator from "Components/Templates/LabelHorizontalSeparator"
import { TextSizeOption } from "Data/TextSizeOption"
import { HorizontalAlignment } from "Data/HorizontalAlignment"
import Spacer from "Components/UI/Spacer"
import Spinner from "Components/UI/Spinner"
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

      if (response && response.data && response.data.providers) {
        const providersArray: OAuthProviderData[] = Object.values(
          response.data.providers
        )
        setProviders(providersArray)
      } else {
        setProviders([])
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
          {providers && providers.length > 0 ? (
            providers.map((provider) => (
              <React.Fragment key={provider.id}>
                {RenderProviderNode(provider)}
              </React.Fragment>
            ))
          ) : (
            <div className="w-auto text-center mx-auto">
              <p className="text-secondary px-4 py-2 bg-secondary-subtle rounded-2 fw-medium">
                No linked OAuth Providers found
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
export default LinkedLoginMethods
