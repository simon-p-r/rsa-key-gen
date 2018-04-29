'use strict';

const Code = require('code');
const Fs = require('fs');
const Lab = require('lab');
const Os = require('os');
const Path = require('path');
const Cli = require('../lib/cli');
const RSA = require('../lib/index');


// Declare internals
const internals = {};


const rmDir = (dir) => {

    const s = Fs.lstatSync(dir);
    if (s.isFile()) {
        Fs.unlinkSync(dir);
    }
    if (!s.isDirectory()) {
        return;
    }

    const fileArr = Fs.readdirSync(dir);
    for (const f in fileArr) {
        rmDir(dir + '/' + fileArr[f]);
    }

    Fs.rmdirSync(dir);
};


// Test shortcuts
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('Cli', () => {

    const keysDir = `${Os.tmpdir()}${Path.sep}keys`;
    const rootDir = `${Os.tmpdir()}${Path.sep}keys${Path.sep}root`;
    lab.before(() => {

        try {
            Fs.mkdirSync(keysDir);
            Fs.mkdirSync(rootDir);
        }
        catch (e) {

        }


    });

    lab.after(() => {

        try {
            rmDir(keysDir);
            rmDir(rootDir);
        }
        catch (e) {

        }
    });

    it('runs fails to run command due to invalid args', () => {

        const errArgs = ['-invalid', 'args'];
        return new Promise((resolve) => {

            Cli.run(errArgs, (err, output) => {

                expect(err).to.exist();
                expect(output).to.not.exist();
                resolve();
            });
        });
    });

    it('should show help when -h flag is called', () => {

        const helpArgs = ['-h'];
        return new Promise((resolve) => {

            Cli.run(helpArgs, (err, output) => {

                expect(err).to.not.exist();
                expect(output).to.exist();
                resolve();
            });
        });
    });

    it('should show version of project when -v flag is called', () => {

        const versionArgs = ['-v'];
        return new Promise((resolve) => {

            Cli.run(versionArgs, (err, output) => {

                expect(err).to.not.exist();
                expect(output).to.contain('v');
                resolve();
            });
        });
    });

    it('should return an error when keyPairs cannot be generated due to invalid openssl path', () => {

        RSA.setOpenSSLPath('invalid');
        const args = ['-b', '2048'];
        return new Promise((resolve) => {

            Cli.run(args, (err, output) => {

                expect(err).to.exist();
                expect(err.message).to.contain('Could not find openssl');
                expect(output).to.not.exist();
                RSA.setOpenSSLPath('openssl');
                resolve();
            });
        });
    });

    it('should generate KeyPairs and save to a specified directory', () => {

        const args = ['-d', keysDir];
        return new Promise((resolve) => {

            Cli.run(args, (err, output) => {

                expect(err).to.not.exist();
                expect(output).to.exist();
                resolve();
            });
        });
    });

    it('should generate KeyPairs and using a root plus directory flags', () => {

        const args = ['-r', rootDir, '-d', './'];
        return new Promise((resolve) => {

            Cli.run(args, (err, output) => {

                expect(err).to.not.exist();
                expect(output).to.exist();
                resolve();

            });
        });
    });


    it('should fail to save generated KeyPairs due to an invalid directory', () => {

        const args = ['-d', 'invalid/directory'];
        return new Promise((resolve) => {

            Cli.run(args, (err, output) => {

                expect(err).to.exist();
                expect(output).to.not.exist();
                resolve();
            });
        });
    });

    it('should generate keyPairs and print via stdout', () => {

        const args = [];
        return new Promise((resolve) => {

            Cli.run(args, (err, output) => {

                expect(err).to.not.exist();
                expect(output).to.exist();
                resolve();
            });
        });
    });
});
