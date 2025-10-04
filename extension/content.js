const imdbImgSrc = chrome.runtime.getURL("assets/images/imdb.svg")
const rtImgSrc = chrome.runtime.getURL("assets/images/rt.svg")

const titleEl = document.querySelector("title");

async function makeContent() {
    const mediaName = document.querySelector("h3.previewModal--section-header strong").textContent;
    const mediaYear = document.querySelector("div.videoMetadata--line div.year").textContent;
    const params = {};
    console.log(mediaName)
    params.t = mediaName;
    if(!document.querySelector("div.videoMetadata--line span.duration")?.textContent.toLowerCase().includes("season"))
    {
        console.log(mediaYear)
        params.y = mediaYear
    }    
    const manifest = chrome.runtime.getManifest();
    const devMode = !('update_url' in manifest)
    const url = new URL(devMode ? "http://localhost:3000/api/omdb?" : "");
    Object.entries(params).forEach(([k,v]) => url.searchParams.append(k,v));

    const extDiv = document.createElement("div");
    extDiv.id = "ext-div";

    const imdbImg = Object.assign(document.createElement("img"),{
    "className": "critic-logo",
    "id": "imdb-logo",
    "src": imdbImgSrc
    })
    const rtImg = Object.assign(document.createElement("img"),{
        "className": "critic-logo",
        "id": "rt-logo",
        "src": rtImgSrc
    })

    const imdbScore = Object.assign(document.createElement("div"),{
        "className": "critic-score",
        "id": "imdb-score"
    })
    const rtScore = Object.assign(document.createElement("div"),{
        "className": "critic-score",
        "id": "rt-score"
    })

    const imdbDiv = Object.assign(document.createElement('div'),{
            "className": 'critic-div',
            "id": 'imdb-div' 
        });
    imdbDiv.appendChild(imdbImg);

    const rtDiv = Object.assign(document.createElement('div'),{
        "className": 'critic-div',
        "id": 'rt-div' 
    });
    rtDiv.appendChild(rtImg);

    imdbScore.textContent = "N/A";
    rtScore.textContent = "N/A";

    try {
        const response = await fetch(url.toString(),{method: 'GET'});
        const result = await response.json();
        if(response.ok){
            imdbScore.textContent = result.imdbRating;
            rtScore.textContent = result.rtScore;
        }
    } catch (error) {
        console.error(error)
    }

    imdbDiv.appendChild(imdbScore);
    rtDiv.appendChild(rtScore);

    extDiv.appendChild(imdbDiv);
    extDiv.appendChild(rtDiv);

    return extDiv;
}

async function runExtension() {
    const cont = document.querySelector("div.previewModal--player-titleTreatmentWrapper");
    if (cont && !cont.querySelector("#ext-div")) {
        cont.appendChild(await makeContent());
    }
}

async function handleChange() {
    const url = location.href;
    if (url.includes("jbv=") || url.includes("/title/")) {
        await runExtension();
    }
}

let lastUrl = location.href;
new MutationObserver(async () => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        await handleChange();
    }
}).observe(document, { subtree: true, childList: true });

handleChange();