export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token; 
};

export const getUserRole = () => {
    return localStorage.getItem('role');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    window.location.href = '/login'; 
};

export const hasRole = (requiredRole) => {
    const userRole = getUserRole();
    return userRole === requiredRole;
};

export const isTokenExpired = () => {
    const token = getToken();
    if (!token) return true;
    
    try {
        // Decode JWT token to check expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch (error) {
        return true; 
    }
};

// Enhanced authentication check
export const isValidSession = () => {
    return isAuthenticated() && !isTokenExpired();
};