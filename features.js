const featureGuide = document.querySelector("[data-feature-guide]");
const featureTabs = [...featureGuide.querySelectorAll(".regular-tabs a")];
const featurePanels = featureTabs.map((tab) => document.getElementById(tab.hash.slice(1)));

featureGuide.querySelector(".regular-tabs").setAttribute("role", "tablist");

function selectFeatureTab(selectedIndex) {
  featureTabs.forEach((tab, index) => {
    const selected = index === selectedIndex;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    featurePanels[index].hidden = !selected;
  });
}

function selectFeatureTabFromHash() {
  const target = document.getElementById(location.hash.slice(1));
  const index = featurePanels.findIndex((panel) => panel.contains(target));
  selectFeatureTab(index === -1 ? 0 : index);
}

featureTabs.forEach((tab, index) => {
  const panel = featurePanels[index];
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", panel.id);
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", tab.id);
  panel.tabIndex = 0;

  tab.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.hash !== tab.hash) history.pushState(null, "", tab.hash);
    selectFeatureTab(index);
  });

  tab.addEventListener("keydown", (event) => {
    const last = featureTabs.length - 1;
    let next;
    switch (event.key) {
      case "ArrowLeft": next = index === 0 ? last : index - 1; break;
      case "ArrowRight": next = index === last ? 0 : index + 1; break;
      case "Home": next = 0; break;
      case "End": next = last; break;
      case " ": next = index; break;
      default: return;
    }
    event.preventDefault();
    featureTabs[next].focus();
    featureTabs[next].click();
  });
});

selectFeatureTabFromHash();
addEventListener("hashchange", selectFeatureTabFromHash);
