export const ClientService = {
    getClients() {
        return fetch('/demo/data/clients.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    },
    getClient() {
        return fetch('/demo/data/clients.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    },
    async postRegister(user) {
        
        
    }
}