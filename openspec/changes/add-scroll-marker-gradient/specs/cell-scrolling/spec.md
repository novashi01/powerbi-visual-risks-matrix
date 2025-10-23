## ADDED Requirements
### Requirement: Scroll Fade Indicators
The visual SHALL apply a configurable gradient fade mask to both inherent and residual marker stacks whenever cell scrolling is enabled and content overflows, so hidden markers ease into transparency at the clip boundary.

#### Scenario: Fade indicates overflowed markers
- **GIVEN** a residual cell with scrolling enabled and more markers than the grid can display at once
- **WHEN** the cell renders
- **THEN** a fade effect appears at the top and bottom of the scrollable marker area
- **AND** scrolling reveals the hidden markers without abrupt cut-offs

#### Scenario: Fade disabled when depth is zero
- **GIVEN** the format pane fade depth control is set to 0
- **WHEN** the cell renders with scrollable content
- **THEN** no fade mask is applied and markers appear as they did prior to this change

#### Scenario: Fade depth adjusts gradient size
- **GIVEN** the fade depth control is set to 20px
- **WHEN** the cell renders
- **THEN** the fade gradient spans approximately 20px from each edge before reaching full opacity
- **AND** changes to the control update the fade extent without requiring a reload
