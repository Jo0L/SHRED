// ass an item
$('#add-button').click(() => { 
    $('#error-message').hide().text('');
    
    $.ajax({
        url: '/manager/add-accessory',
        type: 'POST',
        data: $('#new_item_form').serialize(),
        success: (res) => {
            $('#modal').modal('hide');
            alert('Item added successfully!');
            window.location.reload(true);
        },
        error: function(xhr, status, error) {
            $('#error-message').text('An error occurred: ' + error).show();
        }
    });
});


// Edit an itema
$('#edit-button').click(() => {  
    // Get the ID of the item to be edited
    const accessoryId = $(this).data('id');
  
    // Make an AJAX request to fetch the item details
    $.ajax({
      url: `/accessories/${accessoryId}`, // Adjust the URL based on your API endpoint
      type: 'GET',
      success: (itemData) => {
        // Populate the edit form with the fetched data
        $('#color-input').val(itemData.color);
        $('#company-input').val(itemData.company);
        $('#gender-select').val(itemData.gender); // Set the selected option for gender
        $('#price-input').val(itemData.price);
        $('#stock-input').val(itemData.stock);
        $('#img-input').val(itemData.img); // Update if using image URL
  
        // Show the edit modal
        $('#modal-edit').modal('show');
      },
      error: function(xhr, status, error) {
        console.error('Error fetching item data:', error);
        alert('An error occurred while fetching item details.');
      }
    });
  });

$('.delete-btn').on('click', function() {
    const id = $(this).data('id');
    if (confirm('Are you sure you want to delete this item?')) {
        $.ajax({
            url: `/accessories/delete/${id}`,
            type: 'DELETE',
            success: function(result) {
                alert('Item deleted successfully!');
                window.location.reload(true);
            },
            error: function(err) {
                console.error(err);
                alert('Failed to delete the item.');
            }
        });
    }
});

