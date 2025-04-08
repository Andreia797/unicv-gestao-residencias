import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

const NotificationService = {
    socket: null,
    eventCallbacks: {},

    connect: () => {
        if (!NotificationService.socket || !NotificationService.socket.connected) {
            NotificationService.socket = io(SOCKET_URL, {
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            });

            NotificationService.socket.on('connect_error', (error) => {
                console.error('Erro de conexão do socket:', error);
            });

            NotificationService.socket.on('connect_timeout', (timeout) => {
                console.error('Tempo limite de conexão do socket:', timeout);
            });

            NotificationService.socket.on('error', (error) => {
                console.error('Erro do socket:', error);
            });
        }
    },

    disconnect: () => {
        if (NotificationService.socket && NotificationService.socket.connected) {
            NotificationService.socket.disconnect();
        }
    },

    subscribe: (event, callback) => {
        NotificationService.connect();
        if (NotificationService.socket) {
            NotificationService.socket.on(event, callback);
            NotificationService.eventCallbacks[event] = callback;
        }
    },

    unsubscribe: (event) => {
        if (NotificationService.socket && NotificationService.eventCallbacks[event]) {
            NotificationService.socket.off(event, NotificationService.eventCallbacks[event]);
            delete NotificationService.eventCallbacks[event];
        }
    },

    send: (event, data) => {
        if (NotificationService.socket && NotificationService.socket.connected) {
            NotificationService.socket.emit(event, data);
        } else {
            console.warn('Socket não conectado. Mensagem não enviada.');
        }
    },
};

export default NotificationService;