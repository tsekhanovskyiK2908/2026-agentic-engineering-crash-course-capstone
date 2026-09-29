// Decides whether a test run counts as valid TDD "red" evidence: the tests must run, and at least one
// must fail on an assertion (or on a not-implemented stub). A compile error, an empty run, or an
// infrastructure or fixture failure (missing tool or script, package restore, Docker stopped) is the
// wrong reason to be red.
const COMPILE_ERRORS = [/\berror CS\d{4}\b/, /\berror TS\d{4,5}\b/, /\[ERROR\] TS\d{4,5}\b/];
const NO_TESTS = [/No test is available/i, /No test files found/i, /\bTotal tests?: 0\b/i];
const INFRASTRUCTURE = [
  /is not recognized as an internal or external command/i,
  /command not found/i,
  /Missing script/i,
  /\berror NU\d{4}\b/,
  /DockerUnavailableException|Docker is either not running|Cannot connect to the Docker daemon/i,
  /(Class|Collection|Assembly) fixture type .* threw/i,
  /did not have matching fixture data/i,
];
const FAILING_TESTS = [
  /\bFailed:\s+[1-9]\d*/, // dotnet test
  /\bTests\s+[1-9]\d* failed\b/, // Vitest
  /ℹ fail [1-9]\d*/, // node:test
];
const ASSERTION_OR_STUB = [
  /\bAssert\.\w+\(\) Failure/, // xUnit
  /\bXunit\.Sdk\.\w+Exception/,
  /\bAssertionError\b/, // Vitest / Chai / node:assert
  /\bexpected .+ to /i,
  /NotImplementedException|not implemented/i,
];

export function classifyRedRun({ exitCode, output }) {
  const reject = (reason) => ({ ok: false, reason });
  if (exitCode === 0) return reject('Tests passed; a red run must fail. Write the checks before the code.');
  if (COMPILE_ERRORS.some((re) => re.test(output))) {
    return reject('Compile error; add the minimal stubs so the tests compile and fail on assertions.');
  }
  if (NO_TESTS.some((re) => re.test(output))) return reject('No tests ran; check the test filter or test discovery.');
  if (INFRASTRUCTURE.some((re) => re.test(output))) {
    return reject('Infrastructure or fixture failure (tool, script, packages, Docker); fix the environment and rerun.');
  }
  if (!FAILING_TESTS.some((re) => re.test(output))) {
    return reject('No failing test detected; the run probably failed for an infrastructure reason.');
  }
  if (!ASSERTION_OR_STUB.some((re) => re.test(output))) {
    return reject('Tests failed, but not on an assertion or a not-implemented stub; check the failure reason.');
  }
  return { ok: true, reason: 'Tests ran and failed on assertions.' };
}
