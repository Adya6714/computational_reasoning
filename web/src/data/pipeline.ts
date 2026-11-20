export const lifecycleStages = [
  {
    id: 1,
    title: "Research problem identification",
    goal: "Identify the problem, its scope, importance and the precise question you want to answer.",
    output: "Problem statement",
    color: "var(--vermillion)",
  },
  {
    id: 2,
    title: "Literature review and prior work",
    goal: "Identify existing research, established findings, competing explanations, limitations and unresolved questions.",
    output: "Literature review matrix",
    color: "var(--cobalt)",
  },
  {
    id: 3,
    title: "Research gap identification",
    goal: "Establish exactly what existing research does not explain, measure, establish or resolve.",
    output: "Research gap statement",
    color: "var(--teal)",
  },
  {
    id: 4,
    title: "Research questions and hypotheses",
    goal: "Formulate specific, falsifiable research questions and hypotheses. Define what evidence would support or contradict them.",
    output: "RQs and hypotheses",
    color: "var(--acid)",
  },
  {
    id: 5,
    title: "Research contribution and novelty",
    goal: "Identify what is genuinely new about your work and why it advances the field.",
    output: "Contribution statement",
    color: "var(--vermillion)",
  },
  {
    id: 6,
    title: "Methodology and experimental design",
    goal: "Determine datasets, models, variables, baselines, evaluation metrics, experimental conditions and statistical tests.",
    output: "Research protocol",
    color: "var(--cobalt)",
  },
  {
    id: 7,
    title: "Execution and experimentation",
    goal: "Run experiments, collect evidence, maintain logs, perform ablations and test alternative explanations.",
    output: "Experimental results",
    color: "var(--teal)",
  },
  {
    id: 8,
    title: "Analysis and interpretation",
    goal: "Analyse findings, quantify uncertainty, identify failure cases and distinguish observations from interpretations.",
    output: "Results and findings",
    color: "var(--acid)",
  },
  {
    id: 9,
    title: "Paper drafting",
    goal: "Construct the argument and write the paper using the evidence already established.",
    output: "Complete manuscript",
    color: "var(--vermillion)",
  },
  {
    id: 10,
    title: "Validation, review and submission",
    goal: "Verify reproducibility, citations, claims, limitations, formatting and alignment with the target venue.",
    output: "Submission-ready paper",
    color: "var(--cobalt)",
  },
] as const;

export const foundationQuestions = [
  { q: "What is the problem?", a: "Precise problem definition" },
  { q: "Why does it matter?", a: "Scientific or practical significance" },
  { q: "Who has studied it?", a: "Existing research landscape" },
  { q: "What is already established?", a: "Current state of knowledge" },
  { q: "What remains unknown?", a: "Unresolved questions" },
  { q: "What is the research gap?", a: "Specific missing knowledge" },
  { q: "What are we investigating?", a: "Research question" },
  { q: "What would success look like?", a: "Evidence needed to answer it" },
] as const;

export const literatureTypes = [
  { label: "Foundational", desc: "Work that established the field or problem." },
  { label: "State-of-the-art", desc: "The strongest contemporary approaches." },
  { label: "Methodological", desc: "Techniques and experimental frameworks." },
  { label: "Contradictory", desc: "Papers that disagree with each other." },
  { label: "Limitations", desc: "Weaknesses acknowledged by existing authors." },
  { label: "Open problems", desc: "Questions explicitly left unresolved." },
  { label: "Recent developments", desc: "New methods that change the landscape." },
] as const;

export const methodComponents = [
  { name: "Dataset", q: "What data will we use? Where does it come from?" },
  { name: "Sampling", q: "How are examples selected?" },
  { name: "Models", q: "Which models are being evaluated?" },
  { name: "Baselines", q: "What are we comparing against?" },
  { name: "Variables", q: "What are the independent and dependent variables?" },
  { name: "Controls", q: "What factors must remain constant?" },
  { name: "Metrics", q: "How will performance be measured?" },
  { name: "Ablations", q: "Which components need to be isolated?" },
  { name: "Statistical tests", q: "How will we establish significance and uncertainty?" },
  { name: "Reproducibility", q: "Can another researcher replicate this?" },
] as const;

export const paperStructure = [
  {
    section: "Title",
    points: ["Precisely communicate the subject and central contribution."],
  },
  {
    section: "Abstract",
    points: ["Problem", "Research gap", "Proposed approach", "Key results", "Main contribution"],
  },
  {
    section: "Introduction",
    points: [
      "Background and motivation",
      "Problem definition",
      "Research gap",
      "Research questions",
      "Contributions",
      "Paper organisation",
    ],
  },
  {
    section: "Related Work",
    points: [
      "Existing research",
      "Relevant approaches",
      "Comparison of findings",
      "Limitations of prior work",
      "Positioning of your research",
    ],
  },
  {
    section: "Methodology",
    points: [
      "Research design",
      "Data and experimental setup",
      "Models and methods",
      "Metrics",
      "Evaluation protocol",
    ],
  },
  {
    section: "Results",
    points: ["Main experimental findings", "Tables and figures", "Statistical analysis", "Ablations"],
  },
  {
    section: "Discussion",
    points: [
      "Interpretation of results",
      "Implications",
      "Comparison with prior work",
      "Unexpected findings",
      "Alternative explanations",
    ],
  },
  {
    section: "Limitations",
    points: [
      "Methodological limitations",
      "Generalisability",
      "Data limitations",
      "Remaining uncertainties",
    ],
  },
  {
    section: "Conclusion and Future Work",
    points: ["What was established?", "What did we learn?", "What remains unresolved?"],
  },
  {
    section: "References & supplementary",
    points: [
      "Citations",
      "Appendices",
      "Implementation details",
      "Additional experiments",
      "Reproducibility material",
    ],
  },
] as const;

export const qaChecklist = [
  { dim: "Novelty", check: "Is the contribution genuinely new?" },
  { dim: "Literature", check: "Have relevant competing papers been covered?" },
  { dim: "Claims", check: "Is every major claim supported by evidence?" },
  { dim: "Methodology", check: "Can the experiments be reproduced?" },
  { dim: "Statistics", check: "Are uncertainty and significance appropriately handled?" },
  { dim: "Robustness", check: "Have alternative explanations been investigated?" },
  { dim: "Limitations", check: "Are limitations honestly acknowledged?" },
  { dim: "Citations", check: "Are sources accurate and properly attributed?" },
  { dim: "Figures", check: "Are plots readable and accurately labelled?" },
  { dim: "Writing", check: "Is the argument coherent and logically structured?" },
  { dim: "Venue", check: "Does the paper meet the conference/journal requirements?" },
] as const;

export const readinessGates = [
  {
    id: 1,
    name: "Problem validation",
    check: "Can we clearly explain what problem we are solving and why it matters?",
  },
  {
    id: 2,
    name: "Literature validation",
    check: "Can we demonstrate what is already known and what remains unknown?",
  },
  {
    id: 3,
    name: "Novelty validation",
    check: "Can we articulate a defensible, specific contribution?",
  },
  {
    id: 4,
    name: "Methodology validation",
    check: "Can our experimental design actually answer the research questions?",
  },
  {
    id: 5,
    name: "Evidence validation",
    check: "Do our experiments support our conclusions?",
  },
  {
    id: 6,
    name: "Manuscript validation",
    check: "Can an independent researcher understand, assess and reproduce the work?",
  },
] as const;

export const rddItems = [
  "Research motivation and context",
  "Problem definition",
  "Literature landscape",
  "Research gap",
  "Research questions",
  "Hypotheses and theoretical rationale",
  "Expected contributions",
  "Conceptual framework",
  "Experimental methodology",
  "Dataset and model selection",
  "Baselines and evaluation metrics",
  "Statistical analysis plan",
  "Ablation and robustness plan",
  "Expected results and possible negative results",
  "Limitations and threats to validity",
  "Reproducibility plan",
  "Target publication venues",
  "Execution milestones",
] as const;
