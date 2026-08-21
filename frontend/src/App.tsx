import { useState, useEffect } from 'react'
import { getModelsList, type Model } from './services/soclaas'
import ModelTable from './components/ModelsTable';

function App() {
  const [models, setModels] = useState<Model[]>([]);
  // hide those models with aliases by default
  const [showAliases, setShowAliases] = useState(false);

  useEffect(() => {
    getModelsList()
      .then(modelsList => setModels(modelsList));
  }, []);

  return (
    <>
      <h1>SoCLaaS Models</h1>
      <p>
        SoCLaaS provides {models.length} available models (only the non-aliased ones are shown by default).
      </p>
      
      {/* Lightweight component to toggle showing hidden models */}
      <label>
        <input
          type="checkbox"
          checked={showAliases}
          onChange={(event) => setShowAliases(event.target.checked)}
        />
        Show aliases
      </label>

      <ModelTable models={models} showAliases={showAliases}/>
    </>
  );
}

export default App;
