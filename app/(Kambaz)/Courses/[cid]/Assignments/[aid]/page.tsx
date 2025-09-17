'use client';

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name">Assignment Name</label>
      <br />
      <input id="wd-name" defaultValue="A1 - ENV + HTML" /><br /><br />
      
      <textarea id="wd-description" 
          cols={40} 
          rows={8} 
          defaultValue="The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page." />
      <br />
      
      <table>
        <tbody>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-points">Points</label>
            </td>
            <td>
              <input id="wd-points" defaultValue={100} />
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-group">Assignment Group</label>
            </td>
            <td>
              <select id="wd-group">
                <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                <option value="QUIZZES">QUIZZES</option>
                <option value="EXAMS">EXAMS</option>
                <option value="PROJECT">PROJECT</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-display-grade-as">Display Grade as</label>
            </td>
            <td>
              <select id="wd-display-grade-as">
                <option value="Percentage">Percentage</option>
                <option value="Points">Points</option>
                <option value="Letter Grade">Letter Grade</option>
              </select>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              <label htmlFor="wd-submission-type">Submission Type</label>
            </td>
            <td>
              <select id="wd-submission-type" onChange={(e) => {
                const onlineOptions = document.getElementById('wd-online-options');
                if (onlineOptions) {
                  onlineOptions.style.display = e.target.value === 'Online' ? 'block' : 'none';
                }
              }}>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="On Paper">On Paper</option>
              </select>
              <br />
              <br />
              <div id="wd-online-options">
                Online Entry Options
                <br />
                <input type="checkbox" id="wd-text-entry" />
                <label htmlFor="wd-text-entry">Text Entry</label><br />
                <input type="checkbox" id="wd-website-url" />
                <label htmlFor="wd-website-url">Website URL</label><br />
                <input type="checkbox" id="wd-media-recordings" />
                <label htmlFor="wd-media-recordings">Media Recordings</label><br />
                <input type="checkbox" id="wd-student-annotation" />
                <label htmlFor="wd-student-annotation">Student Annotation</label><br />
                <input type="checkbox" id="wd-file-upload" />
                <label htmlFor="wd-file-upload">File Uploads</label>
              </div>
            </td>
          </tr>
          <tr>
            <td align="right" valign="top">
              Assign
            </td>
            <td>
              <div>
                <label htmlFor="wd-assign-to">Assign to</label><br />
                <input id="wd-assign-to" defaultValue="Everyone" /><br /><br />
                
                <label htmlFor="wd-due-date">Due</label><br />
                <input type="date" id="wd-due-date" defaultValue="2024-05-13" /><br /><br />
                
                <label htmlFor="wd-available-from">Available from</label>
                <label htmlFor="wd-available-until" style={{ marginLeft: '20px' }}>Until</label><br />
                <input type="date" id="wd-available-from" defaultValue="2024-05-06" />
                <input type="date" id="wd-available-until" defaultValue="2024-05-20" style={{ marginLeft: '5px' }} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <div style={{ textAlign: "right" }}>
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </div>
  );
}
