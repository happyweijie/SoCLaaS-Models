import { useState, useEffect, useCallback } from 'react'
import { getModelsList, type Model } from './services/soclaas'
import ModelTable from './components/ModelsTable';
import ErrorState from './components/ErrorState';

// One union rather than separate isLoading/hasError flags, so the states
// cannot contradict each other
type Status = "loading" | "ready" | "error";

function App() {
  const [models, setModels] = useState<Model[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  // hide those models that are aliases of other models by default
  const [showAliases, setShowAliases] = useState(false);

  // Shared by the initial load and the retry button. Deliberately does not set
  // "loading" itself: status already starts there, and setting state
  // synchronously inside the mount effect below would cascade a second render
  const loadModels = useCallback(() => {
    getModelsList()
      .then(modelsList => {
        setModels(modelsList);
        setStatus("ready");
      })
      .catch(error => {
        console.error(error);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  // Retrying comes from an error state, so it has to reset the status itself
  const handleRetry = () => {
    setStatus("loading");
    loadModels();
  };

  return (
    <>
      <h1>SoCLaaS Models</h1>

      {/* On error the message below carries the explanation instead, and while
          loading the count would read a misleading "0" */}
      {status === "loading" && <p>Loading available models…</p>}
      {status === "ready" && (
        <p>
          SoCLaaS provides {models.length} available models. Models that are aliases of another model are hidden by default.
        </p>
      )}

      {/* Lightweight component to toggle showing hidden models */}
      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={showAliases}
            // Nothing to filter until the models arrive
            disabled={status !== "ready"}
            onChange={(event) => setShowAliases(event.target.checked)}
          />
          Show alias models
        </label>
      </div>

      {status === "error"
        ? <ErrorState onRetry={handleRetry} />
        : <ModelTable
            models={models}
            showAliases={showAliases}
            isLoading={status === "loading"}
          />}
    </>
  );
}

export default App;
