const BASE_URL = 'http://localhost:9012/auth';

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

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            // Assuming the response contains a new access token
            // Adjust this based on the actual API response structure
            const newAccessToken = data.accessToken || data.token; 
            
            if (newAccessToken) {
              localStorage.setItem('accessToken', newAccessToken);
              headers.set('Authorization', `Bearer ${newAccessToken}`);
              // Retry the original request
              response = await fetch(url, { ...options, headers });
            } else {
              // Refresh failed or no new token, logout
              throw new Error('No new access token received');
            }
          } else {
            throw new Error('Refresh token expired or invalid');
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
