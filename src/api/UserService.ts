export const UserService = {
    baseUrl: import.meta.env.VITE_WETO_BACKEND_USER,
    endpoints: {
        GetUsersByComplex: '/getByComplex',
        UpdateUser: '/update',
        AddUser: '/add',
        DeleteUser: '/delete',
        GetUserById: '/getById',
    },
};