# Marketing Release Process

Standard sequence for taking a GTM packet from generation to launch.

## Steps

### 1. Planning Inputs (gtm-workshop)

Gather inputs for the launch. Use **gtm-workshop** in Cursor.

**Inputs (any combination):**
- **PR link** (ShapeShift GitHub) — primary source of truth for what shipped
- **Protocol URLs** — website, Twitter, Farcaster (for branding, messaging, tone)
- **Partner call transcript** or meeting notes (optional)

If PR provided, **gtm-pr-extractor** parses the PR. If protocol URLs provided, **gtm-protocol-enricher** pulls branding and social tone.

### 2. Generate

Run the full GTM packet generator for the protocol/feature:

- **CLI:** `gtm full-packet --protocol <Name> --url <URL>` (and options: `--pr`, `--protocol-twitter`, `--protocol-farcaster`, `--campaign-type program`, `--cta`, etc.)
- **Output:** `research-output/<protocol-slug>/` (index.html, checklist, drafts, press, calendar, etc.)

### 3. Gap Audit and Questionnaire

After generation, fill gaps with product input:

1. **Run gtm-gap-auditor** — Compare packet to schema; identify missing or uncertain fields.
   - **Cursor:** *"Run the gtm-gap-auditor skill on research-output/rfox"*
   - **Output:** `research/gtm_gap_report.md`

2. **Run gtm-questionnaire-generator** — Build an HTML form from the gap report.
   - **Output:** `research/gtm_discovery_questionnaire.html` (fillable, saveable as JSON)

3. **Product person fills the form** — Fill out, click Save, download JSON or copy to clipboard.

4. **Run gtm-questionnaire-merger** — Merge filled form into the packet.
   - **Cursor:** *"Run the gtm-questionnaire-merger skill; packet is research-output/rfox; here's the filled form [paste or file]"*
   - **Output:** Updated marketing_brief, partner_kit, checklist, drafts, press, etc.

### 4. Final Check (before launch)

Run the **GTM Final Check** so the packet is release-ready:

- **Cursor:** Use the **gtm-final-check** skill: *"Run the GTM final check on this packet"* (with the packet path, e.g. `research-output/rfox`). The skill runs the 7-step check (source of truth, placeholders, protocol summary, framing, copy, brand voice, cadence) and identifies fixes.
- **Apply** all fixes the check identifies (Unknown/undefined, design key message, tweet length, infobot/checklist product type, press framing, calendar hooks, DMs, banned phrases, etc.).
- This step prevents placeholders, wrong framing, and copy issues from going live.

### 5. Execute

- **Open the packet:** Serve the packet folder over HTTP (e.g. `npx serve .` in `research-output/<protocol-slug>/`) and open **index.html**. Use **view.html** (linked from Content Drafts) to preview copy as X, Discord, or blog and to copy final text; fill any placeholders in the form. See the packet's **README.md** for run instructions.
- **PRE-FLIGHT** (in the packet's `checklist.md` or **checklist.html**): Confirm content ready, access verified, partner status. Optionally run the final check again if content changed.
- **Launch day:** Follow the Day 0 schedule (X, Discord, blog, Medium, Farcaster, DMs, etc.). Copy from the packet previews or from `drafts/` as needed.
- **Days 1–7:** Follow-up threads, engagement, metrics (editable in checklist.html), recap.

## Workflow Summary

```
1. Planning (gtm-workshop) → PR link, protocol URLs, transcript
2. Generate (gtm full-packet)
3. Gap Audit (gtm-gap-auditor)
4. Questionnaire (gtm-questionnaire-generator) → product person fills
5. Merge (gtm-questionnaire-merger)
6. Final Check (gtm-final-check)
7. Execute (checklist)
```

## References

- **GTM Skills Spec:** [GTM-SKILLS-SPEC.md](GTM-SKILLS-SPEC.md)
- **gtm-workshop:** `.cursor/skills/gtm-workshop/SKILL.md`
- **gtm-pr-extractor:** `.cursor/skills/gtm-pr-extractor/SKILL.md`
- **gtm-protocol-enricher:** `.cursor/skills/gtm-protocol-enricher/SKILL.md`
- **gtm-gap-auditor:** `.cursor/skills/gtm-gap-auditor/SKILL.md`
- **gtm-questionnaire-generator:** `.cursor/skills/gtm-questionnaire-generator/SKILL.md`
- **gtm-questionnaire-merger:** `.cursor/skills/gtm-questionnaire-merger/SKILL.md`
- **gtm-final-check:** `.cursor/skills/gtm-final-check/SKILL.md`
- **Packet checklist:** Each packet's `checklist.md` and `checklist.html` (Start Checklist from index)
- **Overview:** [GTM-Coordinator-Overview.md](GTM-Coordinator-Overview.md)
