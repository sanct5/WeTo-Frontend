export const DirectoryService = {
    baseUrl: import.meta.env.VITE_WETO_BACKEND_DIRECTORY,
    endpoints: {
        AddDirectory: '/create',
        GetByComplex: '/getByComplex',
        GetByUser: '/getByUser',
        GetById: '/getById',
        Update: '/update',
        Delete: '/delete',
    },
};