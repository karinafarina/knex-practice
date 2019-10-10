const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe('Shopping-list service object', function() {
  let db
  let testListItems = [
    {
      id: 1,
      name: 'First test item',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      price: '12.00',
      category: 'Main',
      checked: false
    },
    {
      id: 2,
      name: 'Second test item',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      price: '2.00',
      category: 'Main',
      checked: true
    },
    {
      id: 3,
      name: 'Third test item',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '3.00',
      category: 'Lunch',
      checked: false
    },
    {
      id: 4,
      name: 'Fourth test item!',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '0.99',
      category: 'Breakfast',
      checked: true
    },
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
  })

  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())

  after(() => db.destroy())

  context(`Given 'shoppinglist_items' has data`, () => {
    beforeEach(() => {
      return db
        .into('shopping_list')
        .insert(testListItems)
    })
    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      //test that ShoppingListService.getAllItems gets data from table
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql(testListItems)
        })
    })

    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3
      const thirdTestItem = testListItems[thirdId - 1]
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          console.log('actual', actual)
          expect(actual).to.eql({
            id: thirdId,
            name: thirdTestItem.name,
            date_added: thirdTestItem.date_added,
            price: thirdTestItem.price,
            category: thirdTestItem.category,
            checked: false,
          })
        })
    })
    it(`deleteItem() removes an article by id from 'shopping_list' table`, () => {
      const itemId = 3
      return ShoppingListService.deleteItem(db, itemId) 
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          //copy the test items array without the deleted item
          const expected = testListItems.filter(item => item.id !== itemId)
          expect(allItems).to.eql(expected)
        })
    })
    it(`updateItem() updates a list item from the 'shopping_list', table`, () => {
      const idOfItemToUpdate = 3
      const newItemData = {
        name: 'updated name',
        date_added: new Date(),
        price: '99.99',
        checked: true,
      }
      const originalItem = testListItems[idOfItemToUpdate - 1]
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...originalItem,
            ...newItemData
          })
        }) 
    })
  })

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([])
        })
    })
    it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
      const newItem = {
        name: 'Test new name',
        date_added: new Date('2020-01-01T00:00:00.000Z'),
        price: '12.00',
        category: 'Main',
        checked: true
      }
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            date_added: newItem.date_added,
            price: newItem.price,
            category: newItem.category,
            checked: newItem.checked
          })
        })
    })
  })
})