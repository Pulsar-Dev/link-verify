# Pulsar Link Verify
Pulsar Link Verify is the verification site for the Pulsar Link project.
It allows users to link their Discord and Steam accounts to their Gmodstore account
and then link them all together to a Pulsar ID using the Pulsar Link Backend.
It is designed to be used with the rest of the Pulsar Link project and will not function without it.

## Installation
1. Download [bun.sh](https://bun.sh/)
2. Clone the repository
3. Create a `.env` file based on [`.env.example`](https://github.com/Pulsar-Dev/link-verify/blob/master/.env.example)
4. Run `bun install`
5. Run `bun run build`
6. Start the server with `bun ./build/index.js`

## Building
1. Download [bun.sh](https://bun.sh/)
2. Clone the repository
3. Create a `.env` file based on [`.env.example`](https://github.com/Pulsar-Dev/link-verify/blob/master/.env.example)
4. Run `bun install`
5. Run `bun run dev` for development—for production, check the Installation section