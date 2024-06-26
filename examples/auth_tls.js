const { Sender } = require('@questdb/nodejs-client');

async function run() {
  // authentication details
  const CLIENT_ID = 'testapp';
  const PRIVATE_KEY = '9b9x5WhJywDEuo1KGQWSPNxtX-6X6R2BRCKhYMMY6n8';
  const AUTH = {
    keyId: CLIENT_ID,
    token: PRIVATE_KEY
  };

  // pass the authentication details to the sender
  const sender = new Sender({ protocol: 'tcps', host: 'localhost', port: 9009, bufferSize: 4096, auth: AUTH });
  await sender.connect();

  // send the data over the authenticated and secure connection
  let bday = Date.parse('1856-07-10');
  await sender
    .table('inventors_nodejs')
    .symbol('born', 'Austrian Empire')
    .timestampColumn('birthday', bday, 'ms') // epoch in millis
    .intColumn('id', 0)
    .stringColumn('name', 'Nicola Tesla')
    .at(Date.now(), 'ms'); // epoch in millis
  bday = Date.parse('1847-02-11');
  await sender
    .table('inventors_nodejs')
    .symbol('born', 'USA')
    .timestampColumn('birthday', bday, 'ms')
    .intColumn('id', 1)
    .stringColumn('name', 'Thomas Alva Edison')
    .at(Date.now(), 'ms');

  // flush the buffer of the sender, sending the data to QuestDB
  await sender.flush();

  // close the connection after all rows ingested
  await sender.close();
}

run().catch(console.error);
