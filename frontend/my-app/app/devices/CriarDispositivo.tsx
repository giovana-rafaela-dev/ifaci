export default function CriarDispositivo() {
  return (
    <form className="w-[50vw] flex flex-col gap-4 rounded-xl max-h-fit bg-white text-black p-4">
      <h2 className="text-lg font-semibold">Criar Novo Dispositivo</h2>

      <input
        type="text"
        placeholder="Nome do dispositivo"
        className="p-4 rounded-lg outline-2 outline-red-500"
      />
      <input
        type="text"
        placeholder="Tipo"
        className="p-4 rounded-lg outline-2 outline-red-500"
      />
      <input
        type="text"
        placeholder="Local"
        className="p-4 rounded-lg outline-2 outline-red-500"
      />
      <input
        type="number"
        min="1"
        placeholder="ID do sensor"
        className="p-4 rounded-lg outline-2 outline-red-500"
      />

      <input
        type="submit"
        value="Enviar"
        className="py-2 px-4 text-white rounded-lg hover:bg-red-500 bg-red-400"
      />
    </form>
  )
}
