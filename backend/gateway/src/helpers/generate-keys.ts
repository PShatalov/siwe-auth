import { generateKeyPairSync } from 'crypto';

const { publicKey, privateKey } = generateKeyPairSync('ed25519');

console.log(privateKey.export({ type: 'pkcs8', format: 'pem' }));
console.log('=================================================');
console.log(publicKey.export({ type: 'spki', format: 'pem' }));
