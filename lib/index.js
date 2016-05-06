'use strict';

const Async = require('neo-async');
const Fs = require('fs');
const Hoek = require('hoek');
const Joi = require('joi');
const Path = require('path');
const Pem = require('pem');

const internals = {};

internals.bits = Joi.number().valid([1024, 2048, 4096]).default(4096);

internals.schema = {
    keyPair: Joi.object().keys({
        bits: internals.bits,
        cipher: Joi.string().valid(['aes128', 'aes192', 'aes256', 'camellia128', 'camellia192', 'camellia256', 'des','des3', 'idea']).default('aes256'),
        password: Joi.string()
    }),
    certificate: Joi.object().keys({
        selfSigned: Joi.boolean().default(true),
        bits: internals.bits
    })
};

internals.humaniseJoi = (error) => {

    return error.details.map((d) => {

        return d.message.replace(/["]/ig, '');
    }).join(', ');

};



exports.generateKeyPair = function () {

    const callback = (arguments.length === 1 ? arguments[0] : arguments[1]);
    const options = (arguments.length === 1 ? {} : arguments[0]);
    Hoek.assert(typeof callback === 'function', '"generateKeyPair" second argument must be a function');
    const valid = Joi.validate(options, internals.schema.keyPair, { abortEarly: false });

    if (valid.error) {
        return callback(internals.humaniseJoi(valid.error), null);
    }

    const { bits, cipher, password }  = valid.value;
    const settings = { cipher: cipher, password: password };


    Pem.createPrivateKey(bits, settings, (err, privateKey) => {

        if (err) {
            return callback(err);
        }

        Pem.getPublicKey(privateKey.key, (err, publicKey) => {

            // $lab:coverage:off$
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
    Hoek.assert(typeof callback === 'function', '"generateCertificate" second argument must be a function');
    const valid = Joi.validate(options, internals.schema.certificate, { abortEarly: false , allowUnknown: true });

    if (valid.error) {
        return callback(internals.humaniseJoi(valid.error), null);
    }

    const settings = valid.value;

    Pem.createCertificate(settings.certificate, (err, certificate) => {

        if (err) {
            return callback(err);
        }

        return callback(null, certificate);

    });

};

exports.setOpenSSLPath = function (path) {

    Pem.config({
        pathOpenSSL: path
    });

};


exports.saveKeyPairs = (root, keyPair, cb) => {

    const iterator = (item, next) => {

        const target = Path.resolve(root, `${item}.pem`);
        Fs.writeFile(target, keyPair[item], 'utf8', next);
    };

    Async.map(Object.keys(keyPair), iterator, (err, result) => {

        if (err) {
            return cb(err, null);
        }
        return cb(null, root);
    });

};
