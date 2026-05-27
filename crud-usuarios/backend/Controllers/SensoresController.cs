using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("[controller]")]
public class SensoresController : ControllerBase
{
    private static SensorData _estadoAtual = new SensorData
    {
        Id = 1,
        Temperatura = 23.5,
        Pressao = 101.3,
        Velocidade = 0,
        StatusEsp = true,
        TravaSeguranca = false,
        Timestamp = DateTime.Now
    };

    [HttpGet]
    public IActionResult GetDados()
    {
        var rnd = new Random();
        _estadoAtual.Temperatura = Math.Round(23.0 + rnd.NextDouble() * 4, 1);
        _estadoAtual.Pressao = Math.Round(100.0 + rnd.NextDouble() * 5, 1);
        _estadoAtual.Timestamp = DateTime.Now;
        return Ok(_estadoAtual);
    }

    [HttpPost("trava")]
    public IActionResult ControlarTrava([FromBody] ComandoEscrita comando)
    {
        if (comando.LiberarTrava.HasValue)
        {
            _estadoAtual.TravaSeguranca = comando.LiberarTrava.Value;
            string status = comando.LiberarTrava.Value ? "liberada" : "bloqueada";
            return Ok(new { mensagem = $"Trava {status} com sucesso.", trava = _estadoAtual.TravaSeguranca });
        }
        return BadRequest(new { mensagem = "Comando inválido." });
    }

    [HttpPost("velocidade")]
    public IActionResult ControlarVelocidade([FromBody] ComandoEscrita comando)
    {
        if (comando.ProjecaoVelocidade.HasValue)
        {
            if (comando.ProjecaoVelocidade.Value < 0 || comando.ProjecaoVelocidade.Value > 100)
                return BadRequest(new { mensagem = "Velocidade deve estar entre 0 e 100." });

            _estadoAtual.Velocidade = comando.ProjecaoVelocidade.Value;
            return Ok(new { mensagem = "Velocidade atualizada.", velocidade = _estadoAtual.Velocidade });
        }
        return BadRequest(new { mensagem = "Comando inválido." });
    }
}