
# Push Protocol Snap

A MetaMask Snap for delivering channel notifications and chat notifications right in your metamask wallet


## Run Locally

Clone the project

```bash
  git clone https://github.com/ethereum-push-notification-service/push-protocol-snaps
```

Go to the snap directory

```bash
  cd snap
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn start
```

Go to the dapp directory

```bash
  cd push-snap-site
```

Install dependencies

```bash
  npm i
```

Start the server

```bash
  npm run dev
```

## Using the npm package
 Make the following changes in the dapp
 - Change all occurrences of ```defaultSnapOrigin``` from ```local:http://localhost:8080``` to ```npm:push-notify```  in the push-snap-site codebase

## Permissions asked by the Snap
- Local-storage : To store the addresses to send notifications and pgp private key to send PUSH Chat notifications
- Periodic actions (Cron job) : This include sending notifications every minute to the wallet
- Dialog Boxes : This includes Popups for showing notifications on screen and initial screen
- Internet Access : The snap has internet access and can make api calls using fetch()
- Ethereum Provider : This allows the snap to access the first connected account in metamask (🚨 This doesn’t not have access to your funds neither can do transaction on your behalf)



