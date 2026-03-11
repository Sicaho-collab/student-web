import { test, expect } from '@playwright/test'

/**
 * Category E: Apply Form
 *
 * Uses gig-004 (deadline 2026-03-28) which is safely in the future
 * when clock is frozen to 2026-03-11.
 */

const FROZEN_DATE = '2026-03-11T00:00:00'

test.describe('Apply Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date(FROZEN_DATE) })
    await page.goto('/student-web/earn/gig-004')
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })
  })

  test('E1 — clicking Apply Now reveals the apply form', async ({ page }) => {
    await expect(page.getByText('Apply to this Gig')).not.toBeVisible()

    await page.getByRole('button', { name: 'Apply Now' }).click()

    await expect(page.getByText('Apply to this Gig')).toBeVisible()
    await expect(page.getByText('Message to employer')).toBeVisible()
  })

  test('E2 — message field is focused when form appears', async ({ page }) => {
    await page.getByRole('button', { name: 'Apply Now' }).click()
    await expect(page.getByText('Apply to this Gig')).toBeVisible()

    // The textarea should be focused
    const textarea = page.locator('textarea')
    await expect(textarea).toBeFocused({ timeout: 2000 })
  })

  test('E3 — empty message shows validation error on blur', async ({ page }) => {
    await page.getByRole('button', { name: 'Apply Now' }).click()

    const textarea = page.locator('textarea')
    await textarea.focus()
    await textarea.blur()

    await expect(page.getByText('Please enter a message')).toBeVisible()
  })

  test('E4 — character counter shows 0/500 initially and updates on input', async ({ page }) => {
    await page.getByRole('button', { name: 'Apply Now' }).click()

    await expect(page.getByText('0 / 500')).toBeVisible()

    await page.locator('textarea').fill('Hello world')
    await expect(page.getByText('11 / 500')).toBeVisible()
  })

  test('E5 — message capped at 500 characters', async ({ page }) => {
    await page.getByRole('button', { name: 'Apply Now' }).click()

    const longText = 'A'.repeat(500)
    await page.locator('textarea').fill(longText)
    await expect(page.getByText('500 / 500')).toBeVisible()

    // Try to type one more character — should not go beyond 500
    await page.locator('textarea').pressSequentially('B')
    await expect(page.getByText('500 / 500')).toBeVisible()
  })

  test('E6 — counter turns error color at 500 characters', async ({ page }) => {
    await page.getByRole('button', { name: 'Apply Now' }).click()

    await page.locator('textarea').fill('A'.repeat(500))

    // The counter text should have error class
    const counter = page.getByText('500 / 500')
    await expect(counter).toHaveClass(/text-m3-error/)
  })

  test('E7 — availability checkbox shows correct date range from gig', async ({ page }) => {
    await page.getByRole('button', { name: 'Apply Now' }).click()

    // gig-004: startDate=2026-04-01, endDate=2026-04-25
    await expect(
      page.getByText(/I confirm I am available for the dates listed \(01\/04\/2026/)
    ).toBeVisible()
    await expect(page.getByText(/25\/04\/2026\)/)).toBeVisible()
  })

  test('E8 — submit button disabled until message filled AND checkbox checked', async ({ page }) => {
    await page.getByRole('button', { name: 'Apply Now' }).click()

    const submitBtn = page.getByRole('button', { name: 'Submit Application' })

    // Initially disabled
    await expect(submitBtn).toBeDisabled()

    // Fill message only — still disabled
    await page.locator('textarea').fill('I am very interested in this gig.')
    await expect(submitBtn).toBeDisabled()

    // Check availability — now enabled
    await page.getByLabel(/I confirm I am available/).click()
    await expect(submitBtn).toBeEnabled()
  })

  test('E9 — submitting shows Submitting... state', async ({ page }) => {
    await page.getByRole('button', { name: 'Apply Now' }).click()

    await page.locator('textarea').fill('I would love to contribute to this research project.')
    await page.getByLabel(/I confirm I am available/).click()

    await page.getByRole('button', { name: 'Submit Application' }).click()

    await expect(page.getByText('Submitting...')).toBeVisible()
  })

  test('E10 — successful submission shows confirmation', async ({ page }) => {
    await page.getByRole('button', { name: 'Apply Now' }).click()

    await page.locator('textarea').fill('I would love to contribute to this research project.')
    await page.getByLabel(/I confirm I am available/).click()
    await page.getByRole('button', { name: 'Submit Application' }).click()

    await expect(page.getByText('Application submitted!')).toBeVisible({ timeout: 5000 })
    await expect(
      page.getByText(/The employer will review your application/)
    ).toBeVisible()
  })

  test('E11 — Back to Gigs on success navigates to /earn', async ({ page }) => {
    await page.getByRole('button', { name: 'Apply Now' }).click()

    await page.locator('textarea').fill('I would love to contribute to this research project.')
    await page.getByLabel(/I confirm I am available/).click()
    await page.getByRole('button', { name: 'Submit Application' }).click()

    await expect(page.getByText('Application submitted!')).toBeVisible({ timeout: 5000 })
    await page.getByRole('button', { name: 'Back to Gigs' }).click()

    await expect(page).toHaveURL(/\/student-web\/earn$/)
  })
})
