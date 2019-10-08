require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

// function searchByListItemName(searchTerm) {
//   knexInstance
//     .select('*')
//     .from('shopping_list')
//     .where('name', 'ILIKE', `%${searchTerm}%`)
//     .then(result => {
//       console.log('SEARCH TERM', { searchTerm })
//       console.log(result)
//     })
// }
// searchByListItemName('urger')

// function paginateListItems(pageNumber) {
//   const listItemsPerPage = 6
//   const offset = listItemsPerPage * (pageNumber -1)
//   knexInstance
//     .select('id', 'name', 'price', 'date_added', 'checked', 'category')
//     .from('shopping_list')
//     .limit(listItemsPerPage)
//     .offset(offset)
//     .then(result => {
//       console.log('PAGINATE ITEMS', { pageNumber })
//       console.log(result)
//     })
// }
// paginateListItems(5)

// function itemsAfterDate(daysAgo) {
//   knexInstance
//     .select('id', 'name', 'date_added', 'price', 'checked', 'category')
//     .where(
//       'date_added',
//       '>',
//       knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
//     )
//     .from('shopping_list')
//     .then(result => {
//       console.log('PRODUCTS ADDED DAYS AGO')
//       console.log(result)
//     })
// }

// itemsAfterDate(5)

function costPerCatagory() {
  knexInstance
    .select('category')
    .from('shopping_list')
    .groupBy('category')
    .sum('price AS total')
    .then(result => {
      console.log('COST PER CATEGORY')
      console.log(result)
    })
}

costPerCatagory()