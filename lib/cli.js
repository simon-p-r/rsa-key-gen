'use strict';


const Bossy = require('bossy');
const Path = require('path');
const Pkg = require('../package.json');
const RSA = require('./index');

exports.run = (args, cb) => {

    const definition = {
        bits: {
            alias: 'b',
            type: 'string',
            description: 'bits',
            default: 4096
        },
        cipher: {
            alias: 'c',
            type: 'string',
            description: 'cipher'
        },
        root: {
            alias: 'r',
            type: 'string',
            description: 'root to resolve output directory from',
            default: process.cwd()
        },
        directory: {
            alias: 'd',
            type: 'string',
            description: 'output directory'
        },
        version: {
            alias: 'v',
            type: 'boolean',
            description: 'version information'
        },
        help: {
            alias: 'h',
            type: 'boolean',
            description: 'display usage options'
        }
    };

    const argv = Bossy.parse(definition, { argv: args });

    if (argv instanceof Error) {
        return cb(new Error(Bossy.usage(definition, argv.message), null));
    }

    if (argv.help) {
        return cb(null, Bossy.usage(definition, 'rsa-gen [options]'));
    }

    if (argv.version || argv.v) {
        return cb(null, `Package ${Pkg.name} v${Pkg.version}`);
    }

    let outDir;
    if (argv.d || argv.directory) {
        const dir = argv.d;
        const root = argv.r;
        outDir = Path.resolve(root, dir);
    }

    const options = {
        bits: args.bits,
        cipher: args.cipher
    };

    RSA.generateKeyPair(options, (err, keyPair) => {

        if (err) {
            return cb(err, null);
        }

        if (outDir) {
            RSA.saveKeyPairs(outDir, keyPair, (err) => {

                if (err) {
                    return cb(err, null);
                }
                return cb(null, `Saved public and private key to directory ${outDir}`);
            });
        }
        else {
            return cb(null, keyPair);
        }

    });


};
