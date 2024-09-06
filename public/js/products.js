// add an item
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

  $(document).ready(() => {
    // When the delete modal is shown
    $('#deleteModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget); 
        const id = button.data('id'); 
        $('#confirm-delete-button').data('id', id); // Store the ID in the delete button
    });

    // When the delete button inside the modal is clicked
    $('#confirm-delete-button').click(function() { 
        const id = $(this).data('id'); 
        $.ajax({
            url: `/accessories/delete/${id}`,
            type: 'DELETE',
            success: () => {
                $('#deleteModal').modal('hide');
                alert('item deleted succesfully!');
                window.location.reload(true);
            },
            error: (xhr, status, error) => {
                alert('An error occurred while deleting the user: ' + error);
            }
        });
    });
});

