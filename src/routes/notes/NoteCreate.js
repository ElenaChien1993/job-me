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
    status: '未申請',
    tags: [],
    product: '',
    job_link: '',
    resume_link: '',
    salary: {
      range: '',
      type: '',
    },
    responsibilities: [],
    requirements: [{ is_qualified: false, description: '' }],
    bonus: [{ is_qualified: false, description: '' }],
    questions: [],
    attached_files: [{ file_name: '', file_link: '' }],
    more_notes: [],
    other: '',
  });

  const {
    company_name,
    address,
    is_share,
    tags,
    status,
    job_title,
    ...noteDetails
  } = values;

  const {
    product,
    job_link,
    resume_link,
    salary,
    responsibilities,
    requirements,
    bonus,
    questions,
    attached_files,
    more_notes,
    other,
    ...noteDataBrief
  } = values;

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

  return (
    <>
      {(() => {
        switch (step) {
          case 1:
            return (
              <NoteCreateBrief
                nextStep={nextStep}
                handleChange={handleChange}
                noteDataBrief={noteDataBrief}
                noteDetails={noteDetails}
                values={values}
                setValues={setValues}
              />
            );
          case 2:
            return (
              <DetailsStep1
                nextStep={nextStep}
                prevStep={prevStep}
                handleChange={handleChange}
                values={values}
                setValues={setValues}
              />
            );
          case 3:
            return (
              <DetailsStep2
                nextStep={nextStep}
                prevStep={prevStep}
                handleChange={handleChange}
                values={values}
                setValues={setValues}
              />
            );
          case 4:
            return (
              <DetailsStep3
                prevStep={prevStep}
                handleChange={handleChange}
                values={values}
                noteDataBrief={noteDataBrief}
                noteDetails={noteDetails}
                setValues={setValues}
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
