# Push Snap

Push snap is a tool that allows users to receive real-time notification alerts of their favourite web3 applications directly in their Metamask wallet.

Push snaps aims to resolve this specific UX issue by bringing all essential updates of the user directly into their Metamask wallet itself. This completely eliminates the need to bounce between multiple web3 applications as the user’s Metamask wallet itself acts as a unified notification center for all imperative web3t updates for the user.

## Installing the Snap in your Metamask

Installation and set up of Push Snap includes 5-simple steps:

1. Go to [Metamask Snap Directory](https://snaps.metamask.io/snap/npm/pushprotocol/snap/)
2. **Installation of Snap**: Click on Add to Metamask button shown above. This initiates the process of adding Push snap to your own metamask wallet.
3. **Setting-Up Push Snap**: Once installed, you should be prompted to visit [Push Dapp](https://app.push.org/snap). Visit the dapp to proceed with next steps.
4. **Adding your Address to the Snap**: Once connected to the dapp, the snap will require confirmation to add your address. Addition of address in the snap means enabling your wallet to receive notifications.
5. **Opt-In to Channels**: Once address is added, simply click on Get Started. This takes you to the [Push Protocol Channels](https://app.push.org/channels) page wherein you can opt-in to any of your favourite channels to receive real-time notifications.



---
## Installation and Set-Up Guide
1. Clone the project

  ```
git clone https://github.com/ethereum-push-notification-service/push-protocol-snaps
  
```
2. Go to the snap directory
3. cd snap
4. Install dependencies

```
  yarn install
```
5. Start the server

```
  yarn start
```

6. Go to the dapp directory

```
  cd push-snap-site
```

7. Install dependencies

```
  npm i
```

8. Start the server

`  npm run dev`

---

## Permissions required by Push Snap

- **Local storage:** To store the addresses to send notifications and PGP private key to send PUSH Chat notifications
- **Periodic actions**: This includes sending notifications every minute to the wallet
- **Dialog Boxes**: This includes Popups for showing notifications on screen and the initial screen
- **Internet Access**: The snap has internet access and can make API calls using fetch()
- **Ethereum Provider**: This allows the snap to access the first connected account in metamask

> Note: *This doesn’t have access to any KEYS and can’t initiate any transactions on anyone’s behalf.***

---

## Resources
- **[Website](https://push.org)** To checkout our Product.
- **[Docs](https://docs.push.org/developers/)** For comprehensive documentation.
- **[Blog](https://medium.com/push-protocol)** To learn more about our partners, new launches, etc.
- **[Discord](https://discord.com/invite/pushprotocol)** for support and discussions with the community and the team.
- **[GitHub](https://github.com/ethereum-push-notification-service)** for source code, project board, issues, and pull requests.
- **[Twitter](https://twitter.com/pushprotocol)** for the latest updates on the product and published blogs.


## Contributing

Push Protocol is an open source Project. We firmly believe in a completely transparent development process and value any contributions. We would love to have you as a member of the community, whether you are assisting us in bug fixes, suggesting new features, enhancing our documentation, or simply spreading the word. 

- Bug Report: Please create a bug report if you encounter any errors or problems while utilising the Push Protocol.
- Feature Request: Please submit a feature request if you have an idea or discover a capability that would make development simpler and more reliable.
- Documentation Request: If you're reading the Push documentation and believe that we're missing something, please create a docs request.


Read how you can contribute <a href="https://github.com/ethereum-push-notification-service/push-sdk/blob/main/contributing.md">HERE</a>

Not sure where to start? Join our discord and we will help you get started!


<a href="https://discord.com/invite/pushprotocol" title="Join Our Community"><img src="https://www.freepnglogos.com/uploads/discord-logo-png/playerunknown-battlegrounds-bgparty-15.png" width="200" alt="Discord" /></a>

## License
Check out our License <a href='https://github.com/ethereum-push-notification-service/push-sdk/blob/main/license-v1.md'>HERE </a>
