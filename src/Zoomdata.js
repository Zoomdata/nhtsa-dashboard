const ZoomdataSDK = window.ZoomdataSDK;

const application = {
  host: 'live.zoomdata.com',
  port: 443,
  path: '/zoomdata',
  secure: true,
};

const credentials = {
  key: '58cbe712e4b0336a00f938d7',
};

export function getClient() {
  return ZoomdataSDK.createClient({ application, credentials });
}
