'use strict';

const path = require('path');

const express = require('express');
const expressSession = require('express-session');
const debug = require('debug')('Server');

const Util = require('./Util');
const ServerError = require('./ServerError');
const WireGuard = require('../services/WireGuard');
const Telegram = require('../services/Telegram') 
const os = require('os')

const {
  PORT,
  RELEASE,
  PASSWORD,
} = require('../config');
const { type } = require('os');

module.exports = class Server {

  constructor() {
    // Express
    this.app = express()
      .disable('etag')
      .use('/', express.static(path.join(__dirname, '..', 'www')))
      .use(express.json())
      .use(expressSession({
        secret: String(Math.random()),
        resave: true,
        saveUninitialized: true,
      }))

      .get('/api/release', (Util.promisify(async () => {
        return RELEASE;
      })))

      // Authentication
      .get('/api/session', Util.promisify(async req => {
        const requiresPassword = !!process.env.PASSWORD;
        const authenticated = requiresPassword
          ? !!(req.session && req.session.authenticated)
          : true;

        return {
          requiresPassword,
          authenticated,
        };
      }))
      .post('/api/session', Util.promisify(async req => {
        const {
          password,
        } = req.body;
        const notifyText = `WireGuard面板登陆【@status】提醒
主机名称:${os.hostname()}
时间:${new Date().toLocaleString('zh-CN')}
IP:${req.ip}`

        if (typeof password !== 'string') {
          Telegram.notifyText(notifyText.replace("@status","失败"));
          throw new ServerError('密码格式不正确', 401);
        }

        if (password !== PASSWORD) {
          Telegram.notifyText(notifyText.replace("@status","失败"));
          throw new ServerError('密码错误', 401);
        }
        Telegram.notifyText(notifyText.replace("@status","成功"));
        
        req.session.authenticated = true;
        req.session.save();
        
        debug(`New Session: ${req.session.id}`);
      }))

      // WireGuard
      .use((req, res, next) => {
        if (!PASSWORD) {
          return next();
        }

        if (req.session && req.session.authenticated) {
          return next();
        }

        return res.status(401).json({
          error: 'Not Logged In',
        });
      })
      .delete('/api/session', Util.promisify(async req => {
        const sessionId = req.session.id;

        req.session.destroy();

        debug(`Deleted Session: ${sessionId}`);
      }))
      .get('/api/wireguard/client', Util.promisify(async req => {
        return WireGuard.getClients();
      }))
      .get('/api/wireguard/client/:clientId/qrcode.svg', Util.promisify(async (req, res) => {
        const { clientId } = req.params;
        const svg = await WireGuard.getClientQRCodeSVG({ clientId });
        res.header('Content-Type', 'image/svg+xml');
        res.send(svg);
      }))
      .get('/api/wireguard/client/:clientId/configuration', Util.promisify(async (req, res) => {
        const { clientId } = req.params;
        const client = await WireGuard.getClient({ clientId });
        const config = await WireGuard.getClientConfiguration({ clientId });
        const configName = client.name
          .replace(/[^a-zA-Z0-9_=+.-]/g, '-')
          .replace(/(-{2,}|-$)/g, '-')
          .replace(/-$/, '')
          .substring(0, 32);
        res.header('Content-Disposition', `attachment; filename="${configName || clientId}.conf"`);
        res.header('Content-Type', 'text/plain');
        res.send(config);
      }))
      .post('/api/wireguard/client', Util.promisify(async req => {
        const { name } = req.body;
        return WireGuard.createClient({ name });
      }))
      .delete('/api/wireguard/client/:clientId', Util.promisify(async req => {
        const { clientId } = req.params;
        return WireGuard.deleteClient({ clientId });
      }))
      .post('/api/wireguard/client/:clientId/enable', Util.promisify(async req => {
        const { clientId } = req.params;
        return WireGuard.enableClient({ clientId });
      }))
      .post('/api/wireguard/client/:clientId/disable', Util.promisify(async req => {
        const { clientId } = req.params;
        return WireGuard.disableClient({ clientId });
      }))
      .put('/api/wireguard/client/:clientId/name', Util.promisify(async req => {
        const { clientId } = req.params;
        const { name } = req.body;
        return WireGuard.updateClientName({ clientId, name });
      }))
      .put('/api/wireguard/client/:clientId/address', Util.promisify(async req => {
        const { clientId } = req.params;
        const { address } = req.body;
        return WireGuard.updateClientAddress({ clientId, address });
      }))

      .listen(PORT, () => {
        debug(`Listening on http://0.0.0.0:${PORT}`);
      });
  }

};
