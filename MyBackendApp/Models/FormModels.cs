using System.Text.Json.Serialization;

namespace my_backend_app.Models;

/// <summary>
/// Matches frontend Form type for SignalR and in-memory store.
/// </summary>
public class FormState
{
    [JsonPropertyName("windows")]
    public List<FormWindowDto> Windows { get; set; } = [];

    [JsonPropertyName("isConnected")]
    public bool IsConnected { get; set; } = true;

    [JsonPropertyName("isLoading")]
    public bool IsLoading { get; set; }

    [JsonPropertyName("error")]
    public string? Error { get; set; }

    [JsonPropertyName("lastUpdate")]
    public long? LastUpdate { get; set; }

    [JsonPropertyName("activeFieldId")]
    public string? ActiveFieldId { get; set; }
}

public class FormWindowDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("sections")]
    public List<SectionDto> Sections { get; set; } = [];
}

public class SectionDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("formId")]
    public string FormId { get; set; } = "";

    [JsonPropertyName("sections")]
    public List<SectionDto> Sections { get; set; } = [];

    [JsonPropertyName("buttons")]
    public List<object> Buttons { get; set; } = [];

    [JsonPropertyName("fields")]
    public List<FieldDto> Fields { get; set; } = [];
}

public class FieldDto
{
    [JsonPropertyName("type")]
    public string Type { get; set; } = "";

    [JsonPropertyName("label")]
    public LabelDto? Label { get; set; }

    [JsonPropertyName("value")]
    public object? Value { get; set; }

    [JsonPropertyName("items")]
    public List<SelectItemDto>? Items { get; set; }
}

public class LabelDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = "";

    [JsonPropertyName("position")]
    public string Position { get; set; } = "side";
}

public class SelectItemDto
{
    [JsonPropertyName("label")]
    public string Label { get; set; } = "";

    [JsonPropertyName("value")]
    public object? Value { get; set; }
}
