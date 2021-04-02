# Shockwallet Alpha
[![GitHub last commit](https://img.shields.io/github/last-commit/shocknet/PWA?style=flat-square)](https://github.com/shocknet/PWA/commits/master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) 
[![Chat](https://img.shields.io/badge/chat-on%20Telegram-blue?style=flat-square)](https://t.me/Shockwallet)
[![Twitter Follow](https://img.shields.io/twitter/follow/ShockBTC?style=flat-square)](https://twitter.com/shockbtc)

![Banner](https://pbs.twimg.com/profile_banners/971667736978972673/1598594052)
Shockwallet connects to your remote Lightning node and overlays [graph user nodes](https://gun.eco/) for a decentralized social network.

Running a Shockwallet node requires the [Shock API](https://github.com/shocknet/api) backend and [LND](https://github.com/lightningnetwork/lnd)

If you don't have a node already, hosting is offered in-app or a _Node installer available at [shocknet/Wizard](https://github.com/shocknet/wizard)_

## Features:


- [X] Basic LND Channel and Peer Management
- [ ] Fee Control from [mempool.space](https://github.com/mempool/mempool) source
- [ ] LNURL-Pay, Withdraw and Channel
- [X] Social Personas, Presence Indication and Feeds
- [X] E2EEncrypted Chat/Messaging
- [X] Automatic Seed and Channel Backup
- [X] Sender-Initiated Payments (Keysend-less)
- [ ] Provider-less Notifications with node monitor (SSL required)
- [X] LND 12 with Keysend & MPP (sharded payments)
- [X] Invoice liquidity intercept
- [X] Torrent Content Streaming
- [X] Torrent Publishing and Seed Service
- [X] Livestream from Broadcaster
- [X] Guest Webclient (prototype)
- [ ] Advanced Coin Control and PSBT 
- [ ] Advanced Channel Management
- [ ] Automatic Swaps
- [ ] Portable LNURL-Auth Keyring


### Build from source

```
git clone https://github.com/shocknet/PWA
cd PWA
npm install
npm start
```

#### Contributions:

Make a PR or send sats to: `bc1q2pn0rf92mt3pznjxq9gg3wkmjv0cmuy88tmfl8`

<hr></hr>

**If you find any issues with this project, or would like to suggest an enhancement, please [tell us](https://github.com/shocknet/PWA/issues).**

© 2021 [Shock Network, Inc.](https://shockwallet.app)
