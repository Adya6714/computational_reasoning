# Reasoning Computation (RC): Research Programme

**PI:** Adya Srivastava
**Date:** 20 November 2026
**Status:** Working programme document. Directions are research territory, not promised papers. Nothing here is a completed experiment or an established finding unless it is cited as published work.
**Companion file:** `RC_Research_Direction_1_Implementation.md` (step-by-step checklist and technical specification for the first study)

---

# Part A: The programme

## 1. Motivation and the problem we are trying to solve

Language models can solve problems involving arithmetic, symbolic manipulation, planning and sequential state updates. A correct final answer does not tell us **how** the computation was performed. Two models, or one model on two occasions, can reach the same answer through:
- systematic computation;
- retrieval;
- memorized templates;
- lexical familiarity;
- shortcuts.

A wrong answer does not tell us where the computation broke, or why the error persisted.

**The programme problem.** We lack a sufficiently direct, causally tested account of how LLMs represent, transform, maintain and recover from intermediate computational states during multi-step reasoning.

**The questions RC asks:**
- How does a model represent intermediate computational states?
- How does it update and manipulate those states across steps?
- How does it decide which intermediate information to use?
- When an intermediate computation is wrong, why does the model sometimes detect and correct it, and at other times propagate it?
- Can understanding these mechanisms help build more reliable models, through training, mechanisms or architecture?

**Why it matters.**
- **Scientific:** reasoning should be understood as computation with internal mechanisms, not only as an input-output capability. Behaviours that look the same from outside can imply very different internal processes.
- **Technical:** small computational mistakes compound into large failures. Knowing which mechanisms carry errors forward points to targeted fixes.
- **Long-term:** the aim is not an external checker wrapped around model outputs. It is to understand the computation well enough to inform training methods, model mechanisms and architecture. No single paper will achieve this, and none claims to.

**The motivating evidence chain** (how RC moves from behaviour to mechanism to improvement):
1. Construct controlled tasks with exact answers, and transformations that keep the problem while changing its surface or computational demands.
2. Measure behavioural stability, failure profiles and responses to controlled state changes.
3. Inspect activations to see whether candidate values, bindings, rules and intermediate results are represented.
4. Use causal interventions to test whether those representations take part in computation rather than merely correlating with answers.
5. Reconstruct candidate computational pathways and algorithms.
6. Test whether mechanism-targeted interventions improve reliability without damaging correct behaviour, and whether effects transfer.

## 2. RC and its separation from RvC and RR

| Strand | Core question | Relationship to Paper 1 |
|---|---|---|
| RvC: Retrieval versus Computation | Do models preserve answers and procedures under controlled transformations; what behavioural evidence separates procedural execution from familiarity? | Separate project and repository. Not reused as Paper 1 infrastructure without a suitability check |
| RR: Reasoning Reliability | Can we measure failures, predict them, localize internal causes, intervene, verify improvements and test transfer? | Separate programme and repository. No completed Q1 experiments to inherit |
| RC: Reasoning Computation | How do LLMs internally represent, transform, update and use computational state; why do computations fail; can this knowledge improve models? | Paper 1 is RC's first study. Own question, experiments and repository |

**Reuse rule.** RvC and RR ideas or code may be reused only after a scientific and technical suitability check. Every reused component is recorded with its original source, version, modifications and validation status (`docs/reuse_register.md`).

**Why error propagation is Paper 1.** It sits where representation, computation, state use, error genesis, recovery and causal reliability meet. Paper 1's one-line question:

> After the model itself writes a wrong intermediate value, what does the next dependent step actually use?


## 3. Evidence ladder

| Evidence level | Example | Typical evidence | Does not establish |
|---|---|---|---|
| Behavioural (input-intervention) dependence | Editing a written value in the trace changes the next step | Token edits with teacher-forced replay or resampled continuation | Any internal representation or route |
| Representation / decodability | A probe extracts 20 | Probes, minimal pairs, representational similarity | That the model computed or uses 20 |
| Localization | Where 20 is accessible | Layer/position probes, lenses, attribution | That the component implements the operation |
| Causal involvement | Changing an activation alters the next step | Patching, ablation, interchange interventions | A unique semantic role or complete pathway |
| Computational role | The component implements a defined state transition | Counterfactual algorithm tests, path analysis, causal abstraction | A complete mechanism unless relevant pathways are accounted for |
| Generalization | Holds across formats, tasks, models | Held-out transformations, tasks, families, checkpoints | Universal claims about reasoning |

**Where Research Direction 1 sits.** The written-value and source interventions (I_W, I_S) are behavioural input interventions. Only the pre-write activation interventions (I_P, I_S|P) reach the causal-involvement rung. Paper 1 does not claim the computational-role rung.

Design constraints: a probe can predict without being causally relevant; a patch can change a logit while moving many correlated signals; a causal effect can be distributed or redundant.


## 4. Research pillars and directions

### 4.1 Four pillars

| Pillar | Question | Directions |
|---|---|---|
| I. Representation and computational state | What information does the model represent internally, and in what form? | A, D, E |
| II. Computation, updating and control | How does the model manipulate information and maintain state over time? | B, C, H, I, M |
| III. Computational failure and recovery | Where does computation break, why, and how does the model recover? | F, G, L |
| IV. Generalization and improvement | Do mechanisms persist across settings, and can understanding them improve models? | J, K, M (connects to all pillars) |

The pillars group the A to M directions; they do not replace them. Direction M currently sits under both II and IV (open decision P2).

### 4.2 The thirteen directions

**A. Representation of computational state and intermediate variables** (Pillar I)
- **Question:** what is encoded? Numerical values, carries, remainders; variable/entity binding; local versus global state; relational or graph structure; distributed codes, subspaces, feature geometry.
- **Candidate experiments:** decode numbers, variables, bindings and graph state from activations; controlled minimal pairs; representational similarity; logit/tuned lens; compare neurons, linear directions, ICA and SAEs; causal tests that separate presence from use.
- **What we could learn:** what computational information is present, and in what basis.

**B. State updating, temporal binding and memory dynamics** (Pillar II)
- **Question:** how is state transformed when new facts or operations arrive? Incremental updates versus query-time reconstruction; rebinding, overwrites, stale-value competition; multi-entity updates; persistence and decay; internal versus external memory.
- **Candidate experiments:** operation-by-operation traces; read-versus-computed conditions; stale/neighbour/prior competitors; distractor and long-context sweeps; attention/path analysis; patching at update and query positions.
- **What we could learn:** how state is updated and retrieved.

**C. Algorithm selection and implementation** (Pillar II)
- **Question:** which procedure is implemented (sequential, parallel, associative, divide-and-conquer, retrieval, heuristic, hybrid)? Are primitives reused? When does the strategy switch?
- **Candidate experiments:** tasks where candidate algorithms predict different outputs; adversarial instances; scaling by depth, branching and state space; trace signatures; path patching and algorithm-specific counterfactuals.
- **What we could learn:** which procedure the model actually runs.

**D. Intermediate computation and latent reasoning** (Pillar I)
- **Question:** what happens before, between or without explicit reasoning tokens? Latent intermediates; CoT as scaffold versus report; recurrent or looped computation; token-to-computation alignment.
- **Candidate experiments:** visible-CoT versus no-CoT comparisons; intermediate-state probes; latent trajectory measurements; token deletion/replacement; pre-write versus post-write activation patching.
- **What we could learn:** what is computed before a step is verbalized.

**E. Computational routing, circuits and causal organization** (Pillar I)
- **Question:** which components (heads, MLPs, neurons, residual stream, features, positions) carry which information? Routing, circuit composition, mediation, redundancy.
- **Candidate experiments:** activation and path patching; causal tracing; EAP/ACDC; ablation and resample ablation; SAE/transcoder feature circuits; causal scrubbing.
- **What we could learn:** which components transmit the relevant information.

**F. Error genesis and computational failure** (Pillar III)
- **Question:** where does a correct computation first become wrong? First invalid operation; symptom versus cause; local versus global corruption; perturbation thresholds.
- **Candidate experiments:** exact-solver alignment; step annotation; error taxonomy; wrong-state injection; first-divergence analysis; failure-boundary curves.
- **What we could learn:** the first point of computational failure.

**G. Error persistence, recovery and backtracking** (Pillar III)
- **Question:** why do some errors persist and others get corrected? Detection versus correction; recoverability under resampling; rollback; verification; redundant computation; algorithm switching.
- **Candidate experiments:** natural and injected errors; on-policy resampling; teacher-forced replay; free-running continuation; propagation/recovery metrics; interventions on candidate error signals.
- **What we could learn:** why errors persist or disappear.

**H. Constraint and invariant maintenance** (Pillar II)
- **Question:** how are rules maintained through a computation? Rule representation; constraint propagation; conflict detection; long-horizon persistence; counterfactual rule changes.
- **Candidate experiments:** planning/CSP tasks; invariant violations; changed-rule worlds; conflict injection; state/rule patching; transfer to unseen rule systems.
- **What we could learn:** how the model preserves rules.

**I. Goal, subgoal and control-flow management** (Pillar II)
- **Question:** how does a model choose the next operation, mark subgoals complete, verify, continue, backtrack, call tools or stop?
- **Candidate experiments:** DAG/planning tasks; prerequisite manipulation; stop/continue probes; compute allocation; interventions on candidate control signals.
- **What we could learn:** how the model decides what to compute next.

**J. Invariance, compositional generalization and transfer** (Pillar IV)
- **Question:** does the same procedure survive renaming, paraphrase, notation changes, structural recombination, greater depth, new domains or new models?
- **Candidate experiments:** matched transformations; held-out graph structures; symbol remapping; new combinations of known operations; cross-model representation alignment and causal replication.
- **What we could learn:** whether computation is systematic or template-specific.

**K. Training dynamics and emergence** (Pillar IV)
- **Question:** when do computational mechanisms emerge, change or disappear? Behaviour-mechanism dissociation; effects of SFT, DPO, RL and distillation; curriculum and data effects; mechanism drift.
- **Candidate experiments:** checkpoint sweeps; base/instruct/reasoning variants; training-stage contrasts; feature trajectories; causal interventions across checkpoints.
- **What we could learn:** how mechanisms form during training.

**L. Metacognitive monitoring and computational competence** (Pillar III)
- **Question:** does a model internally estimate correctness, incompleteness, uncertainty or likely failure? Competence versus difficulty; monitoring; routing and compute allocation.
- **Candidate experiments:** pre-generation and mid-reasoning probes; confidence and sample-agreement baselines; gold log-probability; signal interventions; held-out calibration.
- **What we could learn:** whether the model knows when its computation is likely wrong.

**M. Architectural implications and computational substrate** (Pillars II and IV)
- **Question:** which architectural properties support reliable stateful computation? Attention versus MLP roles; recurrent depth; KV/context memory; explicit memory and tools versus latent state.
- **Candidate experiments:** architecture comparisons; context/KV constraints; memory augmentation; targeted architectural ablations.
- **What we could learn:** which architectural properties support stateful computation.

### 4.3 Proposed priority (strategy, not novelty-reviewed)
- **First:** F, G, D, A. These connect the error event directly to the internal computation. Research Direction 1 sits here.
- **Second:** B, C, E, H, I, L. These can explain the processes behind the first observations.
- **Third:** J, K, M. These establish generality, training origins and architectural implications.

## 5. How the directions will be studied

### 5.1 Task environments
A **reasoning benchmark** measures whether models solve problems. RC needs **experimental task environments**: problems where intermediate states and dependencies are explicit, so we can intervene and know what caused an outcome. A hard benchmark can still be unusable for mechanistic work if its intermediate variables cannot be identified reliably.

**Principle:** derive RC-specific datasets from established benchmarks where possible:
1. Extract operations, states, dependencies and exact solutions.
2. Transform symbols, values, structures and difficulty.
3. Verify every transition with independent solvers.
4. Output traceable intermediate states.

This also reduces memorization and contamination risk.

**Candidate sources** (to be verified in the benchmark audit; none approved):

| Source | Kind | Likely directions served |
|---|---|---|
| DSR-Bench | Data-structure and structural reasoning | A, B, C, F, G, J |
| BeyondBench | Procedurally generated algorithmic and constraint tasks | C, F, G, H |
| PlanBench / ACPBench | Planning: states, actions, prerequisites, goals | H, I, B |
| Variable-scope / assignment-chain tasks | Controlled computational state | A, B, D, F, G |
| GSM8K / MATH / AIME | Natural mathematical reasoning (external validation) | F, G, J |

### 5.2 Models
**Selection criteria.** Models are chosen for the research, not for leaderboard rank, and never only because they fail often. A model must:
1. produce enough natural errors to study;
2. run reproducibly;
3. expose activations at the positions and layers needed;
4. support the intervention tooling;
5. reason well enough to produce meaningful multi-step traces.

**Model tiers:**
- closed-source frontier models for behavioural baselines;
- open frontier models;
- open-weight models with internals access, for all mechanistic work.

**Current candidates for open-weight work:**
- Qwen3-8B (primary for Direction 1)
- Qwen3-4B
- Gemma-2-2B
- OLMo 3 (training dynamics)
- Qwen3-14B (scale)

### 5.3 Interpretability toolkit (five layers)

| Layer | Job | Methods and tools | Caveat |
|---|---|---|---|
| 1. Readout | Make candidate internal information readable | Logit lens, tuned lens; J++ Lens, Chain Lens, MicroLens (from the research map; to verify) | Readable does not mean used |
| 2. Representational basis | How information is encoded | Neurons, linear probes, ICA, DAS, SAEs | Compare bases; none is ground truth |
| 3. Causal influence | Change activations and measure downstream effects | Activation patching, path patching, attribution patching/EAP, ablation, causal abstraction/DAS | A patch shows sensitivity to that intervention, not an independent pathway |
| 4. Computational organization | Which components and paths are responsible | ACDC, EAP, SAE circuits, transcoders, causal scrubbing | Only after a reproducible causal effect |
| 5. Improvement | Targeted changes that improve reliability | Steering, ablation, mechanistic shaping | Later programme |

**Software candidates:** Hugging Face with PyTorch hooks, TransformerLens, nnsight, pyvene, SAELens, Neuronpedia. Compatibility depends on the version and the architecture, and is tested before use.

**Rule:** every tool must answer a named scientific question.

## 6. Roadmap

| Phase | Goal | Outputs |
|---|---|---|
| 0. Programme foundation | Consolidate the directions; literature, novelty and feasibility per direction; 2 to 4 tentative experiments per promising direction; shared infrastructure | Charter, direction matrix, literature and novelty map, roadmap |
| 1. Environments, models, tools | Audit benchmarks, models and interpretability tools; estimate natural-error yield | Benchmark audit, dataset derivation spec, model compatibility matrix, tooling audit |
| 2. Research Direction 1 | Build and run the first study's 2 to 10 event pilot as a proof of concept | Pipeline, pilot report |
| 3. Decide | Scale, narrow, move to circuits, pivot, or start a reliability study | Pilot interpretation, decision record, scale-up proposal, advisor deck |

**Goal for RC output:** main-track papers at top venues. The number of papers is dictated by results.

The step-by-step plan for Phases 0 to 3 as applied to Direction 1 is in the companion implementation file.

# Part B: Research Direction 1, error propagation (Paper 1)

**One-line question:** after the model itself writes a wrong intermediate value, what does the next dependent step actually use?

Why this direction first: it sits where representation, computation, state use, error genesis, recovery and causal reliability meet (directions D, F, G, A).

## 7. Research problem

**Programme problem.** We lack a sufficiently direct, causally tested account of how LLMs implement, maintain and recover from intermediate computational states during multi-step reasoning. A correct final answer does not reveal how the computation was performed; a wrong answer does not reveal where it broke or why the error persisted.

**Paper 1 problem.** When a model generates an incorrect intermediate value and later consumes it, possible behaviours include:
- using the wrong written value;
- recomputing the needed value from the original inputs;
- detecting a discrepancy and correcting it;
- combining written-value and source information.

These can produce similar outputs while implying different computations. They are not mutually exclusive.

**Research question.** How do incorrect intermediate values causally influence subsequent computation in language models, and what determines whether those errors are propagated or corrected?

**Scope.** A controlled causal investigation of error propagation and recovery in multi-step computation, using programmatically verifiable tasks, model-generated errors, input interventions and activation interventions.

**PI position.** RC keeps the broad ambition of understanding computational mechanisms. Paper 1 is one sharply bounded first problem with a falsifiable question. It does not claim to explain reasoning reliability in general, and its novelty is not yet established.

## 8. Literature and prior work (summary)

### 8.1 Evidence conventions

- **Behavioural:** a controlled change in prompts, traces or conditions changes outputs, without identifying the internal mechanism.
- **Correlational / predictive:** activations or probes predict a value or outcome; not shown to cause behaviour.
- **Causal intervention:** patching, ablation, steering or routing changes an outcome. Strength depends on specificity, controls and manipulation checks.
- **Author interpretation** versus **RC inference** versus **verification status** (full text, partial/abstract, code inspected or not) are reported separately.

**Provenance warning.** Findings in 8.2 are transcribed from the literature-scout report unless marked otherwise. Numbers from the scout are deliberately omitted here. The v1.0 literature review keeps them with their caveats. None may be reused in a manuscript or advisor deck until checked against the final PDF, tables and appendices.

### 8.2 Closest work (condensed matrix)

| Paper | Setting | Reported finding (scout) | Evidence level | RC relevance |
|---|---|---|---|---|
| Sinha et al., *The Illusion of Diminishing Returns* (arXiv:2509.09677) | Long-horizon lookup-and-sum with injected history errors | Prior errors degrade later execution; Qwen3 thinking condition stable, but prior thinking traces were stripped from history | Behavioural | History-presence confound for any thinking-mode interpretation |
| Jia & Mu, *From Decorative to Load-Bearing* (arXiv:2609.25366) | Perturbed CoT steps, forced continuation; GSM8K, MMLU, BBH | Load-bearingness rises with difficulty; propagation differs by task; reasoning RL changes the profile | Strong behavioural; probes predictive; steering limited | Closest behavioural competitor; does not explain internal consumption of a model-generated wrong value |
| Kudo et al., *LLMs Faithfully and Iteratively Compute Answers During CoT* (Findings of EACL 2026; arXiv:2412.01113 v4) | Controlled multi-step arithmetic with assignment strings | Patching written intermediate equations affects downstream output; patching original input equations has little effect in Qwen2.5-7B; weaker pattern in some families; key test on correct runs | Causal intervention on correct runs | Closest direct precedent. RC must test wrong values and whether correctness gates their use |
| Shalev Merin, *Present but Hard to Read* (arXiv:2610.28498) | Two-step digit tasks with minimal pairs, small models | Copy-direction manipulations can drive a later written value; result is manipulation-specific | Causal, narrow | Copy/mixing controls required before calling any activation a computed value |
| Guo et al., *When Context Changes* (arXiv:2609.38866) | Overwrite / ledger memory tasks | Current value can stay decodable while a stale value is output; attention-routing contribution is model-dependent | Causal for selected components | Routing/selection is a competing explanation |
| Tang et al., *Do LMs Track Entities Across State Changes?* (ICML 2026, PMLR v306) | Box/entity tasks, no CoT | Query-time aggregation rather than incremental state; REMOVE uses a suppression-tag mechanism | Mixed | State reconstruction competitor; no-CoT regime |
| Oh & Demberg, *Retrieval-Conditioned Rebinding Circuit* (arXiv:2606.08644 v2) | Entity swap | Binding information re-instated at readout; circuit differs by family | Causal, single operation | Argues against assuming universal state maintenance |
| Chen et al., *From Brewing into Resolution* (arXiv:2606.17648 v3) | Short Python programs, single-digit outputs | Hidden-state re-injection rescues some overprocessed samples; random-vector control not identified | Medium | Method precedent for readout and rescue |
| Yuan et al., *Hidden Error Awareness: Diagnostic, Not Causal* (arXiv:2605.09502; title to verify) | MATH-500 | Correctness decodable; interventions near-null | Predictive; causal tests mostly null | "Correctness is represented" is not a novelty claim |
| Phan et al., *Decoding the Critique Mechanism* (arXiv:2603.16331) | Injected versus natural arithmetic errors in reasoning models | Injected errors often silently recovered; natural wrong-thinking/right-answer cases rare | Predictive plus steering; controls incomplete | Makes on-policy natural errors essential |
| Kumaran et al., *How LLMs Detect and Correct Their Own Errors* (arXiv:2604.22271 v2) | Verify-then-correct on TriviaQA, MNLI | Post-answer evaluative signal causally involved in error detection and correction | Causal, non-CoT tasks | Candidate positive control for correctness signals |
| Varma & Singh, *Decorative Backtracking* (NeurIPS 2026 workshop, per scout) | MATH-500, one model | Removing verbal corrections leaves accuracy largely unchanged | Causal, one model | Verbal "wait" text is not a recovery label |
| Karim et al., *Attention Deficits* (arXiv:2602.19239) | Long-context retrieval | Encoded-but-misread values | Abstract-level only | Availability versus selection |
| Yee et al., *Dissociation of Faithful and Unfaithful Reasoning* (arXiv:2405.15092) | CoT error recovery | Recovery shifts with error type/obviousness | Abstract-level only | Moderator candidate |
| Mehrafarin et al., *When CoT Fails, the Solution Hides in the Hidden States* (arXiv:2604.23351 v3) | GSM8K | Failed CoT hidden states may retain task information | Abstract-level only | A wrong trace may carry correct latent information |
| Ou, *Reasoning Models Confabulate to Defend Injected Beliefs* (arXiv:2611.17958) | Activation injection | Injected beliefs propagate through CoT | Abstract-level only | Adjacent precedent |
| Kumar, *When Built-in Thinking Helps and Hurts* (arXiv:2606.09662) | IFEval, thinking on/off | Mode switches outcomes on a subset of prompts | Medium | Supports item-matched mode comparisons |
| Darade & Thorat, *Represented Is Not Computed* (arXiv:2605.22488) | Controlled transformer | Presence of intermediate information dissociates from causal use | Not inspected in matrix | Method warning |

### 8.3 Competing explanations Paper 1 must distinguish

| Explanation | Claim | Prediction in Paper 1 terms |
|---|---|---|
| Incremental state maintenance | Model maintains an updated latent state | Later computation depends on pre-write/internal state (D_P) |
| Query-time reconstruction | Needed state is rebuilt from context when required | Source information keeps causal influence (D_S) |
| Copying written values | Later step reads the most recent written value | D_W large |
| Independent recomputation | Value re-derived from original inputs | Output tracks f(v*) under source edits with W fixed |
| Faulty-procedure recomputation | Same wrong procedure re-applied to the source | Output tracks f(p(S*)) rather than f(v*) |
| Routing / selection failure | Correct value present but wrong one selected | Effects change under routing interventions; decodability not use |
| Correctness-sensitive verification | Value's correctness gates its use | Dependence on W differs with correctness (exploratory, RQ4) |

These are not mutually exclusive. The objective is to identify which information causally affects downstream computation under stated conditions.

### 8.4 Design implications carried forward

- Do not claim novelty for "models copy written intermediate values" (Kudo et al.) or "correctness is represented" (Yuan et al.).
- Model-generated on-policy errors are the primary unit. Injected errors are a separate, labelled arm.
- Same items across thinking modes; never match accuracy by changing task difficulty.
- Factorial or path-specific interventions are required; attention knockout alone cannot exclude MLP/residual routes.
- Copy/mixing null controls, positive controls and random/unrelated controls are required.
- CoT and no-CoT regimes are kept conceptually distinct.
- Layer/position selection is preregistered or chosen on held-out data, with multiple-comparison control.

### 8.5 Verification status and additions in v1.1

**Checked on 20 November 2026 (bibliographic existence and abstract level only):**
- Kudo et al.: v4 title and Findings of EACL 2026 record confirmed. Earlier arXiv versions were titled *Think-to-Talk or Talk-to-Think? When LLMs Come Up with an Answer in Multi-Step Arithmetic Reasoning* and reported that single-step subproblems are solved before CoT begins, with multi-step calculations performed during CoT. The Kudo task (assignment strings) is structurally close to F2.
- Dutta et al. (TMLR 2024), *How to think step-by-step: A mechanistic understanding of chain-of-thought reasoning* (arXiv:2402.18312): parallel answer pathways drawing on the question context and the generated CoT (Llama-2 7B). Directly relevant to the source-versus-written distinction.
- Lanham et al. (2023), *Measuring Faithfulness in Chain-of-Thought Reasoning* (arXiv:2307.13702): adding mistakes to CoT and resampling the continuation. Behavioural precedent for I_W plus free-running continuation.
- Stolfo, Belinkov & Sachan (EMNLP 2023), *A Mechanistic Interpretation of Arithmetic Reasoning in Language Models using Causal Mediation Analysis* (arXiv:2305.15054): causal mediation on arithmetic; methodological precedent for source interventions.

**Missing from the v1.0 matrix but cited in the protocol (must get matrix rows and full reads):** Zhu, Wang & Sui (arXiv:2505.04955); Dalton (arXiv:2611.13552); Macar et al., *Thought Branches* (arXiv:2510.27484). Also cited without a matrix row: Tyen et al.; Nguyen et al.; Li et al. (state tracking); Pereira & Zuidema.

**Still to check (not verified):** Bogdan et al., *Thought Anchors* (2025); Paul et al. (2024), causal mediation over CoT; Turpin et al. (2023); Geiger et al., causal abstraction; Vig et al. (2020).

**Outstanding verification work** (unchanged from v1.0): full PDFs and appendices of direct competitors; script-level code inspection; reconciliation of every text/table discrepancy; backward/forward citation trace.

## 9. Research gap (candidate, not novelty-validated)

**Gap statement.** The causal dependence of later computation on a model-generated incorrect intermediate value, versus the original source information and the internal state formed before the value was written, is insufficiently characterized. Whether the correctness of the value changes that dependence is also unestablished.

Supporting gaps:
1. **Causal use of incorrect intermediate values.** Kudo et al.'s key comparison is on correct runs.
2. **Whether correctness gates use.** Correctness is decodable (Yuan et al.), but its causal effect on downstream use of a written value is not established.
3. **Copying versus recomputation after an error.** Copying (Shalev Merin, Kudo) and reconstruction (Tang, Oh & Demberg) were shown in different settings, not on model-generated wrong values.
4. **Detection versus functional recovery.** An error signal is not evidence the model uses it.
5. **Thinking-mode resilience.** Sinha et al.'s stability result is confounded by stripped history. Supporting question only.

Evidence that would close the gap: whether wrong values causally influence later steps; dependence on W, S, P or combinations; whether dependence changes with correctness; whether natural and injected errors differ; whether the measured dependence predicts a behavioural consequence beyond the discovering intervention. A null result is informative.

## 10. Research questions

| RQ | Question | Role |
|---|---|---|
| RQ1 | For natural wrong values, how sensitive is the next dependent step to changing W, S and P? | Primary mechanism |
| RQ2 | Do these dependencies differ between thinking-on and thinking-off runs of the same weights, controlling error class and evidence? | Mode moderator |
| RQ3 | Do replay-level dependencies predict free-running propagation or recovery, beyond a behavioural baseline? | Bridge test |
| RQ0 | Does thinking-mode stability persist when earlier thinking remains visible? | Separate validation track |
| RQ4 | Does correctness information causally modulate use of W? | Exploratory; requires positive control |

Whether correctness gating is the headline or exploratory is an open PI decision (Section 14, D1).

## 11. Contribution and novelty boundary

**Proposed contribution (if supported).** A causal profile of how later reasoning depends on a model's own naturally generated incorrect intermediate values, through the written value, source information, or internal state formed before writing, and a test of whether that profile predicts which errors propagate or are corrected during free-running reasoning.

**Contribution hierarchy.**
- Primary: the causal dependence profile on natural errors plus the replay-to-free-running predictive test.
- Methodological: the W/S/P intervention design with explicit validation and controls. (Factorial patching itself is standard causal mediation; the claim is its application and validation here.)
- Secondary: same-weights thinking comparison; retained-versus-stripped history; slip versus systematic errors.
- Infrastructure (not a scientific contribution): generators, alignment, intervention tooling, cost estimation.

**Claim strength depends on results.**
- Only W dependence identifiable: narrow the claim to written-value dependence in tested settings.
- Replay measures fail to predict free-running behaviour beyond the baseline: report the dependence profile, do not claim to explain propagation.
- No mode difference: thinking mode stays a tested moderator.
- Faulty-procedure recomputation is only identifiable where p(S*) is well defined and differs from v* (mainly systematic errors).

**Novelty boundary.** The proposed combination is: natural errors in pretrained models + source/written/pre-write intervention design + predictive bridge to free-running behaviour + same-weights mode comparison. Do not use "first" or "unprecedented" until the novelty audit is complete.

## 12. How Direction 1 will be tested (summary)

- **Data:** controlled multi-step tasks with exact solvers, derived from established benchmarks after an audit. Each task has explicit intermediate values and dependency graphs.
- **Model:** one open-weight checkpoint for the pilot (candidate: Qwen3-8B), with same-weights thinking-on/off comparisons later.
- **Events:** the model's own naturally generated wrong intermediate values, kept in full with every exclusion logged.
- **Interventions:**
  - edit the written value (W);
  - edit the source facts (S), in the prompt only or in the prompt and the trace;
  - transplant or clamp the internal state formed before the value is written (P).
  Each runs with matched controls and validation checks.
- **Two separate measurements:**
  - teacher-forced replay (how the next dependent step responds under a fixed context);
  - free-running continuation (what the model actually does next).
- **Prediction test:** do the W/S/P dependence measures predict propagation or recovery beyond a behavioural baseline, including the model's own initial preference for the wrong downstream answer?
- **First milestone:** a 2 to 10 event pilot that validates the pipeline and looks for an early scientific signal, against expectations written down beforehand.

Full definitions, intervention tables, controls, metric, eligibility rules and the step-by-step build are in `RC_Research_Direction_1_Implementation.md`.

---

# Part C: Governance

## 13. Claim discipline

- Separate observed results, literature facts, interpretations, hypotheses and proposed methods.
- Report null, opposite-direction, heterogeneous and failed-control results; never select the strongest layer, window or metric.
- Residual patching is not a value-only intervention.
- Replay dependence is not free-running recovery.
- Conditional counterfactual++ rates are not raw causal effects.
- No claims of direct copying, exclusive recomputation or a unique internal route.
- Claims limited to tested models, task families and prompt distributions.
- The protocol is not "validated" until implementation, alignment and feasibility gates pass.


**Governance.** The PI approves research directions, research questions, hypotheses, benchmarks, models, sample sizes, preregistrations, compute spend and repository changes. RC lives in its own repository, `reasoning-computation`. RvC and RR code is reused only after a suitability check and is recorded with source, version, modifications and validation status.

## 14. Open programme-level and scientific decisions (PI)

| ID | Decision | Notes |
|---|---|---|
| P1 | Which reasoning type the first experiments study: structural/algorithmic, mathematical, planning/constraint, or a broader comparison first | Current lean: broader comparison |
| P2 | Primary pillar for direction M (II or IV) | |
| D1 | Is correctness gating the headline contribution of Direction 1 or exploratory (RQ4)? | Gap analysis treats it as central; protocol treats it as exploratory |
| D2 | Add a "consistency edit" (source edited so the wrong value becomes correct) to test correctness gating with W fixed? | |
| D3 | Adopt an explicit pre-write hypothesis: for slips the pre-write state carries the correct value; for systematic errors it carries the wrong one? | Follows from Kudo et al. |
| D4 | Replace "D_W > 0" as a primary hypothesis (near-certain given prior work) and recompose the primary hypothesis family | |
| D5 | Map the smallest effect of interest from survival units to logit units | |
| D6 | Keep RQ0 in Paper 1, move it to an appendix, or to a separate paper? | |
| D7 | At least two model families for core claims? | Budget dependent |
| D8 | Matched-temperature sensitivity for the mode comparison? | |

Implementation-level decisions are listed in the companion file (Part 2, S23).


## 15. References

Bibliographic details, venues and versions must be rechecked against primary sources before submission. "Checked" means existence and abstract-level match on 20 Nov 2026 only.

- Kudo et al. (2026). LLMs Faithfully and Iteratively Compute Answers During CoT: A Systematic Analysis With Multi-step Arithmetics. Findings of EACL 2026. arXiv:2412.01113 v4. *Checked.*
- Dutta, Singh, Chakrabarti & Chakraborty (2024). How to think step-by-step: A mechanistic understanding of chain-of-thought reasoning. TMLR. arXiv:2402.18312. *Checked.*
- Lanham et al. (2023). Measuring Faithfulness in Chain-of-Thought Reasoning. arXiv:2307.13702. *Checked.*
- Stolfo, Belinkov & Sachan (2023). A Mechanistic Interpretation of Arithmetic Reasoning in Language Models using Causal Mediation Analysis. EMNLP 2023. arXiv:2305.15054. *Checked.*
- Sinha et al. (2025). The Illusion of Diminishing Returns. arXiv:2509.09677.
- Jia & Mu (2026). From Decorative to Load-Bearing. arXiv:2609.25366.
- Shalev Merin (2026). Present but Hard to Read. arXiv:2610.28498.
- Guo et al. (2026). When Context Changes. arXiv:2609.38866.
- Tang et al. (2026). Do Language Models Track Entities Across State Changes? ICML 2026, PMLR v306.
- Oh & Demberg (2026). A Retrieval-Conditioned Rebinding Circuit. arXiv:2606.08644.
- Chen et al. (2026). From Brewing into Resolution. arXiv:2606.17648.
- Yuan et al. (2026). Hidden Error Awareness. arXiv:2605.09502.
- Phan et al. (2026). Decoding the Critique Mechanism in Large Reasoning Models. arXiv:2603.16331.
- Kumaran et al. (2026). How LLMs Detect and Correct Their Own Errors. arXiv:2604.22271.
- Varma & Singh (2026). Decorative Backtracking. NeurIPS 2026 workshop (per scout).
- Karim et al. (2026). Attention Deficits. arXiv:2602.19239.
- Yee et al. (2024). Dissociation of Faithful and Unfaithful Reasoning. arXiv:2405.15092.
- Mehrafarin et al. (2026). When CoT Fails, the Solution Hides in the Hidden States. arXiv:2604.23351.
- Ou (2026). Reasoning Models Confabulate to Defend Injected Beliefs. arXiv:2611.17958.
- Kumar (2026). When Built-in Thinking Helps and Hurts. arXiv:2606.09662.
- Darade & Thorat (2026). Represented Is Not Computed. arXiv:2605.22488.
- Zhu, Wang & Sui. Chain-of-Thought Tokens are Computer Program Variables. arXiv:2505.04955.
- Dalton (2026). How Post-Training Influences Verbalized Algorithmic Computation. arXiv:2611.13552.
- Macar et al. Thought Branches: Interpreting LLM Reasoning Requires Resampling. arXiv:2510.27484.
- Zhang & Nanda. Towards Best Practices of Activation Patching in Language Models. arXiv:2309.16042.
- Heimersheim & Nanda. How to use and interpret activation patching. arXiv:2404.15255.
- Makelov, Lange & Nanda. Is This the Subspace You Are Looking For? arXiv:2311.17030.
