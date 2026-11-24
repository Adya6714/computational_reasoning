export const toySteps = [
  { id: "x", line: "x = 7", role: "given", value: "7" },
  { id: "y", line: "y = x + 5", role: "computed", value: "12" },
  { id: "z", line: "z = y * 2", role: "computed", value: "24" },
  { id: "w", line: "w = z - 3", role: "answer", value: "21" },
] as const;

export type ToyStepId = (typeof toySteps)[number]["id"];

export const toyPrompt =
  "x = 7. y = x + 5. z = y * 2. w = z - 3. What is w? Think step by step.";

export const toySolver =
  "A solver generates thousands of these with different numbers, operations, depths and names, and knows every correct intermediate value.";

export const feasibilityBands = [
  {
    id: "easy",
    label: "Easy now",
    directions: "A, B, D, F, G, J, L",
    evidence: "Behavioural, decodability, some causal",
    detail:
      "“Some causal” is B’s update-position patch, and only B’s. A, D, J and L on this pass are probes or behaviour. F and G are inference and resampling. This row is the proposed sweep.",
  },
  {
    id: "richer",
    label: "Needs richer tasks or tooling",
    directions: "C, E, H, I",
    evidence: "Causal, but only after the task or tool is set up",
    detail:
      "C needs adversarial items that split two algorithms. E needs a reproducible effect from A or D, and unverified TransformerLens support for Qwen3. H and I need planning or constraint tasks.",
  },
  {
    id: "weak",
    label: "Weak on our budget",
    directions: "K, M",
    evidence: "Mostly behavioural or correlational",
    detail:
      "K spends a checkpoint sweep and may find that small OLMo checkpoints never solve a 3-step chain. M cannot separate architecture from training data, because we cannot train our own models.",
  },
] as const;

export type FeasibilityBandId = (typeof feasibilityBands)[number]["id"];

export const toyReadings = [
  "All 13 directions can be posed on one task family. That is what shared infrastructure means in practice: one solver, one trace format, one set of intermediate values, thirteen questions.",
  "About half are cheap and near-term. H and I need planning tasks, which is a real input to the P1 decision. The assignment chain does not become a planning benchmark by adding one constraint sentence.",
  "F, G, A and D on this toy task are effectively Direction 1’s first half, so the sweep is not a detour. F builds the error taxonomy Direction 1 consumes. G is the behavioural recovery question. A and D ask whether the value, and the latent intermediate, are even readable.",
  "One toy task is enough to understand the directions. It is not enough to publish on them.",
] as const;

export const nextStepOptions = [
  {
    id: "sweep",
    title: "Feasibility sweep",
    body: "The same ~500 chains, one small model (Qwen3-1.7B or Gemma-2-2B), behavioural and probe level only, for A, B, D, F, G, J and L.",
    cost: "A few T4 GPU-hours by a rough guess, not yet costed. Needs explicit GPU authorization. No path patching, EAP, checkpoint sweeps or architecture comparisons.",
  },
  {
    id: "matrix",
    title: "Matrix first, no compute",
    body: "Write these questions into the Phase 0 direction-matrix CSV, in the tentative-experiment column.",
    cost: "No GPU. This is a Phase 0 deliverable either way.",
  },
] as const;

export const toyExperiments = [
  {
    id: "A",
    name: "Representation",
    pillar: "I",
    band: "easy",
    sweep: true,
    question:
      "At the y = position, is 12 readable from the model’s activations before it writes it?",
    procedure:
      "Train a linear probe on the value of y, layer by layer. Controls: shuffled labels, and chains where y is copied rather than computed.",
    procedureFromQuestion: false,
    reaches: "Decodability and localization.",
    reachesFromMethod: false,
    feasibility: "Easy. Small model on a Colab T4.",
    catch: "Readable does not mean used.",
    relation: null,
    looksAt: "The position where the model is about to write y, before 12 is on the page.",
    highlight: ["y"],
    item: "The shared chain. The probe target is the value of y.",
  },
  {
    id: "B",
    name: "State updating",
    pillar: "II",
    band: "easy",
    sweep: true,
    question: "After x = 7 … x = 9, does the model use the new x or the stale one?",
    procedure:
      "Add reassignments, measure stale-value errors against distance, then patch the activation at the update position.",
    procedureFromQuestion: false,
    reaches:
      "Behavioural dependence of stale-value errors on distance. The update-position patch can reach causal involvement. It does not by itself identify a unique route.",
    reachesFromMethod: true,
    feasibility: "Easy.",
    catch: "Guo et al. and Tang et al. are close prior work.",
    relation: null,
    looksAt: "The later position that has to use x, after x has been overwritten.",
    highlight: ["x"],
    item: "The shared chain with a second assignment, x = 9, at a controlled distance from the first.",
  },
  {
    id: "C",
    name: "Algorithm selection",
    pillar: "II",
    band: "richer",
    sweep: false,
    question:
      "For y = x + 1 repeated k times, does the model step through each line or shortcut to x + k?",
    procedure:
      "Build items where the two algorithms make different errors. Stepping gives an off-by-one at one position. Shortcutting gives a different pattern. Then compare error signatures.",
    procedureFromQuestion: false,
    reaches:
      "Behavioural discrimination between two procedures. A computational-role claim needs the signatures to come apart. The item design is the experiment, because the two algorithms often predict the same final answer.",
    reachesFromMethod: true,
    feasibility: "Medium.",
    catch:
      "Candidate algorithms often predict the same output, so this needs carefully designed adversarial items.",
    relation: null,
    looksAt: "A run of increments, not the three-step chain. The two procedures have to be separable by their mistakes.",
    highlight: ["y"],
    item: "y = x + 1, repeated k times, built so stepping and shortcutting fail differently.",
  },
  {
    id: "D",
    name: "Latent computation",
    pillar: "I",
    band: "easy",
    sweep: true,
    question: "With no CoT (“answer only”), is z = 24 readable at the final position?",
    procedure:
      "Compare CoT and no-CoT accuracy as chain depth grows, and probe for the intermediate values in no-CoT runs.",
    procedureFromQuestion: false,
    reaches:
      "Behavioural: accuracy against depth, with and without CoT. Decodability of intermediates in the no-CoT run. Decodability is not use.",
    reachesFromMethod: true,
    feasibility: "Easy.",
    catch:
      "Kudo et al. already show single-step parts are solved before the CoT. “The intermediate is computed early” is not a new claim.",
    relation: "With A, F and G, this is Direction 1’s first half.",
    looksAt: "The final position of an answer-only run, asking whether z = 24 is readable there.",
    highlight: ["z", "w"],
    item: "The same chains twice: once with “think step by step”, once with “answer only”.",
  },
  {
    id: "E",
    name: "Routing and circuits",
    pillar: "I",
    band: "richer",
    sweep: false,
    question:
      "Which attention heads carry y’s value from its line to the position where z is computed?",
    procedure: "Path patching and attention knockout, then EAP.",
    procedureFromQuestion: false,
    reaches:
      "Causal involvement, and computational organization only if a reproducible effect survives the controls. Attention knockout alone cannot exclude MLP or residual routes.",
    reachesFromMethod: true,
    feasibility: "Medium to hard. TransformerLens support for Qwen3 is unverified.",
    catch: "Only meaningful after A or D gives a reproducible effect.",
    relation: "Blocked on A or D.",
    looksAt: "The path from the line that writes y to the position that computes z.",
    highlight: ["y", "z"],
    item: "The shared chain, after a probe or a no-CoT effect has already been shown to replicate.",
  },
  {
    id: "F",
    name: "Error genesis",
    pillar: "III",
    band: "easy",
    sweep: true,
    question:
      "In a wrong trace, which line is the first wrong one, and was it an arithmetic slip, a copy error or a wrong operation?",
    procedure:
      "Run about 1,000 chains, align each line to the solver, and build an error taxonomy.",
    procedureFromQuestion: false,
    reaches: "Behavioural. A taxonomy of first divergences. No internal claim.",
    reachesFromMethod: true,
    feasibility: "Easy. Inference only.",
    catch: null,
    relation: "This is also the front end of Direction 1.",
    looksAt: "The first line that disagrees with the solver.",
    highlight: ["y", "z", "w"],
    item: "About 1,000 generated chains, each line aligned to the solver’s intermediate values.",
  },
  {
    id: "G",
    name: "Persistence and recovery",
    pillar: "III",
    band: "easy",
    sweep: true,
    question: "Once y is written wrong, does w end up wrong?",
    procedure:
      "Resample 20 continuations from the wrong line, measure the recovery rate, and compare natural errors with injected ones.",
    procedureFromQuestion: false,
    reaches:
      "Behavioural recovery under resampling. Natural and injected errors stay separate arms.",
    reachesFromMethod: true,
    feasibility: "Easy behaviourally.",
    catch:
      "The yield of natural errors. If the model rarely writes a wrong y, the natural arm is empty, and the injected arm cannot stand in for it.",
    relation: "This is Direction 1.",
    looksAt: "A wrong y, then the w the continuation actually writes.",
    highlight: ["y", "w"],
    item: "The shared chain, continued 20 times from a wrong y. Natural wrong lines and injected wrong lines are separate.",
  },
  {
    id: "H",
    name: "Constraints",
    pillar: "II",
    band: "richer",
    sweep: false,
    question:
      "Given “every variable must stay below 50”, does the model keep the rule over 10 steps? Does it notice an injected violation?",
    procedure:
      "Impose the rule, run chains of about 10 steps, and inject a violation.",
    procedureFromQuestion: true,
    reaches:
      "Behavioural maintenance and detection of a stated constraint, if the task can express one.",
    reachesFromMethod: true,
    feasibility: "Medium.",
    catch:
      "The toy task is too simple for this. It really needs PlanBench or constraint-satisfaction tasks.",
    relation: "A direct input to decision P1.",
    looksAt: "Whether a stated bound is still in force ten steps later, and whether an injected breach is noticed.",
    highlight: [],
    item: "A longer chain under an explicit bound. The three-step arithmetic item does not carry this question.",
  },
  {
    id: "I",
    name: "Control flow",
    pillar: "II",
    band: "richer",
    sweep: false,
    question:
      "If the definitions are given out of order, does the model still compute them in dependency order? Does it know when it is done?",
    procedure: "Shuffle the dependency graph; probe for a stop or next-variable signal.",
    procedureFromQuestion: false,
    reaches:
      "Behavioural sensitivity to presentation order. A probe can reach decodability of a candidate stop or next-variable signal. A positive probe is not yet a control mechanism.",
    reachesFromMethod: true,
    feasibility: "Medium.",
    catch: "A clean control signal is hard to define.",
    relation: "Like H, this pushes toward planning tasks and is an input to P1.",
    looksAt: "The order the model computes in, when the prompt order is not the dependency order, and any signal that it is done.",
    highlight: ["y", "z", "w"],
    item: "The same definitions, shuffled, so the text order and the dependency order disagree.",
  },
  {
    id: "J",
    name: "Invariance",
    pillar: "IV",
    band: "easy",
    sweep: true,
    question:
      "Rename x, y, z to apple, river, q7, or write numbers as words. Do accuracy and the A-probe direction still hold?",
    procedure:
      "Apply those surface changes, remeasure accuracy, and test whether the direction found by the A probe still decodes the value.",
    procedureFromQuestion: true,
    reaches:
      "Behavioural invariance on its own. Mechanism transfer only after A exists, and only as a replication of that probe direction.",
    reachesFromMethod: true,
    feasibility: "Easy behaviourally. Medium for mechanism transfer.",
    catch: "Needs A done first.",
    relation: "The mechanism-transfer half waits on A. The sweep can still measure accuracy.",
    looksAt: "The same computation under new names or number words, including the probe direction from A.",
    highlight: ["x", "y", "z"],
    item: "apple = 7. river = apple + 5. q7 = river * 2. Or the same chain with numbers written as words.",
  },
  {
    id: "K",
    name: "Training dynamics",
    pillar: "IV",
    band: "weak",
    sweep: false,
    question:
      "At which OLMo checkpoint does y become readable, and does that come before the model gets the answers right?",
    procedure: "Sweep the public OLMo intermediate checkpoints.",
    procedureFromQuestion: false,
    reaches:
      "Correlational. A checkpoint at which a probe starts to read y, set next to the checkpoint at which answers become correct. That order is not a causal account of how the mechanism formed.",
    reachesFromMethod: true,
    feasibility: "Medium. Each checkpoint costs compute.",
    catch:
      "Small checkpoints may never solve 3-step chains. A probe that never rises, on a model that never answers, does not time the emergence of anything.",
    relation: null,
    looksAt: "The same y-probe as A, repeated across public OLMo checkpoints, beside answer accuracy.",
    highlight: ["y", "w"],
    item: "The shared chain, scored at each public OLMo intermediate checkpoint.",
  },
  {
    id: "L",
    name: "Metacognition",
    pillar: "III",
    band: "easy",
    sweep: true,
    question:
      "Before the model writes a line, does a probe predict that the line will be wrong, better than token log-probability does?",
    procedure:
      "At the position before the line is written, compare a correctness probe with token log-probability.",
    procedureFromQuestion: true,
    reaches:
      "Predictive. A comparison against log-probability. Not a causal claim about monitoring.",
    reachesFromMethod: true,
    feasibility: "Easy to medium.",
    catch:
      "Yuan et al. found correctness readable but not causal. The comparison also needs enough errors, so it depends on the yield that limits G.",
    relation: "Needs the errors that F and G are counting.",
    looksAt: "The position just before a line is written. The probe is about whether that line will be wrong.",
    highlight: ["y"],
    item: "The shared chains, labelled by whether the next line matches the solver.",
  },
  {
    id: "M",
    name: "Architecture",
    pillar: "II",
    band: "weak",
    sweep: false,
    question:
      "Does a recurrent or state-space model (for example Mamba) of similar size break at a different chain depth? Does limiting the attention window break chains at a predictable depth?",
    procedure:
      "Compare depth-accuracy curves across an existing model of another architecture, and across a limited attention window. Behavioural only. No training.",
    procedureFromQuestion: true,
    reaches: "Behavioural. A difference in the depth at which accuracy falls.",
    reachesFromMethod: true,
    feasibility: "Behavioural only.",
    catch:
      "We can’t train our own models, so training-data differences confound every comparison. A depth gap between two released models is not an architectural result.",
    relation: "Also sits under Pillar IV. Which pillar is primary is open decision P2.",
    looksAt: "The chain depth at which accuracy collapses, for a similar-size state-space model and for a limited attention window.",
    highlight: ["w"],
    item: "The same family of chains, run behaviourally. No model is trained for this.",
  },
] as const;
