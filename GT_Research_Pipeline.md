# Research Paper Development Protocol

**PI:** Adya Srivastava  
**Date:** 20 November 2026  
**Status:** Standard operating procedure for every paper in the research programme  
**Companion files:** `RC_Research_Programme.md`, `RC_Research_Direction_1_Implementation.md`

---

Writing a research paper should follow a structured protocol. You should not begin by opening a document and writing the Introduction. You should first establish what you are investigating, why it matters, what is already known, what is missing, what you intend to demonstrate, and how you will establish that your conclusions are valid.

Think of research-paper development as a sequence of gates. Each stage should produce a concrete artifact that you verify before moving to the next.

---

## The research lifecycle

**10 stages · From an initial idea to submission**

| Stage | Goal | Output |
|---|---|---|
| 1. Research problem identification | Identify the problem, its scope, importance and the precise question you want to answer | Problem statement |
| 2. Literature review and prior work | Identify existing research, established findings, competing explanations, limitations and unresolved questions | Literature review matrix |
| 3. Research gap identification | Establish exactly what existing research does not explain, measure, establish or resolve | Research gap statement |
| 4. Research questions and hypotheses | Formulate specific, falsifiable research questions and hypotheses. Define what evidence would support or contradict them | RQs and hypotheses |
| 5. Research contribution and novelty | Identify what is genuinely new about your work and why it advances the field | Contribution statement |
| 6. Methodology and experimental design | Determine datasets, models, variables, baselines, evaluation metrics, experimental conditions and statistical tests | Research protocol |
| 7. Execution and experimentation | Run experiments, collect evidence, maintain logs, perform ablations and test alternative explanations | Experimental results |
| 8. Analysis and interpretation | Analyse findings, quantify uncertainty, identify failure cases and distinguish observations from interpretations | Results and findings |
| 9. Paper drafting | Construct the argument and write the paper using the evidence already established | Complete manuscript |
| 10. Validation, review and submission | Verify reproducibility, citations, claims, limitations, formatting and alignment with the target venue | Submission-ready paper |

---

## What exactly should you identify at each stage?

This is the more important part. Here is the checklist to use as a research protocol.

### Phase 1: Establish the research foundation

Before reading hundreds of papers or writing anything, answer:

| Question | What you need to establish |
|---|---|
| What is the problem? | Precise problem definition |
| Why does it matter? | Scientific or practical significance |
| Who has studied it? | Existing research landscape |
| What is already established? | Current state of knowledge |
| What remains unknown? | Unresolved questions |
| What is the research gap? | Specific missing knowledge |
| What are we investigating? | Research question |
| What would success look like? | Evidence needed to answer it |

**Important:** A research gap is not simply an area that hasn't received enough attention. It must be a meaningful unresolved problem.

### Phase 2: Literature review

This is where you establish your understanding of the field.

You should identify:

- **Foundational papers** – work that established the field or problem.
- **State-of-the-art papers** – the strongest contemporary approaches.
- **Methodological papers** – techniques and experimental frameworks.
- **Contradictory findings** – papers that disagree with each other.
- **Limitations** – weaknesses acknowledged by existing authors.
- **Open problems** – questions explicitly left unresolved.
- **Recent developments** – new methods or findings that change the research landscape.

Create a literature matrix:

| Paper | Problem | Method | Findings | Limitations | Relevance |
|---|---|---|---|---|---|
| Paper A | What it studies | Approach | Results | Weaknesses | Why it matters |
| Paper B | What it studies | Approach | Results | Weaknesses | Why it matters |

Do not just summarise papers. You need to synthesise them.

For example:

- Paper A establishes X.
- Paper B challenges the assumption underlying X.
- Paper C proposes a different methodology.
- However, none of these investigate Y under condition Z.

That final observation might lead to your research gap.

### Phase 3: Research question, hypothesis and contribution

These three things must be clearly distinguished.

| Element | Meaning |
|---|---|
| Research question | What are we trying to understand? |
| Hypothesis | What do we expect to find, and why? |
| Contribution | What new knowledge will the paper provide? |

For every research question, establish:

- Is it specific?
- Is it answerable?
- Is it scientifically meaningful?
- Can it be tested with available evidence?
- What alternative explanations exist?

A good paper should have a small number of tightly connected research questions rather than numerous loosely connected ones.

### Phase 4: Methodology and experimental design

This is arguably the most consequential phase for empirical ML research.

Before running experiments, identify:

| Component | Questions to resolve |
|---|---|
| Dataset | What data will we use? Where does it come from? |
| Sampling | How are examples selected? |
| Models | Which models are being evaluated? |
| Baselines | What are we comparing against? |
| Variables | What are the independent and dependent variables? |
| Controls | What factors must remain constant? |
| Metrics | How will performance be measured? |
| Ablations | Which components need to be isolated? |
| Statistical tests | How will we establish significance and uncertainty? |
| Reproducibility | Can another researcher replicate this? |

You should also define:

- Inclusion and exclusion criteria.
- Experimental conditions.
- Random seeds and number of runs.
- Data contamination controls.
- Failure-case analysis.
- Expected limitations.
- Criteria for accepting or rejecting hypotheses.

**A critical rule:** Design experiments that could prove your hypothesis wrong, not just experiments that could confirm it.

### Phase 5: Execute and analyse

Once the protocol is established, execute it.

Maintain three separate records:

1. **Experiment log** – what was run, under which conditions, and when.
2. **Results repository** – raw outputs, processed results, figures and tables.
3. **Research decisions** – changes to methodology, unexpected observations and reasons for deviations.

Then analyse:

- Primary results.
- Secondary results.
- Statistical uncertainty.
- Baseline comparisons.
- Ablation results.
- Robustness.
- Failure cases.
- Unexpected findings.

Do not confuse a statistically significant result with a scientifically important result.

### Phase 6: Writing the actual paper

Only now should you begin drafting the manuscript.

A conventional empirical research paper follows this structure:

#### Standard research paper structure

1. **Title**  
   Precisely communicate the subject and central contribution.

2. **Abstract**
   - Problem
   - Research gap
   - Proposed approach
   - Key results
   - Main contribution

3. **Introduction**
   - Background and motivation
   - Problem definition
   - Research gap
   - Research questions
   - Contributions
   - Paper organisation

4. **Related Work**
   - Existing research
   - Relevant approaches
   - Comparison of findings
   - Limitations of prior work
   - Positioning of your research

5. **Methodology**
   - Research design
   - Data and experimental setup
   - Models and methods
   - Metrics
   - Evaluation protocol

6. **Results**
   - Main experimental findings
   - Tables and figures
   - Statistical analysis
   - Ablations

7. **Discussion**
   - Interpretation of results
   - Implications
   - Comparison with prior work
   - Unexpected findings
   - Alternative explanations

8. **Limitations**
   - Methodological limitations
   - Generalisability
   - Data limitations
   - Remaining uncertainties

9. **Conclusion and Future Work**
   - What was established?
   - What did we learn?
   - What remains unresolved?

10. **References and supplementary material**  
    Citations, appendices, implementation details, additional experiments and reproducibility material.

**One important distinction:** the paper's writing order need not be its final presentation order. Draft Methodology and Results first, then Related Work and Introduction, and finally Abstract and Conclusion.

### Phase 7: Quality assurance and research integrity

Before submission, conduct a separate review.

| Review dimension | Verification |
|---|---|
| Novelty | Is the contribution genuinely new? |
| Literature | Have relevant competing papers been covered? |
| Claims | Is every major claim supported by evidence? |
| Methodology | Can the experiments be reproduced? |
| Statistics | Are uncertainty and significance appropriately handled? |
| Robustness | Have alternative explanations been investigated? |
| Limitations | Are limitations honestly acknowledged? |
| Citations | Are sources accurate and properly attributed? |
| Figures | Are plots readable and accurately labelled? |
| Writing | Is the argument coherent and logically structured? |
| Venue | Does the paper meet the conference/journal requirements? |

---

## Recommendation: use a research-gate system

Rather than treating this as a writing checklist, treat it as a series of approvals.

### Research readiness gates

| Gate | Name | Check |
|---|---|---|
| Gate 1 | Problem validation | Can we clearly explain what problem we are solving and why it matters? |
| Gate 2 | Literature validation | Can we demonstrate what is already known and what remains unknown? |
| Gate 3 | Novelty validation | Can we articulate a defensible, specific contribution? |
| Gate 4 | Methodology validation | Can our experimental design actually answer the research questions? |
| Gate 5 | Evidence validation | Do our experiments support our conclusions? |
| Gate 6 | Manuscript validation | Can an independent researcher understand, assess and reproduce the work? |

You should not move to the next gate until the previous one has been reviewed and approved.

---

## Implementation for our research programme

Given that we're working on research involving LLM reasoning, behavioural evaluation, mechanistic interpretability and related questions, introduce an additional layer: a **Research Design Document (RDD)**.

This document should exist before the paper manuscript.

It should contain:

- Research motivation and context.
- Problem definition.
- Literature landscape.
- Research gap.
- Research questions.
- Hypotheses and theoretical rationale.
- Expected contributions.
- Conceptual framework.
- Experimental methodology.
- Dataset and model selection.
- Baselines and evaluation metrics.
- Statistical analysis plan.
- Ablation and robustness plan.
- Expected results and possible negative results.
- Limitations and threats to validity.
- Reproducibility plan.
- Target publication venues.
- Execution milestones.

This prevents a common research failure: conducting a large number of experiments, discovering interesting observations, and then trying to retrofit a research question and novelty claim around the results.

**The principle:** establish the scientific question first, design the evidence-generation process second, and write the paper third.

Use this as the standard operating procedure for every paper in the research programme, with a separate RDD for each paper. That way, the document can be handed to Claude or another researcher so they can independently understand, critique and execute the same research direction.
