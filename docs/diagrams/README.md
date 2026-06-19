# PRAJNA Faculty Data - Architecture Diagrams

This directory contains diagrams illustrating system design, data flows, and component interactions for the Faculty Data modules.

## Guidelines for Adding Diagrams

1. **Prefer Mermaid.js format:** Whenever possible, embed Mermaid code block specs directly inside markdown documents (`docs/architecture/overview.md` or `docs/lld/template.md`). This keeps diagrams editable and version-controlled.
2. **Static Images:** If drawing diagrams in external tools (e.g. Draw.io, Lucidchart):
   - Export them in PNG format.
   - Save the raw editable file (e.g. `.drawio` or `.svg`) in this directory so other team members can update it.
   - Reference the image in documentation files using relative markdown paths:
     ```markdown
     ![Profile Module Flow Diagram](../diagrams/profile-flow.png)
     ```
3. **Naming Convention:** Use clear names describing the module and content (e.g. `m7-profile-db-schema.png`, `m9-scopus-workflow.drawio`).
