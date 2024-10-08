// Initialize tooltips
$(document).ready(() => {
    $('[data-toggle="tooltip"]').tooltip();
});

// Delete am item
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
            url: `/manager/order-cancel/${id}`,
            type: 'DELETE',
            success: () => {
                $('#deleteModal').modal('hide');
                alert('Order has been cancelled');
                window.location.reload(true);
            },
            error: (xhr, status, error) => {
                alert('Error cancelling the order: ' + error);
            }
        });
    });
});

// Deliver Order button click event
$('.deliver-order-btn').click(function() {
    const orderId = $(this).data('id');

    // AJAX request to mark the order as delivered
    $.ajax({
        url: `/manager/order-deliver/${orderId}`,
        method: 'PATCH',
        success: function(response) {
            alert('Order has been marked as delivered');
            location.reload(); // Reload the page to reflect the change
        },
        error: function(error) {
            alert('Error marking the order as delivered');
        }
    });
});

// Filter orders
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
        const search = $('#search').val().toLowerCase(); // Search by username
        const selectedMonth = $('#month').val(); // Filter by month
        const selectedPrice = $('#price').val(); // Filter by price range
        const selectedItems = $('#items').val(); // Filter by items amount

        // Loop through each row and check if it matches the filter criteria
        $('tbody tr').each(function () {
            const row = $(this);
            const username = row.find('td:nth-child(2)').text().toLowerCase(); // Username is in the 2nd column
            const dateText = row.find('td:nth-child(3)').text(); // Date is in the 3rd column
            const month = dateText.split('.')[1]; // Get the month by splitting on the dot
            const price = parseFloat(row.find('td:nth-child(4)').text().replace('$', '')); // Price is in the 4th column
            const items = parseInt(row.find('td:nth-child(5)').text()); // Number of items is in the 5th column

            let matches = true;

            // Search filter (by username)
            if (search && !username.includes(search)) {
                matches = false;
            }

            // Month filter
            if (selectedMonth && selectedMonth !== month) {
                matches = false;
            }

            // Price filter
            if (selectedPrice) {
                const [minPrice, maxPrice] = selectedPrice.split('-');
                if (price < parseFloat(minPrice) || (maxPrice && price > parseFloat(maxPrice))) {
                    matches = false;
                }
            }

            // Items filter
            if (selectedItems) {
                const [minItems, maxItems] = selectedItems.split('-');
                if (items < parseInt(minItems) || (maxItems && items > parseInt(maxItems))) {
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
        $('#search').val(''); // Reset search input
        $('#month').val(''); // Reset month filter
        $('#price').val(''); // Reset price filter
        $('#items').val(''); // Reset items filter
        $('tbody tr').show(); // Show all rows
    }
});