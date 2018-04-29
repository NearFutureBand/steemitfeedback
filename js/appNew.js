//app.js - additional unique scripts for full version - extension for api.js - deploy AFTER api.js

golos.config.set('websocket', 'wss://ws.testnet.golos.io');
golos.config.set('address_prefix', 'GLS');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

document.querySelector('.'+prefix+'btn-add-fb').addEventListener('click', function(){
    openAddFbForm();
});