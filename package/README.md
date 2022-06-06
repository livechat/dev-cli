# <img src="https://livechat.design/images/livechat/DIGITAL%20%28RGB%29/SVG/Mark_RGB_Orange.svg" widht="24px" height="24px" /> LiveChat Developer Console CLI

> This project unlocks LiveChat Developer Console capabilities in form of easy to use CLI application. Additionally it allows for quick application bootstrap and project scaffolding.

[![mit](https://img.shields.io/badge/license-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
![GitHub package.json version](https://img.shields.io/github/package-json/v/livechat/dev-cli)
[![Check](https://github.com/livechat/dev-cli/actions/workflows/check.yml/badge.svg?branch=main)](https://github.com/livechat/dev-cli/actions/workflows/check.yml)

## 📦 Installation

Use the [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package managers to install the dev-cli package in your project.

```bash
npm install -g @livechat/dev-cli
# or
yarn global add @livechat/dev-cli
```

## 🚀 Usage

```text
LiveChat Developer Console CLI

lcdev [command]

Commands:
  lcdev init [dirName]  scafold new LiveChat app project from template
  lcdev login           login with your LiveChat account
  lcdev bootstrap       bootstrap new LiveChat app using config file
  lcdev create          create new LiveChat app
  lcdev widget          setup agent app widget
  lcdev auth            setup app authorization
  lcdev app-webhooks    setup app webhooks
  lcdev chat-webhooks   setup chat webhooks
  lcdev chat-actions    setup chat actions
  lcdev chat-boosters   setup chat boosters
  lcdev remove          remove app

Options:
  --help     Show help
  --version  Show version number
```

## ⚙️ Getting started

Below you'll find a step by step guide how to go from a brand new LiveChat Developer Program account to a fully working LiveChat application ready to be used on your LiveChat account.

> **Warning**
> Before you start make sure to already have a LiveChat account (you can [create one here](https://accounts.livechat.com/signup)). You will also need Ngrok together with its free account installed on your computer to obtain a temporary and secure public domain for your local application (follow [these instructions](https://ngrok.com/download)).

1. Install the `LiveChat Developer Console CLI`:

```sh
npm install -g @livechat/dev-cli
```

2. Verify that you are using the latest version and can access the CLI:

```sh
lcdev --version
```

3. Login to your LiveChat account inside the CLI:

```sh
lcdev login
```

4. Initialize a new project from our official [Nex.js app template](https://github.com/livechat/next-app):

```sh
lcdev init first-livechat-app
```

5. Install project dependencies and start local dev server:

```sh
cd first-livechat-app
npm install
npm run dev
```

6. Open the HTTP tunnel to obtain secure public domain for your local app:

```sh
ngrok http 3000
```

7. Bootstrap your new LiveChat app by providing the newly established public domain:

```sh
lcdev bootstrap --baseURL <your-https-domain-from-ngrok>
```

## 🏗 Contributing

Read the [Contributing Guide](CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes.

This project has adopted a [Code of Conduct](CODE_OF_CONDUCT.md) that we expect project participants to adhere to. Please read the full text so that you can understand what actions will and will not be tolerated.

## 📃 License

The code and documentation in this project are released under the [MIT License](https://choosealicense.com/licenses/mit/).
