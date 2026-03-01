using Microsoft.AspNetCore.SignalR;

namespace my_backend_app.Hubs;

/// <summary>
/// Simple hub for testing SignalR connectivity (e.g. from .http negotiate or a real client).
/// </summary>
public class TestHub : Hub
{
    public async Task Ping()
    {
        await Clients.Caller.SendAsync("Pong", DateTime.UtcNow);
    }

    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
