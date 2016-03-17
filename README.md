# rsa-key-gen [![Build Status](https://travis-ci.org/simon-p-r/rsa-key-gen.svg?branch=master)](https://travis-ci.org/simon-p-r/rsa-key-gen)


An implementation of [openssl genrsa for node](https://www.openssl.org/docs/man1.0.2/apps/genrsa.html).

It makes use of [pem](https://github.com/andris9/pem) module which is dependant upon openssl binary to work as is a wrapper to the command line tool.

# Install

 ```bash
 $ npm install rsa-key-gen
 ```

# Usage

### rsaKeyGen.generateKeyPair(options, [callback])

 (Callback) with error and result signature



 `options`:

 * `bits` key length in bits
 * `cipher` default: `aes256` see openssl man page for valid options
 * `password`: string password for key pair



 Example

 ```js

 const rsaKeyGen = require('rsa-key-gen');


 const options = {
    bits: 4096,
    cipher: 'camellia256',
    password: 'secret'
 };


rsaKeyGen.generateKeyPair(options, (err, result) => {

    if (err) {
        throw err
    }
    // Print keypair to console
    console.log('%s\n\n%s', result.private, result.public);

});
 ```

### rsaKeyGen.generateCertificate(options, [callback])

 (Callback) with error and result signature



 `options`

 * `selfSigned` boolean
 * `bits` length in bits for certificate

 Other valid options are described in the pem modules docs


 ```js

 const options = {
    bits: 4096,
    selfSigned: true
 };



 rsaKeyGen.generateCertificate(options, (err, result) => {

     if (err) {
         throw err
     }
     // Print cert artifacts to console
     console.log('%s\n\n%s', result.clientKey, result.certificate);
     console.log('%s\n\n%s', result.csr, result.serviceKey);

 });

 ```

 ### rsaKeyGen.setOpenSSLPath(path)



  `path` custom location of openSSL path

Caveat with this method must be called in between calls to different binaries as value is cached by node's require



  ```js


 rsaKeyGen.generateCertificate('custom/path/to/openssl');

 ```

Todo

 * improve docs
 * improve validation of incoming parameters
