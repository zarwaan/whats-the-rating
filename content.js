const imdbImgSrc = chrome.runtime.getURL("assets/images/imdb.svg")
const rtImgSrc = chrome.runtime.getURL("assets/images/rt.svg")

const titleEl = document.querySelector("title");

function makeContent() {
    const mediaName = document.querySelector("h3.previewModal--section-header strong").textContent;
    const mediaYear = document.querySelector("div.videoMetadata--line div.year").textContent;
    console.log(mediaName+' '+mediaYear)

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

    imdbScore.textContent = "10.0";
    rtScore.textContent = "100%";

    imdbDiv.appendChild(imdbScore);
    rtDiv.appendChild(rtScore);

    extDiv.appendChild(imdbDiv);
    extDiv.appendChild(rtDiv);

    return extDiv;
}

function runExtension() {
    const cont = document.querySelector("div.previewModal--player-titleTreatmentWrapper");
    if (cont && !cont.querySelector("#ext-div")) {
        cont.appendChild(makeContent());
    }
}

function handleChange() {
    const url = location.href;
    if (url.includes("/browse?jbv=") || url.includes("/title/")) {
        runExtension();
    }
}

let lastUrl = location.href;
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        handleChange();
    }
}).observe(document, { subtree: true, childList: true });

if (titleEl) {
    new MutationObserver(handleChange).observe(titleEl, { childList: true });
}

handleChange();