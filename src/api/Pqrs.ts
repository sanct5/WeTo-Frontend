export const pqrsService = {
    baseUrl: import.meta.env.VITE_WETO_BACKEND_PQRS,
    endpoints: {
        addPqrs: '/add',
        getPqrsByComplex: '/getByComplex',
        replyPqrs: '/answer',
        closePqrs: '/close',
        getPqrsAnswers: '/getAnswers',
        notifyAll: '/notify',
        reopen: '/reopen',
        getByUser: '/getByUser',
        notifyOne: '/notifyOne',
    },
};