export const UserService = {
    baseUrl: import.meta.env.VITE_WETO_BACKEND_USER,
    endpoints: {
        GetUsersByComplex: '/getByComplex',
        UpdateUser: '/update',
        AddUser: '/add',
        DeleteUser: '/delete',
        GetUserById: '/getById',
        addUserPet: '/addPet',
        deleteUserPet: '/removePet',
        updateUserPet: '/updatePet',
        addUserVehicle: '/addVehicle',
        deleteUserVehicle: '/removeVehicle',
        updateUserVehicle: '/updateVehicle',
    },
};