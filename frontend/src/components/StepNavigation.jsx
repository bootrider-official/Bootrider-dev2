// ✅ src/components/StepNavigation.jsx
import React from "react";

const StepNavigation = ({ step, totalSteps, onNext, onBack }) => (
  <div className="flex justify-between mt-5">
    {step > 0 && (
      <button
        onClick={onBack}
        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
      >
        Back
      </button>
    )}
    {step < totalSteps - 1 && (
      <button
        onClick={onNext}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Next
      </button>
    )}
  </div>
);

export default StepNavigation;
