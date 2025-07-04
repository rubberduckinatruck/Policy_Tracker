// @ts-nocheck
document.addEventListener('DOMContentLoaded', function() {
    // Change Frequency Over Time Chart
    var ctx1 = document.getElementById("changeFrequencyChart").getContext("2d");
    var changeFrequencyLabels = JSON.parse('{{ change_frequency_labels | tojson | safe }}');
    var changeFrequencyData = JSON.parse('{{ change_frequency_data | tojson | safe }}');
    var changeFrequencyChart = new Chart(ctx1, {
        type: "line",
        data: {
            labels: changeFrequencyLabels,
            datasets: [{
                label: "Policy Changes",
                data: changeFrequencyData,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
                fill: true
            }]
        }
    });

    // Policy Type Distribution Chart
    var ctx2 = document.getElementById("policyTypeChart").getContext("2d");
    var policyTypeChart = new Chart(ctx2, {
        type: "pie",
        data: {
            labels: ["Policies", "Procedures"],
            datasets: [{
                data: [{{ total_policies | default(0) }}, {{ total_procedures | default(0) }}],
                backgroundColor: ["blue", "green"]
            }]
        }
    });
});
