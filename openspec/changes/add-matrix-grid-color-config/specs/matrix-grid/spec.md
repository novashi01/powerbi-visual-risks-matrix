## ADDED Requirements

### Requirement: Configurable severity color transparency

The visual SHALL provide a setting that allows authors to configure the alpha (transparency) applied to severity fill colors in the matrix grid.

#### Scenario: Author sets severity transparency
- **WHEN** an author sets the "Severity color transparency" value in visual settings
- **THEN** all severity fills in the rendered grid use that alpha value applied to their base colors

### Requirement: Configurable grid border color

The visual SHALL provide a setting that allows authors to set the grid border color used to draw cell separators and outlines.

#### Scenario: Author sets grid border color
- **WHEN** an author chooses a border color in settings
- **THEN** the grid renders cell borders using the configured color

### Requirement: Remove/Deprecate dataColors setting

The `dataColors` setting SHALL be removed from the authoring UI or marked deprecated and have no effect on rendering.

#### Scenario: dataColors has no effect
- **WHEN** a report author toggles or edits the `dataColors` setting
- **THEN** the visual rendering does not change and documentation explains that `dataColors` is deprecated

### Requirement: Category data influence documented

The visual SHALL document how category fields affect marker placement, coloring, or grouping so authors understand how their data maps to visual elements.

#### Scenario: Category data guidance
- **WHEN** an author consults the documentation
- **THEN** they find a short section describing how category data affects visual layout and color mapping
