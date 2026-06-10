# Demo: How a Session Gets Made (for Miguel)

Jeff asked me to run a full test of the `/session` command and write up how it works from the AI/engineering side, plus show what came out the other end. This is that writeup. It's deliberately light on detail — ask Jeff (or me) about anything you want to go deeper on.

## The one-paragraph version

This repo is a campaign engine: every NPC, location, session, and rule lives as a small markdown file with structured metadata. When the DM types `/session`, I don't invent a session from vibes — I assemble it. Scripts pull the current campaign state, semantic search digs up thematically relevant material from ~750 entity files, hard rules decide what I'm allowed to invent versus what I must ask about, and the DM approves things at fixed checkpoints. The output is a runnable session plan that's consistent with everything that's already happened at the table.

## How the planning actually flows

- **Orient.** A PowerShell script dumps the campaign dashboard in one shot — who's in the party, what's afflicting them, what last session's cliffhanger was. Cheaper and more reliable than me re-reading a dozen files.
- **Search, don't remember.** The repo has a vector index over every entity. I query it by *meaning* ("debts, dread, kindness on the road") rather than keywords, so old material resurfaces when it's thematically right. For this run it confirmed Vallaki was the natural destination and that nothing in canon already owned the motifs we wanted.
- **Rules constrain the AI.** Three big ones did real work in this run:
  - *Free entity rule* — if the session needs something that doesn't exist yet, I'm forbidden from silently inventing it. I have to stop and ask. (The road to Vallaki had no entity file — that became an explicit question, not improv.)
  - *Mysteries are protected* — the DM keeps a file of deliberately-unanswered questions. When pushed to explain "what's really going on underneath," I'm required to deflect and keep the unknown unknown.
  - *Campaign separation* — material seeded for the future homebrew world doesn't leak into Strahd sessions, even when it would fit.
- **The DM stays in control.** There are exactly five points where I stop and ask: orientation, hook choice, one batched scoping question, draft approval, and "should I save this?" Everything else runs without pestering.

## The testing trick: a fake DM

Here's the AI-enhanced-developer part. To test an interactive command end-to-end, you need someone answering the questions — so the engine has *persona agents*: small, scripted AI stand-ins for the DM. This run used `dm-suggestive`, a persona built to stress-test creativity handling. It plays a DM with a strong vision (slow folk-horror: "crows that watch but never land," "a debt someone can't name") but zero structural plans, and it follows deterministic rules so test runs are comparable — it asks exactly one forbidden-lore question, allows exactly one revision pass, and always answers the save offer the same way.

Each persona runs as a fresh subagent with hard constraints (no tools, no planning, answer in character only), and every reply is verified to have made zero tool calls — early testing showed unconstrained subagents would try to hijack the planner's job. The audit then scores the run: did the planner map the DM's motifs onto existing canon instead of inventing? Did it flag gaps instead of papering over them? Did it protect the mysteries under pressure? This run passed all of those, and also logged five concrete improvement findings (mostly token-efficiency stuff) into the test suite.

## What came out: Session 14 — "The Road Remembers"

The persona picked the night-hag thread from Session 13 and pulled it folk-horror. The plan: the party escorts Ireena and Ismark down the Old Svalich Road toward Vallaki — three days where wolves pace the treeline like they're *counting* rather than hunting, travelers leave bread on worn mile-markers and don't ask why, and crows sit one to a marker, never landing. The heart of the session is the Vadu Stead, the last roof before Vallaki: a genuinely warm family whose hospitality has prudence under it, because a cart stops there seasonally and nobody in the family can say what they pay. There's a third bed upstairs no one sleeps in and tally-marks no one admits cutting. The hag herself never appears — residue only. One real fight (the night "the tally completes"), then Vallaki's bells arriving through the trees, and a closing image: after three days of crows that watched and never landed, the one on the gatehouse is looking directly at them.

Two new entities were drafted, flagged, and DM-approved along the way (the road itself, and Mirena Vadu of the stead). Notably, the engine *refused* a couple of things mid-run: it wouldn't explain the hag's true purpose (protected mystery), and it parked a crow-themed faction idea because that material belongs to the next campaign.

## Where to look

- The full session plan and both entity drafts: `tests/runs/2026-06-10-session-suggestive-artifacts/`
- The step-by-step trace of every file read, script call, and persona checkpoint: `tests/runs/2026-06-10-session-suggestive.md`
- The improvement findings the run produced: `tests/commands/session/gaps.md`

Everything from this run is sandboxed in `tests/` — none of it touched the live campaign. (So no spoilers, Miguel: if any of this road shows up at the table, Kellan put it there on purpose.)
