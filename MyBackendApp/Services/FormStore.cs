using System.Text.Json;
using my_backend_app.Models;

namespace my_backend_app.Services;

/// <summary>
/// In-memory form state store. Applies the same logic as the frontend mock (applyFormFieldChange, applyFocusChange, applyFocusGain).
/// </summary>
public class FormStore
{
    private FormState _state;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
    };

    public FormStore()
    {
        _state = Seed();
    }

    /// <summary>
    /// Returns current form state (clone). Caller can serialize to JSON for SignalR.
    /// </summary>
    public FormState GetState()
    {
        return Clone(_state);
    }

    /// <summary>
    /// Seed with mock data matching the frontend mockBackend initial state.
    /// </summary>
    public static FormState Seed()
    {
        return new FormState
        {
            IsConnected = true,
            IsLoading = false,
            Error = null,
            LastUpdate = null,
            ActiveFieldId = "personal-basic:0",
            Windows =
            [
                new FormWindowDto
                {
                    Name = "Personal Information",
                    Sections =
                    [
                        new SectionDto
                        {
                            Name = "Basic Details",
                            FormId = "personal-basic",
                            Sections =
                            [
                                new SectionDto
                                {
                                    Name = "Address",
                                    FormId = "personal-basic-address",
                                    Sections = [],
                                    Buttons = [],
                                    Fields =
                                    [
                                        new FieldDto { Type = "text", Label = new LabelDto { Name = "Street", Position = "side" }, Value = "Ågatan 24 C" },
                                        new FieldDto { Type = "text", Label = new LabelDto { Name = "City", Position = "side" }, Value = "Söderköping" },
                                        new FieldDto { Type = "text", Label = new LabelDto { Name = "Postcode", Position = "side" }, Value = "61434" },
                                    ],
                                },
                            ],
                            Buttons = [],
                            Fields =
                            [
                                new FieldDto { Type = "text", Label = new LabelDto { Name = "First Name", Position = "side" }, Value = "Johannes" },
                                new FieldDto { Type = "text", Label = new LabelDto { Name = "Last Name", Position = "side" }, Value = "Lindgren" },
                                new FieldDto { Type = "number", Label = new LabelDto { Name = "Age", Position = "side" }, Value = 43 },
                                new FieldDto { Type = "checkbox", Label = new LabelDto { Name = "Subscribe to newsletter", Position = "side" }, Value = false },
                            ],
                        },
                        new SectionDto
                        {
                            Name = "Contact",
                            FormId = "personal-contact",
                            Sections = [],
                            Buttons = [],
                            Fields =
                            [
                                new FieldDto { Type = "text", Label = new LabelDto { Name = "Email", Position = "side" }, Value = "johannes.lindgren@im.se" },
                                new FieldDto
                                {
                                    Type = "select",
                                    Label = new LabelDto { Name = "Country", Position = "side" },
                                    Items = [new SelectItemDto { Label = "Sweden", Value = "se" }, new SelectItemDto { Label = "United Kingdom", Value = "uk" }, new SelectItemDto { Label = "Denmark", Value = "dk" }, new SelectItemDto { Label = "Norway", Value = "no" }],
                                    Value = new { label = "Sweden", value = "se" },
                                },
                                new FieldDto { Type = "textarea", Label = new LabelDto { Name = "Notes", Position = "top" }, Value = "Prefers morning appointments." },
                            ],
                        },
                    ],
                },
                new FormWindowDto
                {
                    Name = "Schedule",
                    Sections =
                    [
                        new SectionDto
                        {
                            Name = "Appointment",
                            FormId = "schedule-appointment",
                            Sections =
                            [
                                new SectionDto
                                {
                                    Name = "Recurrence",
                                    FormId = "schedule-recurrence",
                                    Sections = [],
                                    Buttons = [],
                                    Fields =
                                    [
                                        new FieldDto { Type = "checkbox", Label = new LabelDto { Name = "Repeat", Position = "side" }, Value = false },
                                        new FieldDto
                                        {
                                            Type = "select",
                                            Label = new LabelDto { Name = "Frequency", Position = "side" },
                                            Items = [new SelectItemDto { Label = "Daily", Value = "daily" }, new SelectItemDto { Label = "Weekly", Value = "weekly" }, new SelectItemDto { Label = "Monthly", Value = "monthly" }],
                                            Value = new { label = "Weekly", value = "weekly" },
                                        },
                                    ],
                                },
                            ],
                            Buttons = [],
                            Fields =
                            [
                                new FieldDto { Type = "datetime", Label = new LabelDto { Name = "Start Date & Time", Position = "side" }, Value = "2026-03-10 09:00" },
                                new FieldDto
                                {
                                    Type = "radio",
                                    Label = new LabelDto { Name = "Priority", Position = "top" },
                                    Items = [new SelectItemDto { Label = "Low", Value = "low" }, new SelectItemDto { Label = "Medium", Value = "medium" }, new SelectItemDto { Label = "High", Value = "high" }],
                                    Value = new { label = "Medium", value = "medium" },
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    }

    /// <returns>True if state changed (field was updated).</returns>
    public bool ApplyFormFieldChange(string sectionId, int fieldIndex, object? newValue)
    {
        var section = FindSection(_state.Windows, sectionId);
        if (section?.Fields.Count > fieldIndex != true) return false;
        var field = section.Fields[fieldIndex];
        if (newValue is JsonElement je)
            field.Value = je;
        else
            field.Value = newValue;
        _state.LastUpdate = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        return true;
    }

    /// <returns>True if ActiveFieldId changed.</returns>
    public bool ApplyFocusGain(string sectionId, int fieldIndex)
    {
        var newActive = $"{sectionId}:{fieldIndex}";
        if (_state.ActiveFieldId == newActive) return false;
        _state.ActiveFieldId = newActive;
        _state.LastUpdate = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        return true;
    }

    /// <returns>True if state changed (field value or ActiveFieldId).</returns>
    public bool ApplyFocusChange(string sectionId, int fieldIndex, object? currentValue)
    {
        var changed = false;
        var section = FindSection(_state.Windows, sectionId);
        if (section?.Fields.Count > fieldIndex == true && currentValue != null)
        {
            var field = section.Fields[fieldIndex];
            if (!Equals(field.Value, currentValue))
            {
                changed = true;
                if (currentValue is JsonElement je)
                    field.Value = je;
                else
                    field.Value = currentValue;
            }
        }

        var all = GetAllFieldIds(_state);
        var currentKey = $"{sectionId}:{fieldIndex}";
        var idx = all.FindIndex(p => $"{p.sectionId}:{p.fieldIndex}" == currentKey);
        if (idx >= 0 && all.Count > 0)
        {
            var next = all[(idx + 1) % all.Count];
            var nextActive = $"{next.sectionId}:{next.fieldIndex}";
            if (_state.ActiveFieldId != nextActive)
            {
                changed = true;
                _state.ActiveFieldId = nextActive;
            }
        }
        _state.LastUpdate = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        return changed;
    }

    public void ResetToSeed()
    {
        _state = Seed();
    }

    private static SectionDto? FindSection(List<FormWindowDto> windows, string formId)
    {
        foreach (var w in windows)
        {
            var s = FindSectionInSections(w.Sections, formId);
            if (s != null) return s;
        }
        return null;
    }

    private static SectionDto? FindSectionInSections(List<SectionDto> sections, string formId)
    {
        foreach (var s in sections)
        {
            if (s.FormId == formId) return s;
            var nested = FindSectionInSections(s.Sections, formId);
            if (nested != null) return nested;
        }
        return null;
    }

    private static List<(string sectionId, int fieldIndex)> GetAllFieldIds(FormState state)
    {
        var result = new List<(string sectionId, int fieldIndex)>();
        void Traverse(List<SectionDto> sections)
        {
            foreach (var s in sections)
            {
                for (var i = 0; i < s.Fields.Count; i++)
                    result.Add((s.FormId, i));
                Traverse(s.Sections);
            }
        }
        foreach (var w in state.Windows)
            Traverse(w.Sections);
        return result;
    }

    private static FormState Clone(FormState s)
    {
        var json = JsonSerializer.Serialize(s, JsonOptions);
        return JsonSerializer.Deserialize<FormState>(json, JsonOptions) ?? Seed();
    }
}
