'use strict'

const Seneca = require('seneca')
const Mesh = require('seneca-mesh')
const Counter = require('seneca-counter-firebase')
const envs = process.env

const options = {
  seneca: {
    tag: envs.TFK_SENECA_MESH_COUNTER_TAG || 'tfk-seneca-counter'
  },
  mesh: {
    auto: true,
    listen: [
      {pin: 'role:counter, cmd:add', model: 'consume'},
      {pin: 'role:counter, cmd:subtract', model: 'consume'},
      {pin: 'role:counter, cmd:get', model: 'consume'}
    ]
  },
  counterOptions: {
    tag: envs.TFK_SENECA_MESH_COUNTER_TAG || 'tfk-seneca-counter',
    apiKey: envs.TFK_SENECA_MESH_COUNTER_FIREBASE_API_KEY,
    authEmail: envs.TFK_SENECA_MESH_COUNTER_FIREBASE_AUTH_EMAIL,
    authPassword: envs.TFK_SENECA_MESH_COUNTER_FIREBASE_AUTH_PASSWORD,
    databaseURL: envs.TFK_SENECA_MESH_COUNTER_FIREBASE_URL || 'https://seneca-firebase-test.firebaseio.com'
  },
  isolated: {
    host: envs.TFK_SENECA_MESH_COUNTER_HOST || 'localhost',
    port: envs.TFK_SENECA_MESH_COUNTER_PORT || 8000
  }
}

const Service = Seneca(options.seneca)

if (envs.TFK_SENECA_MESH_COUNTER_ISOLATED) {
  Service.listen(options.isolated)
} else {
  Service.use(Mesh, options.mesh)
}

Service.use(Counter, options.counterOptions)
