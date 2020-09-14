const rp = require('request-promise');
const TOKEN = require('./token');

async function getToken() {
  const options = {
    method: 'POST',
    uri: 'https://idcs-902a944ff6854c5fbe94750e48d66be5.identity.oraclecloud.com/oauth2/v1/token',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': TOKEN.AUTH,
      'cache-control': 'no-cache',
      'postman-token': '280d6ac2-0e1c-d7ed-fc20-85de145f3d1c',
    },
    form: {
      grant_type: 'client_credentials',
      scope: 'urn:opc:resource:consumer::all'
    }
  }

  return rp(options)
}

async function getTransacoes() {
  const token = await getToken();
  
  const options = {
    method: 'GET',
    uri: 'https://af3tqle6wgdocsdirzlfrq7w5m.apigateway.sa-saopaulo-1.oci.customer-oci.com/fiap-sandbox/open-banking/v1/accounts/00711234533/transactions',
    json: true,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(token).access_token}`
    }
  };
  return rp(options);
}

async function getMorningCall() {
  const token = await getToken();

  const options = {
    method: 'GET',
    uri: 'https://af3tqle6wgdocsdirzlfrq7w5m.apigateway.sa-saopaulo-1.oci.customer-oci.com/fiap-sandbox/media/v1/youtube?fromData=2020-07-09&toData=2020-07-14&playlist=morningCalls&channel=safra',
    json: true,
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${JSON.parse(token).access_token}`
    },
    params: {
      'fromData':'2020-07-09',
      'toData':'2020-07-14',
      'playlist':'morningCalls',
      'channel':'safra'
    }
  };

  return rp(options);
}

module.exports = { getTransacoes, getMorningCall }