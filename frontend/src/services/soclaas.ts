import axios from "axios";

// Empty default keeps requests same-origin: the Vite dev proxy handles it
// locally, and on Vercel the API is served from the same deployment.
const BASE = import.meta.env.VITE_API_BASE ?? "";

export interface Model {
  id: string;
  context_length: number;
  context_window: number;
  max_context_length: number;
  max_model_len: number;
  soclaas: {
    capabilities: string[];
    description: string;
    input_microdollars_per_million_tokens: number;
    output_microdollars_per_million_tokens: number;
    audio_microdollars_per_minute: number;
    alias_of?: string;
  };
}

interface ModelsResponse {
  object: "list";
  data: Model[];
}

export const getModelsList = async (): Promise<Model[]> => {
  const response = await axios.get<ModelsResponse>(
    `${BASE}/api/models`
  );

  return response.data // ModelsResponse
    .data; // Model[]
};
