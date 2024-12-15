const API_BASE = "http://127.0.0.1:5000";

// API Service using jQuery
const ApiService = {
    // Fetch all payments
    getAllPayments: function () {
        return $.ajax({
            url: `${API_BASE}/payments`,
            method: "GET",
        });
    },

    // Fetch payment by ID
    getPaymentById: function (id) {
        return $.ajax({
            url: `${API_BASE}/payments/${id}`,
            method: "GET",
        });
    },

    // Add a new payment
    addPayment: function (paymentData) {
        return $.ajax({
            url: `${API_BASE}/payments`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(paymentData),
        });
    },

    // Update an existing payment
    updatePayment: function (id, paymentData) {
        return $.ajax({
            url: `${API_BASE}/payments/${id}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(paymentData),
        });
    },

    // Delete a payment
    deletePayment: function (id) {
        return $.ajax({
            url: `${API_BASE}/payments/${id}`,
            method: "DELETE",
        });
    },
};
