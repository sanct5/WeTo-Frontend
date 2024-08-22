export const UserService = {
    baseUrl: import.meta.env.VITE_WETO_BACKEND_USER,
    endpoints: {
        GetUsersByComplex: '/getUsersByComplex',
        UpdateUser: '/updateUser',
        AddUser: '/addUser',
        DeleteUser: '/deleteUser',
        GetUserById: '/getUserById',
    },
};