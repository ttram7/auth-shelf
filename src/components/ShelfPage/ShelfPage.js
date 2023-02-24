import { useState, useEffect } from 'react';
import axios from 'axios';
import './ShelfPage.css';

function ShelfPage() {
  const [shelfList, setShelfList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    fetchShelf();
  }, []);

  const item = {itemName, image}

  const fetchShelf = () => {
    axios.get('/api/shelf').then((response) => {
      setShelfList(response.data);
    }).catch((error) => {
      console.log(error);
      alert('Something went wrong.');
    });
  }

  const sendItem = event => {
    event.preventDefault();
    axios.post('/api/shelf', item)
        .then(response => {
            console.log('successful post', response)
        }).catch(err => {
            console.log('error with making post', err)
        })
    setItemName('');
    setImage('');
    fetchShelf();
  }
  const deleteItem = (id) => {
    console.log('in deleteItem')
    axios.delete(`/api/shelf/${id}`)
    .then(response => {
      console.log('successful delete', response)
      fetchShelf();
    }).catch(err => {
      console.log('error with making delete', err)
    })
}
  return (
    <div className="container">
      <h2>Add to shelf</h2>
      <form onSubmit={sendItem}>
        <input type="text" placeholder='item name' value={itemName} 
        onChange={event => setItemName(event.target.value)}></input>
        <input type='type' placeholder='image url' value={image}
        onChange={event => setImage(event.target.value)}></input>
        <button>Submit</button>
      </form>
      <h2>Shelf</h2>
      <p>All of the available items can be seen here.</p>
      {
        shelfList.length === 0 && (
          <div>No items on the shelf</div>
        )
      }
      {
        shelfList.map(item => {
          return <div className="responsive" key={item.id}>
                    <div className="gallery">
                        <img src={item.image_url} alt={item.description} />
                        <br />
                        <div className="desc">{item.description}</div>
                        <div style={{textAlign: 'center', padding: '5px'}}>
                          <button style={{cursor: 'pointer'}} onClick={() => deleteItem(item.id)}>Delete</button>
                        </div>
                    </div>
                 </div>
        })
      }
      <div className="clearfix"></div>
    </div>
  );
}

export default ShelfPage;
