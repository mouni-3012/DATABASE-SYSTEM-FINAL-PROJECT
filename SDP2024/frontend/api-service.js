const API_BASE = "http://127.0.0.1:5000";


const ApiService = {
    
    getAllPayments: function () {
        return $.ajax({
            url: `${API_BASE}/payments`,
            method: "GET",
        });
    },

    
    getPaymentById: function (id) {
        return $.ajax({
            url: `${API_BASE}/payments/${id}`,
            method: "GET",
        });
    },

    
    addPayment: function (paymentData) {
        return $.ajax({
            url: `${API_BASE}/payments`,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(paymentData),
        });
    },

    
    updatePayment: function (id, paymentData) {
        return $.ajax({
            url: `${API_BASE}/payments/${id}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(paymentData),
        });
    },

    
    deletePayment: function (id) {
        return $.ajax({
            url: `${API_BASE}/payments/${id}`,
            method: "DELETE",
        });
    },
};
