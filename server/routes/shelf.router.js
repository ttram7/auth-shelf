const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

/**
 * Get all of the items on the shelf
 */
// return logged in user's items
router.get('/', (req, res) => {
  //let queryText = `SELECT * FROM "item"`;
  if (req.isAuthenticated()) {
  let queryText = `SELECT * FROM "item" WHERE "user_id" = $1`;
  pool.query(queryText, [req.user.id]).then((result) => {
    res.send(result.rows);
  }).catch((error) => {
    console.log(error);
    res.sendStatus(500);
  });
}else {
  res.sendStatus(403); //403 Forbidden must log in 401 Unauthorized Admin access
  }
});

/**
 * Add an item for the logged in user to the shelf
 */
router.post('/', (req, res) => {
  // endpoint functionality
  let newItem = req.body;
  console.log(`Added new item`, newItem);

  let queryText = `INSERT INTO "item" ("description", "image_url", "user_id")
                   VALUES ($1, $2, $3);`;
  pool.query(queryText, [newItem.itemName, newItem.image, req.user.id])
    .then(result => {
      res.sendStatus(201);
    })
    .catch(error => {
      console.log(`Error adding new item`, error);
      res.sendStatus(500);
    });
});


/**
 * Delete an item
 */
router.delete('/:id', (req, res) => {
  // endpoint functionality
  let reqId = req.params.id;
  console.log('Delete request for id', reqId);
  let sqlText = 'DELETE FROM "item" WHERE id=$1;';
  pool.query(sqlText, [reqId])
    .then( (result) => {
      console.log('Item deleted');
      res.sendStatus(200);
    })
    .catch( (error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500); 
    })
});

module.exports = router;
