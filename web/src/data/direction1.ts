export const oneLiner =
  "After the model itself writes a wrong intermediate value, what does the next dependent step actually use?";

export const paper1Behaviours = [
  "Using the wrong written value",
  "Recomputing the needed value from the original inputs",
  "Detecting a discrepancy and correcting it",
  "Combining written-value and source information",
] as const;

export const researchQuestions = [
  {
    id: "RQ1",
    role: "Primary mechanism",
    q: "For natural wrong values, how sensitive is the next dependent step to changing W, S and P?",
  },
  {
    id: "RQ2",
    role: "Mode moderator",
    q: "Do these dependencies differ between thinking-on and thinking-off runs of the same weights, controlling error class and evidence?",
  },
  {
    id: "RQ3",
    role: "Bridge test",
    q: "Do replay-level dependencies predict free-running propagation or recovery, beyond a behavioural baseline?",
  },
  {
    id: "RQ0",
    role: "Separate validation",
    q: "Does thinking-mode stability persist when earlier thinking remains visible?",
  },
  {
    id: "RQ4",
    role: "Exploratory",
    q: "Does correctness information causally modulate use of W?",
  },
] as const;

export const interventions = [
  {
    id: "W",
    name: "Written value",
    short: "Edit the written intermediate value in the trace",
    detail:
      "Change the model-generated wrong value that appears in the chain-of-thought, then measure how the next dependent step responds.",
    color: "var(--vermillion)",
  },
  {
    id: "S",
    name: "Source facts",
    short: "Edit the original source information",
    detail:
      "Edit source facts in the prompt only, or in both the prompt and the trace, to test whether later computation rebuilds from sources.",
    color: "var(--cobalt)",
  },
  {
    id: "P",
    name: "Pre-write state",
    short: "Clamp or transplant internal state before writing",
    detail:
      "Intervene on activations formed before the value is written, testing whether internal state—not just the written token—drives the next step.",
    color: "var(--teal)",
  },
] as const;

export const competingExplanations = [
  {
    name: "Incremental state maintenance",
    claim: "Model maintains an updated latent state",
    prediction: "Later computation depends on pre-write/internal state (D_P)",
  },
  {
    name: "Query-time reconstruction",
    claim: "Needed state is rebuilt from context when required",
    prediction: "Source information keeps causal influence (D_S)",
  },
  {
    name: "Copying written values",
    claim: "Later step reads the most recent written value",
    prediction: "D_W large",
  },
  {
    name: "Independent recomputation",
    claim: "Value re-derived from original inputs",
    prediction: "Output tracks f(v*) under source edits with W fixed",
  },
  {
    name: "Faulty-procedure recomputation",
    claim: "Same wrong procedure re-applied to the source",
    prediction: "Output tracks f(p(S*)) rather than f(v*)",
  },
  {
    name: "Routing / selection failure",
    claim: "Correct value present but wrong one selected",
    prediction: "Effects change under routing interventions; decodability ≠ use",
  },
  {
    name: "Correctness-sensitive verification",
    claim: "Value's correctness gates its use",
    prediction: "Dependence on W differs with correctness (exploratory, RQ4)",
  },
] as const;

export const gapPoints = [
  {
    title: "Causal use of incorrect intermediate values",
    body: "Kudo et al.'s key comparison is on correct runs. Wrong values remain under-characterized.",
  },
  {
    title: "Whether correctness gates use",
    body: "Correctness is decodable (Yuan et al.), but its causal effect on downstream use of a written value is not established.",
  },
  {
    title: "Copying versus recomputation after an error",
    body: "Copying and reconstruction were shown in different settings, not on model-generated wrong values.",
  },
  {
    title: "Detection versus functional recovery",
    body: "An error signal is not evidence the model uses it to correct course.",
  },
  {
    title: "Thinking-mode resilience",
    body: "Sinha et al.'s stability result is confounded by stripped history. Supporting question only.",
  },
] as const;

export const contribution = {
  proposed:
    "A causal profile of how later reasoning depends on a model's own naturally generated incorrect intermediate values, through the written value, source information, or internal state formed before writing — and a test of whether that profile predicts which errors propagate or are corrected during free-running reasoning.",
  hierarchy: [
    {
      tier: "Primary",
      text: "Causal dependence profile on natural errors plus the replay-to-free-running predictive test.",
    },
    {
      tier: "Methodological",
      text: "W/S/P intervention design with explicit validation and controls.",
    },
    {
      tier: "Secondary",
      text: "Same-weights thinking comparison; retained-versus-stripped history; slip versus systematic errors.",
    },
    {
      tier: "Infrastructure",
      text: "Generators, alignment, intervention tooling, cost estimation — not a scientific contribution.",
    },
  ],
} as const;

export const phaseMap = [
  {
    phase: "0",
    title: "Programme foundation",
    goal: "Establish the RC territory before committing Paper 1 resources",
    outputs: "Updated programme document, direction matrix, literature and novelty map",
    who: "You + Claude project",
  },
  {
    phase: "1",
    title: "Benchmark, dataset, model and tooling",
    goal: "Decide what environments, models and tools can support the research",
    outputs: "Benchmark audit, dataset derivation spec, model compatibility matrix, tooling audit",
    who: "Claude audits, Cursor tests, you decide",
  },
  {
    phase: "2",
    title: "Build and pilot Direction 1",
    goal: "Build the pipeline; run the 2 to 10 event pilot",
    outputs: "Pipeline, event schema, pilot report",
    who: "Cursor code, you review, Claude PR/results",
  },
  {
    phase: "3",
    title: "Decide what the research becomes",
    goal: "Choose the next scientific investment from the pilot evidence",
    outputs: "Pilot interpretation, decision record, scale-up proposal, advisor deck",
    who: "You + Claude project",
  },
] as const;

export const testPlan = [
  {
    title: "Data",
    body: "Controlled multi-step tasks with exact solvers, derived from established benchmarks after an audit. Explicit intermediate values and dependency graphs.",
  },
  {
    title: "Model",
    body: "One open-weight checkpoint for the pilot (candidate: Qwen3-8B), with same-weights thinking-on/off comparisons later.",
  },
  {
    title: "Events",
    body: "The model's own naturally generated wrong intermediate values, kept in full with every exclusion logged.",
  },
  {
    title: "Two measurements",
    body: "Teacher-forced replay (next-step response under fixed context) and free-running continuation (what the model actually does next).",
  },
  {
    title: "Prediction test",
    body: "Do W/S/P dependence measures predict propagation or recovery beyond a behavioural baseline?",
  },
  {
    title: "First milestone",
    body: "A 2 to 10 event pilot that validates the pipeline and looks for an early scientific signal against pre-written expectations.",
  },
] as const;

export const groundRules = [
  "Order of work: programme → benchmark → tool → model → direction selection → design freeze → GPU pilot → advisor review.",
  "Allowed now: repository, docs, audits, small CPU compatibility tests.",
  "Needs PI authorization: any GPU time; choice of dataset source, primary model or intervention framework.",
  "Nothing in Phases 0–2 is a result. The pilot cannot establish generality or statistical significance.",
  "Every phase ends with a written decision in docs/experiment_decisions.md.",
  "Methodology is versioned, not edited in place.",
] as const;
