const BASE_URL = 'http://localhost:9012/auth';

// Standard API response format: { message: string, success: boolean, data: any }
export interface ApiResponse<T = any> {
  message: string;
  success: boolean;
  data: T | null;
}

/**
 * Parses the API response and throws an error if the request failed.
 * Handles both HTTP errors and API-level errors (success: false).
 */
export async function handleApiResponse<T = any>(
  response: Response,
  fallbackError = 'Something went wrong'
): Promise<ApiResponse<T>> {
  const result: ApiResponse<T> = await response.json().catch(() => ({
    message: fallbackError,
    success: false,
    data: null,
  }));

  if (!response.ok || !result.success) {
    throw new Error(result.message || fallbackError);
  }

  return result;
}

export const apiService = {
  async fetchWithAuth(url: string, options: RequestInit = {}) {
    let accessToken = localStorage.getItem('accessToken');
    
    const headers = new Headers(options.headers);
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${BASE_URL}/refresh-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: refreshToken }),
          });

          const refreshResult: ApiResponse = await refreshResponse.json();

          if (refreshResponse.ok && refreshResult.success && refreshResult.data) {
            const newAccessToken = refreshResult.data.accessToken || refreshResult.data.token;
            
            if (newAccessToken) {
              localStorage.setItem('accessToken', newAccessToken);
              headers.set('Authorization', `Bearer ${newAccessToken}`);
              // Retry the original request
              response = await fetch(url, { ...options, headers });
            } else {
              throw new Error(refreshResult.message || 'No new access token received');
            }
          } else {
            throw new Error(refreshResult.message || 'Refresh token expired or invalid');
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
          // Clear local storage and redirect to login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } else {
        // No refresh token available, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return response;
  }
};
