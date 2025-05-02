import { apiClient } from "@/lib/axios";

const signup = (data : { name : string, email : string, password : string}) => {
    return apiClient.post("/users/signup", data);
};

const login = (data : { email : string, password : string}) => {
    return apiClient.post("/users/login", data);
};

const changePassword = (data : { oldPassword : string, newPassword : string}) => {
    return apiClient.post("/users/change-password", data);
};

const changeAvatar = (data : FormData) => {
    return apiClient.post("/users/change-avatar", data);
};

const getUsers = () => {
    return apiClient.get("/users");
};

export {
    signup,
    login,
    changePassword,
    changeAvatar,
    getUsers
}