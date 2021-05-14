import fetch from 'node-fetch';
import {alphabet} from './enums';
import {performance} from 'perf_hooks';
import {resolveFormula} from './formula';
import {Job, JobsResponse} from './interfaces';
import {findFormulas, updateCellAtPosition} from './sheet';

getJobData().then((data: JobsResponse) => {
  let results: any[] = [];
  let submissionBody: any = {email: 'povilast@wix.com', results};
  console.log('Executing jobs...');
  const jobExecutionStartTime = performance.now();
  data.jobs.forEach((job) => {
    results.push(doJob(job));
  });
  const jobExecutionEndTime = performance.now();
  console.log(
    'Jobs finished executing in: ',
    Number((jobExecutionEndTime - jobExecutionStartTime).toPrecision(4)),
    'ms.'
  );
  sendSubmission(data.submissionUrl, submissionBody);
});

async function getJobData() {
  const HUB_URL =
    'https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator';
  console.log('Fetching job data...');
  return fetch(`${HUB_URL}/jobs`).then((response: any) => response.json());
}

function sendSubmission(submissionUrl: string, result: any) {
  console.log('Sending submission...');
  const submissionStartTime = performance.now();
  const body = result;
  fetch(submissionUrl, {
    method: 'post',
    body: JSON.stringify(body),
    headers: {'Content-Type': 'application/json'},
  })
    .then((res) => res.json())
    .then((json) => {
      const submissionResponseTime = performance.now();
      console.log(
        'Received response in: ',
        Math.trunc(submissionResponseTime - submissionStartTime),
        'ms.'
      );
      console.log('Submission response: ');
      console.log(json);
    })
    .catch((e) => console.log(e));
}

export function doJob(job: Job) {
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
  return jobResult;
}
