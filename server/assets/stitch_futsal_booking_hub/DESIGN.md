# Design System Specification: The Kinetic Turf

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Pitch"**

This design system moves beyond the generic "booking app" aesthetic by treating the digital interface with the same precision and intentionality as a high-end sports facility. We are merging the high-energy spirit of Futsal with the sophisticated restraint of editorial design. 

The system rejects the "boxed-in" layout of traditional SaaS. Instead, it utilizes **Organic Asymmetry** and **Tonal Depth**. By overlapping elements and utilizing a "No-Line" philosophy, we create a fluid, premium experience that feels breathable yet authoritative. We don't just book courts; we curate an athletic lifestyle.

## 2. Colors & Surface Philosophy
The palette is rooted in the "Pitch Green" (`primary`), balanced by deep, intelligent neutrals.

### Tonal Surface Hierarchy
We prohibit the use of 1px solid borders for sectioning. Boundaries are defined strictly through background shifts or tonal nesting.
*   **The "No-Line" Rule:** To separate the sidebar from the main content, use `surface-container-low` against a `surface` background. Never use a stroke.
*   **Surface Nesting:** Treat the UI as layers of fine paper. 
    *   **Level 0 (Base):** `surface` (#f6fafe)
    *   **Level 1 (Sections):** `surface-container-low` (#f0f4f8)
    *   **Level 2 (Interactive Cards):** `surface-container-lowest` (#ffffff)
*   **The Glass & Gradient Rule:** For floating navigation or high-impact hero sections, use Glassmorphism. Apply `surface` at 70% opacity with a `24px` backdrop blur. For primary CTAs, use a subtle linear gradient from `primary` (#006d40) to `primary_container` (#2bb673) at a 135-degree angle to add "soul" and movement.

## 3. Typography
We use a dual-typeface system to balance character with utility.

*   **Display & Headlines (Plus Jakarta Sans):** Chosen for its modern, athletic geometry. Use `display-lg` and `headline-md` with tight tracking (-0.02em) to create an editorial, high-end feel.
*   **Body & UI (Inter):** Chosen for its unparalleled readability in dense data environments like booking schedules.
*   **The Hierarchy Intent:** Use `label-md` in all-caps with `0.05em` letter spacing for status indicators and category headers to provide an authoritative, "stadium signage" aesthetic.

## 4. Elevation & Depth
Traditional shadows are too heavy for this system. We use **Tonal Layering** supplemented by **Ambient Shadows**.

*   **The Layering Principle:** A "Upcoming Match" card should sit on `surface-container-lowest` (#ffffff). When it sits on a `surface-container-low` (#f0f4f8) background, the contrast provides all the "lift" required.
*   **Ambient Shadows:** If a card must "float" (e.g., a hover state), use an ultra-diffused shadow:
    *   `y: 8px, blur: 24px, color: rgba(23, 28, 31, 0.06)` (using a tint of `on_surface`).
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use `outline_variant` at **15% opacity**. Never 100%.

## 5. Components

### Booking Cards
*   **Structure:** No borders. Use `surface-container-lowest` for the card body. 
*   **Detail:** Use a `primary` left-accent bar (4px width) to indicate a "Live" or "Confirmed" status. 
*   **Spacing:** Use `xl` (1.5rem) internal padding to ensure the content breathes.

### Status Badges
*   **Upcoming:** `secondary_container` background with `on_secondary_container` text.
*   **Completed:** `primary_fixed` background with `on_primary_fixed` text.
*   **Cancelled:** `error_container` background with `on_error_container` text.
*   **Shape:** Use the `full` (9999px) roundedness scale for a pill shape.

### Time-Slot Pickers
*   **Unselected:** `surface_container_high` background.
*   **Selected:** `primary` background with `on_primary` text.
*   **Hover:** `primary_container` with a subtle `2px` "Ghost Border" of `primary`.
*   **Layout:** Use a horizontal scrolling flex-row to avoid vertical clutter.

### Admin Data Tables
*   **The Rule:** Forbid divider lines between rows.
*   **Alternation:** Use zebra-striping with `surface_container_low` for even rows. 
*   **Typography:** Use `label-md` for headers in `on_surface_variant` to keep the focus on the data.
*   **Padding:** Vertical cell padding must be at least `md` (0.75rem) to maintain the premium feel.

### Action Chips
*   **Style:** `md` (0.75rem) roundedness. Use `surface_variant` for inactive states and `primary_fixed` for active filtering.

## 6. Do's and Don'ts

### Do
*   **Do** use white space as a structural element. If an element feels cramped, increase the padding rather than adding a line.
*   **Do** use `plusJakartaSans` for any text larger than 1.5rem to maintain the brand's premium edge.
*   **Do** ensure that all interactive elements use the `DEFAULT` (0.5rem) to `md` (0.75rem) corner radius for a friendly but modern feel.

### Don't
*   **Don't** use pure black (#000000) for text. Use `on_surface` (#171c1f) to maintain tonal harmony with the deep slate palette.
*   **Don't** use standard "drop shadows." If it looks like a default Photoshop effect, it’s too heavy.
*   **Don't** use high-contrast borders. If two areas need separation, use a background color shift from the `surface-container` tiers.