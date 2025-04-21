const username = "iMarcraft"; // GitHub username

let repos = []; // array to store repository data
let repoImgUrl = ""; // variable to store the image of the repository

const aboutSection = document.getElementById('about'); // select the about section

let typingInterval; // variable to store the typing interval

fetch(`https://api.github.com/users/${username}/repos`)
    .then((response) => response.json())    // parse the response as JSON
    .then((data) => {
        repos = data; // store the fetched data in the repos array        
        setupHoverListeners(); // call the function to display repositories
    })
    .catch((error) => console.error("Error fetching repositories:", error)); // handle errors

function setupHoverListeners() {
    const projectCards = document.querySelectorAll('.project-card'); // select all project cards

    projectCards.forEach(card => {
        let repoName = card.firstElementChild.getAttribute('name'); // get the name of the repository from the card
        const repo = repos.find(repo => repo.name === repoName); // find the repository in the repos array
        card.setAttribute("href", `${repo.html_url}`)

        card.addEventListener('mouseenter', () => {
            if (repo) {
                // add typing animation to the terminal
                typeInTerminal(repo.name);
                loadImageFromReadme(repo);
            }
        })

        card.addEventListener('mouseleave', () => {
            clearRepoDisplay(); // clear the displayed repository information
            clearTerminal(); // clear the terminal text
            clearInterval(typingInterval); // clear the typing interval
        })
    })
}

function typeInTerminal(repoName) {
    const terminalText = document.querySelector('.terminal-typing'); // select the terminal text element

    terminalText.textContent = ''; // clear previous
    let i = 0; // initialize index

    clearInterval(typingInterval); // clear any previous typing interval

    typingInterval = setInterval(() => {
        if (i < repoName.length) {
            terminalText.textContent += repoName[i++]; // add one character at a time
        }
        else {
            clearInterval(typingInterval); // stop the interval when done
        }
    }, 35); // typing speed
}

function clearTerminal() {
    const terminalText = document.querySelector('.terminal-typing'); // select the terminal text element
    terminalText.textContent = ''; // clear the terminal text
}

async function loadImageFromReadme(repo) {
    try {
        const readmeApiUrl = `https://api.github.com/repos/${username}/${repo.name}/readme`;
        const response = await fetch(readmeApiUrl);

        if (!response.ok) throw new Error(`README not found for ${repo.name}`);

        const data = await response.json();
        const readmeContentUrl = data.download_url; // Direct link to raw README content

        const markdownResponse = await fetch(readmeContentUrl);
        const markdown = await markdownResponse.text();

        const regex = /!\[.*?\]\((.*?)\)/; // Markdown image pattern
        const match = markdown.match(regex);

        if (match && match[1]) {
            repoImgUrl = match[1];
            displayRepo(repo);
        } else {
            console.log(`No image found in README for ${repo.name}`);
        }
    } catch (error) {
        console.error(`Failed to load README for ${repo.name}:`, error);
    }
}


function displayRepo(repo) {
    setInterval(() => {
        aboutSection.style.backgroundImage = `url(${repoImgUrl})`; // update the background image every second
    })

    aboutSection.style.backgroundSize = "contain"; // set the background size to cover
    aboutSection.style.backgroundRepeat = "no-repeat"; // set the background repeat to no-repeat
    aboutSection.style.backgroundPosition = "center"; // set the background position to center
    aboutSection.style.opacity = ".5"; // set the opacity to 0.5
    aboutSection.style.transition = `opacity 0.5s url(${repoImgUrl})`; // set the transition for opacity change
    aboutSection.style.display = "block"; // remove flex display from the about section
    aboutSection.innerHTML = `
    <h3 class="repo-name">${repo.name}</h3>
    <p class="repo-description">${repo.description || "No description available."}</p>
    `;
}

function clearRepoDisplay() {
    repoImgUrl = ""; // clear the image URL
    aboutSection.style.backgroundImage = ""; // clear the background image of the about section
    aboutSection.style.backgroundSize = ""; // clear the background size of the about section
    aboutSection.style.display = "flex"; // set the display to flex for the about section
    aboutSection.style.opacity = "1"; // set the opacity to 1 for the about section
    aboutSection.innerHTML = `
    <div class="about-text">
        <h2 class="header">It's me, Marcus!</h2>
        <p class="description">
            I aspire to change the world with my crafts, 
            one project at a time. With an exceptional 
            understanding of computer science, I'm off 
            to building not only projects, but also my 
            experience. Cheers to contributing to forming a
            better world through technology!
        </p>
    </div>
    <div class="about-image-container">
        <img src="images/marcus.png" alt="Marcus Laguerre" class="about-image">
    </div>
    `;
}