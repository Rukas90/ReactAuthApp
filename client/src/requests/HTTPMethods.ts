import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios"

export const GET = async <T = any>(
  api: string,
  url: string,
  _?: any,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return axios.get<T>(buildApiUrl(api, url), config)
}

export const POST = async <T = any>(
  api: string,
  url: string,
  data?: any,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return axios.post<T>(buildApiUrl(api, url), data, config)
}

export const PUT = async <T = any>(
  api: string,
  url: string,
  data?: any,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return axios.put<T>(buildApiUrl(api, url), data, config)
}

export const DELETE = async <T = any>(
  api: string,
  url: string,
  _?: any,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return axios.delete<T>(buildApiUrl(api, url), config)
}

export const PATCH = async <T = any>(
  api: string,
  url: string,
  data?: any,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  return axios.patch<T>(buildApiUrl(api, url), data, config)
}

export const buildApiUrl = (api: string, url: string): string => {
  const path = url.startsWith("/") ? url : `/${url}`

  if (!api) {
    console.error("api url is not defined")
    return path
  }
  console.log(`${api}${path}`)
  return `${api}${path}`
}
