using Microsoft.AspNetCore.SignalR;
using my_backend_app.Models;
using my_backend_app.Services;

namespace my_backend_app.Hubs;

/// <summary>
/// SignalR hub for form state. Same events as the frontend mock: formFieldChanged, formFocusChanged, formFocusGained.
/// On connect sends current form state; on SendEvent applies and broadcasts updated state.
/// </summary>
public class FormHub : Hub
{
    private readonly FormStore _formStore;

    public FormHub(FormStore formStore)
    {
        _formStore = formStore;
    }

    public override async Task OnConnectedAsync()
    {
        await PushFormStateToCaller();
        await base.OnConnectedAsync();
    }

    /// <summary>
    /// Receives a client event (formFieldChanged, formFocusChanged, formFocusGained). Applies to in-memory store and broadcasts state.
    /// SignalR deserializes the incoming JSON to ClientEventDto.
    /// </summary>
    public async Task SendEvent(ClientEventDto evt)
    {
        if (evt == null) return;

        switch (evt.Type)
        {
            case "formFieldChanged":
                if (evt.SectionId != null && evt.FieldIndex.HasValue)
                {
                    _formStore.ApplyFormFieldChange(evt.SectionId, evt.FieldIndex.Value, evt.NewValue);
                }
                break;
            case "formFocusChanged":
                if (evt.SectionId != null && evt.FieldIndex.HasValue)
                {
                    _formStore.ApplyFocusChange(evt.SectionId, evt.FieldIndex.Value, evt.CurrentValue);
                }
                break;
            case "formFocusGained":
                if (evt.SectionId != null && evt.FieldIndex.HasValue)
                {
                    _formStore.ApplyFocusGain(evt.SectionId, evt.FieldIndex.Value);
                }
                break;
            default:
                break;
        }

        await PushFormStateToAll();
    }

    private async Task PushFormStateToCaller()
    {
        var state = _formStore.GetState();
        var message = new
        {
            entityId = "form",
            property = "state",
            value = state,
            timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
            source = "backend",
        };
        await Clients.Caller.SendAsync("StateChange", message);
    }

    private async Task PushFormStateToAll()
    {
        var state = _formStore.GetState();
        var message = new
        {
            entityId = "form",
            property = "state",
            value = state,
            timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
            source = "backend",
        };
        await Clients.All.SendAsync("StateChange", message);
    }
}
