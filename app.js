let allIdeas = [];
let sortAsc = false;

async function loadIdeas() {
    try {
        const response = await fetch('ideas.json');
        allIdeas = await response.json();
        filterAndRender();
    } catch (error) {
        document.getElementById('marketplace-grid').innerHTML = "Unable to load the repository.";
    }
}

function filterAndRender() {
    const category = document.getElementById('categoryFilter').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    
    let filtered = allIdeas.filter(idea => {
        const matchesCategory = (category === "All" || idea.category === category);
        const matchesSearch = idea.title.toLowerCase().includes(searchText) || 
                              idea.description.toLowerCase().includes(searchText);
        return matchesCategory && matchesSearch;
    });

    filtered.sort((a, b) => {
        const d1 = new Date(a.date);
        const d2 = new Date(b.date);
        return sortAsc ? d1 - d2 : d2 - d1;
    });

    render(filtered);
}

function toggleSort() {
    sortAsc = !sortAsc;
    document.getElementById('sortIcon').innerText = sortAsc ? "↑" : "↓";
    filterAndRender();
}

function render(data) {
    const grid = document.getElementById('marketplace-grid');
    if (data.length === 0) {
        grid.innerHTML = "<p>No matching research ideas found.</p>";
        return;
    }
    
    grid.innerHTML = data.map(idea => {
        // Create a list of reference tags
        const refHtml = idea.references.map(ref => `<li>${ref}</li>`).join('');
        
        return `
            <div class="card">
                <div class="card-top">
                    <span class="category">${idea.category}</span>
                    <span class="date">${idea.date}</span>
                </div>
                
                <h3>${idea.title}</h3>
                <p>${idea.description}</p>
                
                <div class="ref-section">
                    <h4>Suggested References:</h4>
                    <ul>${refHtml}</ul>
                </div>

                <div class="card-footer">
                    <div class="contributor">
                        <strong>Proposed by:</strong> ${idea.contributor}
                    </div>
                    <a href="mailto:${idea.email}?subject=Inquiry: ${idea.title}" class="contact-btn">
                        Contact Researcher
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

loadIdeas();
