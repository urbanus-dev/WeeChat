describe('template spec', () => {
  it('passes', () => {
    cy.visit('/')
  })
})
describe('register', () => {
  it('should register', () => {
    cy.visit('/register')
    cy.get('input[name="email"]').type('benson578@gmail.com');
    cy.get('input[name="password"]').type('111111');
    cy.get('input[name="confirmPassword"]').type('111111');
    cy.get('input[name="Username"]').type('Rooidgebenson');
    cy.get('select[name="languagePreference"]').select('bg');
    
    cy.get('button[type="submit"]').click();
  });
});
describe('login', () => {
  it('should login', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('benson578@gmail.com');
    cy.get('input[name="password"]').type('111111')
    cy.get('button[type="submit"]').click()
  });
})


