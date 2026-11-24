export const validitySources = [
  {
    id: "propagate",
    label: "Propagation",
    title: "Tracing Error Propagation in Reasoning Language Models",
    cite: "Nguyen, Pham & Nguyen · EMNLP 2026 main",
    href: "https://aclanthology.org/2026.emnlp-main.1559/",
    check: "Abstract read 22 Nov 2026",
    body: "Step-level errors are locally predictable from a short window of neighbouring steps. Trace-level failure often comes from a persistent error that started earlier, not from an isolated slip. Recoverable and unrecoverable traces are separated by counterfactual resampling. Unrecoverable traces leave final-step representations that separate from recoverable ones, and the persistent error can be decoded there. The signal propagates and accumulates.",
    bears:
      "This is the representational half of Direction 1. A mistake can be readable. Readability is not yet a test of whether the next step uses it.",
  },
  {
    id: "aging",
    label: "Step depth",
    title: "When Does Reasoning Age?",
    cite: "Firke & Kannan · EMNLP 2026 main",
    href: "https://aclanthology.org/2026.emnlp-main.1976/",
    check: "Abstract read 22 Nov 2026",
    body: "Survival analysis of 18,969 chains, five benchmarks, seven models from 3B to 70B, under greedy decoding. The conditional probability of a reasoning error rises with step depth. The Weibull shape satisfies ρ > 1 in 34 of 35 dataset–model cells. The abstract reports that this holds after an informative-censoring adjustment and after a shared-frailty check for problem-level heterogeneity. Raw error rates hide the pattern. The conditional hazard shows it.",
    bears:
      "A 3-step toy chain can illustrate a direction. It is the wrong place to claim the phenomenon. The hazard is a function of depth.",
  },
  {
    id: "amplify",
    label: "Amplification",
    title: "Cascading Failure Amplification in Multi-Step LLM Reasoning",
    cite: "Bansal, Agarwal & Gangwani · ICML 2026 FAGEN workshop",
    href: "https://openreview.net/forum?id=5XoSAYPGMT",
    check: "Workshop listing checked. PDF not retrieved (OpenReview 403)",
    body: "Title and authors are confirmed from the workshop listing. The figures are not. A public author summary, matching the validity note, reports that a prior error raises the chance of a later error by about 3–8× across GPT-4o-mini, Llama-3.1-8B and Qwen-2.5-72B, that roughly half of post-error steps introduce a new mistake in some evaluations, and that cross-verification helped more than step-level self-checking in the tested settings. Those figures stay out of any claim until the PDF is read.",
    bears:
      "What is safe to carry now: an earlier mistake changes the error rate of what follows, and the diagnostic has to be at the level of the trace.",
  },
  {
    id: "decorative",
    label: "Decorative CoT",
    title: "When AI Shows Its Work, Is It Actually Working?",
    cite: "Basu & Chakraborty · arXiv:2603.22816 v1",
    href: "https://arxiv.org/html/2603.22816v1",
    check: "Abstract and opening read 22 Nov 2026",
    body: "Step-level ablation on ten frontier models, including GPT-5.4, Claude Opus 4.6-R, DeepSeek-V3.2, MiniMax-M2.5 and Kimi-K2.5, across sentiment, mathematics, topic classification and medical QA. For most of those models, removing any individual written step changes the answer less than 17% of the time, and a single step is often enough to recover the answer. On mathematics, smaller models (0.8–8B) show genuine step dependence (55% necessity). Faithfulness is specific to the model and the task.",
    bears:
      "A written trace can be accurate and still not be the computation. That is the distinction Paper 1 draws between the written value and what the next step uses.",
  },
  {
    id: "agents",
    label: "Agents",
    title: "Why cascading agent failures pass benchmarks",
    cite: "Doughty · Prefactor blog, 21 Nov 2026",
    href: "https://prefactor.tech/blog/cascading-failures-step-level-evaluation-gap",
    check: "Blog, not a paper. Figures not used",
    body: "A benchmark that scores only the final output misses silent propagation. An early wrong step is accepted downstream and becomes load-bearing. The post says leading agents still complete only a minority of realistic multi-step tasks under production-like conditions, and that faults often enter early and are not acted on when later evidence contradicts them.",
    bears:
      "Treat this as a statement of the production gap, not as a measured result. It is the same reason the programme wants solvers and explicit intermediate states.",
  },
] as const;

export const validityImproved = {
  title: "What has improved",
  body: "Scaling, reasoning-specific training, and longer internal deliberation have raised accuracy and removed some brittle short-chain failures. Reasoning models are better placed to re-derive a step than models that only answer. Internal signals do carry information about step correctness in the cases these papers report: neighbouring-step windows and final-step representations, and correctness probes that predict without causing. That is the signal this programme is built to test.",
} as const;

export const validityUnsolved = {
  title: "What has not been solved",
  body: "Quiet intermediate errors that read as confident. Propagation that spoils the final answer. Written traces that are not load-bearing. The cost of checking only from the outside. The 2026 work still treats these as open. Probes, process-level checks and step-level evaluation stop where this programme starts: whether the represented error is the one the computation uses.",
} as const;

export const validityScaling = {
  title: "Scaling laws",
  body: "A pretraining scaling law says average loss falls as a power of parameters, data and compute. It does not say whether the next step uses the value that was just written. Test-time scaling buys more steps. On models from 3B to 70B, the conditional chance of an error rises with that depth. On mathematics, written steps are less necessary in frontier models than in small ones. Scale can lift the final answer while the trace becomes a worse description of the computation.",
} as const;

export const validityOpenModels = {
  title: "Open models are the real problem",
  body: "The model a lab can deploy, fine-tune and then change is open-weight. A closed API only accepts an external checker, which this programme has set aside. An open model exposes its activations and can take a different training run or architecture. That is the practical gain: not another point on the loss curve, a model whose intermediate computation can be made reliable because someone is allowed to open it. Knowing which state is represented, which wrong value the next step uses, and which component carries it is what a training change, a mechanism edit or an architectural constraint can aim at.",
} as const;

export const validityBottom =
  "Frontier models have not retired the problem. Scaling will keep raising accuracy, and it leaves the computation inside the step undescribed. The place that description can change a deployed model is the open-weight model. Find the error in the state, test which errors propagate, then use that to train, edit or redesign the model that can be opened.";
