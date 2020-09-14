const { query } = require('express');
const rp = require('request-promise');
const TOKEN = require('./token');
const api = require('./routes');

async function sendToUser(chat_id, text) {
  const options = {
    method: 'GET',
    uri: `https://api.telegram.org/bot${TOKEN.TELEGRAM}/sendMessage`,
    qs: {
      chat_id,
      text
    }
  };

  return rp(options);
}

module.exports.finbot = async event => {
  const body = JSON.parse(event.body);
  const {chat, text} = body.message;

  if (!text) {
    await sendToUser(chat.id, 'Comando inválido');
  } else if (text === "/transacoes") {
    let message = ""

    try {
      const result = await api.getTransacoes();

      result.data.transaction.forEach(transaction => {
        message += `Codigo da transação: ${transaction.transactionId} 
        \n Valor: R$ ${transaction.amount.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
        \n Data da transação: ${new Date(transaction.valueDateTime).toLocaleDateString('pt-BR')}
        \n Descrição da transação: ${transaction.transactionInformation}
        \n Banco Origem: ${transaction.proprietaryBankTransactionCode.issuer} \n_____________________________________________\n\n`;
      })
    } catch (error) {
      message = `Erro: ${error.message}`;
    }

    await sendToUser(chat.id, message);
  }
  
  else if (text === '/comandos') {
    const message = `Lista de comandos: 
    \n/transacoes: suas transações
    \n/comprovante: comprovantes de transações
    \n/saldo: seu saldo
    \n/investimento: tudo sobre investimento
    \n/pix: informações do pix
    \n/ajuda: solicitar ajuda
    \n/morningcall: novidades no morning call Safra`
    await sendToUser(chat.id, `${message}`);
  } 
  
  else if (text === '/morningcall') {
    let message = ""

    try {
      const result = await api.getMorningCall();

      message = `${result.data[0].title}\n${result.data[0].description}\n${result.data[0].links[0].href}`

    } catch (error) {
      message = `Erro: ${error.message}`;
    }
 
    await sendToUser(chat.id, message);
  }
  
  else {
    await sendToUser(chat.id, `Acesse a lista de comandos /comandos`);
  }

  return { statusCode: 200 };
};