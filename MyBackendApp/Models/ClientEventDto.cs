using System.Text.Json.Serialization;

namespace my_backend_app.Models;

/// <summary>
/// Matches frontend ClientEvent union (formFieldChanged, formFocusChanged, formFocusGained, etc.).
/// </summary>
public class ClientEventDto
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "";

    [JsonPropertyName("sectionId")]
    public string? SectionId { get; set; }

    [JsonPropertyName("fieldIndex")]
    public int? FieldIndex { get; set; }

    [JsonPropertyName("oldValue")]
    public object? OldValue { get; set; }

    [JsonPropertyName("newValue")]
    public object? NewValue { get; set; }

    [JsonPropertyName("currentValue")]
    public object? CurrentValue { get; set; }

    [JsonPropertyName("elementId")]
    public string? ElementId { get; set; }

    [JsonPropertyName("hasFocus")]
    public bool? HasFocus { get; set; }

    [JsonPropertyName("timestamp")]
    public long? Timestamp { get; set; }
}
