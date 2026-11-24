# Reasoning Computation (RC): Research Programme

**PI:** Adya Srivastava
**Date:** 20 November 2026
**Revised:** 24 November 2026. PI decisions of 23–24 November 2026: programme and Direction 1 goals; three-stage structure; task and model selection; compute and build order. Decision log below. Earlier revision, 22 November 2026: §1.1 late-2026 validity check. Earlier revision, 21 November 2026: §4.4 shared toy task illustration.
**Status:** Working programme document. Directions are research territory, not promised papers. Nothing here is a completed experiment or an established finding unless it is cited as published work. A pipeline smoke run has been done; no model hosted on GPU yet; no internals inspected.
**Companion file:** `RC_Research_Direction_1_Implementation.md` (step-by-step checklist and technical specification for the first study)

---

# Part A: The programme

## 1. Motivation and the problem we are trying to solve

**Programme goal.** Find out how language models actually carry out multi-step reasoning inside: how they hold, update and use intermediate results, why errors spread or get corrected, and turn that into models that catch and fix their own mistakes.

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

### 1.1 Validity of the programme, late 2026

The problem remains valid for newer frontier models. Intermediate-step errors, cascading mistakes, and unfaithful or decorative reasoning traces are still reported in strong reasoning models and frontier systems, including work from October and November 2026. Scaling and reasoning training have raised accuracy. They have not made a wrong intermediate state a solved object.

The problem has shifted. The obvious failure on a short chain is no longer the main case. The live cases are longer traces, errors that stay quiet, and representations that carry a mistake forward. RC's framing — what is in the state before a line is written, and which wrong values the next step actually uses — is the part this work still treats as open.

**Status of this section.** A validity argument for keeping the programme, not an RC result and not a literature matrix (that matrix is §8). On 22 November 2026 the abstracts of Nguyen et al., Firke & Kannan, and Basu & Chakraborty were read and match the claims attributed to them below. Bansal, Agarwal & Gangwani is identified from the ICML 2026 FAGEN workshop listing; the OpenReview PDF (forum id `5XoSAYPGMT`) returned 403, so its figures are not checked against the paper. The Prefactor piece is a vendor blog. A number taken from an unread PDF or a blog is marked. It is not for a manuscript or an advisor deck until the primary source is read (§8.1).

#### 1.1.1 Evidence that the problem is still live

**Error propagation in reasoning traces.** Nguyen, Pham & Nguyen, *Tracing Error Propagation in Reasoning Language Models*, EMNLP 2026 main (anthology `2026.emnlp-main.1559`). Abstract, read 22 November 2026. Step-level errors are locally predictable from a short window of neighbouring steps, so the trace carries an early warning. Trace-level failure is often not an isolated slip. It comes from a persistent error that started earlier. Recoverable and unrecoverable traces are separated by counterfactual resampling. Unrecoverable traces leave final-step representations that separate from recoverable ones, and the persistent error can be decoded from that final-step representation. The error signal propagates and accumulates. This is the representational half of Direction 1 (A, D, F, G): a mistake is readable, and readability is not yet a test of whether the next step uses it.

**Increasing hazard with step depth.** Firke & Kannan, *When Does Reasoning Age? Survival Analysis of Step-Level Error Hazard in LLM Chains*, EMNLP 2026 main (anthology `2026.emnlp-main.1976`). Abstract, read 22 November 2026. Survival analysis of 18,969 chains, five benchmarks, seven models from 3B to 70B, greedy decoding. A near-universal aging effect: the conditional probability of a reasoning error rises with step depth. The Weibull shape satisfies ρ > 1 in 34 of 35 dataset–model cells. The abstract reports that this holds under informative-censoring adjustment and under a shared-frailty check for problem-level heterogeneity. Raw error rates hide the pattern; the conditional hazard shows it. This is why a 3-step toy chain (§4.4) can illustrate a direction and still be the wrong place to claim the phenomenon. The hazard is a function of depth.

**Amplification after the first error.** Bansal, Agarwal & Gangwani, *Cascading Failure Amplification in Multi-Step LLM Reasoning: Operational Definitions, Trace-Level Diagnostics, and Intervention Analysis*, ICML 2026 FAGEN workshop. Authors and title confirmed from the workshop listing on 22 November 2026. OpenReview forum `5XoSAYPGMT` was not retrieved. **Figures not checked against the PDF.** The validity note, consistent with a public author summary, reports that a prior error raises the chance of a later error by about 3–8× across model families (GPT-4o-mini, Llama-3.1-8B, Qwen-2.5-72B in that summary), that roughly half of post-error steps introduce a new mistake in some evaluations, and that cross-verification helped more than step-level self-checking in the tested settings. Those three figures stay out of any claim until the PDF is read. The qualitative point that is safe to carry now is the one the workshop accepted the paper to make: an earlier mistake changes the error rate of what follows, and the diagnostic has to be at the level of the trace.

**Decorative traces in frontier models.** Basu & Chakraborty, *When AI Shows Its Work, Is It Actually Working?*, arXiv:2603.22816 v1. Abstract and opening, read 22 November 2026. Step-level ablation on ten frontier models, including GPT-5.4, Claude Opus 4.6-R, DeepSeek-V3.2, MiniMax-M2.5 and Kimi-K2.5, across sentiment, mathematics, topic classification and medical QA. For most of those models, removing any individual written step changes the answer less than 17% of the time, and a single step is often enough to recover the answer. On mathematics, smaller models (0.8–8B) show genuine step dependence (55% necessity). Faithfulness is specific to the model and the task: MiniMax-M2.5 and Kimi-K2.5 break the decorative pattern on some domains and not others. A written trace can be accurate and still not be the computation. That is the same distinction Paper 1 draws between the written value and what the next step uses. It is also why "the model wrote a correction" is not a recovery result (see Varma & Singh in §8.2).

**Agents and long traces.** Doughty, *Why Cascading Agent Failures Pass Benchmarks but Wreck Production*, Prefactor blog, 21 November 2026. Not a paper. The post's claim, which matches the programme's reason for wanting solvers and intermediate states (§5.1), is that a benchmark scoring only the final output misses silent propagation: an early wrong step is accepted downstream and becomes load-bearing. The post says leading agents still complete only a minority of realistic multi-step tasks under production-like conditions, and that faults often enter early and are not acted on when later evidence contradicts them. Treat the post as a statement of the production gap, not as a measured result. Its incident anecdotes and percentages are not used here.

#### 1.1.2 What has improved, and what has not

**What has improved.** A reading, not a finding. Scaling, reasoning-specific training, and longer internal deliberation have raised accuracy and removed some brittle short-chain failures. Reasoning models are, in the work above, better placed to re-derive a step than models that only answer. Internal signals do carry information about step correctness in reported cases: neighbouring-step windows and final-step representations in Nguyen et al.; correctness probes that are predictive and not causal in Yuan et al. (§8.2). That is the signal RC is built to test, not a signal RC can yet claim to have found.

**What has not been solved.** Quiet intermediate errors that read as confident. Propagation that spoils the final answer. Written traces that are not load-bearing. The cost of checking only from the outside. Independent 2026 lines still treat these as open, and the interventions they try — probes, process-level checks, step-level evaluation — stop where this programme starts: whether the represented error is the one the computation uses.

#### 1.1.3 Scaling laws, and why the open-weight model is the real problem

**Status.** Programme position, 22 November 2026. Not a finding, and not a claim about market share. Kaplan et al. (2020) and Hoffmann et al. (2022) are the classical pretraining scaling laws; they were not re-read for this revision. The empirical points used below are the ones already checked in §1.1.1.

**What a scaling law actually says.** A pretraining scaling law says that average cross-entropy falls as a power of parameters, data and compute. It is a law about loss. It does not say whether the value written at one step is the value the next step uses, whether a wrong value is recovered, or which component carries the state. Test-time scaling spends more steps or more samples to buy accuracy. That buys depth. Firke & Kannan, on models from 3B to 70B, find the conditional probability of a reasoning error rising with that depth. Basu & Chakraborty find written steps less necessary in frontier models than in small models on mathematics. Scale can lift the final-answer rate while the trace becomes a worse description of the computation. "Scale it" and "let it think longer" are not substitutes for knowing the state.

**The real-world object is the open-weight model.** The models a lab can deploy, fine-tune and run as an agent, and then change, are open-weight. A closed frontier API accepts a prompt and returns text. The only reliability tool that fits it is an external checker, which this programme has already set aside (§1). An open model exposes the activations, accepts a training change, and can take a different architecture. That is the practical next gain: not another point on the loss curve, a model whose intermediate computation can be made reliable because someone is allowed to open it. Qwen, Gemma, OLMo and the open frontier systems already in §1.1.1 and §5.2 are that object. Closed models stay behavioural baselines.

**Why this programme is the way to make them better.** A scaling run does not name the failure. A final-answer benchmark does not either (§1.1.1). What names it is the account RC is built to produce: which intermediate value is represented, which wrong value the next step uses, and which part of the network carries it. That account is what a training change (direction K), a transferred mechanism (J) or an architectural constraint (M) can aim at, instead of touching the whole model and hoping the loss moves. Direction 1 is the first cut of that account, on the error that actually propagates. The long-term stake in §1 — training, mechanisms, architecture, not a wrapper — is how an open model gets better at the failures scale does not remove.

**Where this leaves the programme.** Frontier models have not retired the problem. They have moved it from obvious failures on short chains to longer horizons and to the representation that carries the mistake. Scaling will keep raising accuracy. The computation inside the step stays undescribed, and it gets more expensive as the chain gets longer. The place that description can change a deployed model is the open-weight model. The programme's bet is unchanged: find the error in the state, then test which errors propagate, then use that to train, edit or redesign the model that can be opened.

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

A concrete question and one tentative experiment for every direction, posed on a single assignment chain, is in §4.4. That section is an illustration of the directions. It is not a result and not a publication task.

### 4.3 Proposed priority (strategy, not novelty-reviewed)
- **First:** F, G, D, A. These connect the error event directly to the internal computation. Research Direction 1 sits here.
- **Second:** B, C, E, H, I, L. These can explain the processes behind the first observations.
- **Third:** J, K, M. These establish generality, training origins and architectural implications.

### 4.4 One shared toy task (Phase 0 illustrations)

Phase 0 already calls for 2 to 4 tentative experiments per direction (§6). The easiest way to see what each direction would actually do is to run every direction on **one shared toy task**. The point is to show the operation of each direction. It is not to publish.

One toy task is enough to understand the directions. It is not enough to publish on them.

**Status of this section.** Proposed illustration. Not run. No model has been probed, patched or scored on these items. Where a direction did not name an evidence rung, the line "Evidence this illustration can reach" is read off the method it describes, using the ladder in §3. That line is not a result and not an extra experiment.

#### 4.4.1 The shared task

**Prompt.**

```text
x = 7. y = x + 5. z = y * 2. w = z - 3. What is w? Think step by step.
```

**Correct trace.** y = 12, z = 24, w = 21.

A solver generates thousands of these with different numbers, operations, depths and names, and knows every correct intermediate value. Every later comparison (a probe target, a stale value, a first wrong line, a recovery) is scored against that solver, not against a model judgement.

The base item is the shared object. Individual directions change one thing about it: a reassignment, a repeated increment, a no-CoT instruction, a constraint, a shuffled order, a renamed variable, or an injected wrong line. The dependency structure stays the thing being studied.

#### 4.4.2 Each direction, one question, one experiment

**A. Representation** (Pillar I; full name in §4.2)
- **Q.** At the `y =` position, is 12 readable from the model's activations before it writes it?
- **Do.** Train a linear probe on the value of y, layer by layer. Controls: shuffled labels, and chains where y is copied rather than computed.
- **Reaches.** Decodability and localization.
- **Feasibility.** Easy. Small model on a Colab T4.
- **Catch.** Readable does not mean used.
- **On the sweep.** Yes. Easy-now set.

**B. State updating** (Pillar II)
- **Q.** After `x = 7 ... x = 9`, does the model use the new x or the stale one?
- **Do.** Add reassignments, measure stale-value errors against distance, then patch the activation at the update position.
- **Evidence this illustration can reach.** Behavioural dependence of stale-value errors on distance. The update-position patch can reach causal involvement. It does not by itself identify a unique route.
- **Feasibility.** Easy.
- **Catch.** Guo et al. and Tang et al. are close prior work (see §8.2).
- **On the sweep.** Yes.

**C. Algorithm selection** (Pillar II)
- **Q.** For `y = x + 1` repeated k times, does the model step through each line or shortcut to x + k?
- **Do.** Build items where the two algorithms make different errors (stepping gives off-by-one at one position, shortcutting gives a different pattern), then compare error signatures.
- **Evidence this illustration can reach.** Behavioural discrimination between two procedures. A computational-role claim needs the signatures to come apart. Candidate algorithms often predict the same final answer, so the item design is the experiment.
- **Feasibility.** Medium.
- **Catch.** Candidate algorithms often predict the same output, so this needs carefully designed adversarial items.
- **On the sweep.** No. Needs the adversarial items before it is informative.

**D. Latent computation** (Pillar I)
- **Q.** With no CoT ("answer only"), is z = 24 readable at the final position?
- **Do.** Compare CoT and no-CoT accuracy as chain depth grows, and probe for the intermediate values in no-CoT runs.
- **Evidence this illustration can reach.** Behavioural (accuracy against depth, with and without CoT) and decodability of intermediates in the no-CoT run. Decodability is not use.
- **Feasibility.** Easy.
- **Catch.** Kudo et al. already show single-step parts are solved before the CoT (see §8.2 and §8.5). Do not treat "the intermediate is computed early" as a new claim.
- **On the sweep.** Yes.

**E. Routing and circuits** (Pillar I)
- **Q.** Which attention heads carry y's value from its line to the position where z is computed?
- **Do.** Path patching and attention knockout, then EAP.
- **Evidence this illustration can reach.** Causal involvement, and computational organization only if a reproducible effect survives the controls in §5.3. Attention knockout alone cannot exclude MLP or residual routes (§8.4).
- **Feasibility.** Medium to hard. TransformerLens support for Qwen3 is unverified.
- **Catch.** Only meaningful after A or D gives a reproducible effect.
- **On the sweep.** No. Tooling and a prior effect both have to exist first.

**F. Error genesis** (Pillar III)
- **Q.** In a wrong trace, which line is the first wrong one, and was it an arithmetic slip, a copy error or a wrong operation?
- **Do.** Run about 1,000 chains, align each line to the solver, and build an error taxonomy.
- **Evidence this illustration can reach.** Behavioural. A taxonomy of first divergences. No internal claim.
- **Feasibility.** Easy. Inference only.
- **Relation.** This is also the front end of Direction 1.
- **On the sweep.** Yes.

**G. Persistence and recovery** (Pillar III)
- **Q.** Once y is written wrong, does w end up wrong?
- **Do.** Resample 20 continuations from the wrong line, measure the recovery rate, and compare natural errors with injected ones.
- **Evidence this illustration can reach.** Behavioural recovery under resampling. Natural and injected errors stay separate arms (§8.4).
- **Feasibility.** Easy behaviourally.
- **Catch.** The yield of natural errors. If the model rarely writes a wrong y on this chain, the natural arm is empty and the injected arm cannot stand in for it.
- **Relation.** This is Direction 1.
- **On the sweep.** Yes.

**H. Constraints** (Pillar II)
- **Q.** Given "every variable must stay below 50", does the model keep the rule over 10 steps? Does it notice an injected violation?
- **Do.** Stated as the question: impose the rule, run chains of about 10 steps, and inject a violation.
- **Evidence this illustration can reach.** Behavioural maintenance and detection of a stated constraint, if the task can express one.
- **Feasibility.** Medium.
- **Catch.** The toy task is too simple for this. It really needs PlanBench or constraint-satisfaction tasks. This is a direct input to decision P1.
- **On the sweep.** No.

**I. Control flow** (Pillar II)
- **Q.** If the definitions are given out of order, does the model still compute them in dependency order? Does it know when it is done?
- **Do.** Shuffle the dependency graph; probe for a stop or next-variable signal.
- **Evidence this illustration can reach.** Behavioural sensitivity to presentation order. A probe can reach decodability of a candidate stop or next-variable signal. A clean control signal is hard to define, so a positive probe is not yet a control mechanism.
- **Feasibility.** Medium.
- **Catch.** A clean "control signal" is hard to define. Like H, this pushes toward planning tasks and is an input to P1.
- **On the sweep.** No.

**J. Invariance** (Pillar IV)
- **Q.** Rename x, y, z to apple, river, q7, or write numbers as words. Do accuracy and the A-probe direction still hold?
- **Do.** Stated as the question: apply those surface changes, remeasure accuracy, and test whether the direction found by the A probe still decodes the value.
- **Evidence this illustration can reach.** Behavioural invariance on its own. Mechanism transfer only after A exists, and only as a replication of that probe direction.
- **Feasibility.** Easy behaviourally; medium for mechanism transfer.
- **Catch.** Needs A done first.
- **On the sweep.** Yes, at the behavioural and probe level. The mechanism-transfer half waits on A.

**K. Training dynamics** (Pillar IV)
- **Q.** At which OLMo checkpoint does y become readable, and does that come before the model gets the answers right?
- **Do.** Sweep the public OLMo intermediate checkpoints.
- **Evidence this illustration can reach.** Correlational. A checkpoint at which a probe starts to read y, set next to the checkpoint at which answers become correct. That order is not a causal account of how the mechanism formed.
- **Feasibility.** Medium. Each checkpoint costs compute.
- **Catch.** Small checkpoints may never solve 3-step chains. A probe that never rises, on a model that never answers, does not time the emergence of anything.
- **On the sweep.** No. Weak on the current budget.

**L. Metacognition** (Pillar III)
- **Q.** Before the model writes a line, does a probe predict that the line will be wrong, better than token log-probability does?
- **Do.** Stated as the question: at the position before the line is written, compare a correctness probe with token log-probability.
- **Evidence this illustration can reach.** Predictive. A comparison against log-probability. Not a causal claim about monitoring.
- **Feasibility.** Easy to medium.
- **Catch.** Yuan et al. found correctness readable but not causal (see §8.2). The comparison also needs enough errors, so it depends on the yield that limits G.
- **On the sweep.** Yes, as a predictive comparison only.

**M. Architecture** (Pillars II and IV)
- **Q.** Does a recurrent or state-space model (for example Mamba) of similar size break at a different chain depth? Does limiting the attention window break chains at a predictable depth?
- **Do.** Stated as the question: compare depth-accuracy curves across an existing model of another architecture, and across a limited attention window. Behavioural only. No training.
- **Evidence this illustration can reach.** Behavioural. A difference in the depth at which accuracy falls.
- **Feasibility.** Behavioural only.
- **Catch.** We can't train our own models, so training-data differences confound every comparison. A depth gap between Qwen and Mamba is not an architectural result until training data is matched, which this programme cannot do.
- **On the sweep.** No. Weak on the current budget, and confounded even if compute were free.

#### 4.4.3 Feasibility on our setup

| Feasibility on our setup | Directions | Highest evidence level this illustration can reach |
|---|---|---|
| Easy now | A, B, D, F, G, J, L | Behavioural, decodability, some causal |
| Needs richer tasks or tooling | C, E, H, I | Causal, but only after the task or tool is set up |
| Weak on our budget | K, M | Mostly behavioural or correlational |

"Some causal" in the easy row is B's update-position patch, and only B's. A, D, J and L on this pass are probes or behaviour. F and G are inference and resampling. The easy row is not a licence to claim a circuit.

#### 4.4.4 What this tells us

Author's analysis, 21 November 2026. Not literature-checked. Not a finding.

- All 13 directions can be posed on one task family. That is what "shared infrastructure" means in practice: one solver, one trace format, one set of intermediate values, thirteen questions.
- About half are cheap and near-term. H and I need planning tasks, which is a real input to the P1 decision. The assignment chain does not become a planning benchmark by adding one constraint sentence.
- F, G, A and D on this toy task are effectively Direction 1's first half, so the sweep is not a detour around Paper 1. F builds the error taxonomy Direction 1 consumes. G is the behavioural recovery question. A and D ask whether the value, and the latent intermediate, are even readable.
- One toy task is enough to understand the directions. It is not enough to publish on them.

#### 4.4.5 Proposed next step (open; needs PI approval)

Two options. Neither is approved. Recorded as decision P3 in §14.

1. **Feasibility sweep.** The same ~500 chains, one small model (Qwen3-1.7B or Gemma-2-2B), behavioural and probe level only, for A, B, D, F, G, J and L. Compute: a few T4 GPU-hours by a rough guess, not yet costed. It needs explicit GPU authorization before any job is launched. The sweep does not include path patching, EAP, checkpoint sweeps or architecture comparisons.
2. **Matrix first, no compute.** Write §4.4 into the direction-matrix CSV from Phase 0, with these questions as the "tentative experiment" column. No GPU.

The choice is the PI's. Neither option starts until P3 is decided. The sweep does not start without a costed estimate and explicit GPU authorization.

## 5. How the directions will be studied

### 5.1 Task environments
A **reasoning benchmark** measures whether models solve problems. RC needs **experimental task environments**: problems where intermediate states and dependencies are explicit, so we can intervene and know what caused an outcome. A hard benchmark can still be unusable for mechanistic work if its intermediate variables cannot be identified reliably.

**Principle:** derive RC-specific datasets from established benchmarks where possible:
1. Extract operations, states, dependencies and exact solutions.
2. Transform symbols, values, structures and difficulty.
3. Verify every transition with independent solvers.
4. Output traceable intermediate states.

This also reduces memorization and contamination risk.

Datasets are derived from established benchmarks after an audit. Variable/assignment chains are a candidate only. They are not decided. Benchmarks may differ per direction. The source-to-direction table is kept.

The first concrete illustration is the shared assignment chain in §4.4. It shows what each direction would do on one task family. It is not an approved publication task. Directions H and I are not well posed on it; they need planning or constraint tasks (PlanBench, or a constraint-satisfaction source).

**Candidate sources** (to be verified in the benchmark audit; none approved):

| Source | Kind | Likely directions served |
|---|---|---|
| DSR-Bench | Data-structure and structural reasoning | A, B, C, F, G, J |
| BeyondBench (incl. Hard Suite) | Procedurally generated algorithmic and constraint tasks | C, F, G, H |
| PlanBench / ACPBench | Planning: states, actions, prerequisites, goals | H, I, B |
| Variable-scope / assignment-chain tasks | Controlled computational state. Candidate only, not decided. §4.4 is one illustration on this family, not the audited dataset | A, B, D, F, G, and, with the variants in §4.4, C, E, J, K, L, M. H and I only weakly |
| GSM8K / MATH / AIME | Natural mathematical reasoning (external validation) | F, G, J |
| HardcoreLogic | Pending audit | Pending audit |
| Reasoning Gym tasks | Pending audit | Pending audit |
| GSM-Symbolic | Pending audit | Pending audit |

External generators get the same validation audit as our own. A published audit found material defects in 13 of 105 Reasoning Gym generators. That is a reason for the audit, not a reason to drop the source before it is inspected.

**Generator validation** (full procedure in the implementation file): ground truth only from code; two independent solvers must agree on 100% of items. Property tests, scorer tests, frozen hashed generator versions, and one regression test per bug found. An LLM is a bug-finder only, never a label source. A flag counts as a bug only when reproduced by a failing test.

### 5.2 Models
The working model is chosen by a Phase 1 model screen on audited benchmark items. There is no primary model until that screen is done.

**Must-haves:**
1. open weights and activation access;
2. reproducible;
3. enough natural errors;
4. parseable reasoning;
5. intervention tooling works;
6. fits budget (A100 40/80GB);
7. fine-tunable / editable.

**Nice-to-haves** (PI top-3 priority: OPEN):
8. existing SAEs / transcoders;
9. thinking on/off in the same weights;
10. open training data;
11. multi-size family;
12. recency;
13. standard architecture;
14. number tokenization.

**Model tiers:**
- closed-source frontier models for behavioural baselines;
- open frontier models;
- open-weight models with internals access, for all mechanistic work. §1.1.3: these are also the practical object. A closed model can only be wrapped. An open model is the one whose training, mechanisms and architecture this programme can inform.

**Candidates for the Phase 1 screen** (not an approved roster):
- Qwen3.5 (0.8B / 2B / 4B / 9B; hybrid Gated DeltaNet architecture)
- Gemma 3 (270M / 1B / 4B / 12B / 27B; Gemma Scope 2 SAEs/transcoders on every layer). 27B is a family member, not a planned run on this budget
- Olmo 3 7B (fully open data and checkpoints)

**Forced by direction.** K needs Olmo (released training checkpoints). M needs Qwen3.5 and Gemma 3 (hybrid vs standard architecture).

**Phase 0 illustration only, not a model choice.** §4.4.5 names Qwen3-1.7B or Gemma-2-2B for a possible easy-now sweep, and public Olmo intermediate checkpoints for direction K. None of these is authorized, and none replaces the Phase 1 screen.

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

## 6. Programme structure (three stages)

**Stage 1. Scope all directions.** For each direction A–M: 2–3 questions, light depth only. Behavioural tests plus one quick internal check (a probe or a single patch). Purpose: rank directions, not finish them. Log GPU-hours and ₹ per direction.

**Ranking criteria** (score 1–5 each): signal, novelty, fix potential, cost (GPU + build time), paper potential. Weights: OPEN.

**Directions that need extra Stage 1 build:**
- H and I: planning / constraint tasks
- E: attribution patching
- K: models with released training checkpoints (Olmo)
- M: hybrid vs standard model comparison (Qwen3.5 vs Gemma 3)

**Stage 2. One direction at a time.** Take the top-ranked direction. Full mechanistic work, then a fix (steering, targeted weight edits, mechanism-targeted LoRA; RL only if tiny), then transfer to a hard benchmark. Then move to the next direction. Within any direction, the fix comes only after a mechanism is located.

**Stage 3. Scaling.** Last, and only for winning directions, if credits remain.

Whether Direction 1 stays first or competes in the Stage 1 ranking is OPEN. The companion implementation file is the Direction 1 technical specification; it is not a licence to skip Stage 1.

**Goal for RC output:** main-track papers at top venues. The number of papers is dictated by results.

**Compute (24 Nov 2026).** The PI manages the ₹10,000 JarvisLabs budget. Reference prices (USD/hr, checked 23 Nov 2026): A100 40GB $0.89 on-demand / $0.79 spot; A100 80GB $1.49 / $0.89; H100 $3.49 / $1.54; billed per second. Rough estimate: one direction done fully (mechanism + fix, 7–9B model) ≈ 10–20 A100-hours. Avoid: debugging on live GPUs, 27B models, RL. Cost estimate provided before each run. Build all code first; smoke-test on CPU/Colab; JarvisLabs for every reported run. Pause GPU instances when idle.

**Build order.** Build all code first (generators, solvers, verifiers, scorers, parser, intervention code) → smoke test on CPU/Colab → JarvisLabs for every reported run. Colab/CPU for debugging only.

# Part B: Research Direction 1, error propagation (Paper 1)

**One-line question:** after the model itself writes a wrong intermediate value, what does the next dependent step actually use?

**Direction 1 goal.** After the model itself writes a wrong intermediate value, what does the next dependent step actually use, and use it for a targeted fix that improves accuracy on established benchmarks.

**Fix requirements.** A held-out benchmark never used while designing the fix. Report effects on previously-correct items. No regressions hidden.

Why this direction is a candidate to go first: it sits where representation, computation, state use, error genesis, recovery and causal reliability meet (directions D, F, G, A). Whether it stays first or competes in Stage 1 ranking is OPEN.

## 7. Research problem

**Programme problem.** We lack a sufficiently direct, causally tested account of how LLMs implement, maintain and recover from intermediate computational states during multi-step reasoning. A correct final answer does not reveal how the computation was performed; a wrong answer does not reveal where it broke or why the error persisted.

**Paper 1 problem.** When a model generates an incorrect intermediate value and later consumes it, possible behaviours include:
- using the wrong written value;
- recomputing the needed value from the original inputs;
- detecting a discrepancy and correcting it;
- combining written-value and source information.

These can produce similar outputs while implying different computations. They are not mutually exclusive.

**Research question.** How do incorrect intermediate values causally influence subsequent computation in language models, what determines whether those errors are propagated or corrected, and can that account be used for a targeted fix that improves accuracy on established benchmarks?

**Scope.** A controlled causal investigation of error propagation and recovery in multi-step computation, using programmatically verifiable tasks, model-generated errors, input interventions and activation interventions, then a targeted fix evaluated on a held-out benchmark, with effects on previously-correct items reported.

**PI position.** RC keeps the broad ambition of understanding computational mechanisms. Paper 1 is one sharply bounded first problem with a falsifiable question. It does not claim to explain reasoning reliability in general, and its novelty is not yet established.

## 8. Literature and prior work (summary)

§1.1 is a separate late-2026 validity check on whether the programme problem is still live. It is not part of this matrix, and its unread-PDF figures are not rows here.

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

**Proposed contribution (if supported).** A causal profile of how later reasoning depends on a model's own naturally generated incorrect intermediate values, through the written value, source information, or internal state formed before writing, a test of whether that profile predicts which errors propagate or are corrected during free-running reasoning, and a targeted fix that improves accuracy on established benchmarks.

**Contribution hierarchy.**
- Primary: the causal dependence profile on natural errors plus the replay-to-free-running predictive test.
- Improvement: a targeted fix after the mechanism is located, evaluated on a held-out benchmark never used while designing the fix, with effects on previously-correct items reported.
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

- **Data:** controlled multi-step tasks with exact solvers, derived from established benchmarks after an audit. Each task has explicit intermediate values and dependency graphs. Variable/assignment chains are a candidate only, not decided.
- **Model:** one open-weight checkpoint for the pilot, chosen by a Phase 1 model screen on audited benchmark items. Same-weights thinking-on/off comparisons later if the screened model supports them.
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
- **Fix, only after a mechanism is located:** steering, targeted weight edits, or mechanism-targeted LoRA (RL only if tiny). Transfer to a hard, held-out benchmark never used while designing the fix. Report effects on previously-correct items.

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
| P1 | Which reasoning type the first experiments study: structural/algorithmic, mathematical, planning/constraint, or a broader comparison first | **Retired, 24 Nov 2026, likely moot under Stage 1.** Benchmarks may differ per direction. Kept in the table so earlier notes remain readable |
| P2 | Primary pillar for direction M (II or IV) | |
| P3 | Phase 0 next step for the shared toy task (§4.4.5): write the thirteen questions into the direction-matrix CSV now, or specify a feasibility sweep (A, B, D, F, G, J, L; ~500 chains; Qwen3-1.7B or Gemma-2-2B; behavioural and probe level) | Sweep is a rough guess of a few T4 GPU-hours, not costed. GPU use needs explicit authorization. Neither option is approved. Stage 1 now covers light-depth questions per direction |
| P4 | Ranking-criteria weights for Stage 1 (signal, novelty, fix potential, cost, paper potential) | OPEN |
| P5 | Whether Direction 1 stays first or competes in the Stage 1 ranking | OPEN |
| P6 | PI top-3 among model nice-to-haves (items 8–14 in §5.2) | OPEN |
| P7 | Final model after the Phase 1 screen | OPEN |
| P8 | Benchmark audit outcome | OPEN |
| P9 | Novelty reads still outstanding: Dalton (arXiv:2611.13552), Zhu (arXiv:2505.04955), Thought Branches (arXiv:2510.27484) | OPEN |
| D1 | Is correctness gating the headline contribution of Direction 1 or exploratory (RQ4)? | Gap analysis treats it as central; protocol treats it as exploratory |
| D2 | Add a "consistency edit" (source edited so the wrong value becomes correct) to test correctness gating with W fixed? | |
| D3 | Adopt an explicit pre-write hypothesis: for slips the pre-write state carries the correct value; for systematic errors it carries the wrong one? | Follows from Kudo et al. |
| D4 | Replace "D_W > 0" as a primary hypothesis (near-certain given prior work) and recompose the primary hypothesis family | |
| D5 | Map the smallest effect of interest from survival units to logit units | |
| D6 | Keep RQ0 in Paper 1, move it to an appendix, or to a separate paper? | |
| D7 | At least two model families for core claims? | Budget dependent |
| D8 | Matched-temperature sensitivity for the mode comparison? | |

Implementation-level decisions are listed in the companion file (Part 2, S23).

## Decision log (24 Nov 2026)

PI decisions of 23–24 November 2026. This log summarises what changed. The sections above are the source of truth.

1. **Programme goal.** Find out how language models actually carry out multi-step reasoning inside: how they hold, update and use intermediate results, why errors spread or get corrected, and turn that into models that catch and fix their own mistakes.
2. **Direction 1 goal.** Extended to a targeted fix that improves accuracy on established benchmarks. Held-out benchmark never used while designing the fix. Report effects on previously-correct items. No regressions hidden. Within any direction, the fix comes only after a mechanism is located.
3. **Programme structure.** Three stages replace the old Phase 0–3 roadmap. Stage 1: 2–3 questions per direction A–M, light depth (behavioural tests + one probe or single patch), rank directions, log GPU-hours and ₹. Ranking criteria 1–5: signal, novelty, fix potential, cost, paper potential; weights OPEN. Extra Stage 1 build: H, I (planning/constraint tasks), E (attribution patching), K (Olmo checkpoints), M (Qwen3.5 vs Gemma 3). Stage 2: one direction at a time, full mechanism then fix then transfer. Stage 3: scaling last, winning directions only, if credits remain.
4. **Tasks.** Datasets derived from established benchmarks after audit. Variable/assignment chains are a candidate only, not decided. Benchmarks may differ per direction. Source-to-direction table kept. Added pending audit: BeyondBench Hard Suite, HardcoreLogic, Reasoning Gym, GSM-Symbolic. External generators get the same validation audit (published audit: material defects in 13 of 105 Reasoning Gym generators).
5. **Models.** Chosen by a Phase 1 model screen on audited items. Candidates: Qwen3.5 (0.8B/2B/4B/9B, hybrid Gated DeltaNet), Gemma 3 (270M/1B/4B/12B/27B, Gemma Scope 2), Olmo 3 7B. Must-haves 1–7; nice-to-haves 8–14 with PI top-3 OPEN. K needs Olmo; M needs Qwen3.5 + Gemma 3.
6. **Generator validation.** Ground truth from code only; two independent solvers agree on 100% of items. Property tests, scorer tests, frozen hashed versions, one regression test per bug. LLM is a bug-finder only, never a label source. Cursor agent or a separate Claude chat; no paid API calls. Prompt versioned at `validation/prompts/bugfind_v1.md`. Log: `validation/llm_bugfind_log.csv`. A flag is a bug only when a failing test reproduces it.
7. **Parser audit.** Single annotator (PI), labelling blind to parser output, ~100 traces; re-label 30 traces after one week and report intra-rater agreement; single-annotator limitation stated.
8. **Build order.** All code first → smoke test on CPU/Colab → JarvisLabs for every reported run. Colab/CPU for debugging only. Pause GPU instances when idle.
9. **Compute.** PI manages the ₹10,000 JarvisLabs budget. Prices checked 23 Nov 2026 (USD/hr): A100 40GB $0.89 / $0.79 spot; A100 80GB $1.49 / $0.89; H100 $3.49 / $1.54; billed per second. One full direction (mechanism + fix, 7–9B) ≈ 10–20 A100-hours. Avoid debugging on live GPUs, 27B models, and RL. Cost estimate before each run.
10. **Status.** A pipeline smoke run has been done; no model hosted on GPU yet; no internals inspected.
11. **Open.** P1 retired as likely moot under Stage 1. New: ranking weights (P4), Direction 1 vs Stage 1 ranking (P5), nice-to-have top 3 (P6), final model (P7), benchmark audit (P8), novelty reads Dalton / Zhu / Thought Branches (P9). D1–D16 and G3–G8 unchanged.


## 15. References

Bibliographic details, venues and versions must be rechecked against primary sources before submission. "Checked" means existence and abstract-level match. The date of the check is given on the entry. Entries with no mark were not re-read for the 22 November 2026 revision.

- Nguyen, Pham & Nguyen (2026). Tracing Error Propagation in Reasoning Language Models. EMNLP 2026 main. https://aclanthology.org/2026.emnlp-main.1559/ *Abstract checked, 22 Nov 2026.*
- Firke & Kannan (2026). When Does Reasoning Age? Survival Analysis of Step-Level Error Hazard in LLM Chains. EMNLP 2026 main. https://aclanthology.org/2026.emnlp-main.1976/ *Abstract checked, 22 Nov 2026.*
- Bansal, Agarwal & Gangwani (2026). Cascading Failure Amplification in Multi-Step LLM Reasoning: Operational Definitions, Trace-Level Diagnostics, and Intervention Analysis. ICML 2026 FAGEN workshop. OpenReview forum `5XoSAYPGMT`. *Title and authors checked from the workshop listing, 22 Nov 2026. PDF not retrieved.*
- Basu & Chakraborty (2026). When AI Shows Its Work, Is It Actually Working? Step-level evaluation reveals that frontier language models frequently bypass their own reasoning. arXiv:2603.22816 v1. *Abstract and opening checked, 22 Nov 2026.*
- Doughty (2026). Why Cascading Agent Failures Pass Benchmarks but Wreck Production: Step-Level Evaluation Gap. Prefactor blog, 21 Nov 2026. https://prefactor.tech/blog/cascading-failures-step-level-evaluation-gap *Blog, not a paper. Read 22 Nov 2026. Figures not used.*
- Kaplan et al. (2020). Scaling Laws for Neural Language Models. arXiv:2001.08361. *Named in §1.1.3 as the classical pretraining scaling law. Not re-read on 22 Nov 2026.*
- Hoffmann et al. (2022). Training Compute-Optimal Large Language Models. arXiv:2203.15556. *Named in §1.1.3 as the Chinchilla scaling law. Not re-read on 22 Nov 2026.*

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
