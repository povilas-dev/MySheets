import fetch from 'node-fetch';
import {alphabet} from './enums';
import {resolveFormula} from './formula';
import {Job, JobsResponse} from './interfaces';
import {findFormulas, updateCellAtPosition} from './sheet';
const HUB_URL =
  'https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator';
let submissionUrl = '';
let jobs = [];
async function getJobData() {
  return fetch(`${HUB_URL}/jobs`).then((response: any) => response.json());
}

function sendSubmission(result: any) {
  // add body
  const body = result;
  fetch(submissionUrl, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
}

export function doJob(job: Job) {
  if (job.id === 'job-12') {
    console.log('job: ', job.id);
    console.log(JSON.stringify(job.data, null, 4));
  }
  const sheet = job.data;
  const jobFormulas = findFormulas(job.data);
  jobFormulas.forEach((jobFormula) => {
    const formulaCell = jobFormula.formulaCell;
    const resolved = resolveFormula(formulaCell.formula, sheet);
    updateCellAtPosition(
      `${alphabet[jobFormula.cellPosition.column]}${
        jobFormula.cellPosition.row + 1
      }`,
      resolved,
      sheet
    );
  });
  const jobResult = {id: job.id, data: sheet};
  if (job.id === 'job-12') {
    console.log('job: ', job.id);
    console.log(JSON.stringify(jobResult, null, 4));
  }
  // console.log(jobResult);
  return jobResult;
}
const setSubmissionUrl = (url: string) => (submissionUrl = url);
const setJobs = (newJobs: Job[]) => (jobs = newJobs);
getJobData().then((data: JobsResponse) => {
  setSubmissionUrl(data.submissionUrl);
  setJobs(data.jobs);
  console.log(submissionUrl);
  let results: any[] = [];
  let submissionBody: any = {email: 'povilast@wix.com', results};
  data.jobs.forEach((job) => {
    // console.log('Job sheet: ');
    // console.log(JSON.stringify(sheet, null, 4));
    results.push(doJob(job));
  });
  // console.log('SUBMISSION BODY');
  // console.log(JSON.stringify(submissionBody, null, 4));

  sendSubmission(submissionBody);

  // data.jobs.map((job: Job) => {
  //   console.log(JSON.stringify(job, null, 4));
  // });

  console.log('subUrl: ', submissionUrl);
});
