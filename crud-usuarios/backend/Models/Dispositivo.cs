namespace backend.Models;

public class Dispositivo
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Tipo { get; set; } = string.Empty;
    public bool Ativo { get; set; } = true;
}