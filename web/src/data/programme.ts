export const rcQuestions = [
  "How does a model represent intermediate computational states?",
  "How does it update and manipulate those states across steps?",
  "How does it decide which intermediate information to use?",
  "When an intermediate computation is wrong, why does the model sometimes detect and correct it, and at other times propagate it?",
  "Can understanding these mechanisms help build more reliable models, through training, mechanisms or architecture?",
] as const;

export const whyItMatters = [
  {
    title: "Scientific",
    body: "Reasoning should be understood as computation with internal mechanisms, not only as an input-output capability. Behaviours that look the same from outside can imply very different internal processes.",
    color: "var(--vermillion)",
  },
  {
    title: "Technical",
    body: "Small computational mistakes compound into large failures. Knowing which mechanisms carry errors forward points to targeted fixes.",
    color: "var(--cobalt)",
  },
  {
    title: "Long-term",
    body: "The aim is not an external checker wrapped around model outputs. It is to understand the computation well enough to inform training methods, model mechanisms and architecture.",
    color: "var(--teal)",
  },
] as const;

export const evidenceChain = [
  "Construct controlled tasks with exact answers, and transformations that keep the problem while changing its surface or computational demands.",
  "Measure behavioural stability, failure profiles and responses to controlled state changes.",
  "Inspect activations to see whether candidate values, bindings, rules and intermediate results are represented.",
  "Use causal interventions to test whether those representations take part in computation rather than merely correlating with answers.",
  "Reconstruct candidate computational pathways and algorithms.",
  "Test whether mechanism-targeted interventions improve reliability without damaging correct behaviour, and whether effects transfer.",
] as const;

export const strands = [
  {
    id: "RvC",
    name: "Retrieval versus Computation",
    question:
      "Do models preserve answers and procedures under controlled transformations; what behavioural evidence separates procedural execution from familiarity?",
    relation:
      "Separate project and repository. Not reused as Paper 1 infrastructure without a suitability check.",
    color: "var(--acid)",
  },
  {
    id: "RR",
    name: "Reasoning Reliability",
    question:
      "Can we measure failures, predict them, localize internal causes, intervene, verify improvements and test transfer?",
    relation:
      "Separate programme and repository. No completed Q1 experiments to inherit.",
    color: "var(--cobalt)",
  },
  {
    id: "RC",
    name: "Reasoning Computation",
    question:
      "How do LLMs internally represent, transform, update and use computational state; why do computations fail; can this knowledge improve models?",
    relation: "Paper 1 is RC's first study. Own question, experiments and repository.",
    color: "var(--vermillion)",
  },
] as const;

export const evidenceLadder = [
  {
    level: "Behavioural dependence",
    example: "Editing a written value in the trace changes the next step",
    evidence: "Token edits with teacher-forced replay or resampled continuation",
    not: "Any internal representation or route",
  },
  {
    level: "Representation / decodability",
    example: "A probe extracts 20",
    evidence: "Probes, minimal pairs, representational similarity",
    not: "That the model computed or uses 20",
  },
  {
    level: "Localization",
    example: "Where 20 is accessible",
    evidence: "Layer/position probes, lenses, attribution",
    not: "That the component implements the operation",
  },
  {
    level: "Causal involvement",
    example: "Changing an activation alters the next step",
    evidence: "Patching, ablation, interchange interventions",
    not: "A unique semantic role or complete pathway",
  },
  {
    level: "Computational role",
    example: "The component implements a defined state transition",
    evidence: "Counterfactual algorithm tests, path analysis, causal abstraction",
    not: "A complete mechanism unless relevant pathways are accounted for",
  },
  {
    level: "Generalization",
    example: "Holds across formats, tasks, models",
    evidence: "Held-out transformations, tasks, families, checkpoints",
    not: "Universal claims about reasoning",
  },
] as const;

export const pillars = [
  {
    id: "I",
    title: "Representation and computational state",
    question: "What information does the model represent internally, and in what form?",
    directions: ["A", "D", "E"],
    color: "var(--vermillion)",
  },
  {
    id: "II",
    title: "Computation, updating and control",
    question: "How does the model manipulate information and maintain state over time?",
    directions: ["B", "C", "H", "I", "M"],
    color: "var(--cobalt)",
  },
  {
    id: "III",
    title: "Computational failure and recovery",
    question: "Where does computation break, why, and how does the model recover?",
    directions: ["F", "G", "L"],
    color: "var(--teal)",
  },
  {
    id: "IV",
    title: "Generalization and improvement",
    question: "Do mechanisms persist across settings, and can understanding them improve models?",
    directions: ["J", "K", "M"],
    color: "var(--acid)",
  },
] as const;

export const directions = [
  {
    id: "A",
    pillar: "I",
    title: "Representation of computational state and intermediate variables",
    question:
      "What is encoded? Numerical values, carries, remainders; variable/entity binding; local versus global state; relational or graph structure; distributed codes, subspaces, feature geometry.",
    learn: "What computational information is present, and in what basis.",
    priority: 1,
  },
  {
    id: "B",
    pillar: "II",
    title: "State updating, temporal binding and memory dynamics",
    question:
      "How is state transformed when new facts or operations arrive? Incremental updates versus query-time reconstruction; rebinding, overwrites, stale-value competition.",
    learn: "How state is updated and retrieved.",
    priority: 2,
  },
  {
    id: "C",
    pillar: "II",
    title: "Algorithm selection and implementation",
    question:
      "Which procedure is implemented (sequential, parallel, associative, divide-and-conquer, retrieval, heuristic, hybrid)? When does the strategy switch?",
    learn: "Which procedure the model actually runs.",
    priority: 2,
  },
  {
    id: "D",
    pillar: "I",
    title: "Intermediate computation and latent reasoning",
    question:
      "What happens before, between or without explicit reasoning tokens? Latent intermediates; CoT as scaffold versus report; token-to-computation alignment.",
    learn: "What is computed before a step is verbalized.",
    priority: 1,
  },
  {
    id: "E",
    pillar: "I",
    title: "Computational routing, circuits and causal organization",
    question:
      "Which components (heads, MLPs, neurons, residual stream, features, positions) carry which information? Routing, circuit composition, mediation, redundancy.",
    learn: "Which components transmit the relevant information.",
    priority: 2,
  },
  {
    id: "F",
    pillar: "III",
    title: "Error genesis and computational failure",
    question:
      "Where does a correct computation first become wrong? First invalid operation; symptom versus cause; local versus global corruption.",
    learn: "The first point of computational failure.",
    priority: 1,
  },
  {
    id: "G",
    pillar: "III",
    title: "Error persistence, recovery and backtracking",
    question:
      "Why do some errors persist and others get corrected? Detection versus correction; recoverability under resampling; rollback; verification.",
    learn: "Why errors persist or disappear.",
    priority: 1,
  },
  {
    id: "H",
    pillar: "II",
    title: "Constraint and invariant maintenance",
    question:
      "How are rules maintained through a computation? Rule representation; constraint propagation; conflict detection; long-horizon persistence.",
    learn: "How the model preserves rules.",
    priority: 2,
  },
  {
    id: "I",
    pillar: "II",
    title: "Goal, subgoal and control-flow management",
    question:
      "How does a model choose the next operation, mark subgoals complete, verify, continue, backtrack, call tools or stop?",
    learn: "How the model decides what to compute next.",
    priority: 2,
  },
  {
    id: "J",
    pillar: "IV",
    title: "Invariance, compositional generalization and transfer",
    question:
      "Does the same procedure survive renaming, paraphrase, notation changes, structural recombination, greater depth, new domains or new models?",
    learn: "Whether computation is systematic or template-specific.",
    priority: 3,
  },
  {
    id: "K",
    pillar: "IV",
    title: "Training dynamics and emergence",
    question:
      "When do computational mechanisms emerge, change or disappear? Effects of SFT, DPO, RL and distillation; mechanism drift.",
    learn: "How mechanisms form during training.",
    priority: 3,
  },
  {
    id: "L",
    pillar: "III",
    title: "Metacognitive monitoring and computational competence",
    question:
      "Does a model internally estimate correctness, incompleteness, uncertainty or likely failure?",
    learn: "Whether the model knows when its computation is likely wrong.",
    priority: 2,
  },
  {
    id: "M",
    pillar: "II",
    title: "Architectural implications and computational substrate",
    question:
      "Which architectural properties support reliable stateful computation? Attention versus MLP roles; recurrent depth; KV/context memory.",
    learn: "Which architectural properties support stateful computation.",
    priority: 3,
  },
] as const;

export const roadmap = [
  {
    phase: "0",
    title: "Programme foundation",
    goal: "Consolidate the directions; literature, novelty and feasibility per direction.",
    outputs: "Charter, direction matrix, literature and novelty map, roadmap",
  },
  {
    phase: "1",
    title: "Environments, models, tools",
    goal: "Audit benchmarks, models and interpretability tools; estimate natural-error yield.",
    outputs: "Benchmark audit, dataset derivation spec, model compatibility matrix, tooling audit",
  },
  {
    phase: "2",
    title: "Research Direction 1",
    goal: "Build and run the first study's 2 to 10 event pilot as a proof of concept.",
    outputs: "Pipeline, pilot report",
  },
  {
    phase: "3",
    title: "Decide",
    goal: "Scale, narrow, move to circuits, pivot, or start a reliability study.",
    outputs: "Pilot interpretation, decision record, scale-up proposal, advisor deck",
  },
] as const;

export const toolkit = [
  {
    layer: "1. Readout",
    job: "Make candidate internal information readable",
    methods: "Logit lens, tuned lens; J++ Lens, Chain Lens, MicroLens",
    caveat: "Readable does not mean used",
  },
  {
    layer: "2. Representational basis",
    job: "How information is encoded",
    methods: "Neurons, linear probes, ICA, DAS, SAEs",
    caveat: "Compare bases; none is ground truth",
  },
  {
    layer: "3. Causal influence",
    job: "Change activations and measure downstream effects",
    methods: "Activation patching, path patching, EAP, ablation, DAS",
    caveat: "A patch shows sensitivity, not an independent pathway",
  },
  {
    layer: "4. Computational organization",
    job: "Which components and paths are responsible",
    methods: "ACDC, EAP, SAE circuits, transcoders, causal scrubbing",
    caveat: "Only after a reproducible causal effect",
  },
  {
    layer: "5. Improvement",
    job: "Targeted changes that improve reliability",
    methods: "Steering, ablation, mechanistic shaping",
    caveat: "Later programme",
  },
] as const;
