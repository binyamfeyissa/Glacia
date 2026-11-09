import * as React from "react";

export interface QuestionnaireProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep?: number;
  totalSteps?: number;
  onNext?: () => void;
  onPrev?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
}

export const Questionnaire = React.forwardRef<HTMLDivElement, QuestionnaireProps>(
  (
    {
      currentStep = 1,
      totalSteps = 3,
      onNext,
      onPrev,
      canPrev = false,
      canNext = true,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const percent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

    return (
      <div
        ref={ref}
        className={`gl-questionnaire gl-glass ${className}`}
        {...props}
      >
        <div className="gl-questionnaire-header">
          <div className="gl-questionnaire-progress-info">
            <span className="gl-questionnaire-step-label">Step {currentStep} of {totalSteps}</span>
            <span className="gl-questionnaire-percent">{percent}%</span>
          </div>
          <div className="gl-questionnaire-progress-bar">
            <div
              className="gl-questionnaire-progress-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div className="gl-questionnaire-body">{children}</div>

        <div className="gl-questionnaire-footer">
          {canPrev ? (
            <button
              type="button"
              onClick={onPrev}
              className="gl-questionnaire-btn gl-questionnaire-btn-back gl-glass"
            >
              Back
            </button>
          ) : <div />}
          {canNext && (
            <button
              type="button"
              onClick={onNext}
              className="gl-questionnaire-btn gl-questionnaire-btn-next"
            >
              {currentStep === totalSteps ? "Finish" : "Continue"}
            </button>
          )}
        </div>
      </div>
    );
  }
);
Questionnaire.displayName = "Questionnaire";

export interface QuestionnaireStepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export const QuestionnaireStep = React.forwardRef<HTMLDivElement, QuestionnaireStepProps>(
  ({ title, description, className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`gl-questionnaire-step ${className}`} {...props}>
        <h3 className="gl-questionnaire-title">{title}</h3>
        {description && <p className="gl-questionnaire-desc">{description}</p>}
        <div className="gl-questionnaire-options">{children}</div>
      </div>
    );
  }
);
QuestionnaireStep.displayName = "QuestionnaireStep";

export interface QuestionnaireOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export const QuestionnaireOption = React.forwardRef<HTMLDivElement, QuestionnaireOptionProps>(
  ({ selected = false, label, description, icon, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="radio"
        aria-checked={selected}
        tabIndex={0}
        className={`gl-questionnaire-option gl-glass ${selected ? "gl-selected" : ""} ${className}`}
        {...props}
      >
        {icon && <div className="gl-questionnaire-option-icon">{icon}</div>}
        <div className="gl-questionnaire-option-content">
          <span className="gl-questionnaire-option-label">{label}</span>
          {description && (
            <span className="gl-questionnaire-option-desc">{description}</span>
          )}
        </div>
        <div className={`gl-questionnaire-option-radio ${selected ? "gl-active" : ""}`}>
          {selected && <span className="gl-radio-check-dot" />}
        </div>
      </div>
    );
  }
);
QuestionnaireOption.displayName = "QuestionnaireOption";
