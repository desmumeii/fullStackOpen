const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'John Doe',
        username: 'abcdef',
        password: 'abcdef',
      }
    })
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Jane Smith',
        username: 'ghijkl',
        password: 'ghijkl',
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = page.getByText('log in to application')
    const formLocator = page.getByRole('button', { name: 'login' })

    await expect(locator).toBeVisible()
    await expect(formLocator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'abcdef', 'abcdef')

      await expect(page.getByText('John Doe logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'abcdef', 'wrongpassword')

      const errorNotification = page.getByText('wrong username or password')
      await expect(errorNotification).toBeVisible()
      await expect(errorNotification).toHaveCSS('color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'abcdef', 'abcdef')
    })

    test('A blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click() 
      await createBlog(page, 'A blog created by Playwright', 'Playwright Tester', 'http://example.com/playwright-blog')
      
      const firstBlog = page.locator('.blog', { hasText: /A blog created by Playwright/ })
      
      await expect(firstBlog).toBeVisible()

    })
    test('A blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'A blog to be liked', 'Liker', 'http://example.com/like-blog')
      
      const blog = page.locator('.blog', { hasText: /A blog to be liked/ })
      await blog.getByRole('button', { name: 'view' }).click()
      const likeButton = blog.getByRole('button', { name: 'like' })
      const likesText = blog.getByText('likes 0')

      await expect(likesText).toBeVisible()
      await likeButton.click()
      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('A blog can be deleted by its creator', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'A blog to be deleted', 'Deleter', 'http://example.com/delete-blog')
      
      const blog = page.locator('.blog', { hasText: /A blog to be deleted/ })
      await blog.getByRole('button', { name: 'view' }).click()
      const deleteButton = blog.getByRole('button', { name: 'delete' })
      
      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toBe('Are you sure you want to delete this blog?')
        await dialog.accept() // click "OK"
      })

      // Click the delete button
      await deleteButton.click()
      await expect(blog).toHaveCount(0)
    })
    
    test('A blog cannot be deleted by another user', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'A blog that cannot be deleted by others', 'Owner', 'http://example.com/safe-blog')

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'ghijkl', 'ghijkl')

      const blog = page.locator('.blog', { hasText: /A blog that cannot be deleted by others/ })
      await blog.getByRole('button', { name: 'view' }).click()
      const deleteButton = blog.getByRole('button', { name: 'delete' })
      
      await expect(deleteButton).toHaveCount(0)
    })

    test('Blogs are ordered by likes in descending order', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'Least liked blog', 'Author1', 'http://example.com/least-liked')
      await createBlog(page, 'Medium liked blog', 'Author2', 'http://example.com/medium-liked')
      await createBlog(page, 'Most liked blog', 'Author3', 'http://example.com/most-liked')

      await page.getByRole('button', { name: 'view' }).first().click();
      await page.waitForTimeout(500); // wait for blog content to expand

      await page.getByRole('button', { name: 'like' }).click();
      await page.waitForTimeout(500); // wait for like to register

      await page.getByRole('button', { name: 'view' }).first().click();
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'like' }).nth(1).click();
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'like' }).nth(1).click();
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'view' }).click();
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'like' }).nth(2).click();
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'like' }).nth(2).click();
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'like' }).nth(1).click();
      await page.waitForTimeout(500);
      
      const blogs = page.locator('.blog')
      await expect(blogs.nth(0)).toHaveText(/Most liked blog/)
      await expect(blogs.nth(1)).toHaveText(/Medium liked blog/)
      await expect(blogs.nth(2)).toHaveText(/Least liked blog/)
      })
  })

})