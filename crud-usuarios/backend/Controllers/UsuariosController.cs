using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("usuarios")]
public class UsuariosController : ControllerBase
{
    private static readonly List<Usuario> Usuarios = [];
    private static int _proximoId = 1;

    [HttpGet]
    public ActionResult<IEnumerable<Usuario>> Listar()
    {
        return Ok(Usuarios);
    }

    [HttpPost]
    public ActionResult<Usuario> Criar([FromBody] Usuario novo)
    {
        if (string.IsNullOrWhiteSpace(novo.Nome) ||
            string.IsNullOrWhiteSpace(novo.Email) ||
            string.IsNullOrWhiteSpace(novo.Senha))
        {
            return BadRequest(new { mensagem = "Preencha todos os campos." });
        }

        var usuario = new Usuario
        {
            Id = _proximoId++,
            Nome = novo.Nome,
            Email = novo.Email,
            Senha = novo.Senha
        };

        Usuarios.Add(usuario);
        return Created($"/usuarios/{usuario.Id}", usuario);
    }

    [HttpPut("{id:int}")]
    public ActionResult<Usuario> Atualizar(int id, [FromBody] Usuario atualizado)
    {
        var usuario = Usuarios.FirstOrDefault(x => x.Id == id);
        if (usuario is null)
        {
            return NotFound(new { mensagem = "Usuario nao encontrado." });
        }

        if (string.IsNullOrWhiteSpace(atualizado.Nome) ||
            string.IsNullOrWhiteSpace(atualizado.Email) ||
            string.IsNullOrWhiteSpace(atualizado.Senha))
        {
            return BadRequest(new { mensagem = "Preencha todos os campos." });
        }

        usuario.Nome = atualizado.Nome;
        usuario.Email = atualizado.Email;
        usuario.Senha = atualizado.Senha;

        return Ok(usuario);
    }

    [HttpDelete("{id:int}")]
    public IActionResult Deletar(int id)
    {
        var usuario = Usuarios.FirstOrDefault(x => x.Id == id);
        if (usuario is null)
        {
            return NotFound(new { mensagem = "Usuario nao encontrado." });
        }

        Usuarios.Remove(usuario);
        return NoContent();
    }
}