# Simple Logger

A very simple logger that generates one file per message event for a server.

It's written in [Node.js](https://nodejs.org/en/) with [TypeScript](https://www.typescriptlang.org/).

# Reasoning Behind This Logger

Plenty of loggers are there for developers, system administrators, *etc.* and thus write lots of log events to as few files as possible. This one does the opposite: it logs one log event to a file at a time.

The idea behind it is that it provides a light-weight logger that can be used to produce one `JSON` file per event so as to send it to someone who might not be a developer. This could be someone who has to interface between a client and the dev team, for example, and thus this logger could serve as inspiration for producing a more "non-tech" way of sending information to other people.

File logging could be set up to a mail server that sends an email to someone in another team, for example.

# Getting Started

// Coming soon!

# Requirements

Node version 12+.

