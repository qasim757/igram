import { validateInstagramUrl } from '../server/validation.js';
import { extractWithWeirdDL } from '../server/providers/weirddl.js';

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, failureDetails?: string) {
  if (condition) {
    results.push({ name: testName, passed: true });
    console.log(`  ✓ ${testName}`);
  } else {
    results.push({ name: testName, passed: false, message: failureDetails });
    console.error(`  ✗ ${testName} - ${failureDetails}`);
  }
}

async function runTestSuite() {
  console.log('\n=== Starting iGram Automated Test Suite ===\n');

  // Test 1: URL Validation - Valid Reel URLs
  console.log('[Suite 1: URL Validation & SSRF Protection]');
  const valid1 = validateInstagramUrl('https://www.instagram.com/reel/DUtY_OyjMwq/');
  assert(Boolean(valid1.isValid && valid1.normalizedUrl?.includes('DUtY_OyjMwq')), 'Valid Instagram Reel URL passes validation');

  const valid2 = validateInstagramUrl('https://instagram.com/p/C8P6Jd0M5qA?igsh=MXRkZ3Nyd3Y=');
  assert(Boolean(valid2.isValid && valid2.normalizedUrl && !valid2.normalizedUrl.includes('igsh')), 'Query parameters are safely sanitized from URL');

  const valid3 = validateInstagramUrl('https://instagr.am/reel/DUtY_OyjMwq');
  assert(valid3.isValid, 'Shortened instagr.am domain is supported');

  // Test 2: URL Validation - Invalid URLs & Attack vectors
  const invalidDomain = validateInstagramUrl('https://malicious-instagram.com/reel/123');
  assert(!invalidDomain.isValid, 'Rejects spoofed domain names');

  const ssrfLocalhost = validateInstagramUrl('http://localhost:3000/reel/123');
  assert(!ssrfLocalhost.isValid, 'Rejects localhost SSRF attempt');

  const ssrfIp = validateInstagramUrl('http://192.168.1.1/reel/123');
  assert(!ssrfIp.isValid, 'Rejects private IP range SSRF attempt');

  const unsupportedType = validateInstagramUrl('https://www.instagram.com/stories/username/123456/');
  assert(!unsupportedType.isValid, 'Rejects unsupported Instagram Stories');

  const malformed = validateInstagramUrl('not-a-valid-url');
  assert(!malformed.isValid, 'Rejects arbitrary invalid strings');

  // Test 3: Upstream Provider Live Test
  console.log('\n[Suite 2: Upstream Provider Live Integration]');
  try {
    const verifiedUrl = 'https://www.instagram.com/reel/DUtY_OyjMwq/';
    const extraction = await extractWithWeirdDL(verifiedUrl);

    assert(extraction.success === true, 'WeirdDL extracts valid public Instagram Reel successfully');
    assert(typeof extraction.media?.downloadUrl === 'string' && extraction.media.downloadUrl.length > 10, 'Extracts non-empty download URL');
    assert(extraction.media?.type === 'video', 'Identifies media type as video');
    assert(extraction.media?.provider === 'weirddl', 'Records provider identifier accurately');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    assert(false, 'WeirdDL live test completed without unhandled exceptions', msg);
  }

  // Test 4: Provider error handling on non-existent content
  console.log('\n[Suite 3: Provider Error Handling]');
  try {
    const brokenUrl = 'https://www.instagram.com/reel/INVALID_NONEXISTENT_999999/';
    const brokenExtract = await extractWithWeirdDL(brokenUrl);
    assert(brokenExtract.success === false, 'Gracefully handles invalid or removed Instagram post');
    assert(typeof brokenExtract.error === 'string' && brokenExtract.error.length > 0, 'Returns descriptive human error message');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    assert(false, 'Provider error test handled cleanly', msg);
  }

  // Summary
  console.log('\n=== Test Suite Results ===');
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  console.log(`Passed: ${passedCount}/${totalCount}`);

  if (passedCount === totalCount) {
    console.log('ALL TESTS PASSED SUCCESSFULLY! ✓\n');
  } else {
    console.error(`Failed ${totalCount - passedCount} tests.\n`);
    process.exit(1);
  }
}

runTestSuite().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
