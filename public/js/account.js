
// TODO: loading?
$(document).ready(() => {
    fetch('/orders').then(async (res) => {
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
    }).catch(console.error);
    
    fetch('/users').then(async (res) => {
        const user = await res.json();
        Object.entries(user).forEach(([key, val]) => {
            if (['address', 'mail'].includes(key) && !!val ){
                $('#info-keys').append(`<p>${key}</p>`);
                $('#info-values').append(`<p>${val}</p>`);
                $(`#${key}-input`).val(val);
            }
            else if (key == 'whishlist' && val){
                val.forEach(item => 
                    // TODO: show item preview image and link to its page
                    $('#whishlist-container').append(`<p>${item}</p>`)
                );
            }
        });

    }).catch(console.error);
    
});

// TODO: mail validation?
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
            // TODO: toast ('An error occurred: ' + error);
        }
    });
});