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

    it('should throw an error when generateKeyPair function has no callback', (done) => {

        expect(() => Gen.generateKeyPair()).throws(Error);
        done();
    });

    it('should return an error from generateKeyPair due to invalid options', (done) => {

        Gen.generateKeyPair({ bits: 1 }, (err, results) => {

            expect(err).to.exist();
            expect(results).to.not.exist();
            done();
        });
    });


    it('should return an error from generateKeyPair due to invalid openSSL path', (done) => {

        Gen.setOpenSSLPath('invalid');
        Gen.generateKeyPair((err, results) => {

            expect(err).to.exist();
            expect(results).to.not.exist();
            done();
        });
    });

    it('should generate a private/public key pair with default options', (done) => {

        Gen.setOpenSSLPath('openssl');
        Gen.generateKeyPair((err, results) => {

            expect(err).to.not.exist();
            expect(results.private).to.be.a.string();
            expect(results.public).to.be.a.string();
            done();
        });
    });

    it('should generate a private/public key pair with user options', (done) => {

        const options = {
            bits: 4096,
            cipher: 'camellia256'
        };

        Gen.generateKeyPair(options, (err, results) => {

            expect(err).to.not.exist();
            expect(results.private).to.be.a.string();
            expect(results.public).to.be.a.string();
            done();
        });
    });

    it('should throw an error when generateCertificate function has no callback', (done) => {

        expect(() => Gen.generateCertificate()).throws(Error);
        done();
    });

    it('should return an error from generateCertificate due to invalid options', (done) => {

        Gen.generateCertificate({ bits: 1 }, (err, results) => {

            expect(err).to.exist();
            expect(results).to.not.exist();
            done();
        });
    });

    it('should return an error from generateCertificate due to invalid openSSL path', (done) => {

        Gen.setOpenSSLPath('invalid');
        Gen.generateCertificate((err, results) => {

            expect(err).to.exist();
            expect(results).to.not.exist();
            done();
        });
    });

    it('should generate a certificate with default options', (done) => {

        Gen.setOpenSSLPath('openssl');
        Gen.generateCertificate((err, results) => {

            expect(err).to.not.exist();
            expect(results.clientKey).to.be.a.string();
            expect(results.certificate).to.be.a.string();
            expect(results.csr).to.be.a.string();
            expect(results.serviceKey).to.be.a.string();
            done();
        });
    });


    it('should generate a certificate with user options', (done) => {

        const options = {
            selfSigned: false,
            bits: 1024
        };

        Gen.generateCertificate(options, (err, results) => {

            expect(err).to.not.exist();
            expect(results.clientKey).to.be.a.string();
            expect(results.certificate).to.be.a.string();
            expect(results.csr).to.be.a.string();
            expect(results.serviceKey).to.be.a.string();
            done();
        });
    });

});
