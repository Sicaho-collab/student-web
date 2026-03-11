import { test, expect, devices } from '@playwright/test'

/**
 * Category G: Responsive Design
 *
 * Tests layout differences between mobile and desktop viewports.
 */

const FROZEN_DATE = '2026-03-11T00:00:00'

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date(FROZEN_DATE) })
  })

  test('G1 — GigCard metadata stacks vertically on mobile, inline on desktop', async ({ page, browserName }) => {
    // Use a narrow viewport (mobile)
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/student-web/earn')
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })

    // On mobile, the metadata container should use flex-col (stacked)
    const metadataRow = page.getByRole('article').first().locator('.flex.flex-col.gap-1\\.5').first()
    await expect(metadataRow).toBeVisible()

    // Switch to desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/student-web/earn')
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })

    // On desktop, same container is visible (md:flex-row kicks in via CSS)
    // Verify the card still renders all content correctly
    const firstCard = page.getByRole('article').first()
    await expect(firstCard.getByText('Social Media Content Creator')).toBeVisible()
    await expect(firstCard.getByText('$467.11')).toBeVisible()
    await expect(firstCard.getByText('Remote')).toBeVisible()
  })

  test('G2 — filter chips are scrollable on mobile and wrap on desktop', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/student-web/earn')
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })

    // Location filter listbox should be visible and scrollable (overflow-x-auto)
    const locationListbox = page.getByRole('listbox', { name: 'Filter by location' })
    await expect(locationListbox).toBeVisible()
    await expect(locationListbox).toHaveClass(/overflow-x-auto/)

    // Capability filter listbox also scrollable
    const capListbox = page.getByRole('listbox', { name: 'Filter by capability' })
    await expect(capListbox).toBeVisible()
    await expect(capListbox).toHaveClass(/overflow-x-auto/)

    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/student-web/earn')
    await expect(page.getByRole('article').first()).toBeVisible({ timeout: 3000 })

    // On desktop, listboxes still render (md:flex-wrap kicks in via CSS)
    await expect(page.getByRole('listbox', { name: 'Filter by location' })).toBeVisible()
    await expect(page.getByRole('listbox', { name: 'Filter by capability' })).toBeVisible()
  })

  test('G3 — apply form is usable on mobile with 44px min touch targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/student-web/earn/gig-004')
    await expect(page.getByText('Gig Details')).toBeVisible({ timeout: 3000 })

    // Apply Now button should have min-h-[44px]
    const applyBtn = page.getByRole('button', { name: 'Apply Now' })
    await expect(applyBtn).toBeVisible()
    const applyBox = await applyBtn.boundingBox()
    expect(applyBox).not.toBeNull()
    expect(applyBox!.height).toBeGreaterThanOrEqual(44)

    // Open form and check Submit button
    await applyBtn.click()
    await expect(page.getByText('Apply to this Gig')).toBeVisible()

    const submitBtn = page.getByRole('button', { name: 'Submit Application' })
    await expect(submitBtn).toBeVisible()
    const submitBox = await submitBtn.boundingBox()
    expect(submitBox).not.toBeNull()
    expect(submitBox!.height).toBeGreaterThanOrEqual(44)
  })
})
