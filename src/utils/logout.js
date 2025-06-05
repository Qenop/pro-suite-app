// E:\PROJECTS\pro-suite-app\management-app\src\utils\logout.js

export const logout = () => {
  localStorage.removeItem('token'); // Clear JWT
  window.location.href = '/login';  // Force redirect to login
};
