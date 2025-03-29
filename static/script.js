document.addEventListener("DOMContentLoaded", () => {
    // First check if all required elements exist
    const fileInput = document.getElementById("file");
    const analyzeBtn = document.getElementById("analyze-btn");
    const refreshBtn = document.getElementById("refresh-btn");
    const resultSection = document.getElementById("result");

    // Check if elements exist before proceeding
    if (!fileInput || !analyzeBtn || !refreshBtn || !resultSection) {
        console.error("One or more required elements are missing from the DOM");
        return;
    }

    // Create export button
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "Export PDF";
    exportBtn.classList.add("primary-btn");
    exportBtn.style.display = "none";
    document.body.appendChild(exportBtn);

    // File input handler
    fileInput.addEventListener("change", () => {
        analyzeBtn.disabled = !fileInput.files.length;
    });

    // Analyze button handler
    analyzeBtn.addEventListener("click", async () => {
        const file = fileInput.files[0];
        if (!file) return;

        analyzeBtn.disabled = true;
        analyzeBtn.textContent = "Analyzing...";

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/upload", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                resultSection.innerHTML = `<p class='error'>${data.error}</p>`;
                exportBtn.style.display = "none";
            } else {
                resultSection.innerHTML = `
                    <h2>Analysis Result</h2>
                    <p>${data.result.replace(/\n/g, '<br>')}</p>
                    ${data.image ? `<img src="${data.image}" alt="Processed Leaf Image">` : ''}
                `;
                exportBtn.style.display = "block";
            }
        } catch (error) {
            console.error("Error:", error);
            resultSection.innerHTML = `<p class='error'>${
                error.message.includes('Failed to fetch') 
                    ? "Network error - please check your connection" 
                    : "Analysis failed - please try another image"
            }</p>`;
            exportBtn.style.display = "none";
        } finally {
            analyzeBtn.disabled = false;
            analyzeBtn.textContent = "Analyze";
        }
    });

    // Refresh button handler
    refreshBtn.addEventListener("click", () => {
        fileInput.value = "";
        analyzeBtn.disabled = true;
        resultSection.innerHTML = "";
        exportBtn.style.display = "none";
    });

    // Export button handler
    exportBtn.addEventListener("click", () => {
        if (window.jspdf) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.text("LeafScan Analysis Report", 10, 10);
            doc.text(resultSection.innerText, 10, 20);
            doc.save("LeafScan_Report.pdf");
        } else {
            console.error("jsPDF library not loaded");
            alert("PDF export feature is not available");
        }
    });

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    }
});