declare global {
  interface Window {
    logout: () => void;
  }
}

window.logout = function () {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("access_token");
    window.location.href = "./login.html";
  }
};

export {};
