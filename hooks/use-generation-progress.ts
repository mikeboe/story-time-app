import { useEffect, useState } from "react";

const generationSteps = [
  "Initializing...",
  "Crafting characters...",
  "Building world...",
  "Weaving plot threads...",
  "Adding magical touches...",
  "Developing dialogue...",
  "Creating atmosphere...",
  "Polishing details...",
  "Enhancing emotions...",
  "Finalizing adventure...",
  "Reviewing story...",
  "Almost ready...",
];

export const useGenerationProgress = (isGenerating: boolean) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    // Change step every 5 seconds
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % generationSteps.length);
    }, 5000);

    // Random progress updates to simulate unknown duration
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Random increment between 1-8 to create realistic feeling
        const increment = Math.random() * 7 + 1;
        const newProgress = Math.min(prev + increment, 95); // Cap at 95% until done
        return newProgress;
      });
    }, 800 + Math.random() * 1200); // Random interval between 800-2000ms

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isGenerating]);

  // Complete progress when done
  useEffect(() => {
    if (!isGenerating && progress > 0) {
      setProgress(100);
    }
  }, [isGenerating, progress]);

  return {
    currentStep: generationSteps[currentStep],
    progress,
  };
};
