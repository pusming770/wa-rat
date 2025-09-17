// module.js
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@yupra/baileys');
const admin = require('firebase-admin');
const fs = require('fs');
const chalk = require('chalk');
const pino = require('pino');
const readlineSync = require('readline-sync');
const { default: ora } = require('ora');
const figlet = require('figlet');
const gradient = require('gradient-string');

module.exports = {
    makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    admin,
    fs,
    chalk,
    pino,
    readlineSync,
    ora,
    figlet,
    gradient
};