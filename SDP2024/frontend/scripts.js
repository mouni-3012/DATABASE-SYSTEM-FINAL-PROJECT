// Show specific tab
function showTab(tabId) {
    // Hide all tab content
    $('.tab-content').hide();

    // Show the selected tab
    $('#' + tabId).show();

    // Remove active class from all tab buttons
    $('.tab-button').removeClass('active');

    // Add active class to the clicked button
    $(`.tab-button[onclick="showTab('${tabId}')"]`).addClass('active');
}
$(document).ready(() => {
    showTab('screen1'); // Show the first tab (screen1)
});

// Populate the Due Date dropdown for filtering
function populateDueDateFilter() {
    const filterDropdown = $('#due-date-filter');
    const currentYear = new Date().getFullYear();
    const dueDates = [
        `April 15, ${currentYear}`,
        `June 15, ${currentYear}`,
        `September 15, ${currentYear}`,
        `January 15, ${currentYear + 1}`
    ];

    filterDropdown.empty(); // Clear existing options
    filterDropdown.append('<option value="">Select Due Date</option>'); // Default option
    dueDates.forEach(date => {
        const formattedDate = new Date(date).toLocaleDateString('en-US'); // Format as MM/DD/YYYY
        filterDropdown.append(`<option value="${formattedDate}">${formattedDate}</option>`);
    });
}


// Update percentage text dynamically and calculate tax
function updatePercentageAndTax() {
    const taxRate = parseFloat($('#tax-rate').val());
    const totalAmount = parseFloat($('#total-amount').text().replace('$', ''));
    if (!isNaN(taxRate)) {
        const percentage = (taxRate * 100).toFixed(2); 
        $('#tax-rate-percentage').text(`= ${percentage}%`);
    } else {
        $('#tax-rate-percentage').text('0%'); 
    }
    if (!isNaN(totalAmount)) {
        calculateTax();
    }
}

// Calculate the tax due
function calculateTax() {
    const taxRate = parseFloat($('#tax-rate').val()); 
    const totalAmount = parseFloat($('#total-amount').text().replace('$', ''));

    if (isNaN(taxRate) || isNaN(totalAmount)) {
        $('#tax-due').text('$0.00');
        return;
    }

    // Calculate the tax due
    const taxDue = totalAmount * taxRate;

    // Display the tax due
    $('#tax-due').text(`$${taxDue.toFixed(2)}`);
}




// Initialize Screen 2 on page load
$(document).ready(() => {
    populateDueDateFilter();
});


// Fetch and populate the table on Screen 1
// Fetch and populate the table on Screen 1
function loadPayments() {
    ApiService.getAllPayments().done((data) => {
        let rows = '';
        data.forEach((payment) => {
            const dueDateFormatted = new Date(payment.due_date).toLocaleDateString('en-US');
            rows += `
                <tr>
                    <td>${payment.id}</td>
                    <td>${payment.company}</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td>${payment.payment_date || 'N/A'}</td>
                    <td>${payment.status}</td>
                    <td>${dueDateFormatted}</td>
                    <td>
                        <button onclick="openEditPopup(${payment.id})">Edit</button>
                        <button onclick="confirmDelete(${payment.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        // Populate the table body
        $('#payments-table tbody').html(rows);
    });
}

function filterByDueDate() {
    const selectedDueDate = $('#due-date-filter').val();

    ApiService.getAllPayments().done((data) => {
        let rows = '';
        let totalAmount = 0;

        data.forEach((payment) => {
            const dueDateFormatted = new Date(payment.due_date).toLocaleDateString('en-US');
            if (!selectedDueDate || dueDateFormatted === selectedDueDate) {
                rows += `
                    <tr>
                        <td>${payment.id}</td>
                        <td>${payment.company}</td>
                        <td>${payment.amount.toFixed(2)}</td>
                        <td>${payment.payment_date || 'N/A'}</td>
                        <td>${payment.status}</td>
                        <td>${dueDateFormatted}</td>
                    </tr>
                `;
                totalAmount += payment.amount;
            }
        });

        // Populate the table and update the total amount
        $('#filtered-payments-table tbody').html(rows);
        $('#total-amount').text(`$${totalAmount.toFixed(2)}`);

        // Reset the tax due calculation
        calculateTax();
    });
}


// Populate the Due Date dropdown
function populateDueDateDropdown() {
    const dueDateDropdown = $('#popup-due-date');
    const currentYear = new Date().getFullYear();
    const dueDates = [
        `April 15, ${currentYear}`,
        `June 15, ${currentYear}`,
        `September 15, ${currentYear}`,
        `January 15, ${currentYear + 1}`
    ];

    dueDateDropdown.empty(); // Clear existing options
    dueDateDropdown.append('<option value="">Select Due Date</option>'); // Default option
    dueDates.forEach(date => {
        const formattedDate = new Date(date).toLocaleDateString('en-US'); // Format as MM/DD/YYYY
        dueDateDropdown.append(`<option value="${formattedDate}">${formattedDate}</option>`);
    });
}

function validateForm() {
    const company = $('#popup-company').val().trim();
    const amount = $('#popup-amount').val().trim();
    const status = $('#popup-status').val().trim();
    const dueDate = $('#popup-due-date').val().trim();

    // Enable Save button only if all required fields are filled
    if (company && amount && status && dueDate) {
        $('#save-button').prop('disabled', false);
    } else {
        $('#save-button').prop('disabled', true);
    }
}


// Call this function when opening the Add/Edit popup
function openAddPopup() {
    populateDueDateDropdown(); // Populate due date dropdown
    $('#popup-form')[0].reset(); // Reset form fields
    $('#popup-id').val('');
    $('#save-button').prop('disabled', true); // Disable Save button initially
    $('#popup-title').text('Add Payment');
    $('#popup-modal').show();
}


function openEditPopup(id) {
    populateDueDateDropdown();
    ApiService.getPaymentById(id).done((data) => {
        $('#popup-title').text('Edit Payment');
        $('#popup-id').val(data.id);
        $('#popup-company').val(data.company);
        $('#popup-amount').val(data.amount);
        $('#popup-payment-date').val(data.payment_date);
        $('#popup-status').val(data.status);
        $('#popup-due-date').val(data.due_date);
        $('#save-button').prop('disabled', false); // Enable Save button
        $('#popup-modal').show();
    });
}

// Confirm delete
function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this record?')) {
        ApiService.deletePayment(id).done(() => {
            alert('Record deleted successfully!');
            loadPayments();
        });
    }
}

// Save Record (Add or Update)
function saveRecord() {
    const id = $('#popup-id').val();
    const paymentData = {
        company: $('#popup-company').val(),
        amount: parseFloat($('#popup-amount').val()),
        payment_date: $('#popup-payment-date').val(),
        status: $('#popup-status').val(),
        due_date: $('#popup-due-date').val(), // Directly save the selected MM/DD/YYYY value
    };

    if (id) {
        ApiService.updatePayment(id, paymentData).done(() => {
            alert('Record updated successfully!');
            loadPayments();
            closePopup();
        });
    } else {
        ApiService.addPayment(paymentData).done(() => {
            alert('Record added successfully!');
            loadPayments();
            closePopup();
        });
    }
}


// Close popup
function closePopup() {
    $('#popup-modal').hide();
}

// Load payments on page load
$(document).ready(() => {
    loadPayments();
});