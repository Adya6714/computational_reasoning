# RC Research Direction 1: Implementation Checklist and Technical Specification

**Study:** Research Direction 1 (Paper 1): what does the next dependent step use after a model writes its own wrong intermediate value, and use it for a targeted fix that improves accuracy on established benchmarks. Held-out benchmark never used while designing the fix. Report effects on previously-correct items.
**Repository:** `reasoning-computation`
**PI:** Adya Srivastava
**Date:** 20 November 2026
**Revised:** 24 November 2026. PI decisions of 23–24 November 2026: Direction 1 goal includes a targeted fix; model chosen by Phase 1 screen; generator validation, parser audit, build order and compute. See the programme document's Decision log (24 Nov 2026).
**Companion file:** `RC_Research_Programme.md` (programme, motivation, directions, and Direction 1's scientific case)

**How to use this file**
- **Part 1, step-by-step checklist:** what we create, in order, from repository setup to the advisor decision. Cursor builds from it. Every step has outputs and acceptance tests.
- **Part 2, technical specification:** the exact definitions Part 1 implements: symbols, token roles, interventions, controls, metric, eligibility and statistics. If Part 1 and Part 2 disagree, Part 2 wins until the PI approves a change.

**Status:** a pipeline smoke run has been done; no model hosted on GPU yet; no internals inspected. Programme Stage 1 (scope all directions) and the Direction 1 Phase 1 audits may proceed. Pipeline code for reported runs waits for the Phase 1 exit gate. Any GPU use needs explicit PI authorization. A cost estimate is provided before each run.

---

# Part 1: Step-by-step implementation checklist

## 0. Ground rules

1. **Order of work.**
   1. Programme review
   2. Benchmark review
   3. Tool review
   4. Model review
   5. Research-direction selection (or Stage 1 ranking: OPEN whether Direction 1 stays first)
   6. Paper 1 design freeze for the pilot
   7. Build all code first (generators, solvers, verifiers, scorers, parser, intervention code)
   8. Smoke test on CPU/Colab
   9. JarvisLabs for every reported run
   10. Advisor review
2. **What may happen now.** Creating the repository and README; programme documents; benchmark, model and tool audits (reading code, licences and papers); small CPU-level compatibility tests; completing the remaining pipeline code and CPU/Colab smoke tests. Colab/CPU for debugging only.
3. **What needs your explicit authorization first.**
   - Any GPU time. JarvisLabs for every reported run. Pause GPU instances when idle. Cost estimate before each run.
   - Any choice of dataset source, primary model or intervention framework.
4. **Nothing in Phases 0 to 2 is a result.** The pilot is a proof of concept. It can show feasibility, surface interesting patterns and expose design failures. It cannot establish generality or statistical significance.
5. **Every phase ends with a written decision** in `docs/experiment_decisions.md` (date, decision, evidence, approver).
6. **Methodology is versioned, not edited.** Cursor never changes methodology files in `docs/`.

### Phase map

| Phase | Goal | Main outputs | Who does most of the work |
|---|---|---|---|
| 0. Programme foundation | Establish the RC territory before committing Paper 1 resources | Updated programme document, direction matrix, literature and novelty map | You + Claude project (Literature Scout, Novelty Auditor) |
| 1. Benchmark, dataset, model and tooling selection | Decide what environments, models and tools can support the research | Benchmark audit, dataset derivation spec, model compatibility matrix, tooling audit | Claude project (audits), Cursor (compatibility test code), you (decisions) |
| 2. Build and pilot Research Direction 1 | Build the pipeline on the approved choices; run the 2 to 10 event pilot | Pipeline, event schema, pilot report | Cursor (code), you (review), Claude project (PR review, Results Analyst) |
| 3. Decide what the research becomes | Choose the next scientific investment from the pilot evidence | Pilot interpretation, decision record, scale-up proposal, advisor deck | You + Claude project |

---

## 1. Create the repository (allowed now)

### 1.1 On GitHub
- New **private** repository `reasoning-computation`. Do not fork or copy RvC or RR.
- `.gitignore`: Python defaults plus
  ```
  data/raw/
  data/processed/
  experiments/*/outputs/
  *.pt
  *.safetensors
  *.npy
  .env
  ```

### 1.2 First commit: README only
Message: `Initial commit: RC scope and separation from RR and RvC`.

```markdown
# Reasoning Computation (RC)

RC is an independent research programme on how large language models internally
represent, transform, update and use computational state, why multi-step
computations fail, and whether that understanding can improve models.

## Programme pillars
- I. Representation and computational state
- II. Computation, updating and control
- III. Computational failure and recovery
- IV. Generalization and improvement

## Research Direction 1 (Paper 1, in design)
When a model writes a wrong intermediate value during multi-step computation,
what does the next dependent step actually use: the written value, the original
source information, or internal state formed before the value was written?
Does that dependence predict whether the error propagates or is corrected?

## Separation from other programmes
| Repository | Purpose | Relationship |
|---|---|---|
| RvC (Retrieval versus Computation) | Behavioural transformations and evaluation | Separate; not RC infrastructure |
| RR (Reasoning Reliability) | Measuring, localising and improving reliability | Separate; not RC infrastructure |
| RC (this repository) | Internal computational state, causal dependence, error propagation | Own questions, protocols, experiments |

Code or ideas from RvC/RR are reused only after a suitability check and are
recorded in docs/reuse_register.md (source, version, modifications, validation).

## Status
- Programme foundation and benchmark/model/tool audits in progress.
- Methodology: versioned working design. Not frozen.
- A pipeline smoke run has been done; no model hosted on GPU yet; no internals inspected. GPU runs require PI authorization.
```

### 1.3 Second commit: skeleton

```
reasoning-computation/
├── README.md
├── pyproject.toml
├── .cursor/rules/rc.mdc
├── docs/
│   ├── RC_Research_Programme.md              # programme document (file 1)
│   ├── RC_Research_Direction_1_Implementation.md  # this file (file 2)
│   ├── programme/
│   │   ├── RC_Research_Direction_Matrix.csv
│   │   └── RC_Literature_and_Novelty_Map.csv
│   ├── audits/
│   │   ├── Benchmark_Audit.md
│   │   ├── Dataset_Derivation_Spec.md
│   │   ├── Model_Compatibility_Matrix.csv
│   │   └── Interpretability_Tooling_Audit.md
│   ├── pilot_protocol.md                # written before the pilot (Part 1, Section 5.3)
│   ├── experiment_decisions.md
│   └── reuse_register.md
├── audits/                              # compatibility-test code (Phase 1)
│   ├── tooling_compat/
│   └── model_compat/
├── configs/{models,tasks,experiments}/
├── src/rc/
│   ├── schemas.py
│   ├── logging_utils.py
│   ├── datasets/          # source-benchmark adapters + derivation (Phase 2)
│   ├── task_generation/   # controlled instance generation + solvers
│   ├── model_runner/
│   ├── trace_parsing/
│   ├── event_extraction/
│   ├── alignment/
│   ├── replay/
│   ├── interventions/
│   ├── readout/           # optional lens diagnostics (staged)
│   ├── free_running/
│   └── analysis/
├── experiments/{pilot_001,pilot_002}/
├── data/{raw,processed,manifests}/
├── tests/fixtures/
├── logs/{experiment_log.csv,exclusions.csv}
└── reports/
```

The `.csv` versions of the matrix and maps keep everything diffable in git. If you prefer spreadsheets for editing, keep a spreadsheet as the working copy and export to CSV for each commit.

---

## 2. Phase 0: Programme foundation

**Goal:** establish the scientific territory before committing Paper 1 resources. No code.

### 2.1 Pillars and directions

| Pillar | Question | Original directions |
|---|---|---|
| I. Representation and computational state | What information does the model represent, and in what form? | A, D, E |
| II. Computation, updating and control | How does the model manipulate information and maintain state? | B, C, H, I, M |
| III. Computational failure and recovery | Where does computation break, why, and how does the model recover? | F, G, L |
| IV. Generalization and improvement | Do mechanisms persist across settings; can understanding improve models? | J, K, M |

These are groupings over the A to M taxonomy, not replacements. **Note:** M appears under both II and IV in the proposal. Decide its primary home, or record it as shared.

**Proposed priority** (strategy only, not novelty-reviewed):
- First: F, G, D, A
- Second: B, C, E, H, I, L
- Third: J, K, M

### 2.2 Deliverables

**`RC_Research_Programme.md`** (keep current; it replaces a separate charter)
- Programme question
- Pillars
- Scope boundaries versus RvC and RR
- Governance (PI approvals)
- Evidence discipline
- Venue goals

**`RC_Research_Direction_Matrix.csv`**, one row per direction, columns:
`direction_id, pillar, scientific_question, candidate_task_families, candidate_methods, expected_evidence, evidence_level_reachable, shared_infrastructure, key_prior_work, open_questions, novelty_status, feasibility_compute, feasibility_tooling, priority, possible_followups, notes`

**`RC_Literature_and_Novelty_Map.csv`**, one row per paper, columns:
`paper_id, title, authors, year, venue_or_arxiv, version_checked, directions, task, models, methods, reported_finding, evidence_level, limitations, rc_relevance, full_text_read, code_inspected, verified_by, date_checked`

**`RC_Research_Roadmap.md`**
- Ordered list of candidate studies
- Dependencies between them
- Which infrastructure they share
- Which study is Research Direction 1, and why

### 2.3 How to do it
- In the Claude project, run Literature Scout per direction (2 to 4 tentative experiments per promising direction), then Novelty Auditor on the top candidates.
- Paper 1 rows come first. The competitors missing from the v1.0 matrix get rows: Zhu et al., Dalton, Thought Branches, Dutta et al., Lanham et al., Stolfo et al.

### 2.4 Phase 0 exit
- Programme document updated; matrix and map committed.
- Research Direction 1 is confirmed as the first study, or it competes in Stage 1 ranking (OPEN). Decision recorded.

---

## 3. Phase 1: Benchmark, dataset, model and tooling selection

### 3.1 Benchmark audit

**Principle.** A reasoning benchmark measures whether models solve problems. Paper 1 needs an **experimental task environment**: problems where intermediate values and dependencies are explicit, so we can intervene on them and know what caused an outcome. The environment is derived from established benchmarks where possible.

**Candidate sources** (as proposed; every factual detail below must be verified from the primary source during the audit):

| Candidate | Proposed role | Proposed RC use | Main open question |
|---|---|---|---|
| DSR-Bench (reported as PMLR v306) | Structural / data-structure reasoning | Derive stack, queue, tree, graph and state-update problems; track which previous state each operation consumes | Do its task grammar and traces support single-position interventions? |
| BeyondBench (reported as ICLR 2026, with public code; incl. Hard Suite) | Procedurally generated algorithmic and constraint tasks | Find task types with meaningful intermediate mistakes; derive fresh instances with exact ground truth | Do outputs expose a clear sequence of intermediate state transitions? |
| PlanBench / ACPBench | Planning and control flow (Pillar II) | Dependency tracking, subgoals, state transitions, backtracking, stopping | Different computational regime; states and actions instead of values, so W/S/P needs redefining |
| Variable-scope / assignment-chain tasks (incl. Kudo et al.-style and F2) | Controlled computational state | Direct fit to the W/S/P design. **Candidate only, not decided.** | Risk of a "toy task" critique; closeness to Kudo et al. |
| GSM8K / MATH / AIME | External validation | Check whether controlled findings show up in natural maths; source of error types | Contamination, variable formats, hard token-level dependency annotation |
| HardcoreLogic | Pending audit | Pending audit | Pending audit |
| Reasoning Gym tasks | Pending audit | Pending audit | External generators get the same validation audit as our own. A published audit found material defects in 13 of 105 Reasoning Gym generators |
| GSM-Symbolic | Pending audit | Pending audit | Pending audit |

**Audit checklist** (one section per benchmark in `Benchmark_Audit.md`):
1. **Primary source verified:** paper, venue, version, date checked.
2. **Code and licence:** repository URL, commit inspected, licence terms for derivation and redistribution.
3. **Generator:** is there one, how is it seeded, what is its parameter space?
4. **Verifier:** is there an exact solver that checks every intermediate transition, not just the final answer?
5. **Intermediate state:** can every intermediate state be extracted as an explicit value with a dependency graph?
6. **Trace format:** will models naturally write intermediate states in a parseable, step-by-step form?
7. **Intervention fit:** can a source fact be changed by a one-token edit? Is each written intermediate value a single token (or is there a defined multi-token handling)? Is collision metadata available, i.e. whether the dependent operation is one-to-one?
8. **Contamination risk:** how much public exposure is there, and can fresh instances be generated?
9. **Difficulty range:** can difficulty be raised enough to produce natural errors in the candidate models without changing the construct?
10. **Directions served:** which pillars/directions beyond Paper 1 could reuse it?
11. **Score** (1 to 5) on: intervention fit, verifiability, natural-error potential, scientific breadth, contamination safety, implementation cost. Plus a written verdict.

**`Dataset_Derivation_Spec.md`**, for the chosen source or sources:

| Stage | Content |
|---|---|
| Source | Benchmark, version, task families used, licence |
| Extract | Operation sequence, state variables, dependencies, exact solution |
| Transform | Symbol renaming, value changes, operation-sequence and structure changes, difficulty control |
| Verify | Two independent solvers check every transition and the final answer |
| Output | RC dataset schema: source facts with spans, dependency graph, every intermediate value, operation injectivity, seeds, provenance link to the source instance |

**Requirements the derived dataset must meet for Paper 1** (from Part 2, S10, S12 and S15):
- exact intermediate values;
- an explicit dependency graph;
- editable source facts;
- single-token values, or a stated multi-token rule;
- collision metadata;
- fresh seeds;
- provenance.

**Decision needed (open):** dataset source after the benchmark audit (G3). Programme P1 (which reasoning type first) is retired as likely moot under Stage 1: benchmarks may differ per direction. Variable/assignment chains remain a candidate only, not decided. Proposed starting hypothesis (not approved): derive the first dataset from DSR-Bench plus controlled variable-dependency tasks, using BeyondBench to find harder algorithmic families.

### 3.2 Model review and compatibility matrix

The working model is chosen by a Phase 1 model screen on audited benchmark items. There is no primary model until that screen is done.

**Must-haves.** (1) open weights + activation access, (2) reproducible, (3) enough natural errors, (4) parseable reasoning, (5) intervention tooling works, (6) fits budget (A100 40/80GB), (7) fine-tunable/editable.

**Nice-to-haves** (PI top-3 priority: OPEN). (8) existing SAEs/transcoders, (9) thinking on/off in same weights, (10) open training data, (11) multi-size family, (12) recency, (13) standard architecture, (14) number tokenization.

**Candidates for the Phase 1 screen** (not an approved roster):

| Model | Proposed role |
|---|---|
| Qwen3.5 (0.8B / 2B / 4B / 9B) | Hybrid Gated DeltaNet family. Required for direction M |
| Gemma 3 (270M / 1B / 4B / 12B / 27B) | Standard architecture; Gemma Scope 2 SAEs/transcoders on every layer. Required for direction M. 27B is a family member, not a planned run on this budget |
| Olmo 3 7B | Fully open data and checkpoints. Required for direction K |

**`Model_Compatibility_Matrix.csv` columns:**
`model, revision, params, licence, thinking_toggle, chat_template_verified, digits_single_token, loads_in_framework, residual_hook_points, cache_at_positions_ok, identity_patch_zero, all_layer_clamp_ok, peak_mem_gb_at_max_ctx, tokens_per_s, replay_fidelity_ok, behavioural_yield_estimate, notes, tested_on, git_commit`

**Behavioural yield screen** (needs GPU authorization):
- A small, fixed-size run of the candidate dataset on the shortlisted models.
- Purpose: estimate the natural-error rate by difficulty level and mode.
- Seeds used here are retired. Size cap, cost cap and stop rule are written in the authorization request before it runs.

**Pilot rule.** The pilot uses **one** fixed checkpoint. A second model family is a replication question for later.

### 3.3 Interpretability tooling audit

**Five-layer toolkit:**

| Layer | Purpose | Candidate tools | Paper 1 status |
|---|---|---|---|
| 1. Readout | Make candidate internal information readable (correct value, wrong value, source facts, operation) | Logit lens and tuned lens (baselines); J++ Lens, Chain Lens, MicroLens (from the updated research map; existence, code and model support to verify) | Diagnostic addition, not a prerequisite. A value being readable does not mean the model uses it |
| 2. Representational basis | How information is encoded | Neurons, linear probes, ICA, DAS, SAEs | Linear/neuron baselines; DAS optional; ICA and SAEs staged later |
| 3. Causal influence | Change activations and measure downstream computation | Activation patching, path patching, attribution patching/EAP, ablation, resample ablation, causal abstraction/DAS | **Core for Paper 1** (W/S/P interventions) |
| 4. Computational organization | Which components and paths are responsible | ACDC, EAP, SAE circuits, transcoders, causal scrubbing | Second stage, only after a reproducible causal effect |
| 5. Improvement | Targeted changes that improve reliability | Steering, ablation, mechanistic shaping | Later programme |

**Software candidates:**

| Package | Intended use |
|---|---|
| Plain Hugging Face + PyTorch hooks | Baseline implementation with full control |
| TransformerLens | Activation caching, hooks, interventions (check support for the exact model) |
| nnsight | Inspecting and intervening in Hugging Face models |
| pyvene | Interchange interventions, subspace causal tests (DAS) |
| SAELens / Neuronpedia | SAE loading and feature inspection (staged) |
| J++ Lens, MicroLens | Readout and position exploration (verify before planning around them) |

Compatibility depends on the version and the architecture. Test the exact model, library version and hook points. Never assume support.

**Framework compatibility test** (Cursor writes this in `audits/tooling_compat/`). Run the same battery on each framework with a small model on CPU/Colab first, then on the primary candidate only with GPU authorization:
1. Load the model; render the chat template with thinking on and off.
2. Cache residual-stream activations at chosen positions and layers.
3. **Identity patch:** patch activations with themselves; logits change by exactly zero.
4. **Position-exact patch:** only the listed positions change; all other positions stay bit-identical.
5. **All-layer clamp** at a position window works.
6. Logits before the earliest intervention position are unchanged.
7. Replay fidelity: teacher-forced log-prob matches the generation-time log-prob.
8. Wall time and peak memory for one full event-style pass at representative context length.
9. Effort to implement the eight factorial cells in S13.4.

**`Interpretability_Tooling_Audit.md`:** one section per tool, covering:
- the question it answers in RC;
- the layer it belongs to;
- version tested;
- models supported;
- test battery results;
- known caveats;
- verdict: use now, staged, or reject.

**Rule:** every tool in the pipeline must map to a named scientific question. Recommended Paper 1 pilot stack, pending the audit:
- HF loading and generation;
- one intervention framework chosen by the compatibility test;
- direct activation patching as the primary causal technique;
- linear/neuron baselines (optionally DAS);
- lenses as optional diagnostics.

### 3.4 Phase 1 exit gate

| Decision | Evidence required |
|---|---|
| Dataset source(s) and derivation spec | Benchmark audit with scores and verdicts |
| Primary pilot model (one checkpoint) | Compatibility matrix row complete; yield screen result |
| Intervention framework | Tooling audit battery passed |
| Optional readout diagnostics in the pilot | Each tied to a named question |
| Part 2 specification v1.2 | S10, S11 and S13 updated to match the above; PI-approved |

Reported GPU runs wait for this gate. Remaining pipeline code may be written and smoke-tested on CPU/Colab. Build all code first; JarvisLabs only for reported runs.

---

## 4. Phase 2: Build Research Direction 1

### 4.1 Cursor project rules (`.cursor/rules/rc.mdc`)

```markdown
---
description: RC research repository rules
alwaysApply: true
---
- The specification is docs/RC_Research_Direction_1_Implementation.md Part 2
  (current approved version) plus docs/audits/Dataset_Derivation_Spec.md. Implement exactly what they define.
  If ambiguous, stop and ask; do not invent definitions.
- Never change dataset source, model, framework or methodology. Those are PI
  decisions recorded in docs/experiment_decisions.md.
- Never edit files in docs/ except experiment_decisions.md entries the user dictates.
- Never run GPU jobs, download large models or start long runs unless the user
  explicitly asks in this session.
- Every function gets a unit test. Every intervention runs the validation checks
  in Part 2, S14.4.
- Use the code names from Part 2, S12.1.
- Every stage logs exclusions to logs/exclusions.csv with a reason code from
  Part 2, S18.2. Never drop an example silently.
- Every output records git commit, config hash, seed, model revision, timestamp.
- Do not copy RvC/RR code without an entry in docs/reuse_register.md.
- Do not call outputs results or findings.
```

### 4.2 Prompt pattern and review loop
- **Prompt:** "Read Part 2 sections SX, the derivation spec, and guide step N. Implement step N only. Files: ... Acceptance tests: ... Run pytest, show output, open PR 'Step N: name'."
- **Review loop:**
  1. Cursor opens a PR.
  2. You read the diff and run the tests.
  3. The Claude project reviews it against the Part 2 specification (mismatches first).
  4. Merge, and record any decision.

### 4.3 Reuse audit (before Step 1)
Inspect RvC (task generation, verification, model runner, logging) and RR (logging, intervention utilities, evaluation). Add a row per candidate to `docs/reuse_register.md`:
`component, source_repo, commit, function, suitable_for_RC_and_why, modifications, validation_status, decision`.
Default to rewriting anything that touches RC definitions (role map, events, interventions, metric).

### 4.4 Build steps

**Build order.** Build all code first (generators, solvers, verifiers, scorers, parser, intervention code) → smoke test on CPU/Colab → JarvisLabs for every reported run. Colab/CPU for debugging only. Pause GPU instances when idle. Use the same architecture family as the screened model where possible, so hook points match.

**Step 1: Schemas, config, logging.**
- **Build:**
  - Pydantic models: `SourceInstance`, `Task`, `SourceFact`, `Trace`, `ParsedStep`, `Event`, `TokenRoleMap`, `InterventionSpec`, `ReplayResult`, `FreeRunResult`, `ExclusionRecord`, `RunRecord`.
  - `InterventionSpec` mirrors Part 2, S13.2: treatment, control, positions, layers, held_unchanged, outcome, alternative_explanations.
  - Exclusion reason codes as an Enum, from Part 2, S18.2.
  - Export `Event_Schema.json`.
- **Tests:** schema round-trips; invalid reason codes rejected; config hash is deterministic.

**Step 2: Dataset derivation and controlled generation.**
- **Build:**
  - Adapters in `src/rc/datasets/` for the approved source benchmark(s): load, extract, transform per `Dataset_Derivation_Spec.md`.
  - Generator in `src/rc/task_generation/` for fresh controlled instances.
  - Two independent solvers.
  - Injectivity and collision metadata per operation.
  - Provenance link to each source instance.
  - Duplicate check across splits.
- **Tests:** two independent solvers agree on 100% of items; seed reproducibility; source-fact spans correct; injectivity flags correct. Property tests, scorer tests and generator validation as in Part 2, S10.1.

**Step 3: Templates and tokenizer checks.**
- **Build:** a prompt template that makes the model write explicit intermediate steps in a fixed format, in both thinking-on and thinking-off modes.
- **Tests:** values are single tokens in every template context (or the multi-token rule from the Part 2 specification is applied); token-ID parity across renders; modes differ only in expected template tokens.

**Step 4: Model runner.**
- **Build:**
  - Generation with per-mode decoding.
  - Save full token IDs, text, per-token log-probs, settings, seed, revision, wall time, peak memory.
  - Null and echo clients.
  - Leaky no-think flag.
- **Tests:** complete records; null/echo behaviour; greedy reproducibility.

**Step 5: Trace parser.**
- **Build:**
  - Parse steps into target, operands, operation and written result, with character spans, from both the thinking and answer blocks.
  - Detect source restatements (S_trace) and link each to its fact.
  - Detect re-derivations/corrections (`m_rederivation`).
  - Unparseable lines are flagged, never dropped.
- **Tests:** at least 10 hand-built fixtures, including messy thinking text.

**Step 6: Event extractor.**
- **Build:**
  - Root error = first wrong intermediate on the dependency path.
  - j = first later step consuming it.
  - Single-error condition at j.
  - v_correct, v_written, ans_correct, ans_implied.
  - Collision checks (Part 2, S15).
  - Funnel counts (Section 18.1).
- **Tests:** known-error fixtures; multi-error exclusion; collision code on a non-injective operation; funnel adds up.

**Step 7: Token alignment and event cards.**
- **Build:**
  - Token role map (Part 2, S12.2) from offset mapping.
  - Pmin, P1, P2 and P1\S_trace.
  - j_ans.
  - Colour-coded event card per event.
- **Tests:** every token has exactly one role; text reconstructs; fixture positions are correct.
- **Checkpoint A:** review at least 10 event cards from real small-model traces by hand before Step 8.

**Step 8: Teacher-forced replay.**
- **Build:**
  - Digit/answer logits at j_ans.
  - LD = logit(ans_correct) − logit(ans_implied).
  - Target-specific pairs; all candidate log-probs; KL.
  - Replay fidelity check.
  - Time and memory.
- **Tests:** fidelity passes; repeat replays identical.

**Step 9: Interventions and controls** (built on the framework chosen in Phase 1).
- **Build, in this order:**
  1. Token edits: I_W, I_S-prompt, I_S-all.
  2. Position-aligned donor runs.
  3. Hook context manager (single layer, band, all layers).
  4. I_P and I_S|P, forward and reverse.
  5. All controls in Part 2, S14.
  6. Validation on every call (Section 14.4).
  7. OOD diagnostics.
- **Tests:** clamp identity, no-op patch and W identity edit all give exactly zero change; a deliberately wrong-position patch is caught; all eight factorial cells run on a fixture.

**Step 10 (optional, staged): Readout diagnostics.**
- **Build:** logit lens and tuned lens baselines; any approved lens from the tooling audit; read v_correct / v_written / source values across layers at P and j_ans.
- **Note:** reported as decodability only, never as use.
- **Tests:** lens outputs reproduce on a fixture; baseline comparison included.

**Step 11: Producing-step resampling.**
- **Build:** N resamples from the same prefix; recurrence rate; on-policy v_alt; p(S*) as the modal value with its share, or `PSTAR_UNDEFINED`.
- **Tests:** nothing after W conditions the resampling; seeded reproducibility.

**Step 12: Free-running continuation.**
- **Build:**
  - K continuations from the context ending at W.
  - Labels from the solver: `PROPAGATED`, `RECOVERED`, `REWRITTEN`, `OTHER_WRONG`, `UNPARSEABLE`.
  - Raw, counterfactual++-style and rewrite rates side by side.
- **Tests:** fixture labels match hand labels; outputs stored separately from replay.

**Step 13: Pilot analysis and report.**
- **Build:**
  - Event cards with all metrics, controls, validation and free-running labels.
  - Funnel and exclusions.
  - Runtime and memory.
  - Pre-registered expectation table versus observations (Section 5.3).
  - "What the pilot must tell us" table.
  - No significance tests. No averages presented as effects.

---

## 5. Phase 2: The 2 to 10 event pilot (proof of concept)

### 5.1 Two jobs
1. **Validate the pipeline.** Generate or select tasks, run the model, find natural errors, inspect activations, intervene and analyse.
2. **Test scientific promise.** Look for cases that reveal a pattern, separate competing explanations, or expose a phenomenon worth scaling.

### 5.2 Three types of evidence aimed for

| Type | What it shows | Signal |
|---|---|---|
| A. One complete, reproducible natural-error case | Model-generated error, correct solution, dependent step, token alignment, activation positions | Pipeline |
| B. Controlled intervention comparison | Whether changing W, S or P changes the next computation, next to controls; ideally a pattern separating at least two explanations | Scientific |
| C. Replay-to-free-running comparison | Whether intervention measurements relate to what the model does when it continues freely | Research direction |

### 5.3 Written before the pilot runs (commit to `docs/pilot_protocol.md`)

1. **Screening pool:** fixed size, seeds, difficulty levels, mode(s). Example structure: N items per difficulty cell, generated and frozen before any trace is produced.
2. **Eligibility rules:** Part 2, S12, S15 and S18.
3. **Selection rule** for which eligible events get the full intervention battery. It must be mechanical. Example: process eligible events in a pre-shuffled order, stratified by error class (repeat versus non-repeat under resampling), until the batch cap is reached.
4. **Expected patterns per explanation.** For each competing explanation in Programme doc Section 8.3, write the expected direction of ΔW, ΔP and ΔS|P and the free-running outcome. For example:
   - copying: large ΔW, small ΔP and ΔS|P;
   - latent pre-write state: small ΔW, large ΔP;
   - recompute from source: output moves toward f(v*) under source edits with W fixed;
   - faulty-procedure recompute: output moves toward f(p(S*)).
5. **Advisor-deck selection rule:** how representative examples will be chosen for slides (e.g. one per observed pattern, chosen by the pre-shuffled order). The full pilot results go in the appendix.

### 5.4 Integrity rules
- Never resample a trace until an error appears. Generate more items from the pool instead, and log it.
- Keep every eligible event. Report positive, negative, null and failed-control cases.
- Every generated example appears in the funnel or the exclusions log.
- Phase 0 to 2 seeds are retired from later phases.

### 5.5 Runbook

**Before the first GPU session**
- [ ] Phase 1 exit gate passed; Part 2 specification v1.2 approved.
- [ ] Steps 1 to 9, 11, 12 and 13 merged and green on the small model (Step 10 optional).
- [ ] Checkpoint A done.
- [ ] Pilot protocol (5.3) committed.
- [ ] Model revision pinned.
- [ ] GPU authorization recorded: session plan, time cap, cost cap, stop point.
- [ ] JarvisLabs logging ready (start, end, instance, cost, against the ₹10,000 budget).

**Batch 1 (`experiments/pilot_001/`, 2 to 3 events): end to end**
1. Generate traces for the screening pool.
2. Parse, extract events, build role maps and event cards.
3. Check alignment on every card.
4. Run one replay per event, with the fidelity check.
5. Run one free-running continuation per event.
6. Save raw outputs, token IDs, logits at j_ans, activation metadata, time and memory.
7. Fix instrumentation before Batch 2.

**Batch 2 (`experiments/pilot_002/`, 5 to 10 events): measurements and signal**
1. Select events by the written rule; include different error classes if present.
2. Run I_W, I_S-prompt, I_S-all, I_P (P1; single-layer sweep plus the frozen layer set), I_S|P, both directions.
3. Run every control in Part 2, S14.
4. Run optional readout diagnostics if approved.
5. Compare replay with free-running per event.
6. Fill the expectation-versus-observation table.
7. Log failures and surprises.

**If natural errors are too rare:** record the yield (it is information). Move to the pre-planned harder difficulty cells in the pool. Stop if still none. Any task change is a logged PI decision.

### 5.6 What the pilot must tell us

| Question | Successful pilot |
|---|---|
| Valid tasks? | Both solvers verify every task |
| Natural errors? | Some model-generated errors identified, with yield by difficulty |
| W and j identified? | Correct spans and dependencies on event cards |
| P extracted? | Correct pre-write positions |
| Interventions execute? | Intended positions changed; all Section 14.4 checks pass |
| Controls sensible? | Identity controls exactly zero; unrelated interventions do not reproduce the effect indiscriminately |
| Replay versus free-running separated? | Separate outputs and labels |
| Resource cost? | Runtime and memory per event and component |
| **Scientific signal?** | Observations compared against the pre-written expectation table; any pattern that separates explanations is described with its cases, including counter-cases |

---

## 6. Phase 3: Decide what the research becomes

**Possible outcomes:**
- scale Paper 1 to a confirmatory study (P0 benchmark and authorization first);
- narrow the question to the interventions with reliable effects;
- move toward a circuit or computational-role study;
- pivot to another RC direction;
- start a targeted-reliability study.

**Outputs:**
- `reports/Pilot_Interpretation.md` (Results Analyst + Adversarial Reviewer in the Claude project)
- `docs/Research_Decision_Record.md`
- `docs/Scaleup_Proposal.md`
- the advisor presentation, using the pre-written example-selection rule

---

## 7. Using the Claude co-work project

| Phase | Ask the Claude project for |
|---|---|
| 0 | Literature Scout per direction; Novelty Auditor on top candidates; draft charter and matrix rows for your review |
| 1 | Benchmark audits from primary sources and repositories; tooling and model audit write-ups; review of compatibility-test code and results |
| 2 | PR review against the Part 2 specification; event-card alignment checks; Experimental Designer review of the pilot protocol before it is committed |
| 3 | Results Analyst and Adversarial Reviewer on the pilot report; advisor-deck review |

Connect the GitHub repository to the project so it can read diffs and files. Decisions live in the repo, not only in chats.

---

## 8. Data management

| In git | Out of git |
|---|---|
| Code, configs, tests, fixtures, audits, programme docs | Raw traces at scale, activation tensors, model weights |
| `data/manifests/*.csv` (path, SHA-256, size, commit) | `data/raw/`, `data/processed/` |
| `logs/*.csv`, event cards, pilot report | Large outputs (JarvisLabs storage or a drive, referenced by manifest) |

---

## 9. Definition of done per phase

**Phase 0**
- [ ] Programme document updated; direction matrix and literature/novelty map committed.
- [ ] Research Direction 1 confirmed or replaced.

**Phase 1**
- [ ] Benchmark audit with verdicts.
- [ ] Derivation spec.
- [ ] Compatibility matrix.
- [ ] Tooling audit.
- [ ] Exit-gate decisions recorded.
- [ ] Part 2 specification v1.2 approved.

**Phase 2**
- [ ] Pipeline steps merged with tests.
- [ ] Pilot protocol committed before any pilot run.
- [ ] Batches 1 and 2 complete.
- [ ] Every example accounted for.
- [ ] Identity controls exactly zero.
- [ ] Pilot report written.

**Phase 3**
- [ ] Interpretation reviewed.

---

# Part 2: Technical specification (methodology v1.1)

This part defines exactly what is built and measured. Section numbers carry an "S" prefix so they are not confused with the Part 1 checklist.

## S9. Study phases

| Phase | Purpose | Authorization |
|---|---|---|
| Programme Phases 0 and 1 | Programme foundation; benchmark, model and tooling selection (Part 1, Sections 2 and 3) | Allowed now (no GPU without authorization) |
| 2 to 10 event pilot | Validate the pipeline and test scientific promise (Part 1, S5) | After the Phase 1 exit gate and GPU authorization |
| Gate V0: intervention validation | Interventions behave as expected on correct traces | Part of the pilot and of P0 |
| P0: feasibility pilot | Yield, trace lengths, error classes, exclusions, timing, alignment feasibility at scale | NOT authorized; requires end-to-end benchmark and budget review |
| Gate B: replay-to-recovery bridge pilot | Reliability and predictiveness of replay measures | NOT authorized |
| Confirmatory study | Preregistered tests | NOT authorized; requires dated preregistration |

Seeds used in any phase are retired from later phases.

## S10. Datasets and task construction

**Status:** the dataset source is decided by the benchmark audit (Part 1, S3.1). F2 below is one candidate, kept here as the reference design. Variable/assignment chains are a candidate only, not decided. Whatever source is chosen must meet the constraints listed in this section. External generators get the same validation audit as our own.

| Dataset | Role | Design | Factors |
|---|---|---|---|
| F2: variable-dependency programs | Core for RQ1 to RQ3 | Source facts define variables; operations mod 10 arranged in a dependency graph; model computes a queried final variable | Depth (3, 5, 8), look-back distance, fan-out, source redundancy (each fact stated 1, 2 or 3 times) |
| F1: running-sum lookup | RQ0 only | Word-to-value dictionary across turns; running sum | Keys per turn, number of turns |
| Python code tracing | Held-out format transfer (same graphs, different surface) | Equivalent graphs as Python; `sys.settrace` provides reference state | As F2 |
| F3: multi-digit addition with carries | Optional comparison with Dalton | Carry chains | Digits, carry patterns |

**Construction constraints.**
- Values are single digits so each value is one token (verified per tokenizer).
- Source and written-value interventions are one-token substitutions.
- Ground truth only from code. Every item is checked by two independent reference solvers; the solvers must agree on 100% of items.
- The generator records, for each operation, whether it is injective (one-to-one) over digits mod 10. Addition and subtraction mod 10 are injective; multiplication is injective only by 1, 3, 7 or 9. This metadata drives the collision rule in S15.
- Null client (random digits) and echo client (repeats last number) must behave as specified.
- Duplicate items are checked across all splits.

### S10.1 Validation of task generators (24 Nov 2026)

- **Ground truth only from code.** Two independent solvers must agree on 100% of items.
- **Property tests:** determinism, no duplicates, value ranges, no ambiguous names, tokenization recorded.
- **Scorer tests:** accepts correct; rejects all wrong variants; no crash on malformed input; planted-defect set.
- **Versions:** frozen and hashed generator versions. One regression test per bug found.
- **LLM role:** bug-finder only, never a label source. Run via Cursor agent or a separate Claude chat. No paid API calls. Prompt versioned at `validation/prompts/bugfind_v1.md`.
- **Log.** Every flag is logged in `validation/llm_bugfind_log.csv` with columns: `date, generator_version, reviewer, prompt_version, file_reviewed, flagged_issue, severity, verified_by, verdict, fix_commit, regression_test_id`.
- A flag counts as a bug only when reproduced by a failing test. False alarms stay logged.
- External generators (including Reasoning Gym) get this same audit. A published audit found material defects in 13 of 105 Reasoning Gym generators.

## S11. Models and decoding

**Status:** the pilot uses one checkpoint, chosen by a Phase 1 model screen on audited benchmark items (Part 1, S3.2). The table below is the screen roster, not an approved primary.

| Model | Role | Status |
|---|---|---|
| Qwen3.5 (0.8B / 2B / 4B / 9B) | Hybrid Gated DeltaNet family; required for direction M | Screen candidate |
| Gemma 3 (270M / 1B / 4B / 12B / 27B) | Standard architecture; Gemma Scope 2 SAEs/transcoders on every layer; required for direction M | Screen candidate. 27B not a planned run on this budget |
| Olmo 3 7B | Fully open data and checkpoints; required for direction K | Screen candidate |
| Small same-family model from the screened family | Pipeline development and unit testing only | No scientific use; never reported as evidence |

**Decoding.** Qwen3 thinking: temperature 0.6, top-p 0.95. Qwen3 non-thinking: temperature 0.7, top-p 0.8. Other models: model-card settings, recorded per run. Exact model revisions, templates, token IDs, decoding settings and execution configurations are logged for every run.

## S12. Operational definitions and token alignment (new in v1.1)

### S12.1 Symbols

| Symbol | Code name | Definition |
|---|---|---|
| S_prompt | `src_prompt` | Original source facts as stated in the prompt (token spans) |
| S_trace | `src_trace` | Any source fact restated in the reasoning trace before j (token spans, each linked to the prompt fact it restates) |
| S | `src` | S_prompt together with S_trace |
| E | `prod_expr` | Expression in the trace that produces the intermediate value (e.g. `x = 3 + 4 =`) |
| W | `written` | Written intermediate-value token (one digit token), value v′ |
| P | `prewrite` | Pre-write activation window (Pmin, P1, P2; S12.3) |
| M | `intervening` | All trace tokens strictly between W and the dependent step's operand/answer positions, excluding tokens labelled S_trace or restatements of W |
| R_W | `w_restate` | Later restatements of v′ between W and j |
| j | `dep_step` | First later step whose computation takes the target intermediate as an input |
| j_ans | `dep_answer_pos` | Position whose next-token distribution is the dependent step's answer digit |
| v | `v_correct` | Correct intermediate value |
| v′ | `v_written` | Model's incorrect written value |
| v″ | `v_alt` | Replacement written value (on-policy from producing-step resampling, or off-policy magnitude-matched) |
| S* | `src_edit` | One-token source edit that changes the correct intermediate value to v* |
| v* | `v_star` | Correct intermediate value under S* |
| p(S*) | `v_pstar` | Producing-step output under S* (defined in 12.4) |
| f_j | `dep_fn` | The operation at step j, with j's other inputs held at their trace values |
| a* | `ans_correct` | Correct downstream answer: f_j(v) |
| a′ | `ans_implied` | Downstream answer implied by the wrong value: f_j(v′) |
| a″, a^v*, a^p | `ans_alt`, `ans_star`, `ans_pstar` | f_j(v″), f_j(v*), f_j(p(S*)) |

### S12.2 Token role map

For every event, every token from the start of the prompt to j_ans is assigned exactly one role:
`SYSTEM/TEMPLATE`, `S_prompt`, `OTHER_PROMPT`, `S_trace`, `E`, `W`, `R_W`, `M`, `J_OPERANDS`, `J_ANS`, `OTHER_TRACE`.

Rules:
1. Roles are assigned from character offsets mapped to token offsets using the tokenizer's offset mapping. Any token that straddles a role boundary marks the event `ALIGN_STRADDLE` and excludes it.
2. A digit in the trace equal to a source value is labelled S_trace only if the parser links it to a specific source fact (e.g. `a = 3` restating prompt `a = 3`). Coincidental equal digits are not S_trace.
3. If E contains S_trace tokens (e.g. `x = 3 + 4`), they keep the S_trace label, and the event records `p1_contains_src_trace = true`.
4. The map is saved per event and rendered in a human-readable event card for review (S19).

**Why S_trace matters.** If only the prompt is edited, the model can still read restated source values in the trace. A small prompt-only source effect could then be wrongly read as "no source dependence".

### S12.3 Pre-write windows

| Window | Definition | Role |
|---|---|---|
| Pmin | Single position immediately before the first W token | Minimal local diagnostic |
| P1 | E through the position immediately before W | Pre-specified primary window |
| P2 | P1 plus the preceding step span | Sensitivity analysis |
| P1\S_trace | P1 with S_trace positions removed | Sensitivity variant, separates pre-write state from restated source tokens |

All windows are reported. P1 is primary. Windows are never chosen after seeing outcomes. If P1 fails pre-written validity checks, the event is excluded under that rule.

### S12.4 Value definitions requiring care

- **v″ on-policy:** a value other than v′ produced when the producing step is resampled from the same prefix. Not selected on the outcome at j. Availability is recorded; it is expected to be lower for systematic errors.
- **p(S*):** the modal producing-step output over the producing-step resamples under S* (teacher-forced prefix with S* substituted), with its recurrence share recorded. If no value reaches a pre-specified modal share, p(S*) is marked undefined and faulty-procedure analyses exclude the event.
- **Slip / systematic:** recurrence rate of v′ over producing-step resamples is stored as a continuous covariate. A binary class uses a PI-frozen cut-off for stratification only.
- **Single-error condition:** the root error must be the only incorrect input to j. Events where j has another incorrect input are excluded (`MULTI_ERROR_AT_J`).

## S13. Intervention specification (new in v1.1)

### S13.1 Common rules

- Token-edit interventions change token IDs only at the listed positions. The modified sequence is re-run from the first edited position (earlier KV cache may be reused only if verified bit-identical).
- Activation interventions overwrite the residual stream (input to the transformer block) at listed positions and layers.
- **Donor construction:** a donor sequence is the original token sequence with S* substituted at the listed source positions, run teacher-forced. Donor and recipient are therefore position-aligned. Donor activations come from an off-policy context; this is stated wherever donor results are reported.
- An activation patch establishes sensitivity to that particular intervention. It is not proof of an independent computational pathway.

### S13.2 Intervention table

| Intervention | Treatment | Control | Positions affected | Layers affected | Held unchanged | Outcome measured | Alternative explanations |
|---|---|---|---|---|---|---|---|
| **I_W** (written-value edit) | W and all R_W set to v″ | Original sequence (W = v′) | W, R_W | None patched; all layers recomputed after the edit | S_prompt, S_trace, E, P, M | S15 metrics at j_ans; primary target pair (a″ versus a′) | Sensitivity to any digit at that position (check with value-preserving and random-digit controls); off-policy text if v″ is hand-picked |
| **I_S-prompt** (prompt source edit) | One S_prompt fact set to its S* value | Original sequence | That S_prompt token only | None patched; recomputed after edit | S_trace, E text, W = v′, M | Metrics at j_ans; target pair (a^v* versus a′) and (a^p versus a′) | Model reads S_trace instead; edit changes unrelated context; total effect is not a route estimate |
| **I_S-all** (prompt and trace source edit) | The S_prompt fact and every linked S_trace restatement set to S* values | Original sequence | S_prompt token and linked S_trace tokens | None patched; recomputed after edits | E non-source tokens, W = v′, M | As I_S-prompt | Trace becomes internally inconsistent (restated source no longer matches W); flag likelihood of edited trace |
| **I_P** (pre-write state transplant) | Residual stream at P positions replaced with donor-run activations (donor uses S*) | Original activations at P | P window positions (P1 primary; Pmin, P2, P1\S_trace sensitivity) | Primary: frozen layer set (13.3); diagnostic: single-layer sweep | All token IDs (S, W = v′, M) | Metrics at j_ans; target pair (a^v* versus a′) | Patch transfers more than the value (token identity of S_trace in P1, position, format); OOD activation; compensation by later layers |
| **I_S\|P** (source edit with pre-write clamp) | I_S-prompt (or I_S-all) applied while P activations are clamped to original-run values | I_S-prompt (or I_S-all) without clamp | Source positions (token edit) + P positions (clamp) | Clamp at all layers at P positions | W = v′, M tokens | Residual source effect at j_ans not passing through clamped P positions | Source information relays through M, S_trace or other positions; clamp is not a full route block |
| **I_W-res** (optional, separately named) | Residual stream at W position patched from a run with W = v″ | Original | W position | Named layers | All tokens | Metrics at j_ans | Not the same as I_W; never pooled with I_P |

### S13.3 Layer scope and freeze rule

- **I_S|P clamp:** all layers at P positions. A single-layer clamp would let later layers at P re-read S* through attention, so it would not mean what the estimand claims.
- **I_P primary layer set:** frozen by the PI before any natural-error intervention is run, using only correct-trace Gate V0 diagnostics and single-layer sweeps. Default proposal for that decision: all layers at P positions, with a contiguous middle-layer band as a named secondary set. The choice and its rationale are recorded in `docs/experiment_decisions.md`.
- Single-layer sweeps (both directions) are diagnostics, reported in full, never used to select the confirmatory set from natural-error outcomes.

### S13.4 Factorial design and estimands

The 2×2×2 design crosses source tokens (S / S*), P activations (original / donor-from-S*) and written text (v′ / v″). The eight cells do not automatically identify three independent pathways.

| Estimand | Definition | Interpretation |
|---|---|---|
| D_W (ΔW) | Within each fixed S/P condition, contrast W = v″ with W = v′ | Written-text sensitivity |
| D_P (ΔP) | Within each fixed S/W condition, contrast donor P with original P; forward and reverse reported separately | P-representation sensitivity / sufficiency and necessity-style evidence |
| D_S (ΔS\|P) | Within each fixed P/W condition, contrast S* with S | Residual source sensitivity under the stated clamp |
| Interactions | All 2-way and 3-way contrasts with intervals | Whether one intervention's effect depends on another factor |

- Primary reporting: conditional contrasts and interactions, not an additive decomposition.
- "Approximately additive" only if interactions are small relative to pre-registered margins with narrow intervals.
- Never infer "copy" from D_W alone or "recompute" from D_S alone.
- The source factor is run in both I_S-prompt and I_S-all forms; which is primary is an open PI decision (D9).
- If timing does not support the full factorial on all events, a pre-registered random subset receives the full factorial and all events receive the four single-intervention cells.

### S13.5 Patch direction and diagnostics

- Forward (donor into original) and reverse (original into donor) patching; disagreements reported.
- Report donor/recipient norm ratio, cosine similarity and distance from a layer-specific natural activation pool; flag OOD patches.
- Position-wise P2 patches on a pre-specified random subset.

## S14. Controls and validation checks (new in v1.1)

### S14.1 Unrelated-value controls

| Control | What it does | Expected result |
|---|---|---|
| Value-preserving source edit S° | Edit a source fact so the intermediate value is unchanged | Approximately zero source effect (within pre-defined equivalence margin) |
| W identity edit | Re-write W with the same token v′ through the edit code path | Exactly zero change |
| Off-path digit edit | Change a digit not on the dependency path to j | Approximately zero effect |
| Random-digit W edit | Replace W with a random digit not in {v, v′, v″, v*} | Characterises generic sensitivity to the W position |

### S14.2 Unrelated-activation controls

| Control | What it does | Expected result |
|---|---|---|
| Random-span patch | Patch an equal-length span outside P and outside the dependency path, same layers | Small effect relative to I_P |
| Value-preserving donor | Donor run on S° (value unchanged) patched at P | Approximately zero effect |
| Unrelated-event donor | Donor activations from a different event at matched positions | Characterises effect of OOD-but-structured activations |
| Clamp identity | Clamp P to its own original activations with no source edit | Exactly zero change |
| No-op patch | Patch donor equal to recipient | Exactly zero change |

### S14.3 Correct-trace controls (Gate V0)

Run all eight factorial cells and controls on correct traces. Expected, following Kudo et al.: dependence on the most recently written value. Gate V0 success criteria include reproducing the direction of Kudo et al.'s written-value dependence on correct runs. If V0 fails, natural-error results are not interpreted.

### S14.4 Patch validation (implementation checks, run on every event)

1. The patched tensor at listed positions and layers equals the donor tensor (exact or within dtype tolerance).
2. Tensors at all non-listed positions in the patched layer are bit-identical to the recipient's.
3. Logits at every position before the earliest intervention position are unchanged.
4. Token-ID diff between treatment and control sequences equals exactly the intended edit set.
5. Teacher-forced replay of the unedited sequence reproduces the generation-time log-probability of the original token at j_ans within tolerance (replay fidelity check).

Any failure excludes the event (`PATCH_VALIDATION_FAIL` or `REPLAY_FIDELITY_FAIL`) and is logged.

## S15. Downstream metric (fixed in v1.1)

**Primary metric.** At j_ans, the logit difference between the correct downstream answer and the answer implied by the wrong intermediate value:

  LD = logit(a*) − logit(a′), where a* = f_j(v) and a′ = f_j(v′), with j's other inputs held at their trace values.

Each intervention's effect is ΔLD = LD(treatment) − LD(control). Each intervention also has a target-specific pair:

| Intervention | Target-specific pair |
|---|---|
| I_W | logit(a″) − logit(a′) |
| I_S-prompt, I_S-all, I_S\|P | logit(a^v*) − logit(a′); and logit(a^p) − logit(a′) where p(S*) is defined |
| I_P | logit(a^v*) − logit(a′) |

**Always also recorded:** individual log-probabilities of a*, a′, a″, a^v*, a^p; the full distribution over the ten digit tokens; probability-mass shift; KL over digit tokens; agreement in direction across metrics.

**Collision rule.** The metric is defined on downstream answers, not intermediate values. An event is eligible for a given contrast only if the answers in that contrast are distinct:
- Minimum for any analysis: a* ≠ a′.
- I_W contrast: a″ ∉ {a′}; and a″ ≠ a* reported.
- Source and P contrasts: a^v* ∉ {a′, a*}.
- Full factorial: {a*, a′, a″, a^v*} pairwise distinct; a^p distinct where used.

Operations at j that are not injective mod 10 can create collisions even when values differ. Collisions are logged by reason code (`COLLISION_*`) with the operation type, so exclusion bias by operation can be checked (S18). The five-distinct-values rule on intermediate values (v, v′, v″, v*, p(S*)) remains, and is checked together with answer distinctness.

## S16. Replay versus free-running: separate protocols (new in v1.1)

| | Teacher-forced replay | Free-running continuation |
|---|---|---|
| Input | Original context up to j_ans (original M), with the intervention applied | Context up to and including W (with or without intervention); M and later steps regenerated by the model |
| Procedure | One forward pass per cell; read the digit distribution at j_ans | Generate K continuations with the mode's decoding settings |
| Outcome | ΔLD and target-specific metrics at j_ans | Propagation, recovery, written re-derivation, rewrite/reappearance of the producing step; per-step and end-to-end survival |
| Establishes | Sensitivity of the next dependent computation under a controlled continuation | What the model actually does when it generates its own subsequent reasoning |
| Does not establish | Free-running behaviour, recovery, or what happens when M differs | Which internal information caused the outcome |

Additional rules:
- Replay measurements are never described as observations of free-running behaviour.
- **M re-derivation flag:** if the original M already re-derives or corrects the intermediate value (common in thinking traces), the replay measurement at j is post-recovery. Every event records `m_rederivation = true/false`, and analyses report the two groups separately.
- **Free-running reporting:** (i) raw propagation/recovery; (ii) counterfactual++-style rate among rollouts that do not rewrite the producing step; (iii) rewrite/reappearance rate. The conditional rate is post-intervention selected and always shown beside raw rates.
- **Outcome labels** (from the solver, not from verbal markers): `PROPAGATED` (j uses v′ and output equals a′), `RECOVERED` (j output equals a*), `REWRITTEN` (producing step re-written before j), `OTHER_WRONG`, `UNPARSEABLE`.
- K is chosen from pilot variance and measured cost.
- Producing-step resampling (for v″, p(S*), slip/systematic) is a third, separate procedure and is not conditioned on outcomes at j.

## S17. Prediction experiment (strengthened in v1.1)

**Question (RQ3).** Do W/S/P dependence measurements predict free-running propagation or recovery beyond information already available from ordinary behaviour and the model's own output probabilities?

**Baseline model covariates.**
- Task difficulty (solver-defined sub-step difficulty, depth)
- Source redundancy (restatement count)
- Error class (recurrence rate; binary class)
- Thinking mode
- Token distance from W to j
- **Initial downstream answer preference:** unintervened replay LD at j_ans and log p(a′)
- **Producing-step uncertainty:** entropy of the digit distribution at W's position during generation, and v′ recurrence under resampling

**Extended model.** Baseline plus D_W, D_S and D_P.

**Evaluation.**
- Mixed-effects logistic model, cross-validation grouped by item; held-out log-loss, AUROC gain over baseline, calibration.
- Held-out model-family evaluation and within-item cross-mode test where available.
- Report correlations between each dependence measure and the baseline preference measures, so readers can see how much of each measure is already in the output probabilities.

**Decision rule.** The explanatory bridge is supported only if the extended model improves out-of-sample prediction over the baseline by at least the pre-registered margin. Expected directions (fixed before any pilot): higher D_W predicts more propagation; stronger D_S toward the correct value predicts more recovery; D_P exploratory.

## S18. Sampling, eligibility and exclusions (new in v1.1)

### S18.1 Funnel (counts recorded at every stage, by mode, depth, operation type, error class)

1. Tasks generated
2. Tasks verified by both solvers
3. Traces generated
4. Traces parsed successfully
5. Traces with at least one wrong intermediate
6. Root errors identified (first wrong intermediate on the dependency path)
7. Root errors with an identifiable dependent step j
8. Single-error condition at j satisfied
9. Token alignment valid (no straddles; role map complete)
10. Five distinct intermediate values available
11. Downstream answers collision-free for the required contrasts
12. On-policy v″ available (recorded; off-policy v″ used otherwise, labelled)
13. Interventions pass validation (S14.4)
14. Events analysed

### S18.2 Exclusion reason codes (`logs/exclusions.csv`)

`SOLVER_DISAGREE`, `PARSE_FAIL`, `NO_ERROR`, `NO_DEP_STEP`, `MULTI_ERROR_AT_J`, `ALIGN_STRADDLE`, `ALIGN_ROLE_INCOMPLETE`, `MULTI_TOKEN_VALUE`, `VALUES_NOT_DISTINCT`, `COLLISION_ANS_CORRECT_IMPLIED`, `COLLISION_ANS_ALT`, `COLLISION_ANS_STAR`, `PSTAR_UNDEFINED`, `NO_ONPOLICY_ALT`, `P1_INVALID`, `PATCH_VALIDATION_FAIL`, `REPLAY_FIDELITY_FAIL`, `LEAKY_NOTHINK`, `RUNTIME_ERROR`.

Each row: event ID, item ID, seed, mode, stage, reason code, detail, timestamp, code version (git commit).

### S18.3 Exclusion bias checks

Compare exclusion rates across error class, operation type, depth, difficulty and mode. Report results with and without exclusions wherever exclusions could bias findings. A mode gap in exclusion rate above 10 percentage points is flagged.

## S19. Pilot

The pilot is specified in Part 1, S5: its two jobs, three evidence types, the pre-written screening pool, selection rule and expectation table, the integrity rules, the batch runbook and what the pilot must tell us.

## S20. Remaining protocol components (carried from Revision 5)

### S20.1 P0 feasibility pilot (NOT authorized)

| Part | Scope | Purpose |
|---|---|---|
| P0b natural-error yield | Qwen3-8B thinking on/off; 200 items per mode × depths 3, 5, 8 (1,200 total) | Yield, trace lengths, error classes, restatements, exclusions |
| P0c producing-step resampling | Up to 10 resamples per eligible root error, capped workload | Slip/systematic, donor values, p(S*) |
| P0d alignment | 100 traces per mode for human gold, if annotators available | Alignment feasibility |
| P0e intervention timing | 20 correct-trace events | Hook/patch correctness and full event runtime |

**Mandatory end-to-end benchmark before GPU authorization:** model/config/tokenizer/template/engine revisions; prompt prefill and generation measured separately at representative and maximum context; KV-cache reuse verified; wall-clock and peak memory per procedure; activation capture, hook overhead, retries; full event time, not throughput extrapolation; conservative component-level GPU-hour estimate with an explicit stop point below the 8 GPU-hour hard ceiling. Pause at 6.5 hours for PI review; stop at 8.0. Deferral order: RQ0 track, then diagnostics subset, then P0b cells (PI approval).

### S20.2 Gate B: replay-to-recovery bridge (NOT authorized)

| Criterion | Proposed rule |
|---|---|
| Feasibility | ≥80% eligible events per mode have valid intervention measures and the minimum valid continuations |
| Measurement variation | Reliability ≥0.60 for D_W and D_S (reliability unit to be defined; D12); ≥30% events with non-degenerate recovery/propagation |
| Directional consistency | Adjusted slope signs consistent in a majority of pre-specified mode × error-class strata |
| Precision | 95% interval width ≤2δ and must not cover both zero and effects larger than δ (δ units to be defined; D11) |

Outcomes: all pass → fresh-item confirmatory bridge; feasibility/reliability fail → revise and repeat bounded pilot; interval too wide → inconclusive; precise interval inside equivalence region → evidence against a meaningful bridge in this setting, PI decides re-scope. Gate B data are never reused as confirmatory.

### S20.3 RQ0 retained-thinking track (separate)

On-policy Qwen3-8B thinking histories, turn by turn; no splicing; the same history rendered twice with thinking visible or stripped; token-level diff and template verification; non-thinking histories as reference population; synthetic histories labelled and never pooled. The retained-history template is labelled modified/OOD unless documented otherwise. Qwen3.6 preserve-thinking is a separate behavioural check. Scope of RQ0 within Paper 1 is an open decision (Programme doc, D6).

### S20.4 Alignment and annotation

| Output | Metric | Provisional acceptance |
|---|---|---|
| Categorical labels | Cohen's κ versus adjudicated gold, per mode | κ ≥ 0.80 |
| Root-error step and j | Exact agreement | ≥0.90 with 95% CI |
| W and j spans | Exact-span match | ≥0.90 with 95% CI |
| P1 / restatement spans | Token F1 | ≥0.90 with 95% CI |
| Exclusions | Mode gap | ≤10 percentage points |

Parser audit (24 Nov 2026). Single annotator (PI). Labelling is blind to parser output. About 100 traces. Re-label 30 traces after one week and report intra-rater agreement. The single-annotator limitation is stated in any report that uses these labels. Rulebook frozen before annotation; aligners revised on development data only. D15 (naming annotators and an adjudicator) is unchanged as an open ID for any later confirmatory round.

### S20.5 Survival analysis

p^k is a planning approximation only. Test constant per-step propagation (trend test), conditional independence (likelihood-ratio test), and agreement between the product of per-step rates and observed end-to-end survival. Report k = 3, 5, 8.

### S20.6 Statistical analysis plan

- Events nested in items: mixed-effects models with item and event random intercepts; item-level bootstrap intervals.
- Replay: linear mixed models on ΔLD with the three factors, their interactions, mode, error class, difficulty, redundancy; pre-specified contrasts for D_W, D_S, D_P.
- Mode comparison within error-class and difficulty strata; pooled estimates secondary; restatement- and evidence-matched subsets. Null mode differences require TOST with the final smallest effect of interest. Mode comparisons are conditional on an error having occurred and are reported as comparisons among observed errors.
- Free-running: mixed-effects logistic regression.
- Prediction bridge: S17.
- Multiplicity: Holm across the primary family (current list: D_W > 0 on natural errors; mode differences in D_W, D_S, D_P within strata; the predictive bridge; the RQ0 visibility effect). Family composition is an open decision (Programme doc, D4).
- Smallest effect of interest provisionally tied to a twofold change in error survival at the median F2 horizon, or the measurement floor if larger; mapping to logit units is an open decision (Programme doc, D5).
- Fixed sample size or pre-specified group-sequential design; no optional stopping.
- Exclusions logged by mode and reason; results with and without exclusions where relevant.
- Dated preregistration before confirmatory data: RQs, hypotheses, outcomes, contrasts, margins, sample sizes, stopping rules, exclusion criteria, analysis code.

### S20.7 Compute constraint

The PI manages the ₹10,000 JarvisLabs budget. Reference prices (USD/hr, checked 23 Nov 2026): A100 40GB $0.89 on-demand / $0.79 spot; A100 80GB $1.49 / $0.89; H100 $3.49 / $1.54; billed per second. Rough estimate: one direction done fully (mechanism + fix, 7–9B model) ≈ 10–20 A100-hours. Avoid: debugging on live GPUs, 27B models, RL. Cost estimate provided before each run. Pause GPU instances when idle.

The 8 GPU-hour ceiling for P0 remains a hard maximum for that specific Direction 1 feasibility package, not a validated forecast. Pilot runtime measurements feed the end-to-end benchmark. The multi-family, multi-scale design may still exceed the ₹10,000 budget if attempted.


## S22. Repository and versioning

- All Direction 1 code, configs, data manifests, logs and reports live in `reasoning-computation`.
- This file lives at `docs/RC_Research_Direction_1_Implementation.md`; changes to Part 2 are versioned (v1.1, v1.2, ...) with a change log, never silently edited.
- Decisions go to `docs/experiment_decisions.md` with date, decision, rationale and approver.
- Reused RvC/RR components are recorded in `docs/reuse_register.md`.

## S23. Open implementation decisions (PI)

Programme-level and scientific decisions (P1 retired; P2; P3; P4–P9; D1 to D8) are in the programme document, Section 14. D1–D16 and G3–G8 below are unchanged.

| ID | Decision | Notes |
|---|---|---|
| D9 | Which source intervention is primary: I_S-prompt or I_S-all? | S13 |
| D10 | Freeze the I_P confirmatory layer set (rule in S13.3) | After Gate V0 |
| D11 | Units of δ for Gate B (slope, AUROC gain or log-loss) | |
| D12 | Unit of reliability for D_W and D_S | Deterministic replay has no natural split |
| D13 | Minimum natural-error yield and fallback | Decide before any yield-dependent run |
| D14 | Slip/systematic cut-off and p(S*) modal-share threshold | |
| D15 | Name annotators and adjudicator | |
| D16 | Second same-weights thinking family; F3 retention; confirmatory model set; K; diagnostics subset size; final sample sizes and margins | |
| G3 | Dataset source(s) after the benchmark audit | |
| G4 | Primary pilot checkpoint | |
| G5 | Intervention framework | |
| G6 | Whether any readout lens enters the pilot, and for which question | |
| G7 | Screening pool size, selection rule and expectation table | |
| G8 | GPU authorizations: yield screen, compatibility test on the primary model, pilot | |

## S24. Decision log

| Item | Status |
|---|---|
| Paper direction | Provisionally retained; novelty not established |
| Repository | New independent repository `reasoning-computation` |
| Natural wrong turns | Primary data population |
| Methodology v1.1 additions (S12 to S18) | Adopted per PI addendum, 20 Nov 2026 |
| I_W, I_S-prompt, I_S-all, I_P, I_S\|P | Approved in principle with operational limits above |
| P1 window | Primary; Pmin, P2, P1\S_trace sensitivity only |
| Factorial | Conditional contrasts and interactions; no assumed additive decomposition |
| 2 to 10 event pilot | After Phase 1 exit gate and GPU authorization |
| Gate B | Retained; δ and reliability units to be defined |
| RQ0 | Separate validation track |
| 8-hour ceiling | Hard maximum; workload unvalidated |
| P0 / Gate B / confirmatory GPU | Not authorized |
| PI decisions 23–24 Nov 2026 | Direction 1 goal includes a held-out targeted fix; model by Phase 1 screen; generator validation S10.1; parser audit is single-annotator (PI); build-all-then-smoke-then-JarvisLabs; compute prices and 10–20 A100-hour estimate; status is smoke run only |


---

# Appendices

## Appendix A: Event record fields (minimum)

```
event_id, item_id, source_benchmark, source_instance_id, seed, mode, model_revision, git_commit, config_hash
difficulty_params (task-specific), redundancy
root_step_index, dep_step_index, dep_fn, dep_fn_injective
v_correct, v_written, v_alt, v_alt_source, v_star, v_pstar, v_pstar_share
ans_correct, ans_implied, ans_alt, ans_star, ans_pstar
src_prompt_positions, src_trace_positions (+ linked fact ids)
prod_expr_positions, written_position, w_restate_positions
intervening_positions, dep_operand_positions, dep_answer_pos
p_min, p1, p2, p1_minus_src_trace, p1_contains_src_trace
m_rederivation, leaky_nothink, recurrence_rate, error_class
written_token_entropy, baseline_LD, baseline_logp_ans_implied
selected_for_full_battery, selection_order_index
funnel_stage_reached, exclusion_code
```

## Appendix B: `logs/exclusions.csv` columns
`timestamp, git_commit, run_id, event_id, item_id, seed, mode, stage, reason_code, detail`

## Appendix C: `logs/experiment_log.csv` columns
`timestamp, run_id, git_commit, config_hash, phase, batch, model_revision, hardware, n_items, n_traces, n_events, wall_time_s, peak_mem_gb, gpu_hours, cost_inr, authorization_ref, notes`
