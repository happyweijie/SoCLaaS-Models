import { useState, useEffect } from 'react'
import { getModelsList, type Model } from './services/soclaas'
import ModelTable from './components/ModelsTable';

function App() {
  const [models, setModels] = useState<Model[]>([]);
  // hide those models that are aliases of other models by default
  const [showAliases, setShowAliases] = useState(false);

  useEffect(() => {
    getModelsList()
      .then(modelsList => setModels(modelsList));
  }, []);

  return (
    <>
      <h1>SoCLaaS Models</h1>
      <p>
        SoCLaaS provides {models.length} available models. Models that are aliases of another model are hidden by default.
      </p>
      
      {/* Lightweight component to toggle showing hidden models */}
      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={showAliases}
            onChange={(event) => setShowAliases(event.target.checked)}
          />
          Show alias models
        </label>
      </div>

      <ModelTable models={models} showAliases={showAliases}/>
    </>
  );
}

export default App;
