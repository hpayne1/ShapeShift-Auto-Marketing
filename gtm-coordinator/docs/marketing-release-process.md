# Marketing Release Process

Standard sequence for taking a GTM packet from generation to launch.

## Steps

### 1. Generate

- Run the full GTM packet generator for the protocol/feature:
  - **CLI:** `gtm full-packet --protocol <Name> --url <URL>` (and options: `--campaign-type program`, `--cta`, etc.)
  - **Output:** `research-output/<protocol-slug>/` (index.html, checklist, drafts, press, calendar, etc.)

### 2. Final check (before launch)

- **Run the GTM Final Check** so the packet is release-ready:
  - **Cursor:** Use the **gtm-final-check** skill: *"Run the GTM final check on this packet"* (with the packet path, e.g. `research-output/rfox`). The skill runs the 5-step check (placeholders, protocol summary, framing, copy, cadence) and identifies fixes.
  - **Apply** all fixes the check identifies (Unknown/undefined, design key message, tweet length, infobot/checklist product type, press framing, calendar hooks, DMs, banned phrases, etc.).
- This step prevents placeholders, wrong framing, and copy issues from going live.

### 3. Execute

- **PRE-FLIGHT** (in the packet’s `checklist.md`): Confirm content ready, access verified, partner status. Optionally run the final check again if content changed.
- **Launch day:** Follow the Day 0 schedule (X, Discord, blog, Medium, Farcaster, DMs, etc.).
- **Days 1–7:** Follow-up threads, engagement, metrics, recap.

## References

- **Final check skill:** `.cursor/skills/gtm-final-check/SKILL.md` (use in Cursor: *"Run GTM final check"* or *"Use gtm-final-check skill on research-output/rfox"*).
- **Packet checklist:** Each packet’s `checklist.md` and `checklist.html` (Start Checklist from index).
- **Overview:** [GTM-Coordinator-Overview.md](GTM-Coordinator-Overview.md).
