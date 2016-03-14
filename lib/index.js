'use strict';

const Pem = require('pem');

const internals = {
    defaults: {
        keyPair: {
            cipher: 'aes256',
            bits: 4096
        },
        certificate: {
            selfSigned: true,
            bits: 4096
        }
    }
};



exports.generateKeyPair = function () {

    const callback = (arguments.length === 1 ? arguments[0] : arguments[1]);
    const options = (arguments.length === 1 ? {} : arguments[0]);
    const settings = Object.assign(internals.defaults.keyPair, options);

    Pem.createPrivateKey(settings.bits, settings, (err, privateKey) => {

        // $lab:coverage:off$
        if (err) {
            return callback(err);
        }

        Pem.getPublicKey(privateKey.key, (err, publicKey) => {

            if (err) {
                return callback(err);
            }
            // $lab:coverage:on$
            return callback(null, { private: privateKey.key, public: publicKey.publicKey });
        });
    });

};

exports.generateCertificate = function () {

    const callback = (arguments.length === 1 ? arguments[0] : arguments[1]);
    const options = (arguments.length === 1 ? {} : arguments[0]);
    const settings = Object.assign(internals.defaults.certificate, options);

    Pem.createCertificate(settings.certificate, (err, certificate) => {

        // $lab:coverage:off$
        if (err) {
            return callback(err);
        }
        // $lab:coverage:on$
        return callback(null, certificate);

    });

};
