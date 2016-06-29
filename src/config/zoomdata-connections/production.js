import { map } from 'mobx';

export const server = {
    credentials: map(),
    application: {
        secure: true,
        host: 'plive.zoomdata.com',
        path: '/zoomdata'
    },
    oauthOptions: {
        client_id: 'bmh0c2FfY2xpZW50MTQ1ODA2NzM4MTE3NDdkNzAxZGIzLTA3MDMtNDk4Mi1iNThiLTQ4NzU2OTZkOTYwNw==',
        redirect_uri: 'http://demos.zoomdata.com/nhtsa-dashboard-2.2/index.html',
        auth_uri: 'https://preview.zoomdata.com/zoomdata/oauth/authorize',
        scope: ['read']
    }
};

server.credentials = map({
    key: '57740838e4b0678411040887'
});