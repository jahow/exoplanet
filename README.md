# EXOPLANET

A very simple application that aims to become a game, where players interact with a common environment that is made of material blocks on a 2D grid and which runs an advanced simulation.

Frontend and backend are written in javascript. Both run the same simulation code and the client regularly sync its environment state with the backend.

Rendering is done with [Babylon.js](www.babylonjs.com).

## installation

```
$ npm install
$ npm start
```

The game is accessible on `localhost:8080`.

## development

```
$ npm run dev
```

The game will run in development mode, i.e. code is readable and the server will be restarted on every code change (frontend or backend).

The game is accessible on `localhost:8080`

To go into debug mode, press `*`.
