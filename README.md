# Shockwallet Alpha

[![GitHub last commit](https://img.shields.io/github/last-commit/shocknet/PWA?style=flat-square)](https://github.com/shocknet/PWA/commits/master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![Chat](https://img.shields.io/badge/chat-on%20Telegram-blue?style=flat-square)](https://t.me/Shockwallet)
[![Twitter Follow](https://img.shields.io/twitter/follow/ShockBTC?style=flat-square)](https://twitter.com/shockbtc)

![Banner](https://pbs.twimg.com/profile_banners/971667736978972673/1598594052)
Shockwallet runs in a browser and connects to your remote Lightning node, it uses [graph user nodes](https://gun.eco/) to offer a decentralized social network and other features.

Running a node for Shockwallet requires the [Shock API](https://github.com/shocknet/api) backend and [LND](https://github.com/lightningnetwork/lnd)

If you don't have a node already, hosting is offered in the app, or a _Node installer available at [shocknet/Wizard](https://github.com/shocknet/wizard)_

## Features:

- [x] Basic LND Channel and Peer Management
- [ ] Fee Control from [mempool.space](https://github.com/mempool/mempool) source
- [x] LNURL-Pay, Withdraw and Channel
- [x] Social Personas, Presence Indication and Feeds
- [x] E2EEncrypted Chat/Messaging
- [x] Automatic Seed and Channel Backup
- [x] Sender-Initiated Payments (Keysend-less)
- [ ] Provider-less Notifications with node monitor (SSL required)
- [x] LND 12 with Keysend & MPP (sharded payments)
- [x] Invoice liquidity intercept
- [x] Torrent Content Streaming
- [x] Torrent Publishing and Seed Service
- [x] Livestream from Broadcaster
- [x] Guest Webclient (prototype)
- [ ] Advanced Coin Control and PSBT
- [ ] Advanced Channel Management
- [ ] Automatic Swaps
- [ ] Portable LNURL-Auth Keyring

## Try it out

Run it directly from Github: [https://wallet.shock.pub](https://wallet.shock.pub)

### Or build from source

```
git clone https://github.com/shocknet/PWA
cd PWA
npm install
npm start
```

To work properly, Shockwallet should be served with an SSL certificate.

#### Contributions:

Make a PR or send sats to: `bc1q2pn0rf92mt3pznjxq9gg3wkmjv0cmuy88tmfl8`

<hr></hr>

**If you find any issues with this project, or would like to suggest an enhancement, please [tell us](https://github.com/shocknet/PWA/issues).**

© 2021 [Shock Network, Inc.](https://shockwallet.app)
