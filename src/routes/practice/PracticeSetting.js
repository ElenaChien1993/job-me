import { useOutletContext } from 'react-router-dom';

// 目前想法可能還是會在這邊再 query 一次 details
const PracticeSetting = () => {
  const [notes] = useOutletContext();
  console.log(notes);

  return <h1>PracticeSetting</h1>
}

export default PracticeSetting;