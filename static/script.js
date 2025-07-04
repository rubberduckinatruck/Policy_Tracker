console.log("Final Policy Tracker Web App loaded.");

document.addEventListener("DOMContentLoaded", () => {
    // Highlight the active page in the navigation bar
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });

    // Refresh the page when the "Try Again" button is clicked
    const tryAgainButton = document.querySelector(".try-again-btn");
    if (tryAgainButton) {
        tryAgainButton.addEventListener("click", () => {
            window.location.reload();
        });
    }

    // Fetch and display recent policy updates from the database
    const updatesSection = document.querySelector("#recent-updates");
    if (updatesSection) {
        const displayError = (message) => {
            updatesSection.innerHTML = `<p class="text-danger">${message}</p>`;
            console.error(message);
        };

        // Fetch updates from Flask API
        fetch("/get-updates")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch updates: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    displayError("No recent policy updates available.");
                    return;
                }

                // Render updates dynamically
                const updatesList = data.map(result =>
                    `<li><a href="${result.url}" target="_blank">${result.policy_number} - ${result.name}</a>: ${result.change_type} (Last Modified: ${convertToPhoenixTime(result.changed_at)})</li>`
                ).join("");

                updatesSection.innerHTML = `<ul>${updatesList}</ul>`;
            })
            .catch(error => {
                displayError(`Failed to load updates: ${error.message}`);
            });
    }

    // Function to Convert UTC Time to Phoenix, AZ Time (MST)
    function convertToPhoenixTime(utcTimestamp) {
        if (!utcTimestamp) return "N/A";
        const options = {
            timeZone: "America/Phoenix",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        };
        return new Intl.DateTimeFormat("en-US", options).format(new Date(utcTimestamp));
    }

    // Search functionality for Policy Table
    const searchBar = document.getElementById("searchBar");
    const policyRows = document.querySelectorAll(".policy-row");

    if (searchBar && policyRows.length > 0) {
        searchBar.addEventListener("input", function () {
            const query = this.value.toLowerCase();
            policyRows.forEach(row => {
                const policyNumber = row.querySelector("td:first-child").innerText.toLowerCase();
                const policyName = row.querySelector("td:nth-child(2)").innerText.toLowerCase();
                row.style.display = (policyNumber.includes(query) || policyName.includes(query)) ? "" : "none";
            });
        });
    }

   
});
