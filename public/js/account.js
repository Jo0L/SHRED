
const loadInfo = async (res) => {
    const user = await res.json();
    Object.entries(user).forEach(([key, val]) => {
        if (['address', 'firstName', 'lastName'].includes(key) && !!val ){
            $('#info-keys').append(`<p>${key}</p>`);
            $('#info-values').append(`<p>${val}</p>`);
            $(`#${key}-input`).val(val);
        }
    });
}

const loadWishlist = async (res) => {
    const { wishlistData } = await res.json();
    if (wishlistData) {
        wishlistData.forEach(item => {
            const wishlistItemDiv = `
                <a href="/accessories/${item.type}/?id=${item.id}" class="wishlist-item">
                    <img src="${item.img}" alt="${item.title}" class="wishlist-item-image"/>
                </a>
            `;
            $('#wishlist-container').append(wishlistItemDiv);
        });

        if(wishlistData.length===0) {
            const noItemsMessage = `
                <p>Your wishlist is empty.</p>
            `;
            $('#wishlist-container').append(noItemsMessage);
        }
    }
}

const loadOrders = async (res) =>  {
    const orders = await res.json();
    // TODO: show cart preview of the order onclick
    orders.forEach(order => {
        const $card = $(`
            <div class="card clickable p-2 mb-2">
                <span class="card-body row">
                    <span class="col-9 card-text">
                        <h5 class="card-title">ORDER #${order._id}</h5>
                        <p>${new Date(order.date).toLocaleDateString("en-US")}</p>
                    </span>
                    <span class="col-3 card-text text-right">
                        <h6>$${order.price.toFixed(2)}</h6>
                    </span>
                </span>
            </div>`);
        $('#order-container').append($card);
    });
}

// TODO: loading?
$(document).ready(() => {
    fetch('/users').then(loadInfo).catch(console.error);
    fetch('/orders').then(loadOrders).catch(console.error);
    fetch('/wishlist').then(loadWishlist).catch(console.error);
    
});


$('#edit-button').click(() => { 
    $.ajax({
        url: '/users',
        type: 'PATCH',
        data: $('#edit-form').serialize(),
        success: (res) => {
            $('#modal').modal('hide');
            window.location.reload(true);
        },
        error: function(xhr, status, error) {
            alert('Error changing user details: ' + error);;
        }
    });
});