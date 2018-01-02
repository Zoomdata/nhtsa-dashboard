const ZoomdataSDK = window.ZoomdataSDK;

const application = {
  host: 'preview.zoomdata.com',
  port: 443,
  path: '/zoomdata',
  secure: true,
};

const credentials = {
  key: 'PHD5icxZK5',
};

export function getClient() {
  return ZoomdataSDK.createClient({ application, credentials });
}
