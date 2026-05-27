using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class DispositivosController : ControllerBase
{
    private static readonly List<Dispositivo> _dispositivos = new();
    private static int _proximoId = 1;

    [HttpGet]
    public IActionResult GetTodos() => Ok(_dispositivos);

    [HttpGet("{id}")]
    public IActionResult GetPorId(int id)
    {
        var dispositivo = _dispositivos.FirstOrDefault(d => d.Id == id);
        if (dispositivo == null)
            return NotFound(new { mensagem = $"Dispositivo {id} não encontrado." });
        return Ok(dispositivo);
    }

    [HttpPost]
    public IActionResult Criar([FromBody] Dispositivo novo)
    {
        if (string.IsNullOrWhiteSpace(novo.Nome) || string.IsNullOrWhiteSpace(novo.Tipo))
            return BadRequest(new { mensagem = "Nome e Tipo são obrigatórios." });

        novo.Id = _proximoId++;
        _dispositivos.Add(novo);
        return CreatedAtAction(nameof(GetPorId), new { id = novo.Id }, novo);
    }

    [HttpPut("{id}")]
    public IActionResult Atualizar(int id, [FromBody] Dispositivo dados)
    {
        var dispositivo = _dispositivos.FirstOrDefault(d => d.Id == id);
        if (dispositivo == null)
            return NotFound(new { mensagem = $"Dispositivo {id} não encontrado." });

        dispositivo.Nome = dados.Nome;
        dispositivo.Tipo = dados.Tipo;
        dispositivo.Ativo = dados.Ativo;
        return Ok(dispositivo);
    }

    [HttpDelete("{id}")]
    public IActionResult Deletar(int id)
    {
        var dispositivo = _dispositivos.FirstOrDefault(d => d.Id == id);
        if (dispositivo == null)
            return NotFound(new { mensagem = $"Dispositivo {id} não encontrado." });

        _dispositivos.Remove(dispositivo);
        return Ok(new { mensagem = $"Dispositivo {dispositivo.Nome} deletado." });
    }
}