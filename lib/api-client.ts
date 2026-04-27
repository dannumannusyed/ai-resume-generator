// API client utilities
export class APIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number
}

export async function fetchAPI<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 10000, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new APIError(response.status, error.message || response.statusText)
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof APIError) throw error
    throw new Error(`API request failed: ${error}`)
  }
}

export async function postAPI<T>(url: string, data: any, options?: FetchOptions): Promise<T> {
  return fetchAPI(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify(data),
  })
}

export async function putAPI<T>(url: string, data: any, options?: FetchOptions): Promise<T> {
  return fetchAPI(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify(data),
  })
}

export async function deleteAPI<T>(url: string, options?: FetchOptions): Promise<T> {
  return fetchAPI(url, {
    ...options,
    method: 'DELETE',
  })
}

export async function getAPI<T>(url: string, options?: FetchOptions): Promise<T> {
  return fetchAPI(url, {
    ...options,
    method: 'GET',
  })
}
