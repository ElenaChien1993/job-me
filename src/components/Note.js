import { Link } from "react-router-dom";

const Note = ({ note }) => {
  return (
    <>
      <ul>
        <li>公司名稱：{note.company_name}</li>
        <li>職稱：{note.job_title}</li>
        <button><Link to={`/notes/details/${note.note_id}`}>看細節</Link></button>
        <button><Link to="/practice/setting">選我練習</Link></button>
      </ul>
    </>
  )
}

export default Note;