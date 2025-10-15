// ==UserScript==
// @name         tt-x
// @namespace    0000xFFFF
// @version      1.0.0
// @description  Tiktokify X (formerly Twitter) - Use arrow keys (LEFT/RIGHT) to scroll feed + UNMUTE videos by default.
// @author       0000xFFFF
// @license      MIT
// @match        https://x.com/home
// @run-at       document-end
// @grant        none
// @icon         data:image/ico;base64,AAABAAEAICAAAAEAIACgBAAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAgAAAAIAgGAAAAc3p69AAABGdJREFUeJztll1MW2UYx1valbaMDUdLG6alCI5uTkfZR5plYoVOYBezA8QisjIGriBiYS2llJ4W21FJML1i8cKtN9tQY0x0X8m2yM3WXRgxxot6MUMWTYg3YDSOixn+vu8p50jL6Cid4WZNnqR9T98+vz7/50sgEAgWiWEDbUOdPwVYCWCxWOD3+x9pOp0ubQc2m+1xdxMPpFIp7HY7BgcHYTQaeaOfqeXl5fHfFUok2Lx3P545VIltxOQqNYTLfqu2tpZ1Tu+nJYFWq2UvGgwG/qy8vJw9a2tr+w8gJwfaVitODHlgG/bixBEzNCIZ+4w6XYPz1XOAo1er1fyZ2WxOAKMApe9Y4WIY+Hw++OynYVIXs8/p96ic605CTgpq9H2yPFQKDmDAuwRAbPT9fpwdG0+4t+4q4KSg0Ug+o1IkA4TDYczPzeO76F0U63ZCkJWVGcByKajj5LOD1SYegHU+P4+FhQX2va2vHwcaGqHYoYMoEwAaRlpKyVLQM3cggH09H4A5M4rZ2Vng4T+IRCK8HF5ivccs0Eu2rh+AGk1EfyCIlu5ubHpOA3HhdqgLC+H+MIDx21FEv58GfV09+ynstWa4HU4ewtfYCqM0PwMAoRASTRHq/AFcuP8bnJc+Q117JyryVHiFSHDh3gweLC5iamoKTNNx1MgL8FKhBicrX8dgYwu8h+oyACBJJNujh4Y4POoYwE/3folrTGDaVTsgy8lF4Na3LAANPfOWFdUyJXtXJhBCK5ZBn70Vz4pTVsPqANkvlKGo04bjLjef5RRgZvpHHmAvyYG5vx+wCThqPQXTEkAa9ugHWXI58huaUO8ciGtJMt1r7cRlxwj++vImwjVvQkoASkgVfHXtGpsD0cjkkwOQaIvxYlcPKTFvPKMtbbAry3CkQIuwm8HHIwFsLynlyzAWiwGxGXTs2v9kAGT6Chzud8T/vWcY7j2VMG5R8dONdsM+jwe7O06xAKFQCHN3f8AV95m1dsDUAHIy5RqcrjiAewj2sgPobW7lZwG1kfFx9Fyc5DthxOnF7bGJhM65bgCpbhfquXpmfPhmOIQJfzBhurWS55/P/o5Pzp+Py1TXiI/eaEl3d1glCfMVeK2rm/1hWuOLf/wJP5l2ArGYlKcIIoUSqqZmXL3/K+ZIBYSCQQzpX4UhV8kPrMyGEWlAxaTRRCYn2QynrdbhcqGy+W1ojx5DibUdVfZ+TJw7xz6f/vo6ekmSKrMk8c6ZtDukD0BMUVSEO7Gf2RqnPYBGgyHmJPPfQarDu9Ruozdu4eEXN3DaYOI3Im4nWL7UpAVA5z0NJUNmQDeVYqkcE4yAMO++h8A+E+4MjSHo9iSsbDQCyWvcmgC4xYPbiDZnS3H45Qr01TfDe9IGX0cX23Y9B2vQq96JaqkCu58vXRF26pgCPEaKlYfcZrw8fDS0BaJsVMi3oSpXhSrS8fSbtrCac2Hn9gS6unHLLNc3UkiReJDGMpkycsmWQor0nPwP9hRgYwH+BaGLtwuK2EuqAAAAAElFTkSuQmCC
// ==/UserScript==

// NOTE: this userscript is best when you zoom into the feed with CTRL & + (CTRL + scroll up) a few times

const CONFIG = {
    UNMUTE_VIDEOS: true,
    DEFAULT_VIDEO_VOLUME: 1,
    SCROLL_BEHAVIOUR: "instant" // change to "smooth" for smooth scroll
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
}

let viewportPost = null;
let interval = null;

function updateStuff() {
    const primaryColumn = document.querySelector('div[data-testid="primaryColumn"]');
    if (primaryColumn) {
        const timeline = primaryColumn.querySelector('div[aria-label="Timeline: Your Home Timeline"]');
        if (timeline) {
            const posts = primaryColumn.querySelectorAll('div[data-testid="cellInnerDiv"]');
            for (let i = 0; i < posts.length; i++) {
                const post = posts[i];
                if (isElementInViewport(post)) {
                    viewportPost = post;
                    clearTimeout(interval);
                }
            }
        }
    }
}

interval = setInterval(updateStuff, 1000);

function unmute(video) {
    if (video && video.muted) {
        video.muted = false;
        video.volume = CONFIG.DEFAULT_VIDEO_VOLUME;
    }
}

function unmutePost(post) {
    const video = post.querySelector("video");
    if (video) {
        unmute(video);
    }
}

if (CONFIG.UNMUTE_VIDEOS) {
    // Observe the page for videos being added dynamically
    const observer = new MutationObserver(() => {
        const videos = document.querySelectorAll('video');
        videos.forEach(unmute);
    });

    // Start watching for changes in the body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}


function next() {
    if (!viewportPost) return;

    const nextPost = viewportPost.nextElementSibling;
    if (nextPost) {
        if (CONFIG.UNMUTE_VIDEOS) { unmutePost(nextPost); }
        viewportPost = nextPost;
        nextPost.scrollIntoView({ behavior: CONFIG.SCROLL_BEHAVIOUR, block: "center" });
    }
}

function prev() {
    if (!viewportPost) return;

    const prevPost = viewportPost.previousElementSibling;
    if (prevPost) {
        if (CONFIG.UNMUTE_VIDEOS) { unmutePost(prevPost); }
        viewportPost = prevPost;
        prevPost.scrollIntoView({ behavior: CONFIG.SCROLL_BEHAVIOUR, block: "center" });
    }
}

document.body.addEventListener("keydown", (event) => {
    const tag = event.target.tagName.toLowerCase();
    const isEditable = event.target.isContentEditable;
    if (tag === "input" || tag === "textarea" || isEditable) return
    switch (event.key) {
        case "ArrowLeft": prev(); event.preventDefault(); break;
        case "ArrowRight": next(); event.preventDefault(); break;
    }
});
