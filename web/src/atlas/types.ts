/** Model Atlas shared types — visualization + research data are separate. */

export type ProvenanceClass =
  | "model_metadata"
  | "measured"
  | "derived"
  | "demonstration";

export type EvidenceClass =
  | "observed_activation"
  | "statistical_association"
  | "attribution"
  | "intervention"
  | "validated_causal"
  | "demonstration";

export type Provenance = {
  class: ProvenanceClass;
  source: string;
  method?: string;
  note?: string;
  checkedAt?: string;
};

export type ModelArchitecture = {
  id: string;
  name: string;
  checkpoint: string;
  architectureType: string;
  parameterCountLabel: string;
  numLayers: number;
  hiddenSize: number;
  intermediateSize: number;
  numAttentionHeads: number;
  numKeyValueHeads: number;
  headDim: number;
  vocabSize: number;
  maxPositionEmbeddings: number;
  hiddenAct: string;
  rmsNormEps: number;
  ropeTheta: number;
  tieWordEmbeddings: boolean;
  interpretabilityArtifacts: string[];
  supportedViews: string[];
  provenance: Provenance;
  status: "verified_config" | "candidate" | "unavailable";
};

export type ComponentKind =
  | "embedding"
  | "block"
  | "attn"
  | "attn_q"
  | "attn_k"
  | "attn_v"
  | "attn_o"
  | "attn_head"
  | "mlp"
  | "mlp_up"
  | "mlp_gate"
  | "mlp_down"
  | "norm"
  | "residual"
  | "lm_head"
  | "neuron"
  | "feature"
  | "token"
  | "variable";

export type AtlasSelection = {
  kind: ComponentKind | "circuit" | "experiment" | "model";
  id: string;
  layer?: number;
  label: string;
};

export type NeuronRecord = {
  id: string;
  layer: number;
  component: "mlp" | "attn";
  index: number;
  activationDemo: number;
  topTokensDemo: { token: string; score: number }[];
  saeFeatureId?: string;
  explanation?: string;
  explanationStatus: "none" | "auto_unvalidated" | "human_validated";
  provenance: Provenance;
};

export type CircuitNode = {
  id: string;
  label: string;
  kind: ComponentKind;
  layer?: number;
  x: number;
  y: number;
};

export type CircuitEdge = {
  id: string;
  source: string;
  target: string;
  weight: number;
  evidence: EvidenceClass;
  method: string;
  note: string;
  provenance: Provenance;
};

export type CircuitRecord = {
  id: string;
  title: string;
  status: "candidate_pathway" | "exploratory" | "validated";
  summary: string;
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  provenance: Provenance;
};

export type ExperimentStep = {
  id: string;
  label: string;
  layerHint?: number;
  note: string;
};

export type ExperimentRecord = {
  id: string;
  title: string;
  prompt: string;
  answer: string;
  mode: "demonstration";
  trace: string[];
  tokens: string[];
  steps: ExperimentStep[];
  conditions: {
    id: string;
    label: string;
    outcome: string;
    note: string;
  }[];
  provenance: Provenance;
};

export type AtlasView = "architecture" | "circuit" | "experiment";
