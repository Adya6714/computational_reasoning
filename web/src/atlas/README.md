# Model Atlas

Interactive research instrument for exploring language-model internals on the Computational Reasoning site.

Route: `/atlas`  
Live (Pages): `https://adya6714.github.io/computational_reasoning/atlas/`

## What is real vs demonstration

| Data | Status |
|---|---|
| Qwen3-8B layer / head / MLP / vocab dimensions | **Verified** from [Hugging Face `config.json`](https://huggingface.co/Qwen/Qwen3-8B/raw/main/config.json) (checked 2026-11-20) |
| Qwen3-4B, Qwen3-14B, Gemma-2-2B, OLMo | **Candidates only** — no verified Atlas config yet |
| Neuron records, SAE labels, top tokens | **Demonstration** (`neurons.demo.ts`) |
| Circuit graphs and edge weights | **Demonstration / exploratory** (`circuits.demo.ts`) |
| `17 + 28` experiment timeline | **Demonstration** (`experiments.demo.ts`) |

Never display demo artifacts as measured findings.

## Architecture

```
src/atlas/
  types.ts                 # shared schema + provenance / evidence enums
  store.ts                 # zustand UI state
  data/
    models.ts              # verified + candidate model metadata
    neurons.demo.ts
    circuits.demo.ts
    experiments.demo.ts
  components/
    AtlasShell.tsx         # layout chrome
    ModelScene.tsx         # R3F 3D architecture
    CircuitGraph.tsx       # SVG directed graph
    ExperimentExplorer.tsx
    LeftSidebar.tsx
    RightPanel.tsx
    BottomPanel.tsx
  atlas.css
  README.md
```

Frontend is decoupled from any single interpretability library. Future adapters should export JSON matching the types in `types.ts`.

## Views

1. **Architecture** — 3D stack (embeddings → 36 blocks → LM head). Click to select, double-click to enter a block (attention heads + MLP sketch).
2. **Circuits** — directed graph with evidence-class edge styling.
3. **Experiments** — token / trace / condition / layer timeline for a toy arithmetic task.

## Adding another model

1. Fetch the exact checkpoint `config.json`.
2. Add a `ModelArchitecture` row in `data/models.ts` with `status: "verified_config"` and provenance pointing at the config URL + date.
3. Leave interpretability artifact lists empty until real files are ingested.

## Ingesting interpretability artifacts (pipeline sketch)

Recommended offline flow (not shipped in-browser):

1. Python job loads a checkpoint via TransformerLens / nnsight / HF.
2. Export JSON artifacts:
   - `activations/{run_id}.json`
   - `features/{sae_id}.json`
   - `circuits/{circuit_id}.json`
   - `experiments/{exp_id}.json`
3. Each file includes `provenance.class` ∈ `{model_metadata, measured, derived, demonstration}` and `evidence` on edges.
4. Place under `public/atlas-data/` (or fetch from object storage) and wire a thin loader — do not bake tensors into the JS bundle.

Compatible tool roles (integration targets, not bundled):

- Readout: Logit / Tuned / J++ lenses  
- Features: SAELens, probes, ICA, DAS  
- Causal: activation / path patching, pyvene, ablation  
- Circuits: Neuronpedia exports, EAP, ACDC, causal scrubbing  

Verify model×tool compatibility before claiming support in the UI.

## Performance notes

- Whole-model view aggregates blocks; heads render only inside an entered block (capped display for clarity).
- Neuron list is a sparse demo subset — never attempt to instance millions of units in WebGL.
- Circuit edges filter by evidence class.

## Local development

```bash
cd web
npm install
npm run dev
# open /atlas
```

Static export for GitHub Pages:

```bash
npm run build   # writes out/ + .nojekyll
```
