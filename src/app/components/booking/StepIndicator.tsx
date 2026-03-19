// Step Indicator Component for Multi-step Booking Form

import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: Step[];
}

export function StepIndicator({ currentStep, totalSteps, steps }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-12">
        {/* Background line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
        
        {/* Progress line */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-[#0d6e6e]"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Step circles */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            
            return (
              <div key={step.number} className="flex flex-col items-center">
                {/* Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted || isCurrent ? '#0d6e6e' : '#ffffff'
                  }}
                  transition={{ duration: 0.3 }}
                  className={`
                    relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                    border-2 transition-colors
                    ${isCompleted || isCurrent ? 'border-[#0d6e6e]' : 'border-gray-300'}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="size-5 text-white" />
                  ) : (
                    <span className={`text-sm font-semibold ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                      {step.number}
                    </span>
                  )}
                </motion.div>

                {/* Label - Desktop only */}
                <div className="hidden md:block mt-3 text-center max-w-[120px]">
                  <p className={`text-sm font-medium ${isCurrent ? 'text-[#0d6e6e]' : 'text-gray-600'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>

                {/* Label - Mobile (current step only) */}
                <div className="md:hidden mt-3 text-center">
                  {isCurrent && (
                    <p className="text-sm font-medium text-[#0d6e6e]">
                      {step.title}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current step text - Mobile */}
      <div className="md:hidden text-center mb-6">
        <p className="text-sm text-gray-600">
          Langkah {currentStep} dari {totalSteps}
        </p>
      </div>
    </div>
  );
}
