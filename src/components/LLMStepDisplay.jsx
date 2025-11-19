import { memo } from 'react';
import './ConversationStyles.css';

// Map step types to user-friendly labels and icons
const STEP_TYPE_CONFIG = {
  'generation': {
    icon: '💭',
    label: 'Thinking',
    description: 'Claude is processing your request...'
  },
  'sql_query': {
    icon: '🔍',
    label: 'Querying Database',
    description: 'Fetching data...'
  },
  'sql_result': {
    icon: '📊',
    label: 'Analyzing Results',
    description: 'Processing query results...'
  },
  'tool_use': {
    icon: '🔧',
    label: 'Using Tool',
    description: 'Executing action...'
  },
  'final_response': {
    icon: '💬',
    label: 'Responding',
    description: 'Preparing response...'
  },
  'default': {
    icon: '⚙️',
    label: 'Processing',
    description: 'Working...'
  }
};

const getStepConfig = (stepType) => {
  return STEP_TYPE_CONFIG[stepType] || STEP_TYPE_CONFIG['default'];
};

// Individual step display
const StepItem = memo(({ step, isLatest }) => {
  const config = getStepConfig(step.stepType);
  
  return (
    <div className={`llm-step ${isLatest ? 'latest' : ''}`}>
      <div className="step-header">
        <span className="step-icon">{config.icon}</span>
        <span className="step-label">{config.label}</span>
        <span className="step-time">
          {new Date(step.createdAt).toLocaleTimeString()}
        </span>
      </div>
      {step.output && (
        <div className="step-output">
          {step.output}
        </div>
      )}
    </div>
  );
});

StepItem.displayName = 'StepItem';

// Main LLM steps display component
const LLMStepDisplay = memo(({ steps, isProcessing }) => {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="llm-steps-container">
      <div className="steps-header">
        {isProcessing && (
          <div className="processing-indicator">
            <div className="spinner"></div>
            <span>Processing...</span>
          </div>
        )}
      </div>
      <div className="steps-list">
        {steps.map((step, index) => (
          <StepItem
            key={step.stepId}
            step={step}
            isLatest={index === steps.length - 1 && isProcessing}
          />
        ))}
      </div>
    </div>
  );
});

LLMStepDisplay.displayName = 'LLMStepDisplay';

export default LLMStepDisplay;

