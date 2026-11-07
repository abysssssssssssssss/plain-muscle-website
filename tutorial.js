const videoDialog = document.querySelector(".tutorial-dialog");
const videoTitle = document.querySelector("#tutorial-dialog-title");
const videoPlayer = document.querySelector(".tutorial-player");
const youtubeLink = document.querySelector(".tutorial-watch-link");

if (typeof videoDialog.showModal === "function") {
  document.querySelector(".tutorial").addEventListener("click", (event) => {
    const link = event.target.closest("a[data-video]");
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    const videoId = new URL(link.href).searchParams.get("v");
    const player = document.createElement("iframe");
    player.title = link.dataset.video;
    player.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0`;
    player.allow = "autoplay; encrypted-media; picture-in-picture";
    player.allowFullscreen = true;
    player.referrerPolicy = "strict-origin-when-cross-origin";

    event.preventDefault();
    videoTitle.textContent = link.dataset.video;
    youtubeLink.href = link.href;
    videoPlayer.replaceChildren(player);
    videoDialog.showModal();
  });

  videoDialog.addEventListener("close", () => videoPlayer.replaceChildren());
}
