describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testi Henkilö',
      username: 'testi',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)
    const user2 = {
      name: 'Toinen Käyttäjä',
      username: 'user',
      password: 'secret'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('user can login', function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Testi Henkilö logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.get('html').should('not.contain', 'Testi Henkilö logged in')

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testi', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.get('#new-blog-button').click()

      cy.get('#title-input').type('React patterns')
      cy.get('#author-input').type('Michael Chan')
      cy.get('#url-input').type('https://reactpatterns.com/')
      cy.get('#submit-button').click()

      cy.get('.error')
        .should('contain', 'a new blog React patterns by Michael Chan added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
    })

    it('A blog can be liked', function() {
      cy.createBlog({
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/'
      })

      cy.contains('React patterns')
        .contains('view').click()
      cy.contains('React patterns')
        .contains('like')
        .click()

      cy.contains('React patterns')
        .contains('1')
    })

    it('A blog can be removed by user who created it', function() {
      cy.createBlog({
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/'
      })

      cy.contains('React patterns')
        .contains('view').click()
      cy.contains('React patterns')
        .contains('remove')
        .click()

      cy.get('.error')
        .should('contain', 'Removed blog React patterns by Michael Chan')
        .and('have.css', 'color', 'rgb(0, 128, 0)')

      cy.get('html')
        .should('not.contain', 'React patterns')
    })

    it('Other users blogs cannot be removed', function() {
      cy.createBlog({
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/'
      })

      cy.contains('logout').click()

      cy.get('#username').type('user')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('React patterns')
        .contains('view').click()
      cy.contains('React patterns')
        .contains('remove')
        .click()

      cy.get('.error')
        .should('contain', 'only the creator can delete a blog')
        .and('have.css', 'border-style', 'solid')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html')
        .should('contain', 'React patterns')
    })

    it('blogs are sorted by likes', function() {
      cy.createBlog({
        title: 'First blog',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/'
      })
      cy.createBlog({
        title: 'Second blog',
        author: 'Edsger W. Dijkstra',
        url: 'https://reactpatterns.com/'
      })
      cy.createBlog({
        title: 'Third blog',
        author: 'Robert C. Martin',
        url: 'https://reactpatterns.com/'
      })

      cy.contains('Third blog')
        .contains('view').click()
      cy.contains('Third blog')
        .contains('like')
        .click()

      cy.contains('Second blog')
        .contains('view').click()
      cy.contains('Second blog')
        .contains('like')
        .click()

      cy.contains('Second blog')
        .contains('like')
        .click()

      cy.contains('First blog')
        .contains('view').click()
      cy.contains('First blog')
        .contains('like')
        .click()

      cy.contains('First blog')
        .contains('like')
        .click()

      cy.contains('First blog')
        .contains('like')
        .click()

      cy.get('.blog').eq(0).should('contain', 'First blog')
      cy.get('.blog').eq(1).should('contain', 'Second blog')
      cy.get('.blog').eq(2).should('contain', 'Third blog')
    })
  })
})