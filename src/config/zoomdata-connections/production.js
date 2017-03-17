import { map } from 'mobx';

export const server = {
    credentials: map(),
    application: {
        secure: true,
        host: 'live.zoomdata.com',
        path: '/zoomdata',
        port: 8443
    },
    oauthOptions: {
        client_id: 'bmh0c2FfY2xpZW50MTQ1ODA2NzM4MTE3NDdkNzAxZGIzLTA3MDMtNDk4Mi1iNThiLTQ4NzU2OTZkOTYwNw==',
        redirect_uri: 'http://demos.zoomdata.com/nhtsa-dashboard-2.2/index.html',
        auth_uri: 'https://live.zoomdata.com/zoomdata/oauth/authorize',
        scope: ['read']
    }
};

server.credentials = map({
    key: '58cbe712e4b0336a00f938d7'
});