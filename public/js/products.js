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


// Edit an item
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

// Filter the products
$(document).ready(function () {
    // Listen for the "Apply Filters" button click
    $('#applyFiltersBtn').click(function () {
        applyFilters();
    });

    // Listen for the "Reset Filters" button click
    $('#resetFiltersBtn').click(function () {
        resetFilters();
    });

    // Function to apply filters
    function applyFilters() {
        const search = $('#search').val().toLowerCase();
        const selectedType = $('#type').val();
        const selectedPrice = $('#price').val();
        const selectedGender = $('#gender').val();
        const selectedStock = $('#stock').val();

        // Loop through each row and check if it matches the filter criteria
        $('tbody tr').each(function () {
            const row = $(this);
            const type = row.find('td:nth-child(2)').text().toLowerCase();
            const brand = row.find('td:nth-child(4)').text().toLowerCase();
            const gender = row.find('td:nth-child(5)').text();
            const price = parseFloat(row.find('td:nth-child(6)').text().replace('$', ''));
            const stock = parseInt(row.find('td:nth-child(7)').text());

            let matches = true;

            // Search filter (checks both type and brand)
            if (search && !type.includes(search) && !brand.includes(search)) {
                matches = false;
            }

            // Type filter
            if (selectedType && selectedType !== type) {
                matches = false;
            }

            // Price filter
            if (selectedPrice) {
                const [minPrice, maxPrice] = selectedPrice.split('-');
                if (price < parseFloat(minPrice) || (maxPrice && price > parseFloat(maxPrice))) {
                    matches = false;
                }
            }

            // Gender filter
            if (selectedGender && selectedGender !== gender) {
                matches = false;
            }

            // Stock filter
            if (selectedStock) {
                const isInStock = selectedStock === 'true' ? stock > 0 : stock <= 0;
                if (!isInStock) {
                    matches = false;
                }
            }

            // Show or hide the row based on whether it matches the filters
            if (matches) {
                row.show();
            } else {
                row.hide();
            }
        });
    }

    // Function to reset filters and show all rows
    function resetFilters() {
        $('#search').val('');
        $('#type').val('');
        $('#price').val('');
        $('#gender').val('');
        $('#stock').val('');
        $('tbody tr').show(); // Show all rows
    }
});

// Make sure the inputs are with positive value
document.getElementById('price-input').addEventListener('input', function() {
    if (this.value < 0) {
        this.value = 0;
    }
});

document.getElementById('stock-input').addEventListener('input', function() {
    if (this.value < 0) {
        this.value = 0;
    }
});