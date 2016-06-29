import { map } from 'mobx';

export const server = {
    application: {
        secure: true,
        host: 'localhost',
        port: 8443,
        path: '/zoomdata'
    },
    oauthOptions: {
        client_id: 'bmh0c2FfY2xpZW50MTQ1OTM0Nzc1NTg0MjQ4YzNiNzdmLTI1NTYtNGMyMS1iODYyLTg2NDRiYjA5ZDlmZA==',
        redirect_uri: 'http://localhost:3000/index.html',
        auth_uri: 'https://localhost:8443/zoomdata/oauth/authorize',
        scope: ['read']
    }
};

server.credentials = map({
    key: '5774014c300451d7fd295f33'
});