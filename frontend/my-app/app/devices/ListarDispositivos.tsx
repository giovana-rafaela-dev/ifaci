export default function ListarDispositivos() {
  return (
    <section className="w-[50vw] max-h-[88vh] overflow-y-auto bg-white text-black rounded-xl flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Lista de Dispositivos</h2>
      <article className="bg-gray-300 border-2 border-gray-500 rounded-lg p-4">
        <h3 className="text-lg font-semibold">Dispositivo</h3>
        <p>Nome do dispositivo</p>
        <div className="flex gap-4">
          <p>Tipo:</p>
          <p className="font-black" />
        </div>
        <div className="flex gap-4">
          <p>Sensor:</p>
          <p className="font-black" />
        </div>
        <div className="flex w-full justify-end gap-4">
          <input
            type="button"
            value="Editar"
            className="rounded-lg px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white cursor-pointer"
          />
          <input
            type="button"
            value="Deletar"
            className="rounded-lg px-4 py-2 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
          />
        </div>
      </article>
    </section>
  )
}
