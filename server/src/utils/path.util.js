/**
 * Constructs a URL from path segments and query parameters.
 *
 * @param {string[]} pathSegments
 * @param {{ name: string, value: string }[]} queryParams
 * @returns {string}
 */
export const getPath = (pathSegments, queryParams = null) => {
    const path = pathSegments.join('/').replace(/\/+/g, '/').replace(/\/$/, '')
    const url = new URL(path)

    if (queryParams) {
        const params = new URLSearchParams()
        queryParams.forEach(param => {
            params.append(param.name, param.value)
        })
        url.search = params.toString()
    }

    return url.toString()
}