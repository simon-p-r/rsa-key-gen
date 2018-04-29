'use strict';

const Code = require('code');
const Gen = require('../lib/index.js');
const Lab = require('lab');

// Set-up lab
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('Key-Gen', () => {

    it('should throw an error when generateKeyPair function has no callback', () => {

        expect(() => Gen.generateKeyPair()).throws(Error);
    });

    it('should return an error from generateKeyPair due to invalid options', () => {

        Gen.generateKeyPair({ bits: 1 }, (err, results) => {

            expect(err).to.exist();
            expect(results).to.not.exist();
        });
    });


    it('should return an error from generateKeyPair due to invalid openSSL path', () => {

        Gen.setOpenSSLPath('invalid');
        return new Promise((resolve) => {

            Gen.generateKeyPair((err, results) => {

                expect(err).to.exist();
                expect(results).to.not.exist();
                resolve();
            });
        });
    });

    it('should generate a private/public key pair with default options', () => {

        Gen.setOpenSSLPath('openssl');
        return new Promise((resolve) => {

            Gen.generateKeyPair((err, results) => {

                expect(err).to.not.exist();
                expect(results.private).to.be.a.string();
                expect(results.public).to.be.a.string();
                resolve();
            });
        });
    });

    it('should generate a private/public key pair with user options', () => {

        const options = {
            bits: 4096,
            cipher: 'camellia256'
        };

        return new Promise((resolve) => {

            Gen.generateKeyPair(options, (err, results) => {

                expect(err).to.not.exist();
                expect(results.private).to.be.a.string();
                expect(results.public).to.be.a.string();
                resolve();
            });
        });
    });

    it('should throw an error when generateCertificate function has no callback', () => {

        expect(() => Gen.generateCertificate()).throws(Error);
    });

    it('should return an error from generateCertificate due to invalid options', () => {

        return new Promise((resolve) => {

            Gen.generateCertificate({ bits: 1 }, (err, results) => {

                expect(err).to.exist();
                expect(results).to.not.exist();
                resolve();
            });
        });
    });

    it('should return an error from generateCertificate due to invalid openSSL path', () => {

        Gen.setOpenSSLPath('invalid');
        return new Promise((resolve) => {

            Gen.generateCertificate((err, results) => {

                expect(err).to.exist();
                expect(results).to.not.exist();
                resolve();
            });
        });
    });


    it('should generate a certificate with default options', () => {

        Gen.setOpenSSLPath('openssl');
        return new Promise((resolve) => {

            Gen.generateCertificate((err, results) => {

                expect(err).to.not.exist();
                expect(results.clientKey).to.be.a.string();
                expect(results.certificate).to.be.a.string();
                expect(results.csr).to.be.a.string();
                expect(results.serviceKey).to.be.a.string();
                resolve();
            });
        });
    });


    it('should generate a certificate with user options', () => {

        const options = {
            selfSigned: false,
            bits: 1024
        };

        return new Promise((resolve) => {

            Gen.generateCertificate(options, (err, results) => {

                expect(err).to.not.exist();
                expect(results.clientKey).to.be.a.string();
                expect(results.certificate).to.be.a.string();
                expect(results.csr).to.be.a.string();
                expect(results.serviceKey).to.be.a.string();
                resolve();
            });
        });
    });

});
