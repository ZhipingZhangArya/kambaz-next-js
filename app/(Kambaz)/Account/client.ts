import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });

// Get HTTP_SERVER from environment variable, with fallback
// Next.js exposes NEXT_PUBLIC_* env vars to the browser
const envServer = process.env.NEXT_PUBLIC_HTTP_SERVER;
export const HTTP_SERVER = (envServer && envServer !== 'undefined') 
  ? envServer 
  : 'http://localhost:4000';
export const USERS_API = `${HTTP_SERVER}/api/users`;

export const signin = async (credentials: any) => {
  const response = await axiosWithCredentials.post(
    `${USERS_API}/signin`,
    credentials
  );
  return response.data;
};

export const signup = async (user: any) => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/signup`, user);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Server responded with error status - throw the error so UI can display it
      throw error;
    } else if (error.request) {
      // Request was made but no response received (Network Error)
      throw new Error("Network error: Unable to connect to server. Please check if the server is running.");
    } else {
      // Something else happened
      throw error;
    }
  }
};

export const updateUser = async (user: any) => {
  const response = await axiosWithCredentials.put(
    `${USERS_API}/${user._id}`,
    user
  );
  return response.data;
};

export const profile = async () => {
  try {
    const response = await axiosWithCredentials.post(`${USERS_API}/profile`);
    return response.data;
  } catch (error: any) {
    // If 401, user is not authenticated - return null
    // This is expected when the user hasn't signed in yet - don't log as error
    if (error.response?.status === 401) {
      return null;
    }
    // Handle network errors gracefully
    if (!error.response && error.request) {
      console.error("[Profile] Network error - Server may be down or unreachable");
      return null; // Return null instead of throwing for network errors
    }
    // Log and re-throw other errors (500, etc.)
    console.error("[Profile] Unexpected error:", error);
    throw error;
  }
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

export const findAllUsers = async () => {
  try {
    const response = await axiosWithCredentials.get(USERS_API);
    return response.data;
  } catch (error: any) {
    console.error("[findAllUsers] Error:", error);
    if (error.response) {
      // Server responded with error status
      throw error;
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("Network error: Unable to fetch users. Please check if the server is running.");
    } else {
      // Something else happened
      throw error;
    }
  }
};

export const findUsersByRole = async (role: string) => {
  try {
    const response = await axiosWithCredentials.get(`${USERS_API}?role=${encodeURIComponent(role)}`);
    return response.data;
  } catch (error: any) {
    console.error("[findUsersByRole] Error:", error);
    throw error;
  }
};

export const findUsersByPartialName = async (name: string) => {
  try {
    const response = await axiosWithCredentials.get(`${USERS_API}?name=${encodeURIComponent(name)}`);
    return response.data;
  } catch (error: any) {
    console.error("[findUsersByPartialName] Error:", error);
    throw error;
  }
};

export const findUsersByRoleAndName = async (role: string, name: string) => {
  try {
    const response = await axiosWithCredentials.get(
      `${USERS_API}?role=${encodeURIComponent(role)}&name=${encodeURIComponent(name)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("[findUsersByRoleAndName] Error:", error);
    throw error;
  }
};

export const findUserById = async (id: string) => {
  const response = await axiosWithCredentials.get(`${USERS_API}/${id}`);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await axiosWithCredentials.delete(`${USERS_API}/${id}`);
  return response.data;
};

export const createUser = async (user: any) => {
  const response = await axiosWithCredentials.post(`${USERS_API}`, user);
  return response.data;
};
