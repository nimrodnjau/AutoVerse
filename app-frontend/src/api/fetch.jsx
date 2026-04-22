const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(method, path, body = null, auth = false) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw { status: res.status, message: data.error || "Request failed" };
  return data;
}

export const api = {
  get: (path, auth = false) => request("GET", path, null, auth),
  post: (path, body, auth = false) => request("POST", path, body, auth),
  put: (path, body, auth = false) => request("PUT", path, body, auth),
  delete: (path, auth = false) => request("DELETE", path, null, auth),
};