"use client"

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

type Tab = "dashboard" | "usuarios" | "dispositivos" | "sensores"

type User = {
  id: number
  nome: string
  email: string
  senha?: string
  perfil: string
  status: string
}

type Device = {
  id: number
  nome: string
  tipo: string
  local: string
  sensorId: number | null
  status: string
}

type SensorData = {
  id: number
  temperatura?: number
  pressao?: number
  umidade?: number
  sensor_presenca?: boolean
  trava_seguranca?: boolean
  createdAt?: string
  updatedAt?: string
}

const emptyUser = {
  nome: "",
  email: "",
  senha: "",
  perfil: "Operador",
  status: "Ativo",
}

const emptyDevice = {
  nome: "",
  tipo: "",
  local: "",
  sensorId: "",
  status: "Ativo",
}

function createRandomSensorPayload() {
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

function randomBetween(min: number, max: number, precision = 1) {
  return Number((min + Math.random() * (max - min)).toFixed(precision))
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [session, setSession] = useState<Omit<User, "senha"> | null>(null)
  const [loginForm, setLoginForm] = useState({ email: "", senha: "" })
  const [users, setUsers] = useState<User[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [sensors, setSensors] = useState<SensorData[]>([])
  const [userForm, setUserForm] = useState(emptyUser)
  const [deviceForm, setDeviceForm] = useState(emptyDevice)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)

  const latestSensor = sensors.at(-1)
  const inactiveDevices = devices.filter((device) => device.status !== "Ativo").length

  const dashboardCards = useMemo(
    () => [
      { label: "Usuarios", value: users.length, detail: `${users.filter((user) => user.status === "Ativo").length} ativos` },
      { label: "Dispositivos", value: devices.length, detail: inactiveDevices ? `${inactiveDevices} inativos` : "Todos operacionais" },
      { label: "Leituras IoT", value: sensors.length, detail: latestSensor ? `Sensor ${latestSensor.id}` : "Aguardando Node-RED" },
      { label: "Temperatura", value: formatNumber(latestSensor?.temperatura, "C"), detail: "Ultima leitura recebida" },
    ],
    [devices.length, inactiveDevices, latestSensor, sensors.length, users],
  )

  const request = useCallback(async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.msg ?? data.message ?? "Nao foi possivel completar a operacao.")
    }

    return data
  }, [])

  const loadData = useCallback(async function loadData() {
    const [usersData, devicesData, sensorData] = await Promise.all([
      request<User[]>("/usuarios"),
      request<Device[]>("/devices"),
      request<SensorData[]>("/iot"),
    ])

    setUsers(usersData)
    setDevices(devicesData)
    setSensors(sensorData)
  }, [request])

  useEffect(() => {
    if (!session) return

    loadData().catch((error: Error) => setFeedback(error.message))
    const interval = window.setInterval(() => {
      loadData().catch(() => undefined)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [loadData, session])

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setFeedback("")

    try {
      const data = await request<{ user: Omit<User, "senha"> }>("/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      })
      setSession(data.user)
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Erro no login.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setFeedback("")

    const userPayload = {
      ...userForm,
      senha: userForm.senha.trim(),
    }

    try {
      if (editingUser) {
        const { senha, ...safePayload } = userPayload
        await request<User>(`/usuarios/${editingUser.id}`, {
          method: "PUT",
          body: JSON.stringify(senha ? userPayload : safePayload),
        })
        setFeedback("Usuario atualizado.")
      } else {
        await request<User>("/usuarios", {
          method: "POST",
          body: JSON.stringify(userPayload),
        })
        setFeedback("Usuario criado.")
      }
      setUserForm(emptyUser)
      setEditingUser(null)
      await loadData()
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Erro ao salvar usuario.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteUser(id: number) {
    setLoading(true)
    setFeedback("")

    try {
      await request(`/usuarios/${id}`, { method: "DELETE" })
      setFeedback("Usuario removido.")
      await loadData()
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Erro ao remover usuario.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveDevice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setFeedback("")

    const payload = {
      ...deviceForm,
      sensorId: deviceForm.sensorId ? Number(deviceForm.sensorId) : null,
    }

    try {
      if (editingDevice) {
        await request<Device>(`/devices/${editingDevice.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        })
        setFeedback("Dispositivo atualizado.")
      } else {
        await request<Device>("/devices", {
          method: "POST",
          body: JSON.stringify(payload),
        })
        setFeedback("Dispositivo criado.")
      }
      setDeviceForm(emptyDevice)
      setEditingDevice(null)
      await loadData()
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Erro ao salvar dispositivo.")
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteDevice(id: number) {
    setLoading(true)
    setFeedback("")

    try {
      await request(`/devices/${id}`, { method: "DELETE" })
      setFeedback("Dispositivo removido.")
      await loadData()
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Erro ao remover dispositivo.")
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateSensorData() {
    setLoading(true)
    setFeedback("")

    try {
      await request<{ data: SensorData }>("/newData", {
        method: "POST",
        body: JSON.stringify(createRandomSensorPayload()),
      })
      setFeedback("Leitura aleatoria gerada.")
      await loadData()
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Erro ao gerar leitura.")
    } finally {
      setLoading(false)
    }
  }

  function startEditUser(user: User) {
    setEditingUser(user)
    setUserForm({
      nome: user.nome,
      email: user.email,
      senha: "",
      perfil: user.perfil,
      status: user.status,
    })
  }

  function startEditDevice(device: Device) {
    setEditingDevice(device)
    setDeviceForm({
      nome: device.nome,
      tipo: device.tipo,
      local: device.local,
      sensorId: device.sensorId ? String(device.sensorId) : "",
      status: device.status,
    })
  }

  function handleChangeTab(tab: Tab) {
    setActiveTab(tab)

    if (window.innerWidth <= 980) {
      setSidebarOpen(false)
    }
  }

  if (!session) {
    return (
      <main className="login-shell">
        <section className="login-panel">
          <div>
            <p className="eyebrow">Acesso ao sistema</p>
            <h1>VaultIoT</h1>
            <p className="muted">Entre com suas credenciais para acessar o painel de controle.</p>
          </div>

          <form onSubmit={handleLogin} className="stack">
            <label>
              Email
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                required
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={loginForm.senha}
                onChange={(event) => setLoginForm({ ...loginForm, senha: event.target.value })}
                required
              />
            </label>
            {feedback && <p className="feedback error">{feedback}</p>}
            <button disabled={loading} type="submit">{loading ? "Entrando..." : "Entrar"}</button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className={`app-shell ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <aside className="sidebar">
        <div className="sidebar-head">
          <div>
            <p className="eyebrow">VaultIoT</p>
            <h1>Painel</h1>
          </div>
          <button className="secondary sidebar-toggle" type="button" onClick={() => setSidebarOpen(false)}>
            Fechar
          </button>
        </div>
        <nav>
          {[
            ["dashboard", "Dashboard"],
            ["usuarios", "Usuarios"],
            ["dispositivos", "Dispositivos"],
            ["sensores", "Sensores"],
          ].map(([key, label]) => (
            <button
              className={activeTab === key ? "active" : ""}
              key={key}
              onClick={() => handleChangeTab(key as Tab)}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="session-box">
          <strong>{session.nome}</strong>
          <span>{session.perfil}</span>
          <button type="button" onClick={() => setSession(null)}>Sair</button>
        </div>
      </aside>

      {sidebarOpen && <button className="sidebar-overlay" type="button" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu lateral" />}

      <section className="content">
        <header className="topbar">
          <div className="topbar-title">
            <button className="secondary sidebar-toggle topbar-toggle" type="button" onClick={() => setSidebarOpen((state) => !state)}>
              Menu
            </button>
            <div>
              <p className="eyebrow">Controle</p>
              <h2>{pageTitle(activeTab)}</h2>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="secondary" type="button" onClick={handleGenerateSensorData} disabled={loading}>
              Gerar leitura
            </button>
            <button type="button" onClick={() => loadData()} disabled={loading}>Atualizar</button>
          </div>
        </header>

        {feedback && <p className="feedback">{feedback}</p>}

        {activeTab === "dashboard" && (
          <section className="grid cards-grid">
            {dashboardCards.map((card) => (
              <article className="metric-card" key={card.label}>
                <span>{card.label}</span>
                <strong>{card.value}</strong>
                <p>{card.detail}</p>
              </article>
            ))}
            <article className="wide-panel">
              <div>
                <h3>Historico recente</h3>
                <p className="muted">Leituras enviadas pelo Node-RED. Atualiza a cada 5 segundos.</p>
              </div>
              <SensorTable sensors={sensors.slice(-6).reverse()} />
            </article>
          </section>
        )}

        {activeTab === "usuarios" && (
          <section className="management-grid">
            <form className="panel stack" onSubmit={handleSaveUser}>
              <h3>{editingUser ? "Editar usuario" : "Novo usuario"}</h3>
              <label>
                Nome
                <input value={userForm.nome} onChange={(event) => setUserForm({ ...userForm, nome: event.target.value })} required />
              </label>
              <label>
                Email
                <input type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} required />
              </label>
              <label>
                {editingUser ? "Nova senha" : "Senha"}
                <input
                  type="password"
                  value={userForm.senha}
                  onChange={(event) => setUserForm({ ...userForm, senha: event.target.value })}
                  placeholder={editingUser ? "Deixe em branco para manter a senha atual" : ""}
                  required={!editingUser}
                />
              </label>
              <div className="two-cols">
                <label>
                  Perfil
                  <select value={userForm.perfil} onChange={(event) => setUserForm({ ...userForm, perfil: event.target.value })}>
                    <option>Administrador</option>
                    <option>Operador</option>
                    <option>Manutencao</option>
                  </select>
                </label>
                <label>
                  Status
                  <select value={userForm.status} onChange={(event) => setUserForm({ ...userForm, status: event.target.value })}>
                    <option>Ativo</option>
                    <option>Inativo</option>
                  </select>
                </label>
              </div>
              <div className="actions">
                {editingUser && <button className="secondary" type="button" onClick={() => { setEditingUser(null); setUserForm(emptyUser) }}>Cancelar</button>}
                <button disabled={loading} type="submit">{editingUser ? "Salvar" : "Criar usuario"}</button>
              </div>
            </form>

            <section className="panel table-panel">
              <h3>Usuarios cadastrados</h3>
              <div className="list">
                {users.map((user) => (
                  <article className="row-card" key={user.id}>
                    <div>
                      <strong>{user.nome}</strong>
                      <span>{user.email}</span>
                    </div>
                    <span className="pill">{user.perfil}</span>
                    <span className={user.status === "Ativo" ? "status ok" : "status"}>{user.status}</span>
                    <div className="row-actions">
                      <button className="secondary" type="button" onClick={() => startEditUser(user)}>Editar</button>
                      <button className="danger" type="button" onClick={() => handleDeleteUser(user.id)}>Excluir</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        {activeTab === "dispositivos" && (
          <section className="management-grid">
            <form className="panel stack" onSubmit={handleSaveDevice}>
              <h3>{editingDevice ? "Editar dispositivo" : "Novo dispositivo"}</h3>
              <label>
                Nome
                <input value={deviceForm.nome} onChange={(event) => setDeviceForm({ ...deviceForm, nome: event.target.value })} required />
              </label>
              <label>
                Tipo
                <input value={deviceForm.tipo} onChange={(event) => setDeviceForm({ ...deviceForm, tipo: event.target.value })} required />
              </label>
              <label>
                Local
                <input value={deviceForm.local} onChange={(event) => setDeviceForm({ ...deviceForm, local: event.target.value })} />
              </label>
              <div className="two-cols">
                <label>
                  Sensor ID
                  <input type="number" min="1" value={deviceForm.sensorId} onChange={(event) => setDeviceForm({ ...deviceForm, sensorId: event.target.value })} />
                </label>
                <label>
                  Status
                  <select value={deviceForm.status} onChange={(event) => setDeviceForm({ ...deviceForm, status: event.target.value })}>
                    <option>Ativo</option>
                    <option>Manutencao</option>
                    <option>Inativo</option>
                  </select>
                </label>
              </div>
              <div className="actions">
                {editingDevice && <button className="secondary" type="button" onClick={() => { setEditingDevice(null); setDeviceForm(emptyDevice) }}>Cancelar</button>}
                <button disabled={loading} type="submit">{editingDevice ? "Salvar" : "Criar dispositivo"}</button>
              </div>
            </form>

            <section className="panel table-panel">
              <h3>Dispositivos cadastrados</h3>
              <div className="list">
                {devices.map((device) => {
                  const linkedSensor = sensors.find((sensor) => sensor.id === device.sensorId)
                  return (
                    <article className="device-card" key={device.id}>
                      <div className="device-head">
                        <div>
                          <strong>{device.nome}</strong>
                          <span>{device.tipo} - {device.local}</span>
                        </div>
                        <span className={device.status === "Ativo" ? "status ok" : "status"}>{device.status}</span>
                      </div>
                      <div className="sensor-strip">
                        <span>Sensor {device.sensorId ?? "sem vinculo"}</span>
                        <span>{formatNumber(linkedSensor?.temperatura, "C")}</span>
                        <span>{formatNumber(linkedSensor?.umidade, "%")}</span>
                      </div>
                      <div className="row-actions">
                        <button className="secondary" type="button" onClick={() => startEditDevice(device)}>Editar</button>
                        <button className="danger" type="button" onClick={() => handleDeleteDevice(device.id)}>Excluir</button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          </section>
        )}

        {activeTab === "sensores" && (
          <section className="panel">
            <div className="section-head">
              <div>
                <h3>Historico de sensores</h3>
                <p className="muted">Todas as leituras recebidas pelo sistema.</p>
              </div>
              <span className="pill">{sensors.length} registros</span>
            </div>
            <SensorTable sensors={sensors.slice().reverse()} />
          </section>
        )}
      </section>
    </main>
  )
}

function SensorTable({ sensors }: { sensors: SensorData[] }) {
  if (!sensors.length) {
    return <div className="empty-state">Nenhuma leitura recebida ainda.</div>
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Temperatura</th>
            <th>Pressao</th>
            <th>Umidade</th>
            <th>Presenca</th>
            <th>Trava</th>
          </tr>
        </thead>
        <tbody>
          {sensors.map((sensor) => (
            <tr key={`${sensor.id}-${sensor.updatedAt ?? sensor.createdAt ?? ""}`}>
              <td>{sensor.id}</td>
              <td>{formatNumber(sensor.temperatura, "C")}</td>
              <td>{formatNumber(sensor.pressao, "bar")}</td>
              <td>{formatNumber(sensor.umidade, "%")}</td>
              <td>{sensor.sensor_presenca ? "Acionado" : "Livre"}</td>
              <td>{sensor.trava_seguranca ? "Ligada" : "Desligada"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatNumber(value: number | undefined, suffix: string) {
  if (value === undefined || Number.isNaN(value)) return "--"
  return `${Number(value).toFixed(1)} ${suffix}`
}

function pageTitle(tab: Tab) {
  const titles = {
    dashboard: "Dashboard",
    usuarios: "Usuarios",
    dispositivos: "Dispositivos",
    sensores: "Sensores",
  }

  return titles[tab]
}
