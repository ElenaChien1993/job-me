import { useState } from 'react';

import NoteCreateBrief from './NoteCreateBrief';
import DetailsStep1 from './DetailsStep1';
import DetailsStep2 from './DetailsStep2';
import DetailsStep3 from './DetailsStep3';

const NoteCreate = () => {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    company_name: '',
    job_title: '',
    is_share: true,
    address: '',
    status: '',
    tags: [],
    product: '',
    job_link: '',
    resume_link: '',
    salary: {
      range: '',
      type: '',
    },
    responsibilities: [],
    requirements: [],
    bonus: [],
    questions: [],
    attached_files: [],
    more_notes: [],
    other: '',
  });

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleChange = input => e => {
    setValues(prev => {
      return { ...prev, [input]: e.target.value };
    });
  };

  console.log(values)

  return (
    <>
      {(() => {
        switch (step) {
          case 1:
            return (
              <NoteCreateBrief
                nextStep={nextStep}
                handleChange={handleChange}
                values={values}
              />
            );
          case 2:
            return (
              <DetailsStep1
                nextStep={nextStep}
                prevStep={prevStep}
                handleChange={handleChange}
                values={values}
              />
            );
          case 3:
            return (
              <DetailsStep2
                nextStep={nextStep}
                prevStep={prevStep}
                handleChange={handleChange}
                values={values}
              />
            );
          case 4:
            return (
              <DetailsStep3
                prevStep={prevStep}
                handleChange={handleChange}
                values={values}
              />
            );
          default:
            console.log('This is a multi-step form built with React.');
        }
      })()}
    </>
  );
};

export default NoteCreate;
