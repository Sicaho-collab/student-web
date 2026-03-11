import { test, expect } from '@playwright/test'

/**
 * Categories C + D: Gig Detail Page and Budget Derivation / Data Parity
 *
 * Clock is frozen to 2026-03-11 so deadline logic and postedAgo are deterministic.
 * gig-003 deadline is 2026-03-12 (future — still open)
 * To test "deadline passed" we freeze to 2026-03-13 in a separate test.
 */

const FROZEN_DATE = '2026-03-11T00:00:00'

test.describe('Gig Detail Page — Data Parity', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date(FROZEN_DATE) })
  })

  // ── Category C: Detail page sections ──

  test('C1 — navigate from card click to detail page', async ({ page }) => {
    await page.goto('/student-web/earn')
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })
    await page.getByRole('article').first().click()
    await expect(page).toHaveURL(/\/student-web\/earn\/gig-001/)
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })
  })

  test('C2 — all sections render for gig-001 (remote, with notes)', async ({ page }) => {
    await page.goto('/student-web/earn/gig-001')
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })

    // Title block
    await expect(page.getByRole('heading', { name: 'Social Media Content Creator' })).toBeVisible()
    await expect(page.getByText('Acme Corp', { exact: true })).toBeVisible()
    await expect(page.getByText(/Posted \d+ days? ago/)).toBeVisible()

    // Description
    await expect(page.getByText('Description')).toBeVisible()
    await expect(page.getByText(/Create engaging social media content/)).toBeVisible()

    // Capabilities
    await expect(page.getByText('Capabilities')).toBeVisible()
    await expect(page.getByText('Communication')).toBeVisible()
    await expect(page.getByText('Creative Thinking')).toBeVisible()

    // Timeline
    await expect(page.getByText('Timeline')).toBeVisible()
    await expect(page.getByText('20/03/2026 (flexible)')).toBeVisible()  // flexibleStart=true
    await expect(page.getByText('10/04/2026')).toBeVisible()  // flexibleEnd=false, no suffix
    await expect(page.getByText('16 business days')).toBeVisible()
    await expect(page.getByText('Schedule Notes')).toBeVisible()
    await expect(page.getByText(/Prefer weekday availability/)).toBeVisible()

    // Pay & Hours
    await expect(page.getByText('Pay & Hours')).toBeVisible()
    await expect(page.getByText('$467.11')).toBeVisible()
    await expect(page.getByText('15 hours')).toBeVisible()
    await expect(page.getByText('Up to 14 hours')).toBeVisible()

    // Location
    await expect(page.getByText('Location')).toBeVisible()
    await expect(page.getByText('Remote')).toBeVisible()

    // Deadline
    await expect(page.getByText('Application Deadline')).toBeVisible()
    await expect(page.getByText('Apply by 17/03/2026')).toBeVisible()

    // Additional Notes
    await expect(page.getByText('Additional Notes')).toBeVisible()
    await expect(page.getByText(/portfolio of previous social media work/)).toBeVisible()

    // Apply button
    await expect(page.getByRole('button', { name: 'Apply Now' })).toBeEnabled()
  })

  test('C3 — flexible start and end dates show (flexible) suffix', async ({ page }) => {
    // gig-004 has flexibleStart=true AND flexibleEnd=true
    await page.goto('/student-web/earn/gig-004')
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })

    await expect(page.getByText('01/04/2026 (flexible)')).toBeVisible()
    await expect(page.getByText('25/04/2026 (flexible)')).toBeVisible()
  })

  test('C4 — duration calculated as business days', async ({ page }) => {
    // gig-001: 2026-03-20 to 2026-04-10 = 16 business days
    await page.goto('/student-web/earn/gig-001')
    await expect(page.getByText('16 business days')).toBeVisible({ timeout: 3000 })
  })

  test('C5 — schedule notes hidden when empty', async ({ page }) => {
    // gig-002 has scheduleNotes = ''
    await page.goto('/student-web/earn/gig-002')
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })

    await expect(page.getByText('Timeline')).toBeVisible()
    await expect(page.getByText('Schedule Notes')).not.toBeVisible()
  })

  test('C6 — location details hidden for remote gigs', async ({ page }) => {
    await page.goto('/student-web/earn/gig-001')
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })

    // Location section should show "Remote" but no "Details" row
    await expect(page.getByText('Remote')).toBeVisible()
    // The KeyValueRow with label "Details" should not be present
    const detailsRow = page.locator('text=Details').filter({ hasText: /^Details$/ })
    await expect(detailsRow).toHaveCount(0)
  })

  test('C7 — location details shown for on-site gigs', async ({ page }) => {
    await page.goto('/student-web/earn/gig-002')
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })

    await expect(page.getByText('On-Site')).toBeVisible()
    await expect(page.getByText('TechStart Inc Office, 42 Innovation Drive, Melbourne VIC 3000')).toBeVisible()
  })

  test('C8 — additional notes hidden when empty', async ({ page }) => {
    // gig-002 has additionalNotes = ''
    await page.goto('/student-web/earn/gig-002')
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })

    await expect(page.getByText('Additional Notes')).not.toBeVisible()
  })

  test('C9 — deadline shows "Apply by" when still open', async ({ page }) => {
    // gig-004 deadline is 2026-03-28, clock is 2026-03-11
    await page.goto('/student-web/earn/gig-004')
    await expect(page.getByText('Apply by 28/03/2026')).toBeVisible({ timeout: 3000 })
  })

  test('C10 — deadline shows "Applications closed" when past', async ({ page }) => {
    // Freeze time AFTER gig-003 deadline of 2026-03-12
    await page.clock.install({ time: new Date('2026-03-13T00:00:00') })
    await page.goto('/student-web/earn/gig-003')
    await expect(page.getByText('Applications closed', { exact: true })).toBeVisible({ timeout: 3000 })
  })

  test('C11 — Apply Now button disabled when deadline passed', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-03-13T00:00:00') })
    await page.goto('/student-web/earn/gig-003')
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })

    await expect(page.getByRole('button', { name: 'Applications Closed' })).toBeDisabled()
  })

  test('C12 — back button navigates to /earn', async ({ page }) => {
    await page.goto('/student-web/earn/gig-001')
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })

    await page.getByRole('button', { name: 'Back to gig listings' }).click()
    await expect(page).toHaveURL(/\/student-web\/earn$/)
  })

  test('C13 — non-existent gig ID shows unavailable message', async ({ page }) => {
    await page.goto('/student-web/earn/gig-999')
    await expect(page.getByText('This gig is no longer available.')).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('button', { name: 'Back to Gigs' })).toBeVisible()
  })

  test('C14 — student payment displayed as formatted currency', async ({ page }) => {
    await page.goto('/student-web/earn/gig-006')
    await expect(page.getByText('$237.80')).toBeVisible({ timeout: 3000 })
  })

  // ── Category D: Budget derivation / data parity math ──

  test('D1 — gig-001 budget $550 derives studentPayment=$467.11 maxHours=14', async ({ page }) => {
    await page.goto('/student-web/earn/gig-001')
    await expect(page.getByText('$467.11')).toBeVisible({ timeout: 3000 })
    await expect(page.getByText('Up to 14 hours')).toBeVisible()
  })

  test('D2 — all mock gigs display correct derived values on cards', async ({ page }) => {
    await page.goto('/student-web/earn')
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })

    // Verify each gig's payment and max hours appear in card listing
    const expectedValues = [
      { payment: '$467.11', hours: 'Up to 14 hrs' },
      { payment: '$390.68', hours: 'Up to 11 hrs' },
      { payment: '$314.24', hours: 'Up to 9 hrs' },
      { payment: '$619.99', hours: 'Up to 18 hrs' },
      { payment: '$543.55', hours: 'Up to 16 hrs' },
      { payment: '$237.80', hours: 'Up to 7 hrs' },
    ]

    for (const { payment, hours } of expectedValues) {
      await expect(page.getByText(payment)).toBeVisible()
      await expect(page.getByText(hours)).toBeVisible()
    }
  })

  test('D3 — gig-002 detail page shows correct derived values', async ({ page }) => {
    // Budget $460: studentPayment=$390.68, maxHours=11, estimatedHours=12
    await page.goto('/student-web/earn/gig-002')
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })

    await expect(page.getByText('$390.68')).toBeVisible()
    await expect(page.getByText('12 hours')).toBeVisible()
    await expect(page.getByText('Up to 11 hours')).toBeVisible()
  })
})
