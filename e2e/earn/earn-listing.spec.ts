import { test, expect } from '@playwright/test'

/**
 * Categories A + B: Earn Listing Page and Filtering/Sorting
 *
 * Clock is frozen to 2026-03-11 so postedAgo values are deterministic.
 * Mock data has 6 gigs: 3 remote, 2 on-site, 1 hybrid.
 */

const FROZEN_DATE = '2026-03-11T00:00:00'

test.describe('Earn Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date(FROZEN_DATE) })
    await page.goto('/student-web/earn')
  })

  // ── Category A: Listing page ──

  test('A1 — shows loading skeletons then gig cards', async ({ page }) => {
    // Skeletons appear via animate-pulse divs
    await expect(page.locator('.animate-pulse').first()).toBeVisible()

    // After loading, gig cards appear (6 total)
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('article')).toHaveCount(6)
  })

  test('A2 — displays correct gig count text', async ({ page }) => {
    await expect(page.getByText('6 gigs available')).toBeVisible({ timeout: 3000 })
  })

  test('A3 — GigCard shows all required fields for gig-001', async ({ page }) => {
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })

    // Default sort is "newest" so gig-001 (postedAt 2026-03-08) is first
    const firstCard = page.getByRole('article').first()

    // Title
    await expect(firstCard.getByText('Social Media Content Creator')).toBeVisible()
    // Employer name
    await expect(firstCard.getByText('Acme Corp', { exact: true })).toBeVisible()
    // Posted ago — 3 days from 2026-03-08 to 2026-03-11
    await expect(firstCard.getByText(/Posted \d+d ago/)).toBeVisible()
    // Description snippet (truncated, just check start)
    await expect(firstCard.getByText(/Create engaging social media content/)).toBeVisible()
    // Capability chips (2 caps, both under max 3)
    await expect(firstCard.getByText('Communication')).toBeVisible()
    await expect(firstCard.getByText('Creative Thinking')).toBeVisible()
    // Location badge
    await expect(firstCard.getByText('Remote')).toBeVisible()
    // Payment
    await expect(firstCard.getByText('$467.11')).toBeVisible()
    // Max hours
    await expect(firstCard.getByText('Up to 14 hrs')).toBeVisible()
    // Date range
    await expect(firstCard.getByText(/20\/03\/2026/)).toBeVisible()
    await expect(firstCard.getByText(/10\/04\/2026/)).toBeVisible()
    // Flexible label (gig-001 has flexibleStart=true)
    await expect(firstCard.getByText('Flexible')).toBeVisible()
    // Deadline short date
    await expect(firstCard.getByText('Apply by 17/03')).toBeVisible()
  })

  test('A4 — page heading and subtitle visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Alumable' })).toBeVisible()
    await expect(page.getByText('Find your next gig')).toBeVisible()
  })

  test('A5 — card click navigates to detail page', async ({ page }) => {
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })
    await page.getByRole('article').first().click()
    await expect(page).toHaveURL(/\/student-web\/earn\/gig-001/)
  })

  // ── Category B: Filtering and Sorting ──

  test('B1 — Remote filter shows only remote gigs', async ({ page }) => {
    await expect(page.getByText('6 gigs available')).toBeVisible({ timeout: 3000 })

    // Click Remote filter chip
    await page.getByRole('option', { name: 'Remote' }).click()

    // Remote gigs: gig-001, gig-004, gig-006 = 3
    await expect(page.getByText('3 gigs available')).toBeVisible()
    await expect(page.getByRole('article')).toHaveCount(3)

    // Verify only remote gigs are shown
    await expect(page.getByText('Social Media Content Creator')).toBeVisible()
    await expect(page.getByText('Research Literature Review')).toBeVisible()
    await expect(page.getByText('Business Plan Review')).toBeVisible()
  })

  test('B2 — On-Site filter shows only on-site gigs', async ({ page }) => {
    await expect(page.getByText('6 gigs available')).toBeVisible({ timeout: 3000 })

    await page.getByRole('option', { name: 'On-Site' }).click()

    // On-site gigs: gig-002, gig-003 = 2
    await expect(page.getByText('2 gigs available')).toBeVisible()
    await expect(page.getByRole('article')).toHaveCount(2)
  })

  test('B3 — Hybrid filter shows only hybrid gigs', async ({ page }) => {
    await expect(page.getByText('6 gigs available')).toBeVisible({ timeout: 3000 })

    await page.getByRole('option', { name: 'Hybrid' }).click()

    // Hybrid gigs: gig-005 = 1
    await expect(page.getByText('1 gig available')).toBeVisible()
    await expect(page.getByRole('article')).toHaveCount(1)
    await expect(page.getByText('Website Redesign Assistant')).toBeVisible()
  })

  test('B4 — toggle location filter off re-shows all gigs', async ({ page }) => {
    await expect(page.getByText('6 gigs available')).toBeVisible({ timeout: 3000 })

    const remoteChip = page.getByRole('option', { name: 'Remote' })
    await remoteChip.click()
    await expect(page.getByText('3 gigs available')).toBeVisible()

    // Click again to deselect
    await remoteChip.click()
    await expect(page.getByText('6 gigs available')).toBeVisible()
  })

  test('B5 — single capability filter narrows results', async ({ page }) => {
    await expect(page.getByText('6 gigs available')).toBeVisible({ timeout: 3000 })

    // Click "Communication" capability filter
    await page.getByRole('option', { name: 'Communication' }).click()

    // Gigs with Communication: gig-001, gig-004, gig-006 = 3
    await expect(page.getByText('3 gigs available')).toBeVisible()
  })

  test('B6 — multiple capability filters use AND logic', async ({ page }) => {
    await expect(page.getByText('6 gigs available')).toBeVisible({ timeout: 3000 })

    // Select Communication AND Creative Thinking
    await page.getByRole('option', { name: 'Communication' }).click()
    await page.getByRole('option', { name: 'Creative Thinking' }).click()

    // Only gig-001 has BOTH
    await expect(page.getByText('1 gig available')).toBeVisible()
    await expect(page.getByText('Social Media Content Creator')).toBeVisible()
  })

  test('B7 — sort by Newest orders by postedAt descending', async ({ page }) => {
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })

    // Default sort is "newest" — verify first card is gig-001 (postedAt 2026-03-08, newest)
    const firstCard = page.getByRole('article').first()
    await expect(firstCard.getByText('Social Media Content Creator')).toBeVisible()
  })

  test('B8 — sort by Highest Pay orders by studentPayment descending', async ({ page }) => {
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })

    await page.getByLabel('Sort gigs').selectOption('highest-pay')

    // Highest pay: gig-004 ($619.99) should be first
    const firstCard = page.getByRole('article').first()
    await expect(firstCard.getByText('Research Literature Review')).toBeVisible()
    await expect(firstCard.getByText('$619.99')).toBeVisible()
  })

  test('B9 — sort by Deadline (Soonest) orders by applicationDeadline ascending', async ({ page }) => {
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })

    await page.getByLabel('Sort gigs').selectOption('deadline')

    // Earliest deadline: gig-003 (2026-03-12) should be first
    const firstCard = page.getByRole('article').first()
    await expect(firstCard.getByText('Event Setup Coordinator')).toBeVisible()
  })

  test('B10 — filtered empty state shows message and clear button', async ({ page }) => {
    await expect(page.getByText('6 gigs available')).toBeVisible({ timeout: 3000 })

    // Select a capability that combined with a location yields zero results
    await page.getByRole('option', { name: 'Hybrid' }).click()
    await expect(page.getByText('1 gig available')).toBeVisible()

    // Now add a capability filter that gig-005 does not have
    await page.getByRole('option', { name: 'Leadership' }).click()

    await expect(page.getByText('No gigs match your filters.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Clear all filters' })).toBeVisible()
  })

  test('B11 — Clear all filters resets to full list', async ({ page }) => {
    await expect(page.getByText('6 gigs available')).toBeVisible({ timeout: 3000 })

    // Apply filters to get empty state
    await page.getByRole('option', { name: 'Hybrid' }).click()
    await page.getByRole('option', { name: 'Leadership' }).click()
    await expect(page.getByText('No gigs match your filters.')).toBeVisible()

    // Click clear
    await page.getByRole('button', { name: 'Clear all filters' }).click()

    // All 6 gigs are back (location filter also cleared)
    await expect(page.getByText('6 gigs available')).toBeVisible()
    await expect(page.getByRole('article')).toHaveCount(6)
  })
})
