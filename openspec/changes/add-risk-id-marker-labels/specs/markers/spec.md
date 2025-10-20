## ADDED Requirements

### Requirement: In-marker Risk ID label
The visual SHALL provide an option to render the risk identifier inside the marker's button when enabled in formatting settings.

#### Scenario: Default disabled
- **GIVEN** the formatting option `showRiskIdLabel` is not enabled (default)
- **WHEN** the visual renders
- **THEN** no text is placed inside markers and existing external labels remain unchanged

#### Scenario: Enabled, centered
- **GIVEN** `showRiskIdLabel` is enabled with `riskIdLabelAlignment = center`
- **WHEN** the visual renders a residual or inherent marker
- **THEN** the risk ID text is rendered inside the marker and horizontally centered and vertically centered relative to the marker's visual box

#### Scenario: Left/Right alignment
- **GIVEN** `riskIdLabelAlignment` is set to `left` (or `right`)
- **WHEN** the visual renders
- **THEN** the label is positioned inside the marker with the chosen padding and alignment (left/right), vertically centered

#### Scenario: Min marker size and truncation
- **GIVEN** `riskIdLabelMinMarkerSize` is set to `auto` OR a numeric value
- **WHEN** the label width would exceed the available marker width
- **THEN** either the marker's rendered visual width SHALL expand to contain the label (if numeric minSize or `auto` rules permit) OR the label SHALL be truncated with ellipsis when `riskIdLabelTruncate` is enabled

#### Scenario: Accessibility and tooltips
- **GIVEN** risk ID labels are enabled
- **WHEN** a screen reader or hover is used
- **THEN** a readable title/aria-label SHALL be available that includes the full risk ID even if the rendered text is truncated
