interface ErrorStateProps {
  onRetry: () => void;
}

// Purely presentational: the retry itself lives in App, so there is one
// code path for the initial load and for retrying
const ErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <div className="error" role="alert">
      <p>Couldn't load models.</p>
      <button onClick={onRetry}>Try again</button>
    </div>
  );
};

export default ErrorState;
