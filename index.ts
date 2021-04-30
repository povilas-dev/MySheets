import fetch from 'node-fetch';
// import {ColumnPosition} from './enums';
import {resolveFormula} from './formula';
import {Job, JobsResponse} from './interfaces';
import {findFormulas} from './sheet';
const HUB_URL =
  'https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator';
let submissionUrl = '';
let jobs = [];
async function getJobData() {
  return fetch(`${HUB_URL}/jobs`).then((response: any) => response.json());
  // .then((data: JobsResponse) => {
  //   console.log(data);
  //   // data.jobs.map((job: Job) => console.log(job.data));
  // });
}

function sendSubmission(jobResults: Job[]) {
  // add body
  const body = {};
  fetch(submissionUrl, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
}

export function doJobs(jobs: Job[]) {
  jobs.forEach((job) => {});
}
const setSubmissionUrl = (url: string) => (submissionUrl = url);
const setJobs = (newJobs: Job[]) => (jobs = newJobs);
getJobData().then((data: JobsResponse) => {
  setSubmissionUrl(data.submissionUrl);
  setJobs(data.jobs);
  console.log(submissionUrl);

  data.jobs.forEach((job) => {
    console.log('job: ', job.id);
    const sheet = job.data;
    console.log('Job sheet: ');
    console.log(JSON.stringify(sheet, null, 4));
    // console.log(findFormulas(job.data));
    // const jobFormulas = findFormulas(job.data);
    // jobFormulas.forEach((formulaCell) => {
    //   console.log('Incoming formulaCell: ', formulaCell);
    //   const resolved = resolveFormula(formulaCell.formula, sheet);
    //   console.log('Resolved Cell: ', resolved);
    // });
  });

  // data.jobs.map((job: Job) => {
  //   console.log(JSON.stringify(job, null, 4));
  // });

  console.log('subUrl: ', submissionUrl);
});
