document.addEventListener('DOMContentLoaded', function() {
    const sortDropdown = document.getElementById('sortBy');
    const searchBar = document.getElementById('search');
    const typeDropdown = document.getElementById('type');
    const genderDropdown = document.getElementById('gender');
    const brandInput = document.getElementById('brand');

    // Populate filter fields with current values
    const params = new URLSearchParams(window.location.search);
    sortDropdown.value = params.get('sortBy') || '';
    searchBar.value = params.get('search') || '';
    typeDropdown.value = params.get('type') || '';
    genderDropdown.value = params.get('gender') || '';

    // Function to apply filters
    function applyFilters() {
        const params = new URLSearchParams();

        const type = typeDropdown.value;
        if (type) params.set('type', type);

        const gender = genderDropdown.value;
        if (gender) params.set('gender', gender);

        const sortBy = sortDropdown.value;
        if (sortBy) params.set('sortBy', sortBy);

        const search = searchBar.value;
        if (search) params.set('search', search);

        window.location.href = `/accessories/filter?` + params.toString();
    }

    // Function to reset filters
    function resetFilters() {
        // Clear all filter fields
        typeDropdown.value = '';
        genderDropdown.value = '';
        sortDropdown.value = '';
        searchBar.value = '';

        // Redirect to the base URL without any filters
        window.location.href = '/accessories/filter';
    }

    // Event listeners
    document.getElementById('applyFiltersBtn').addEventListener('click', applyFilters);
    document.getElementById('resetFiltersBtn').addEventListener('click', resetFilters);
});
