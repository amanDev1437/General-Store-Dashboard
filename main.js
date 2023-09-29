document.addEventListener('DOMContentLoaded', function () {
    const addItemForm = document.getElementById('addItemForm');
    const inventory = document.querySelector('.inventory');

    
    async function fetchInventoryData() {
        try {
            const response = await axios.get('https://crudcrud.com/api/182466e8d6bc43219d36e6e21f900728/storeItems');
            inventory.innerHTML = ''; 
            response.data.forEach((itemData, index) => {
                const inventoryItem = createInventoryItem(itemData, index);
                inventory.appendChild(inventoryItem);
            });
        } catch (error) {
            console.error('Error fetching data from the API', error);
        }
    }

    
    function createInventoryItem(itemData, index) {
        const inventoryItem = document.createElement('div');
        inventoryItem.classList.add('inventory-item');
        inventoryItem.innerHTML = `
            <div>
                <h3>${itemData.name}</h3>
                <p>${itemData.description}</p>
                <p>Price: ${itemData.price}</p>
                <p>Quantity: ${itemData.quantity}</p>
            </div>
            <button class="update-button" data-id="${itemData._id}">Update Quantity</button>
        `;

        return inventoryItem;
    }

    
    fetchInventoryData();

    addItemForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const itemName = document.getElementById('itemName').value;
        const itemDescription = document.getElementById('itemDescription').value;
        const itemPrice = document.getElementById('itemPrice').value;
        const itemQuantity = document.getElementById('itemQuantity').value;

        const newItemData = {
            name: itemName,
            description: itemDescription,
            price: itemPrice,
            quantity: itemQuantity
        };

        try {
            const response = await axios.post('https://crudcrud.com/api/182466e8d6bc43219d36e6e21f900728/storeItems', newItemData);
            
            console.log('Data sent to API successfully', response.data);

            
            await fetchInventoryData();

            
            addItemForm.reset();
        } catch (error) {
            
            console.error('Error sending data to API', error);
        }
    });

    
    inventory.addEventListener('click', async function (e) {
        if (e.target.classList.contains('update-button')) {
            const itemId = e.target.getAttribute('data-id');
            const itemQuantityElement = e.target.parentElement.querySelector('p:last-child');
            const currentQuantity = parseInt(itemQuantityElement.textContent.match(/\d+/)[0]);
            const newQuantity = currentQuantity - 1;

            if (newQuantity >= 0) {
                
                try {
                    const deleteResponse = await axios.delete(`https://crudcrud.com/api/182466e8d6bc43219d36e6e21f900728/storeItems/${itemId}`);
                    
                    console.log('Data deleted via API successfully', deleteResponse.data);

                    
                    const updatedItemData = {
                        name: e.target.parentElement.querySelector('h3').textContent,
                        description: e.target.parentElement.querySelector('p:nth-child(2)').textContent,
                        price: e.target.parentElement.querySelector('p:nth-child(3)').textContent.replace('Price: ', '').trim(),
                        quantity: newQuantity,
                    };

                    
                    try {
                        const postResponse = await axios.post('https://crudcrud.com/api/182466e8d6bc43219d36e6e21f900728/storeItems', updatedItemData);
                        
                        console.log('Data pushed to API successfully', postResponse.data);

                        
                        await fetchInventoryData();
                    } catch (postError) {
                        console.error('Error pushing updated data to API', postError);
                    }
                } catch (deleteError) {
                    console.error('Error deleting previous data via API', deleteError);
                }
            }
        }
    });
});
