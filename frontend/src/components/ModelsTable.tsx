import { type Model } from "../services/soclaas";

interface ModelRowProps {
  model: Model;
}

const ModelRow = ({ model }: ModelRowProps) => {

  const microdollarsToDollars = (amt: number): number => {
    return amt / Math.pow(10, 6);
  };

  const formatModelAlias = (model: Model): string => {
    if (!model.soclaas.alias_of) return "-";

    return model.soclaas.alias_of
  }

  const getModelContextWindow = (model: Model): number | null => {
    return [
      model.context_window,
      model.context_length,
      model.max_context_length,
      model.max_model_len,
    ].find((value) => typeof value === "number" && value > 0) ?? null;
  }

  const formatContextWindow = (tokens: number | null): string  => {
    if (!tokens) return "-";

    return `${Math.round(tokens / 1024)}K`;
  };

  return (
    <tr>
      <td>{model.id}</td>
      <td>{formatModelAlias(model)}</td>
      <td>{model.soclaas.capabilities.join(", ")}</td>
      <td>{formatContextWindow(getModelContextWindow(model))}</td>
      <td>${microdollarsToDollars(model.soclaas.input_microdollars_per_million_tokens)}</td>
      <td>${microdollarsToDollars(model.soclaas.output_microdollars_per_million_tokens)}</td>
    </tr>
  );
};

interface ModelsTableProps {
  models: Model[];
  showAliases: boolean;
}

const ModelTable = ({ models, showAliases }: ModelsTableProps) => {
  // Hide models which are aliases of other models if needed
  const modelsToShow = models
    .filter(model => showAliases || !model.soclaas.alias_of)

  return (
    <>
      <table>
        <thead>
          <tr>
            <td>Model</td>
            <td>Alias of</td>
            <td>Capabilities</td>
            <td>Context</td>
            <td>Input / 1M</td>
            <td>Output / 1M</td>
          </tr>
        </thead>
        
        <tbody>
          {modelsToShow.map(model => (
              <ModelRow key={model.id} model={model} />
            )
          )}
        </tbody>
      </table>
    </>
  );
};

export default ModelTable;
