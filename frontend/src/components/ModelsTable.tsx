import { type Model } from "../services/soclaas";

interface ModelRowProps {
  model: Model;
}

// Sub-cent prices are common, so allow a third decimal place before rounding
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

const ModelRow = ({ model }: ModelRowProps) => {

  const formatPrice = (microdollars: number): string => {
    return priceFormatter.format(microdollars / Math.pow(10, 6));
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
      <td>{model.soclaas.capabilities.join(", ")}</td>
      <td className="num">{formatContextWindow(getModelContextWindow(model))}</td>
      <td className="num">{formatPrice(model.soclaas.input_microdollars_per_million_tokens)}</td>
      <td className="num">{formatPrice(model.soclaas.output_microdollars_per_million_tokens)}</td>
      <td>{formatModelAlias(model)}</td>
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
            <th>Model</th>
            <th>Capabilities</th>
            <th className="num">Context</th>
            <th className="num">Input / 1M</th>
            <th className="num">Output / 1M</th>
            <th>Alias of</th>
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
