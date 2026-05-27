namespace backend.Models;

public class SensorData
{
    public int Id { get; set; }
    public double Temperatura { get; set; }
    public double Pressao { get; set; }
    public double Velocidade { get; set; }
    public bool StatusEsp { get; set; }
    public bool TravaSeguranca { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.Now;
}

public class ComandoEscrita
{
    public bool? LiberarTrava { get; set; }
    public double? ProjecaoVelocidade { get; set; }
}