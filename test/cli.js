'use strict';

const Code = require('code');
const Lab = require('lab');
const Mkdirp = require('mkdirp');
const Os = require('os');
const Path = require('path');
const Rmdir = require('rimraf');
const Cli = require('../lib/cli');
const RSA = require('../lib/index');

// Declare internals
const internals = {};


// Test shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('Cli', () => {

    const keysDir = `${Os.tmpdir()}${Path.sep}keys`;
    const rootDir = `${Os.tmpdir()}${Path.sep}keys${Path.sep}root`;
    lab.before((done) => {

        Mkdirp.sync(keysDir);
        Mkdirp.sync(rootDir);
        done();
    });

    lab.after((done) => {

        Rmdir.sync(keysDir);
        Rmdir.sync(rootDir);
        done();
    });

    it('runs fails to run command due to invalid args', (done) => {

        const errArgs = ['-invalid', 'args'];
        Cli.run(errArgs, (err, output) => {

            expect(err).to.exist();
            expect(output).to.not.exist();
            done();
        });
    });

    it('should show help when -h flag is called', (done) => {

        const helpArgs = ['-h'];
        Cli.run(helpArgs, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
            done();
        });
    });

    it('should show version of project when -v flag is called', (done) => {

        const versionArgs = ['-v'];
        Cli.run(versionArgs, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.contain('v');
            done();
        });
    });

    it('should return an error when keyPairs cannot be generated due to invalid openssl path', (done) => {

        RSA.setOpenSSLPath('invalid');
        const args = ['-b', '2048'];
        Cli.run(args, (err, output) => {

            expect(err).to.exist();
            expect(err.message).to.contain('Could not find openssl');
            expect(output).to.not.exist();
            RSA.setOpenSSLPath('openssl');
            done();
        });
    });

    it('should generate KeyPairs and save to a specified directory', (done) => {

        const args = ['-d', keysDir];
        Cli.run(args, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
            done();
        });
    });

    it('should generate KeyPairs and using a root plus directory flags', (done) => {

        const args = ['-r', rootDir, '-d', './'];
        Cli.run(args, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
            done();
        });
    });


    it('should fail to save generated KeyPairs due to an invalid directory', (done) => {

        const args = ['-d', 'invalid/directory'];
        Cli.run(args, (err, output) => {

            expect(err).to.exist();
            expect(output).to.not.exist();
            done();
        });
    });

    it('should generate keyPairs and print via stdout', (done) => {

        const args = [];
        Cli.run(args, (err, output) => {

            expect(err).to.not.exist();
            expect(output).to.exist();
            done();
        });
    });





});
