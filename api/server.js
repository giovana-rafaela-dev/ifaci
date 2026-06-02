const express = require('express')
const cors = require('cors')

const api = express()

api.use(express.json())
api.use(cors())

let nextUserId = 2
let nextDeviceId = 2
let nextSensorId = 0
const autoGenerateIot = process.env.AUTO_GENERATE_IOT !== 'false'

const usuarios = [
  {
    id: 1,
    nome: 'Administrador',
    email: 'admin@toyota.com',
    senha: 'admin123',
    perfil: 'Administrador',
    status: 'Ativo',
  },
]

const iotData = []

const devices = [
  {
    id: 1,
    nome: 'Sensor principal',
    tipo: 'Estacao IoT',
    local: 'Linha 01',
    sensorId: 1,
    status: 'Ativo',
  },
]

function findById(collection, id) {
  return collection.find((item) => item.id === Number(id))
}

function sanitizeUser(user) {
  const { senha, ...safeUser } = user
  return safeUser
}

function randomBetween(min, max, precision = 1) {
  return Number((min + Math.random() * (max - min)).toFixed(precision))
}

function createRandomSensorData() {
  const temperatura = randomBetween(18, 85)
  const pressao = randomBetween(0.8, 3.8, 2)
  const umidade = randomBetween(35, 90)
  const sensor_presenca = Math.random() > 0.45

  return {
    temperatura,
    pressao,
    umidade,
    sensor_presenca,
    trava_seguranca: temperatura < 70 && pressao < 3.2 && !sensor_presenca,
  }
}

function createSensorData(payload) {
  nextSensorId += 1

  const newData = {
    id: nextSensorId,
    temperatura: Number(payload.temperatura),
    pressao: Number(payload.pressao),
    umidade: Number(payload.umidade),
    sensor_presenca: Boolean(payload.sensor_presenca),
    trava_seguranca: Boolean(payload.trava_seguranca),
    createdAt: new Date().toISOString(),
  }

  iotData.push(newData)
  return newData
}

api.get('/health', (req, res) => {
  res.status(200).send({ status: 'ok' })
})

api.post('/login', (req, res) => {
  const { email, senha } = req.body
  const user = usuarios.find((item) => item.email === email && item.senha === senha)

  if (!user) {
    return res.status(401).send({ msg: 'Email ou senha invalidos.' })
  }

  return res.status(200).send({
    msg: 'Login realizado com sucesso.',
    user: sanitizeUser(user),
  })
})

api.get('/usuarios', (req, res) => {
  res.status(200).send(usuarios.map(sanitizeUser))
})

api.post('/usuarios', (req, res) => {
  const { nome, email, senha, perfil = 'Operador', status = 'Ativo' } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).send({ msg: 'Nome, email e senha sao obrigatorios.' })
  }

  const emailExists = usuarios.some((user) => user.email === email)
  if (emailExists) {
    return res.status(409).send({ msg: 'Ja existe um usuario com este email.' })
  }

  const user = {
    id: nextUserId++,
    nome,
    email,
    senha,
    perfil,
    status,
  }

  usuarios.push(user)
  return res.status(201).send(sanitizeUser(user))
})

api.put('/usuarios/:id', (req, res) => {
  const user = findById(usuarios, req.params.id)

  if (!user) {
    return res.status(404).send({ msg: 'Usuario nao encontrado.' })
  }

  const { nome, email, senha, perfil, status } = req.body

  if (email && usuarios.some((item) => item.email === email && item.id !== user.id)) {
    return res.status(409).send({ msg: 'Ja existe um usuario com este email.' })
  }

  const updates = {
    nome: nome ?? user.nome,
    email: email ?? user.email,
    perfil: perfil ?? user.perfil,
    status: status ?? user.status,
  }

  if (senha) {
    updates.senha = senha
  }

  Object.assign(user, updates)

  return res.status(200).send(sanitizeUser(user))
})

api.delete('/usuarios/:id', (req, res) => {
  const index = usuarios.findIndex((user) => user.id === Number(req.params.id))

  if (index === -1) {
    return res.status(404).send({ msg: 'Usuario nao encontrado.' })
  }

  usuarios.splice(index, 1)
  return res.status(200).send({ msg: 'Usuario removido com sucesso.' })
})

api.get('/iot', (req, res) => {
  res.status(200).send(iotData)
})

api.get('/sensor/:id', (req, res) => {
  const sensorData = findById(iotData, req.params.id) ?? iotData[Number(req.params.id)]

  if (!sensorData) {
    return res.status(404).send({ msg: 'Dados do sensor nao encontrados.' })
  }

  res.status(200).send(sensorData)
})

api.get('/devices', (req, res) => {
  res.status(200).send(devices)
})

api.post('/devices', (req, res) => {
  const { nome, tipo, local = 'Nao informado', sensorId, status = 'Ativo' } = req.body

  if (!nome || !tipo) {
    return res.status(400).send({ msg: 'Nome e tipo sao obrigatorios.' })
  }

  const device = {
    id: nextDeviceId++,
    nome,
    tipo,
    local,
    sensorId: sensorId ? Number(sensorId) : null,
    status,
  }

  devices.push(device)
  return res.status(201).send(device)
})

api.put('/devices/:id', (req, res) => {
  const device = findById(devices, req.params.id)

  if (!device) {
    return res.status(404).send({ msg: 'Dispositivo nao encontrado.' })
  }

  const { nome, tipo, local, sensorId, status } = req.body

  Object.assign(device, {
    nome: nome ?? device.nome,
    tipo: tipo ?? device.tipo,
    local: local ?? device.local,
    sensorId: sensorId === undefined ? device.sensorId : Number(sensorId),
    status: status ?? device.status,
  })

  return res.status(200).send(device)
})

api.delete('/devices/:id', (req, res) => {
  const index = devices.findIndex((device) => device.id === Number(req.params.id))

  if (index === -1) {
    return res.status(404).send({ msg: 'Dispositivo nao encontrado.' })
  }

  devices.splice(index, 1)
  return res.status(200).send({ msg: 'Dispositivo removido com sucesso.' })
})

api.post('/newData', (req, res) => {
  const payload = req.body && Object.keys(req.body).length > 0
    ? req.body
    : createRandomSensorData()
  const newData = createSensorData(payload)
  return res.status(201).send({ message: 'Dados recebidos com sucesso!', data: newData })
})

api.post('/newData/random', (req, res) => {
  const newData = createSensorData(createRandomSensorData())
  return res.status(201).send({ message: 'Leitura aleatoria gerada com sucesso!', data: newData })
})

api.put('/sensor/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = iotData.findIndex((item) => item.id === id)

  if (index !== -1) {
    iotData[index] = { ...iotData[index], ...req.body, id, updatedAt: new Date().toISOString() }
    return res.status(200).send({
      msg: 'Dados do sensor atualizados!',
      data: iotData[index],
    })
  }

  const newData = {
    id,
    ...req.body,
    createdAt: new Date().toISOString(),
  }

  iotData.push(newData)
  nextSensorId = Math.max(nextSensorId, id)

  return res.status(201).send({
    msg: 'Dados do sensor criados!',
    data: newData,
  })
})

const porta = process.env.PORT || 8080
api.listen(porta, () => {
  console.log(`API rodando na porta ${porta}`)

  if (autoGenerateIot) {
    createSensorData(createRandomSensorData())
    setInterval(() => {
      createSensorData(createRandomSensorData())
    }, 5000)
  }
})
