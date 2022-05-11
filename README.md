# EVM Faucet

This is a Faucet app for Ethereum Virtual Machine (EVM) compatible blockchains.  It is forked from Avalanche faucet (https://github.com/ava-labs/avalanche-faucet) and modified to remove all non-EVM related code.  Therefore, it will only work with the C-Chain or any EVM compatible subnets on Avalanche network as well as any EVM blockchain.

There are two different layers in this project. The Node Express backend and the Vue.js frontend.

## Requirements
- Recent version of npm (6.13.4)
- Node v14.16.0
- Google reCaptcha keys for **reCaptcha v2** with **"I'm not a robot" Checkbox**. Make sure to have 'localhost' listed in the domains. (https://www.google.com/recaptcha/intro/v3.html)

## Vue Application
### Installation
1) Clone the repository ``git clone https://github.com/Dexalot/evm-faucet.git``
2) Go to the root directory `cd evm-faucet`
3) Install javascript dependencies with ``yarn install``.
4) Create a ``.env`` file by copying ``.env.example``.

### ENV Files
Variables beginning with ``VUE_APP_`` will get injected into the vue application.

Refer to ``.env.example``

- ``ASSET_ID`` The asset id of the asset the faucet will give
- ``DROP_SIZE`` How much gas token is given from this faucet in wei unit
- ``PRIVATE_KEY`` A private key for the C chain with funds in it to be dripped
- ``RPC_URL`` The URL address to the evm RPC node
- ``CAPTCHA_SECRET`` Your captcha secret from Google reCaptcha
- ``VUE_APP_CAPTCHA_SITE_KEY`` Your public site captcha key from Google reCaptcha
- ``ERL_WINDOW_MIN`` Time period for which requests are checked/remembered in minutes
- ``ERL_MAX_HIT`` The maximum number of connections to allow during the time window
- ``ERL_NUM_PROXIES`` The number of proxies between the user and the server

### Running The Project

The faucet needs an EVM rpc node to connect.
1) Enter all environment variables correctly and fund your private key with enough funds for faucet to drip.
2) Run the project with hot reloading using ``yarn serve``

When you go to the website on your browser, you might get a warning saying
'Site is not secure'.  Install an SSL certificate following your cloud provider's instructions for production environments.

# Node Express

The backend is used to verify captchas and make a request to the EVM RPC node to issue tokens. The backend files are stored
in the ``src/server`` directory.

The node is automatically started with the ``yarn serve`` command but can be individually started with ``node src/server/index.js``

## Deployment

 1) Setup environment variables for production
 2) Compile and minify to have a production ready application with the appropriate ``yarn build-*`` command. Customize build command in package.json as needed.
 3) Run the node backend by running ``node src/server/index.js``. Procfile in the root directory will do this step automatically if you are deploying it as an AWS Elastic Beanstalk app.  Check specifics of your cloud provider as needed.

# Browser Support

We suggest using Google Chrome to view the EVM Faucet website.

### Firefox and https

Firefox does not allow https requests to localhost. But the EVM Faucet uses https by default, so we will need to change this to http. Make this switch by editing the `vue.config.json` file in the root directory and change

```
devServer: {
    https: true
},
```

to

```
devServer: {
    https: false
},
```

and run `yarn serve` to reflect the change.

### Query Parameters

You can pass in the fields below to the faucet URL.
1) `address` for example `<EVM FAUCET URL>/?address=0xbcd4042de499d14e55001ccbb24a551f3b954096`. Will populate the address field from the query.

### QR Reader and HTTPS

Most browsers disable access to cameras if the website is not served over https.
For this reason the QR reader at the address input field may fail to find any cameras if served over http.

### Rate Limiting

EVM Faucet uses express-rate-limit node.js package (https://github.com/nfriedly/express-rate-limit).  If you are behind a proxy/load balancer (usually the case with most hosting services, e.g. Heroku, Bluemix, AWS ELB, Nginx, Cloudflare, etc.), you may need to read the section on Troubleshooting Proxy Issues at https://github.com/nfriedly/express-rate-limit#troubleshooting-proxy-issues.
